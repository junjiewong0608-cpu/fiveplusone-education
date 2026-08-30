#!/usr/bin/env python3
"""Extract widely spaced 5-pose redo strips with edge-connected color key.

This is a temporary QA fallback for cases where image generation draws a solid
background instead of returning real alpha. It only removes pixels matching the
background color that are connected to the canvas edge. It never deletes small
components, never fills holes, and never selects foreground by shape.
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
ACTIONS = ["stand", "run-right", "jump-right", "crouch-right", "lie-right"]
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


def remove_edge_key(image, key, threshold):
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
    queue = deque()
    for x in range(width):
        for y in (0, height - 1):
            idx = y * width + x
            if is_bg[idx] and not outside[idx]:
                outside[idx] = 1
                queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            idx = y * width + x
            if is_bg[idx] and not outside[idx]:
                outside[idx] = 1
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue
            idx = ny * width + nx
            if is_bg[idx] and not outside[idx]:
                outside[idx] = 1
                queue.append((nx, ny))

    removed = 0
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if outside[idx]:
                pix[x, y] = (0, 0, 0, 0)
                removed += 1
            elif pix[x, y][3] == 0:
                pix[x, y] = (*pix[x, y][:3], 255)
    return rgba, removed


def alpha_bbox(image):
    return image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()


def normalize_cell(cell):
    bbox = alpha_bbox(cell)
    if not bbox:
        raise ValueError("empty cell after key removal")
    cropped = cell.crop(bbox)
    max_side = CANVAS_SIZE - PADDING * 2
    scale = min(max_side / cropped.width, max_side / cropped.height)
    resized = cropped.resize(
        (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((CANVAS_SIZE - resized.width) // 2, (CANVAS_SIZE - resized.height) // 2))
    return canvas, list(bbox)


def foreground_component_groups(image, expected_count):
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
            components.append({
                "area": area,
                "bbox": [min_x, min_y, max_x + 1, max_y + 1],
                "cx": (min_x + max_x + 1) / 2,
            })
    if len(components) < expected_count:
        raise ValueError(f"expected at least {expected_count} foreground components, found {len(components)}")

    anchors = sorted(sorted(components, key=lambda item: item["area"], reverse=True)[:expected_count], key=lambda item: item["cx"])
    groups = [{"bbox": anchor["bbox"][:], "components": [anchor]} for anchor in anchors]
    anchor_ids = {id(anchor) for anchor in anchors}
    for component in components:
        if id(component) in anchor_ids:
            continue
        target = min(groups, key=lambda group: abs(((group["bbox"][0] + group["bbox"][2]) / 2) - component["cx"]))
        bbox = target["bbox"]
        cb = component["bbox"]
        target["bbox"] = [
            min(bbox[0], cb[0]),
            min(bbox[1], cb[1]),
            max(bbox[2], cb[2]),
            max(bbox[3], cb[3]),
        ]
        target["components"].append(component)

    padding = 20
    return [
        [max(0, group["bbox"][0] - padding), max(0, group["bbox"][1] - padding),
         min(width, group["bbox"][2] + padding), min(height, group["bbox"][3] + padding)]
        for group in groups
    ]


def foreground_x_groups(image, expected_count):
    alpha = image.getchannel("A")
    width, height = alpha.size
    pix = alpha.load()
    columns = [x for x in range(width) if any(pix[x, y] > ALPHA_THRESHOLD for y in range(height))]
    if not columns:
        raise ValueError("no foreground after key removal")

    runs = []
    start = prev = columns[0]
    for x in columns[1:]:
        if x - prev > 1:
            runs.append([start, prev + 1])
            start = x
        prev = x
    runs.append([start, prev + 1])

    # Keep thin disconnected character details with the nearest pose; only the
    # wide empty gaps between poses should split groups.
    while len(runs) > expected_count:
        gaps = [(runs[i + 1][0] - runs[i][1], i) for i in range(len(runs) - 1)]
        _, index = min(gaps)
        runs[index][1] = runs[index + 1][1]
        del runs[index + 1]

    if len(runs) != expected_count:
        raise ValueError(f"expected {expected_count} foreground groups, found {len(runs)}")

    groups = []
    padding = 20
    for left, right in runs:
        groups.append([max(0, left - padding), 0, min(width, right + padding), height])
    return groups


def extract_strip(strip_path, route, pet_id, key, threshold, layout):
    strip = Image.open(strip_path)
    transparent, removed = remove_edge_key(strip, key, threshold)
    debug_path = WORK_ROOT / "keyed" / route / f"{pet_id}-strip-alpha.png"
    debug_path.parent.mkdir(parents=True, exist_ok=True)
    transparent.save(debug_path)

    if layout == "components":
        source_cells = foreground_component_groups(transparent, len(ACTIONS))
    elif layout == "clusters":
        source_cells = foreground_x_groups(transparent, len(ACTIONS))
    else:
        cell_w = transparent.width // len(ACTIONS)
        source_cells = []
        for index in range(len(ACTIONS)):
            left = index * cell_w
            right = transparent.width if index == len(ACTIONS) - 1 else (index + 1) * cell_w
            source_cells.append([left, 0, right, transparent.height])

    out_root = WORK_ROOT / "normalized" / route
    report = {
        "strip": str(strip_path),
        "route": route,
        "petId": pet_id,
        "key": key,
        "threshold": threshold,
        "removedPixels": removed,
        "debugStrip": str(debug_path.relative_to(WORK_ROOT)),
        "cells": [],
    }
    for action, source_cell in zip(ACTIONS, source_cells):
        left, top, right, bottom = source_cell
        cell = transparent.crop((left, top, right, bottom))
        sprite, bbox = normalize_cell(cell)
        for folder, mirror in ACTION_TO_FOLDERS[action]:
            output = sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if mirror else sprite
            out_path = out_root / folder / f"{pet_id}-8bit.png"
            out_path.parent.mkdir(parents=True, exist_ok=True)
            output.save(out_path)
        report["cells"].append({"action": action, "sourceCell": source_cell, "bbox": bbox})
    return report


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
    parser.add_argument("strip", type=Path)
    parser.add_argument("--route", required=True)
    parser.add_argument("--pet", required=True)
    parser.add_argument("--key", type=parse_hex, default=parse_hex("#ff00ff"))
    parser.add_argument("--threshold", type=int, default=38)
    parser.add_argument("--layout", choices=["components", "clusters", "fixed"], default="components")
    parser.add_argument("--qa-name", default="key-strip-red-qa.png")
    args = parser.parse_args()

    report = extract_strip(args.strip, args.route, args.pet, args.key, args.threshold, args.layout)
    qa = make_red_qa(args.route, args.pet, args.qa_name)
    report["qa"] = str(qa)
    report_path = WORK_ROOT / f"key-strip-report-{args.route}-{args.pet}.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
