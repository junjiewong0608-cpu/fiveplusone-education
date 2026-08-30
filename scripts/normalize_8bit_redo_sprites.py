#!/usr/bin/env python3
"""Normalize single-action transparent 8bit redo sprites.

This script intentionally does not remove backgrounds, detect color keys, erase
components, fill holes, or crop heads. It accepts only transparent source PNGs,
crops the outer alpha bounding box, and fits the complete sprite into 256x256.
"""

import argparse
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PROJECT_ROOT = Path(__file__).resolve().parents[1]
WORK_ROOT = PROJECT_ROOT / "tmp/8bit-redo-20260827"
MANIFEST_PATH = WORK_ROOT / "manifest.json"
CANVAS_SIZE = 256
PADDING = 26
ALPHA_THRESHOLD = 8

MIRRORS = {
    "stand": [("characters-idle-left", True), ("characters-idle", False)],
    "run-right": [("characters-run-left", True)],
    "jump-right": [("characters-jump-left", True)],
    "crouch-right": [("characters-crouch-left", True)],
    "lie-right": [("characters-lie-left", True)],
}

BASE_OUTPUTS = {
    "stand": ["characters", "characters-idle"],
    "run-right": ["characters-run-right"],
    "jump-right": ["characters-jump"],
    "crouch-right": ["characters-crouch"],
    "lie-right": ["characters-lie"],
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


def load_manifest():
    return json.loads(MANIFEST_PATH.read_text())


def alpha_bbox(image):
    return image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()


def count_alpha_components(image):
    alpha = image.getchannel("A")
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
                for nx in (px - 1, px, px + 1):
                    for ny in (py - 1, py, py + 1):
                        if nx < 0 or ny < 0 or nx >= width or ny >= height or (nx == px and ny == py):
                            continue
                        nindex = ny * width + nx
                        if visited[nindex] or pixels[nx, ny] <= ALPHA_THRESHOLD:
                            continue
                        visited[nindex] = 1
                        stack.append((nx, ny))
            components.append({"area": area, "bbox": [min_x, min_y, max_x + 1, max_y + 1]})
    return sorted(components, key=lambda item: item["area"], reverse=True)


def normalize_source(source_path):
    image = Image.open(source_path).convert("RGBA")
    alpha_min, alpha_max = image.getchannel("A").getextrema()
    if alpha_min >= 255:
        raise ValueError("source is fully opaque; transparent redo source required")
    bbox = alpha_bbox(image)
    if not bbox:
        raise ValueError("source has no visible alpha content")
    cropped = image.crop(bbox)
    max_side = CANVAS_SIZE - PADDING * 2
    scale = min(max_side / cropped.width, max_side / cropped.height)
    resized = cropped.resize(
        (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((CANVAS_SIZE - resized.width) // 2, (CANVAS_SIZE - resized.height) // 2))
    out_bbox = alpha_bbox(canvas)
    components = count_alpha_components(canvas)
    return canvas, {
        "sourceSize": list(image.size),
        "sourceAlphaExtrema": [alpha_min, alpha_max],
        "sourceBbox": list(bbox),
        "outputBbox": list(out_bbox) if out_bbox else None,
        "componentCount": len(components),
        "components": components[:8],
    }


def normalize_available(route_filter="", pet_filter=""):
    manifest = load_manifest()
    normalized_root = WORK_ROOT / "normalized"
    report = []
    for task in manifest["tasks"]:
        route = task["route"]
        pet_id = task["petId"]
        action = task["action"]
        if route_filter and route != route_filter:
            continue
        if pet_filter and pet_id != pet_filter:
            continue
        source_path = WORK_ROOT / task["output"]
        if not source_path.exists():
            continue
        try:
            sprite, check = normalize_source(source_path)
            outputs = []
            for folder in BASE_OUTPUTS[action]:
                out_path = normalized_root / route / folder / f"{pet_id}-8bit.png"
                out_path.parent.mkdir(parents=True, exist_ok=True)
                sprite.save(out_path)
                outputs.append(out_path.relative_to(WORK_ROOT).as_posix())
            for folder, mirror in MIRRORS.get(action, []):
                out_sprite = sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if mirror else sprite
                out_path = normalized_root / route / folder / f"{pet_id}-8bit.png"
                out_path.parent.mkdir(parents=True, exist_ok=True)
                out_sprite.save(out_path)
                outputs.append(out_path.relative_to(WORK_ROOT).as_posix())
            report.append({
                "taskId": task["taskId"],
                "petId": pet_id,
                "route": route,
                "action": action,
                "ok": True,
                "outputs": outputs,
                **check,
            })
        except Exception as error:
            report.append({
                "taskId": task["taskId"],
                "petId": pet_id,
                "route": route,
                "action": action,
                "ok": False,
                "error": str(error),
            })
    report_path = WORK_ROOT / "normalize-report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    return report


def make_red_qa(route_filter="", pet_filter="", output_name="red-qa.png"):
    root = WORK_ROOT / "normalized"
    route_ids = [route_filter] if route_filter else ["heroic", "cute"]
    manifest = load_manifest()
    pet_ids = []
    for task in manifest["tasks"]:
        if task["route"] not in route_ids:
            continue
        if pet_filter and task["petId"] != pet_filter:
            continue
        if task["petId"] not in pet_ids:
            pet_ids.append(task["petId"])
    rows = []
    for route in route_ids:
        for pet_id in pet_ids:
            if (root / route / "characters" / f"{pet_id}-8bit.png").exists():
                rows.append((route, pet_id))
    if not rows:
        return None
    cell_w = 158
    cell_h = 194
    sheet = Image.new("RGB", (len(QA_FOLDERS) * cell_w, len(rows) * cell_h), (255, 0, 0))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 12)
    except Exception:
        font = None
    for row_index, (route, pet_id) in enumerate(rows):
        for col, (folder, label) in enumerate(QA_FOLDERS):
            x = col * cell_w
            y = row_index * cell_h
            draw.rectangle([x + 3, y + 20, x + cell_w - 3, y + cell_h - 4], fill=(255, 0, 0), outline=(110, 0, 0))
            title = f"{pet_id} {route}" if col == 0 else label
            draw.text((x + 5, y + 4), title[:22], fill=(255, 255, 255), font=font)
            path = root / route / folder / f"{pet_id}-8bit.png"
            if not path.exists():
                continue
            sprite = Image.open(path).convert("RGBA")
            preview = sprite.copy()
            preview.thumbnail((cell_w - 12, cell_h - 46), Image.Resampling.NEAREST)
            sheet.paste(preview, (x + (cell_w - preview.width) // 2, y + 26 + (cell_h - 52 - preview.height) // 2), preview)
    out_path = WORK_ROOT / output_name
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path)
    return out_path


def install_approved(route_filter="", pet_filter=""):
    manifest = load_manifest()
    root = WORK_ROOT / "normalized"
    installed = []
    for route in ["heroic", "cute"]:
        if route_filter and route != route_filter:
            continue
        target_route = "final" if route == "heroic" else "cute-final"
        for task in manifest["tasks"]:
            if task["route"] != route:
                continue
            pet_id = task["petId"]
            if pet_filter and pet_id != pet_filter:
                continue
            for folder, _ in QA_FOLDERS:
                src = root / route / folder / f"{pet_id}-8bit.png"
                if not src.exists():
                    continue
                dst = PROJECT_ROOT / "assets/8bit" / target_route / folder / f"{pet_id}-8bit.png"
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
                installed.append(dst.relative_to(PROJECT_ROOT).as_posix())
    return installed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--route", default="")
    parser.add_argument("--pet", default="")
    parser.add_argument("--qa", action="store_true")
    parser.add_argument("--qa-name", default="red-qa.png")
    parser.add_argument("--install-approved", action="store_true")
    args = parser.parse_args()
    report = normalize_available(args.route, args.pet)
    qa_path = make_red_qa(args.route, args.pet, args.qa_name) if args.qa else None
    installed = install_approved(args.route, args.pet) if args.install_approved else []
    print(json.dumps({
        "normalized": len([entry for entry in report if entry.get("ok")]),
        "errors": [entry for entry in report if not entry.get("ok")],
        "qa": str(qa_path) if qa_path else "",
        "installed": installed,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
