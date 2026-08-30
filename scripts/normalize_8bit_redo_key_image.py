#!/usr/bin/env python3
"""Normalize one redo sprite image.

This is the safer production path when a generator cannot return real alpha for
referenced 8-bit sprites. It removes only edge-connected pixels close to a known
background color, then crops the resulting outer alpha bounding box.

When a generator does return real alpha, the script preserves that alpha and
only crops/fits the outer transparent bounding box. It must never turn real
transparent pixels back into opaque pixels.
"""

import argparse
import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PROJECT_ROOT = Path(__file__).resolve().parents[1]
WORK_ROOT = PROJECT_ROOT / "tmp/8bit-redo-20260827"
CANVAS_SIZE = 256
PADDING = 26
ALPHA_THRESHOLD = 8
ACTION_TO_FOLDERS = {
    "stand": [("characters", False), ("characters-idle", False), ("characters-idle-left", True)],
    "run-right": [("characters-run-right", False), ("characters-run-left", True)],
    "jump-right": [("characters-jump", False), ("characters-jump-left", True)],
    "crouch-right": [("characters-crouch", False), ("characters-crouch-left", True)],
    "lie-right": [("characters-lie", False), ("characters-lie-left", True)],
}
QA_FOLDERS = [
    ("characters", "stand"),
    ("characters-idle", "idle"),
    ("characters-idle-left", "idle<"),
    ("characters-run-right", "run>"),
    ("characters-run-left", "run<"),
    ("characters-jump", "jump>"),
    ("characters-jump-left", "jump<"),
    ("characters-crouch", "duck>"),
    ("characters-crouch-left", "duck<"),
    ("characters-lie", "lie>"),
    ("characters-lie-left", "lie<"),
]


def parse_hex(value):
    value = value.strip().lstrip("#")
    if len(value) != 6:
        raise argparse.ArgumentTypeError("expected #RRGGBB")
    return tuple(int(value[index:index + 2], 16) for index in (0, 2, 4))


def color_distance_sq(pixel, key):
    return sum((int(pixel[index]) - key[index]) ** 2 for index in range(3))


def remove_key(image, key, threshold, remove_all_key):
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pix = rgba.load()
    limit = threshold * threshold
    is_bg = bytearray(width * height)
    for y in range(height):
        for x in range(width):
            if color_distance_sq(pix[x, y], key) <= limit:
                is_bg[y * width + x] = 1

    outside = bytearray(width * height)
    if remove_all_key:
        outside[:] = is_bg
    else:
        queue = deque()
        for x in range(width):
            for y in (0, height - 1):
                index = y * width + x
                if is_bg[index] and not outside[index]:
                    outside[index] = 1
                    queue.append((x, y))
        for y in range(height):
            for x in (0, width - 1):
                index = y * width + x
                if is_bg[index] and not outside[index]:
                    outside[index] = 1
                    queue.append((x, y))

        while queue:
            x, y = queue.popleft()
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if nx < 0 or ny < 0 or nx >= width or ny >= height:
                    continue
                index = ny * width + nx
                if is_bg[index] and not outside[index]:
                    outside[index] = 1
                    queue.append((nx, ny))

    removed = 0
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if outside[index]:
                pix[x, y] = (0, 0, 0, 0)
                removed += 1
            elif pix[x, y][3] == 0:
                pix[x, y] = (*pix[x, y][:3], 255)
    return rgba, removed


def has_usable_source_alpha(image):
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    minimum, maximum = alpha.getextrema()
    if minimum > ALPHA_THRESHOLD:
        return False
    bbox = alpha_bbox(rgba)
    if not bbox:
        return False
    return bbox != (0, 0, rgba.width, rgba.height)


def preserve_alpha(image):
    rgba = image.convert("RGBA")
    pix = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            if pix[x, y][3] <= ALPHA_THRESHOLD:
                pix[x, y] = (0, 0, 0, 0)
    return rgba


def alpha_bbox(image):
    return image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()


def count_components(image):
    alpha = image.getchannel("A")
    width, height = alpha.size
    pix = alpha.load()
    visited = bytearray(width * height)
    components = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or pix[x, y] <= ALPHA_THRESHOLD:
                continue
            visited[index] = 1
            stack = [(x, y)]
            area = 0
            min_x = max_x = x
            min_y = max_y = y
            while stack:
                px, py = stack.pop()
                area += 1
                min_x = min(min_x, px)
                max_x = max(max_x, px)
                min_y = min(min_y, py)
                max_y = max(max_y, py)
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    nindex = ny * width + nx
                    if visited[nindex] or pix[nx, ny] <= ALPHA_THRESHOLD:
                        continue
                    visited[nindex] = 1
                    stack.append((nx, ny))
            components.append({"area": area, "bbox": [min_x, min_y, max_x + 1, max_y + 1]})
    return sorted(components, key=lambda component: component["area"], reverse=True)


def remove_small_components(image, minimum_pixels):
    minimum = max(0, int(minimum_pixels or 0))
    if minimum <= 0:
        return image, 0, []
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    width, height = alpha.size
    pix = alpha.load()
    visited = bytearray(width * height)
    removed = 0
    removed_components = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or pix[x, y] <= ALPHA_THRESHOLD:
                continue
            visited[index] = 1
            stack = [(x, y)]
            points = []
            min_x = max_x = x
            min_y = max_y = y
            while stack:
                px, py = stack.pop()
                points.append((px, py))
                min_x = min(min_x, px)
                max_x = max(max_x, px)
                min_y = min(min_y, py)
                max_y = max(max_y, py)
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    nindex = ny * width + nx
                    if visited[nindex] or pix[nx, ny] <= ALPHA_THRESHOLD:
                        continue
                    visited[nindex] = 1
                    stack.append((nx, ny))
            if len(points) >= minimum:
                continue
            for px, py in points:
                pix[px, py] = 0
            removed += len(points)
            removed_components.append({"area": len(points), "bbox": [min_x, min_y, max_x + 1, max_y + 1]})
    if removed:
        rgba.putalpha(alpha)
    return rgba, removed, sorted(removed_components, key=lambda component: component["area"], reverse=True)[:12]


def normalize(image):
    bbox = alpha_bbox(image)
    if not bbox:
        raise ValueError("empty image after key removal")
    cropped = image.crop(bbox)
    max_side = CANVAS_SIZE - PADDING * 2
    scale = min(max_side / cropped.width, max_side / cropped.height)
    resized = cropped.resize(
        (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((CANVAS_SIZE - resized.width) // 2, (CANVAS_SIZE - resized.height) // 2))
    return canvas, list(bbox)


def normalize_one(source_path, route, pet_id, action, key, threshold, remove_all_key, force_key, min_component_pixels):
    if action not in ACTION_TO_FOLDERS:
        raise ValueError(f"unknown action: {action}")
    source = Image.open(source_path)
    used_source_alpha = has_usable_source_alpha(source) and not force_key
    if used_source_alpha:
        keyed = preserve_alpha(source)
        removed = 0
    else:
        keyed, removed = remove_key(source, key, threshold, remove_all_key)
    keyed, removed_small_pixels, removed_small_components = remove_small_components(keyed, min_component_pixels)
    keyed_debug = WORK_ROOT / "keyed-single" / route / pet_id / f"{action}.png"
    keyed_debug.parent.mkdir(parents=True, exist_ok=True)
    keyed.save(keyed_debug)

    sprite, bbox = normalize(keyed)
    out_root = WORK_ROOT / "normalized" / route
    outputs = []
    for folder, mirror in ACTION_TO_FOLDERS[action]:
        output = sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if mirror else sprite
        out_path = out_root / folder / f"{pet_id}-8bit.png"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        output.save(out_path)
        outputs.append(out_path.relative_to(WORK_ROOT).as_posix())

    return {
        "source": str(source_path),
        "route": route,
        "petId": pet_id,
        "action": action,
        "key": key,
        "threshold": threshold,
        "removeAllKey": remove_all_key,
        "minComponentPixels": min_component_pixels,
        "usedSourceAlpha": used_source_alpha,
        "mode": "preserve-source-alpha" if used_source_alpha else "remove-edge-connected-key",
        "removedPixels": removed,
        "removedSmallComponentPixels": removed_small_pixels,
        "removedSmallComponents": removed_small_components,
        "sourceBbox": bbox,
        "debugKeyed": str(keyed_debug.relative_to(WORK_ROOT)),
        "componentCount": len(count_components(keyed)),
        "components": count_components(keyed)[:8],
        "outputs": outputs,
    }


def make_red_qa(route, pet_id, name):
    root = WORK_ROOT / "normalized" / route
    cell_w = 158
    cell_h = 194
    sheet = Image.new("RGB", (len(QA_FOLDERS) * cell_w, cell_h), (255, 0, 0))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 12)
    except Exception:
        font = None
    for col, (folder, label) in enumerate(QA_FOLDERS):
        x = col * cell_w
        draw.rectangle([x + 3, 20, x + cell_w - 3, cell_h - 4], fill=(255, 0, 0), outline=(110, 0, 0))
        title = f"{pet_id} {route}" if col == 0 else label
        draw.text((x + 5, 4), title[:22], fill=(255, 255, 255), font=font)
        path = root / folder / f"{pet_id}-8bit.png"
        if not path.exists():
            continue
        sprite = Image.open(path).convert("RGBA")
        preview = sprite.copy()
        preview.thumbnail((cell_w - 12, cell_h - 46), Image.Resampling.NEAREST)
        sheet.paste(preview, (x + (cell_w - preview.width) // 2, 26 + (cell_h - 52 - preview.height) // 2), preview)
    out_path = WORK_ROOT / name
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    return out_path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--route", required=True)
    parser.add_argument("--pet", required=True)
    parser.add_argument("--action", required=True)
    parser.add_argument("--key", type=parse_hex, default=parse_hex("#ff00ff"))
    parser.add_argument("--threshold", type=int, default=95)
    parser.add_argument("--remove-all-key", action="store_true")
    parser.add_argument("--force-key", action="store_true")
    parser.add_argument("--min-component-pixels", type=int, default=0)
    parser.add_argument("--qa-name", default="key-single-red-qa.png")
    args = parser.parse_args()

    report = normalize_one(
        args.source,
        args.route,
        args.pet,
        args.action,
        args.key,
        args.threshold,
        args.remove_all_key,
        args.force_key,
        args.min_component_pixels,
    )
    report["qa"] = str(make_red_qa(args.route, args.pet, args.qa_name))
    report_path = WORK_ROOT / f"key-single-report-{args.route}-{args.pet}-{args.action}.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
