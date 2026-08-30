#!/usr/bin/env python3
import argparse
import json
import statistics
from collections import Counter
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps

ALPHA_CONTENT_THRESHOLD = 16
MAX_INTERNAL_DETAIL_PIXELS = 3200


ACTIONS = [
    ("characters", "fallback"),
    ("heads", "head"),
    ("characters-idle", "idle"),
    ("characters-idle-left", "idle left"),
    ("characters-run-right", "run right"),
    ("characters-run-left", "run left"),
    ("characters-jump", "jump right"),
    ("characters-jump-left", "jump left"),
    ("characters-crouch", "crouch right"),
    ("characters-crouch-left", "crouch left"),
    ("characters-lie", "lie right"),
    ("characters-lie-left", "lie left"),
]


def corner_background_rgb(image, sample=18):
    palette = corner_background_palette(image, sample)
    return palette[0] if palette else (255, 255, 255)


def corner_background_palette(image, sample=18):
    rgb = image.convert("RGB")
    width, height = rgb.size
    boxes = [
        (0, 0, sample, sample),
        (width - sample, 0, width, sample),
        (0, height - sample, sample, height),
        (width - sample, height - sample, width, height),
    ]
    values = []
    for box in boxes:
        crop = rgb.crop(box)
        values.extend(crop.getdata())
    rounded = [
        tuple(int(round(channel / 4) * 4) for channel in pixel)
        for pixel in values
    ]
    common = [pixel for pixel, _ in Counter(rounded).most_common(8)]
    if common:
        return common
    return [tuple(int(statistics.median(channel)) for channel in zip(*values))]


def distance_sq(left, right):
    return sum((int(a) - int(b)) ** 2 for a, b in zip(left, right))


def edge_connected_background(size, is_background):
    width, height = size
    background = bytearray(width * height)
    visited = bytearray(width * height)
    queue = deque()

    def push(x, y):
        index = y * width + x
        if visited[index] or not is_background(x, y):
            return
        visited[index] = 1
        background[index] = 1
        queue.append((x, y))

    for x in range(width):
        push(x, 0)
        push(x, height - 1)
    for y in range(height):
        push(0, y)
        push(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                push(nx, ny)
    return background


def image_from_mask_bytes(size, mask_bytes, foreground_when_zero=False):
    mask = Image.new("L", size)
    if foreground_when_zero:
        mask.putdata([0 if value else 255 for value in mask_bytes])
    else:
        mask.putdata([255 if value else 0 for value in mask_bytes])
    return mask


def background_mask_from_palette(cell, palette):
    rgb = cell.convert("RGB")
    threshold = 34 ** 2 * 3
    width, height = rgb.size
    pixels = rgb.load()

    def is_background(x, y):
        return min(distance_sq(pixels[x, y], bg) for bg in palette) <= threshold

    background = edge_connected_background(rgb.size, is_background)
    return image_from_mask_bytes(rgb.size, background, foreground_when_zero=True)


def alpha_foreground_with_internal_details(cell):
    rgba = cell.convert("RGBA")
    alpha = rgba.getchannel("A")
    alpha_pixels = alpha.load()
    width, height = alpha.size
    foreground = bytearray(width * height)

    for y in range(height):
        for x in range(width):
            if alpha_pixels[x, y] > ALPHA_CONTENT_THRESHOLD:
                foreground[y * width + x] = 1

    outside = edge_connected_background(
        alpha.size,
        lambda x, y: alpha_pixels[x, y] <= ALPHA_CONTENT_THRESHOLD,
    )
    pixels = rgba.load()
    visited = bytearray(width * height)

    def is_internal_transparent(x, y):
        index = y * width + x
        return alpha_pixels[x, y] <= ALPHA_CONTENT_THRESHOLD and not outside[index]

    def is_detail_component(points):
        if len(points) > MAX_INTERNAL_DETAIL_PIXELS:
            return False
        visible_pixels = 0
        saturated_pixels = 0
        bright_pixels = 0
        non_clear_pixels = 0
        for x, y in points:
            red, green, blue, _ = pixels[x, y]
            channel_sum = red + green + blue
            if channel_sum > 18:
                non_clear_pixels += 1
            if channel_sum > 55:
                visible_pixels += 1
            if max(red, green, blue) - min(red, green, blue) >= 42 and channel_sum > 45:
                saturated_pixels += 1
            if red >= 180 and green >= 180 and blue >= 170:
                bright_pixels += 1
        if not non_clear_pixels:
            return False
        if len(points) <= 24:
            return True
        return (
            visible_pixels / len(points) >= 0.08
            or saturated_pixels / len(points) >= 0.04
            or bright_pixels / len(points) >= 0.04
        )

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or not is_internal_transparent(x, y):
                continue
            visited[index] = 1
            stack = [(x, y)]
            points = []
            while stack:
                px, py = stack.pop()
                points.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    nindex = ny * width + nx
                    if visited[nindex] or not is_internal_transparent(nx, ny):
                        continue
                    visited[nindex] = 1
                    stack.append((nx, ny))
            if is_detail_component(points):
                for px, py in points:
                    foreground[py * width + px] = 1

    return image_from_mask_bytes(alpha.size, foreground)


def clean_mask_components(mask):
    width, height = mask.size
    pixels = mask.load()
    visited = bytearray(width * height)
    components = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or not pixels[x, y]:
                continue
            stack = [(x, y)]
            visited[index] = 1
            points = []
            while stack:
                px, py = stack.pop()
                points.append((px, py))
                for nx in (px - 1, px, px + 1):
                    for ny in (py - 1, py, py + 1):
                        if nx < 0 or ny < 0 or nx >= width or ny >= height or (nx == px and ny == py):
                            continue
                        nindex = ny * width + nx
                        if visited[nindex] or not pixels[nx, ny]:
                            continue
                        visited[nindex] = 1
                        stack.append((nx, ny))
            components.append(points)
    if not components:
        return mask
    largest = max(len(points) for points in components)
    cleaned = Image.new("L", mask.size, 0)
    out = cleaned.load()
    for points in components:
        if len(points) != largest:
            continue
        for x, y in points:
            out[x, y] = 255
    return cleaned


def content_bbox(cell):
    rgba = cell.convert("RGBA")
    alpha = rgba.getchannel("A")
    alpha_min, alpha_max = alpha.getextrema()
    alpha_mask = alpha_foreground_with_internal_details(rgba)
    alpha_bbox = alpha_mask.getbbox()
    alpha_pixels = 0
    if alpha_bbox and alpha_min < 250:
        alpha_pixels = sum(1 for value in alpha_mask.getdata() if value)
        total = rgba.size[0] * rgba.size[1]
        if 0.01 < alpha_pixels / total < 0.92:
            alpha_mask = clean_mask_components(alpha_mask)
            alpha_bbox = alpha_mask.getbbox()
            return alpha_bbox, alpha_mask

    palette = corner_background_palette(rgba)
    mask = background_mask_from_palette(rgba, palette)
    mask = clean_mask_components(mask)
    bbox = mask.getbbox()
    if not bbox:
        return (0, 0, rgba.size[0], rgba.size[1]), mask
    return bbox, mask


def trim_to_sprite(cell, size=256, outer_padding=18):
    rgba = cell.convert("RGBA")
    bbox, mask = content_bbox(rgba)
    left, top, right, bottom = bbox
    cropped = rgba.crop(bbox)
    cropped_mask = mask.crop(bbox)
    cropped.putalpha(cropped_mask)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    max_side = size - outer_padding * 2
    cropped.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    x = (size - cropped.width) // 2
    y = (size - cropped.height) // 2
    canvas.alpha_composite(cropped, (x, y))
    edge_margin = min(left, top, rgba.width - right, rgba.height - bottom)
    fill_ratio = (right - left) * (bottom - top) / max(1, rgba.width * rgba.height)
    return canvas, {
        "bbox": [left, top, right, bottom],
        "edgeMargin": edge_margin,
        "fillRatio": round(fill_ratio, 4),
        "cellSize": [rgba.width, rgba.height],
    }


def make_preview(pet_id, sprites, out_path):
    tile = 154
    label_h = 28
    cols = 4
    rows = 3
    preview = Image.new("RGBA", (cols * tile, rows * (tile + label_h)), (248, 247, 255, 255))
    draw = ImageDraw.Draw(preview)
    for index, ((_, label), sprite) in enumerate(zip(ACTIONS, sprites)):
        col = index % cols
        row = index // cols
        x = col * tile
        y = row * (tile + label_h)
        thumb = ImageOps.contain(sprite, (tile - 18, tile - 18), Image.Resampling.LANCZOS)
        preview.alpha_composite(thumb, (x + (tile - thumb.width) // 2, y + 8))
        draw.text((x + 8, y + tile + 4), label, fill=(50, 44, 105, 255))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    preview.convert("RGB").save(out_path, quality=92)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sheet", required=True)
    parser.add_argument("--pet", required=True)
    parser.add_argument("--out", default="assets/8bit/cute-final")
    parser.add_argument("--preview-dir", default="tmp/cute-final-previews")
    parser.add_argument("--report", default="tmp/cute-final-crop-report.json")
    args = parser.parse_args()

    sheet_path = Path(args.sheet)
    pet_id = args.pet.strip().lower()
    out_root = Path(args.out)
    image = Image.open(sheet_path).convert("RGBA")
    cols, rows = 4, 3
    cell_w = image.width // cols
    cell_h = image.height // rows
    sprites = []
    checks = []

    for index, (folder, label) in enumerate(ACTIONS):
        col = index % cols
        row = index // cols
        cell = image.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h))
        sprite, check = trim_to_sprite(cell)
        out_dir = out_root / folder
        out_dir.mkdir(parents=True, exist_ok=True)
        sprite.save(out_dir / f"{pet_id}-8bit.png")
        sprites.append(sprite)
        warning = check["edgeMargin"] < max(8, min(cell_w, cell_h) * 0.025)
        checks.append({
            "petId": pet_id,
            "folder": folder,
            "label": label,
            "warning": warning,
            **check,
        })

    preview_path = Path(args.preview_dir) / f"{pet_id}.jpg"
    make_preview(pet_id, sprites, preview_path)

    report_path = Path(args.report)
    if report_path.exists():
        report = json.loads(report_path.read_text())
    else:
        report = []
    report = [entry for entry in report if entry.get("petId") != pet_id]
    report.extend(checks)
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    risky = [entry for entry in checks if entry["warning"]]
    print(json.dumps({
        "petId": pet_id,
        "preview": str(preview_path),
        "warnings": risky,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
