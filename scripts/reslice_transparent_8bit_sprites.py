#!/usr/bin/env python3
"""Reslice CY PETS STORY 8-bit sprites from transparent source sheets.

This script intentionally does not remove backgrounds, rebuild masks, fill holes,
or delete tiny alpha components. The source sheets already carry transparency, so
we only crop the outside transparent bbox, resize the whole sprite into a 256px
canvas, and mirror approved right-facing poses to left-facing folders.
"""

import argparse
import json
import shutil
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = PROJECT_ROOT / "tmp/final-8bit-sheets"
OUTPUT_ROOT = PROJECT_ROOT / "assets/8bit/final"
BACKUP_ROOT = PROJECT_ROOT / "tmp/8bit-sprite-repair-backup"
DEFAULT_REPORT_PATH = PROJECT_ROOT / "tmp/transparent-reslice-report.json"
DEFAULT_PREVIEW_PATH = PROJECT_ROOT / "tmp/transparent-reslice-red-preview.png"

EXPECTED_POSE_COUNT = 5
ALPHA_THRESHOLD = 8
CANVAS_SIZE = 256
OUTER_PADDING = 24
HEAD_PADDING = 20
STRAY_EDGE_INSET = 6
STRAY_KEEP_DISTANCE = 22
STRAY_MIN_AREA_RATIO = 0.18
STRAY_MIN_PIXELS = 180

POSE_FOLDERS = {
    0: ["characters", "characters-idle"],
    1: ["characters-run-right"],
    2: ["characters-jump"],
    3: ["characters-crouch"],
    4: ["characters-lie"],
}

MIRROR_PAIRS = [
    ("characters-idle", "characters-idle-left"),
    ("characters-run-right", "characters-run-left"),
    ("characters-jump", "characters-jump-left"),
    ("characters-crouch", "characters-crouch-left"),
    ("characters-lie", "characters-lie-left"),
]

PREVIEW_FOLDERS = [
    "heads",
    "characters",
    "characters-idle",
    "characters-run-right",
    "characters-run-left",
    "characters-jump",
    "characters-jump-left",
    "characters-crouch",
    "characters-crouch-left",
    "characters-lie",
    "characters-lie-left",
]

SOURCE_PRIORITY_SUFFIXES = [
    "-heroic-v2-sheet.png",
    "-final-sheet.png",
    "-sheet-cleaned.png",
    ".png",
]


def rel(path):
    return path.resolve().relative_to(PROJECT_ROOT).as_posix()


def infer_pet_id(sheet_path):
    name = sheet_path.name
    for suffix in SOURCE_PRIORITY_SUFFIXES:
        if name.endswith(suffix):
            return name[: -len(suffix)]
    return sheet_path.stem


def sheet_priority(sheet_path):
    name = sheet_path.name
    for index, suffix in enumerate(SOURCE_PRIORITY_SUFFIXES):
        if name.endswith(suffix):
            return index
    return len(SOURCE_PRIORITY_SUFFIXES)


def choose_source_sheets(source_dir=SOURCE_DIR):
    candidates = {}
    for path in sorted(source_dir.glob("*.png")):
        pet_id = infer_pet_id(path)
        previous = candidates.get(pet_id)
        if previous is None or sheet_priority(path) < sheet_priority(previous):
            candidates[pet_id] = path
    return dict(sorted(candidates.items()))


def alpha_bbox(image):
    return image.convert("RGBA").getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()


def alpha_x_segments(image, expected=EXPECTED_POSE_COUNT):
    alpha = image.convert("RGBA").getchannel("A")
    width, height = alpha.size
    pixels = alpha.load()
    occupied = []
    for x in range(width):
        has_alpha = False
        for y in range(height):
            if pixels[x, y] > ALPHA_THRESHOLD:
                has_alpha = True
                break
        occupied.append(has_alpha)

    runs = []
    start = None
    for x, has_alpha in enumerate(occupied):
        if has_alpha and start is None:
            start = x
        elif not has_alpha and start is not None:
            runs.append([start, x])
            start = None
    if start is not None:
        runs.append([start, width])

    if not runs:
        return []

    min_merge_gap = max(18, round(width * 0.018))
    merged = [runs[0]]
    for left, right in runs[1:]:
        gap = left - merged[-1][1]
        if gap <= min_merge_gap:
            merged[-1][1] = right
        else:
            merged.append([left, right])

    while len(merged) > expected:
        gaps = [(merged[index + 1][0] - merged[index][1], index) for index in range(len(merged) - 1)]
        _, index = min(gaps)
        merged[index][1] = merged[index + 1][1]
        del merged[index + 1]

    if len(merged) != expected:
        cell_width = width / expected
        return [(round(index * cell_width), round((index + 1) * cell_width)) for index in range(expected)]

    return [(left, right) for left, right in merged]


def bbox_for_x_range(image, left, right):
    crop = image.crop((left, 0, right, image.height))
    bbox = alpha_bbox(crop)
    if not bbox:
        return None
    return (left + bbox[0], bbox[1], left + bbox[2], bbox[3])


def fit_transparent_crop(image, bbox, padding=OUTER_PADDING, canvas_size=CANVAS_SIZE):
    crop = strip_edge_strays(image.crop(bbox).convert("RGBA"))
    max_side = max(1, canvas_size - padding * 2)
    scale = min(max_side / crop.width, max_side / crop.height)
    resized_size = (
        max(1, round(crop.width * scale)),
        max(1, round(crop.height * scale)),
    )
    resized = crop.resize(resized_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    x = (canvas_size - resized.width) // 2
    y = (canvas_size - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    return canvas


def alpha_components(image):
    alpha = image.convert("RGBA").getchannel("A")
    width, height = alpha.size
    pixels = alpha.load()
    visited = bytearray(width * height)
    components = []

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or pixels[x, y] <= ALPHA_THRESHOLD:
                continue
            visited[index] = 1
            stack = [(x, y)]
            points = []
            while stack:
                px, py = stack.pop()
                points.append((px, py))
                for nx in (px - 1, px, px + 1):
                    for ny in (py - 1, py, py + 1):
                        if nx < 0 or ny < 0 or nx >= width or ny >= height or (nx == px and ny == py):
                            continue
                        nindex = ny * width + nx
                        if visited[nindex] or pixels[nx, ny] <= ALPHA_THRESHOLD:
                            continue
                        visited[nindex] = 1
                        stack.append((nx, ny))
            xs = [point[0] for point in points]
            ys = [point[1] for point in points]
            components.append({
                "points": points,
                "area": len(points),
                "bbox": (min(xs), min(ys), max(xs) + 1, max(ys) + 1),
            })
    return components


def bbox_distance(left, right):
    horizontal_gap = max(0, max(left[0], right[0]) - min(left[2], right[2]))
    vertical_gap = max(0, max(left[1], right[1]) - min(left[3], right[3]))
    return (horizontal_gap * horizontal_gap + vertical_gap * vertical_gap) ** 0.5


def touches_outer_edge(bbox, size, inset=STRAY_EDGE_INSET):
    width, height = size
    return bbox[0] <= inset or bbox[1] <= inset or bbox[2] >= width - inset or bbox[3] >= height - inset


def strip_edge_strays(image):
    components = alpha_components(image)
    if len(components) <= 1:
        return image
    largest = max(components, key=lambda item: item["area"])
    largest_area = max(1, largest["area"])
    largest_bbox = largest["bbox"]
    alpha = image.getchannel("A")
    alpha_pixels = alpha.load()
    changed = False

    for component in components:
        if component is largest:
            continue
        area = component["area"]
        bbox = component["bbox"]
        is_substantial = area >= max(STRAY_MIN_PIXELS, largest_area * STRAY_MIN_AREA_RATIO)
        is_near_body = bbox_distance(bbox, largest_bbox) <= STRAY_KEEP_DISTANCE
        if is_substantial or is_near_body or not touches_outer_edge(bbox, image.size):
            continue
        for x, y in component["points"]:
            alpha_pixels[x, y] = 0
        changed = True

    if changed:
        cleaned = image.copy()
        cleaned.putalpha(alpha)
        return cleaned
    return image


def make_head_sprite(standing_sprite):
    bbox = alpha_bbox(standing_sprite)
    if not bbox:
        return standing_sprite.copy()
    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    head_bottom = top + round(height * 0.58)
    head_left = max(0, left - round(width * 0.08))
    head_right = min(standing_sprite.width, right + round(width * 0.08))
    head_bbox = (head_left, top, head_right, min(standing_sprite.height, max(top + 1, head_bottom)))
    return fit_transparent_crop(standing_sprite, head_bbox, padding=HEAD_PADDING)


def backup_file(path, backup_root):
    backup_path = backup_root / rel(path)
    if backup_path.exists():
        return
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, backup_path)


def write_sprite(path, image, backup_root=None, apply=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    existed = path.exists()
    changed = True
    if existed:
        try:
            existing = Image.open(path).convert("RGBA")
            changed = existing.size != image.size or ImageChopsDifference(existing, image)
        except Exception:
            changed = True
    if changed and apply:
        if existed and backup_root:
            backup_file(path, backup_root)
        image.save(path)
    return changed


def ImageChopsDifference(left, right):
    from PIL import ImageChops

    return ImageChops.difference(left, right).getbbox() is not None


def reslice_pet(pet_id, sheet_path, backup_root=None, apply=False):
    source = Image.open(sheet_path).convert("RGBA")
    alpha_min, alpha_max = source.getchannel("A").getextrema()
    if alpha_min >= 255:
        return {
            "petId": pet_id,
            "source": rel(sheet_path),
            "ok": False,
            "error": "source is fully opaque; transparent reslice refused",
        }

    segments = alpha_x_segments(source)
    pose_bboxes = []
    sprites = []
    for index, (left, right) in enumerate(segments):
        bbox = bbox_for_x_range(source, left, right)
        if not bbox:
            return {
                "petId": pet_id,
                "source": rel(sheet_path),
                "ok": False,
                "error": f"pose {index} has no alpha content",
            }
        pose_bboxes.append(bbox)
        sprites.append(fit_transparent_crop(source, bbox))

    changed_paths = []
    for pose_index, folders in POSE_FOLDERS.items():
        sprite = sprites[pose_index]
        for folder in folders:
            out_path = OUTPUT_ROOT / folder / f"{pet_id}-8bit.png"
            if write_sprite(out_path, sprite, backup_root, apply):
                changed_paths.append(rel(out_path))

    head = make_head_sprite(sprites[0])
    head_path = OUTPUT_ROOT / "heads" / f"{pet_id}-8bit.png"
    if write_sprite(head_path, head, backup_root, apply):
        changed_paths.append(rel(head_path))

    for source_folder, target_folder in MIRROR_PAIRS:
        source_path = OUTPUT_ROOT / source_folder / f"{pet_id}-8bit.png"
        target_path = OUTPUT_ROOT / target_folder / f"{pet_id}-8bit.png"
        source_image = Image.open(source_path).convert("RGBA") if apply else {
            "characters-idle": sprites[0],
            "characters-run-right": sprites[1],
            "characters-jump": sprites[2],
            "characters-crouch": sprites[3],
            "characters-lie": sprites[4],
        }[source_folder]
        mirrored = source_image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        if write_sprite(target_path, mirrored, backup_root, apply):
            changed_paths.append(rel(target_path))

    return {
        "petId": pet_id,
        "source": rel(sheet_path),
        "ok": True,
        "alphaExtrema": [alpha_min, alpha_max],
        "segments": segments,
        "poseBboxes": pose_bboxes,
        "changedPaths": changed_paths,
    }


def draw_red_preview(pet_ids, output_path=DEFAULT_PREVIEW_PATH, stage_root=OUTPUT_ROOT):
    cell_w = 172
    cell_h = 214
    cols = 6
    rows = max(1, len(pet_ids) * 2)
    sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), (255, 0, 0))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 11)
    except Exception:
        font = None

    row = 0
    for pet_id in pet_ids:
        for offset, folders in enumerate((PREVIEW_FOLDERS[:6], PREVIEW_FOLDERS[6:])):
            for col, folder in enumerate(folders):
                x = col * cell_w
                y = row * cell_h
                draw.rectangle([x + 5, y + 22, x + cell_w - 5, y + cell_h - 8], fill=(255, 0, 0), outline=(135, 0, 0))
                path = stage_root / folder / f"{pet_id}-8bit.png"
                if path.exists():
                    image = Image.open(path).convert("RGBA")
                    preview = image.copy()
                    preview.thumbnail((cell_w - 18, cell_h - 48), Image.Resampling.NEAREST)
                    sheet.paste(preview, (x + (cell_w - preview.width) // 2, y + 28 + (cell_h - 56 - preview.height) // 2), preview)
                    bbox = alpha_bbox(image)
                    bbox_text = f"{bbox}" if bbox else "empty"
                else:
                    bbox_text = "missing"
                draw.text((x + 7, y + 6), f"{pet_id}/{folder}", fill=(255, 255, 255), font=font)
                draw.text((x + 7, y + cell_h - 20), bbox_text, fill=(255, 255, 255), font=font)
            row += 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path)
    return output_path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write resliced sprites")
    parser.add_argument("--pet", action="append", default=[], help="limit to one or more pet IDs")
    parser.add_argument("--preview", default=str(DEFAULT_PREVIEW_PATH), help="red background preview path")
    parser.add_argument("--report", default=str(DEFAULT_REPORT_PATH), help="JSON report path")
    args = parser.parse_args()

    sources = choose_source_sheets()
    requested = {pet.strip().lower() for pet in args.pet if pet.strip()}
    if requested:
        sources = {pet_id: path for pet_id, path in sources.items() if pet_id in requested}

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_root = BACKUP_ROOT / f"transparent-reslice-{timestamp}"
    results = []
    for pet_id, sheet_path in sources.items():
        results.append(reslice_pet(pet_id, sheet_path, backup_root=backup_root, apply=args.apply))

    ok_pet_ids = [entry["petId"] for entry in results if entry.get("ok")]
    preview_path = draw_red_preview(ok_pet_ids, Path(args.preview)) if args.apply else None
    report = {
        "apply": args.apply,
        "sourceDir": rel(SOURCE_DIR),
        "outputRoot": rel(OUTPUT_ROOT),
        "backupRoot": rel(backup_root),
        "preview": rel(preview_path) if preview_path else "",
        "okCount": len(ok_pet_ids),
        "errorCount": len([entry for entry in results if not entry.get("ok")]),
        "results": results,
    }
    Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({
        "apply": args.apply,
        "okCount": report["okCount"],
        "errorCount": report["errorCount"],
        "preview": report["preview"],
        "report": rel(Path(args.report)),
        "errors": [entry for entry in results if not entry.get("ok")],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
