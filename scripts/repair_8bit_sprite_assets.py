#!/usr/bin/env python3
"""Repair and verify CY PETS STORY evolution 8-bit sprite cutouts.

The game treats right-facing sprites as the authored source. This script keeps
that contract by regenerating left-facing sprites as exact horizontal mirrors,
then performs conservative alpha cleanup that preserves internal sprite details
such as eyes, mouths, hands, highlights, and colored props.
"""

import argparse
import json
import shutil
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


PROJECT_ROOT = Path(__file__).resolve().parents[1]
STAGE_ROOTS = [
    PROJECT_ROOT / "assets/8bit/final",
    PROJECT_ROOT / "assets/8bit/cute-final",
]
SPRITE_FOLDERS = [
    "characters",
    "heads",
    "characters-idle",
    "characters-idle-left",
    "characters-run-right",
    "characters-run-left",
    "characters-jump",
    "characters-jump-left",
    "characters-crouch",
    "characters-crouch-left",
    "characters-lie",
    "characters-lie-left",
]
MIRROR_PAIRS = [
    ("characters-idle", "characters-idle-left"),
    ("characters-run-right", "characters-run-left"),
    ("characters-jump", "characters-jump-left"),
    ("characters-crouch", "characters-crouch-left"),
    ("characters-lie", "characters-lie-left"),
]
ALPHA_CONTENT_THRESHOLD = 8
LOW_ALPHA_CUTOFF = 5
MIN_COMPONENT_PIXELS = 4
MAX_INTERNAL_DETAIL_HOLE_PIXELS = 3200


def relative_path(path):
    return path.resolve().relative_to(PROJECT_ROOT).as_posix()


def backup_file(path, backup_root):
    backup_path = backup_root / relative_path(path)
    if backup_path.exists():
        return
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, backup_path)


def image_has_difference(left, right):
    return ImageChops.difference(left, right).getbbox() is not None


def alpha_component_points(alpha, target_opaque=True):
    width, height = alpha.size
    pixels = alpha.load()
    visited = bytearray(width * height)
    components = []

    def is_target(x, y):
        opaque = pixels[x, y] > ALPHA_CONTENT_THRESHOLD
        return opaque if target_opaque else not opaque

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or not is_target(x, y):
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
                    if visited[nindex] or not is_target(nx, ny):
                        continue
                    visited[nindex] = 1
                    stack.append((nx, ny))
            components.append(points)
    return components


def remove_low_alpha_noise(image):
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    changed = 0
    data = list(alpha.getdata())
    cleaned = []
    for value in data:
        if 0 < value <= LOW_ALPHA_CUTOFF:
            cleaned.append(0)
            changed += 1
        else:
            cleaned.append(value)
    if changed:
        alpha.putdata(cleaned)
        rgba.putalpha(alpha)
    return rgba, changed


def remove_tiny_alpha_components(image):
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    alpha_pixels = alpha.load()
    changed = 0
    for points in alpha_component_points(alpha, target_opaque=True):
        if len(points) >= MIN_COMPONENT_PIXELS:
            continue
        for x, y in points:
            if alpha_pixels[x, y]:
                alpha_pixels[x, y] = 0
                changed += 1
    if changed:
        rgba.putalpha(alpha)
    return rgba, changed


def outside_transparent_mask(alpha):
    width, height = alpha.size
    pixels = alpha.load()
    outside = bytearray(width * height)
    queue = deque()

    def add(x, y):
        index = y * width + x
        if outside[index] or pixels[x, y] > ALPHA_CONTENT_THRESHOLD:
            return
        outside[index] = 1
        queue.append((x, y))

    for x in range(width):
        add(x, 0)
        add(x, height - 1)
    for y in range(height):
        add(0, y)
        add(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                add(nx, ny)
    return outside


def internal_transparent_components(alpha):
    width, height = alpha.size
    pixels = alpha.load()
    outside = outside_transparent_mask(alpha)
    visited = bytearray(width * height)
    components = []

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or outside[index] or pixels[x, y] > ALPHA_CONTENT_THRESHOLD:
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
                    if visited[nindex] or outside[nindex] or pixels[nx, ny] > ALPHA_CONTENT_THRESHOLD:
                        continue
                    visited[nindex] = 1
                    stack.append((nx, ny))
            components.append(points)
    return components


def is_internal_detail_component(image, points):
    if len(points) > MAX_INTERNAL_DETAIL_HOLE_PIXELS:
        return False
    pixels = image.load()
    bright_pixels = 0
    visible_rgb_pixels = 0
    saturated_pixels = 0
    non_clear_pixels = 0
    for x, y in points:
        red, green, blue, _ = pixels[x, y]
        channel_sum = red + green + blue
        if channel_sum > 18:
            non_clear_pixels += 1
        if channel_sum > 55:
            visible_rgb_pixels += 1
        if max(red, green, blue) - min(red, green, blue) >= 42 and channel_sum > 45:
            saturated_pixels += 1
        if red >= 180 and green >= 180 and blue >= 170:
            bright_pixels += 1
    if not non_clear_pixels:
        return False
    if len(points) <= 24:
        return True
    return (
        visible_rgb_pixels / len(points) >= 0.08
        or saturated_pixels / len(points) >= 0.04
        or bright_pixels / len(points) >= 0.04
    )


def fill_internal_detail_holes(image):
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    alpha_pixels = alpha.load()
    changed = 0
    for points in internal_transparent_components(alpha):
        if not is_internal_detail_component(rgba, points):
            continue
        for x, y in points:
            if alpha_pixels[x, y] < 245:
                alpha_pixels[x, y] = 245
                changed += 1
    if changed:
        rgba.putalpha(alpha)
    return rgba, changed


def repair_alpha(path, backup_root=None, apply=False):
    original = Image.open(path).convert("RGBA")
    repaired, low_alpha_changes = remove_low_alpha_noise(original)
    repaired, tiny_component_changes = remove_tiny_alpha_components(repaired)
    repaired, hole_changes = fill_internal_detail_holes(repaired)
    changed = image_has_difference(original, repaired)
    if changed and apply:
        if backup_root:
            backup_file(path, backup_root)
        repaired.save(path)
    return {
        "path": relative_path(path),
        "changed": changed,
        "lowAlphaPixels": low_alpha_changes,
        "tinyComponentPixels": tiny_component_changes,
        "filledHolePixels": hole_changes,
    }


def mirror_left_sprite(source_path, target_path, backup_root=None, apply=False):
    source = Image.open(source_path).convert("RGBA")
    mirrored = source.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    target = Image.open(target_path).convert("RGBA") if target_path.exists() else None
    changed = target is None or image_has_difference(target, mirrored)
    if changed and apply:
        if target_path.exists() and backup_root:
            backup_file(target_path, backup_root)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        mirrored.save(target_path)
    return {
        "source": relative_path(source_path),
        "target": relative_path(target_path),
        "changed": changed,
    }


def iter_sprite_paths(stage_root):
    for folder in SPRITE_FOLDERS:
        folder_path = stage_root / folder
        if not folder_path.exists():
            continue
        yield from sorted(folder_path.glob("*-8bit.png"))


def repair_all(apply=False):
    backup_root = PROJECT_ROOT / "tmp/8bit-sprite-repair-backup"
    mirror_changes = []
    alpha_changes = []

    for stage_root in STAGE_ROOTS:
        if not stage_root.exists():
            continue
        for source_folder, target_folder in MIRROR_PAIRS:
            source_dir = stage_root / source_folder
            target_dir = stage_root / target_folder
            if not source_dir.exists():
                continue
            for source_path in sorted(source_dir.glob("*-8bit.png")):
                target_path = target_dir / source_path.name
                result = mirror_left_sprite(source_path, target_path, backup_root, apply)
                if result["changed"]:
                    mirror_changes.append(result)

        for path in iter_sprite_paths(stage_root):
            result = repair_alpha(path, backup_root, apply)
            if result["changed"]:
                alpha_changes.append(result)

    return {
        "apply": apply,
        "backupRoot": relative_path(backup_root),
        "mirrorChanges": mirror_changes,
        "alphaChanges": alpha_changes,
    }


def mirror_diff_mean(source_path, target_path):
    source = Image.open(source_path).convert("RGBA")
    target = Image.open(target_path).convert("RGBA")
    diff = ImageChops.difference(source.transpose(Image.Transpose.FLIP_LEFT_RIGHT), target)
    return sum(ImageStat.Stat(diff).mean) / 4


def check_all():
    mirror_failures = []
    internal_detail_hole_warnings = []

    for stage_root in STAGE_ROOTS:
        if not stage_root.exists():
            continue
        for source_folder, target_folder in MIRROR_PAIRS:
            source_dir = stage_root / source_folder
            target_dir = stage_root / target_folder
            if not source_dir.exists():
                continue
            for source_path in sorted(source_dir.glob("*-8bit.png")):
                target_path = target_dir / source_path.name
                if not target_path.exists():
                    mirror_failures.append({"source": relative_path(source_path), "target": relative_path(target_path), "reason": "missing"})
                    continue
                mean = mirror_diff_mean(source_path, target_path)
                if mean > 0:
                    mirror_failures.append({
                        "source": relative_path(source_path),
                        "target": relative_path(target_path),
                        "mirrorDiffMean": round(mean, 4),
                    })

        for path in iter_sprite_paths(stage_root):
            image = Image.open(path).convert("RGBA")
            internal_detail_hole_pixels = 0
            for points in internal_transparent_components(image.getchannel("A")):
                if is_internal_detail_component(image, points):
                    internal_detail_hole_pixels += len(points)
            if internal_detail_hole_pixels:
                internal_detail_hole_warnings.append({
                    "path": relative_path(path),
                    "internalDetailHolePixels": internal_detail_hole_pixels,
                })

    return {
        "mirrorFailureCount": len(mirror_failures),
        "internalDetailHoleWarningCount": len(internal_detail_hole_warnings),
        "brightHoleWarningCount": len(internal_detail_hole_warnings),
        "mirrorFailures": mirror_failures[:80],
        "internalDetailHoleWarnings": internal_detail_hole_warnings[:80],
        "brightHoleWarnings": internal_detail_hole_warnings[:80],
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write repaired PNGs")
    parser.add_argument("--check", action="store_true", help="verify mirror and alpha-hole contracts")
    args = parser.parse_args()

    if args.check and not args.apply:
        print(json.dumps(check_all(), ensure_ascii=False, indent=2))
        return

    report = repair_all(apply=args.apply)
    report["postCheck"] = check_all()
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
