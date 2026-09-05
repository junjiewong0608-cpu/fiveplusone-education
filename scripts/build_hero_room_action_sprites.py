#!/usr/bin/env python3
"""Build transparent 8-bit room action sprites and Q-versions for hero-gacha pets."""

import os
from pathlib import Path
from PIL import Image, ImageOps

PROJECT_ROOT = Path(__file__).resolve().parents[1]

HEROES = [
    "vibranium-panther",
    "arcflare-fox",
    "stormmane-lion",
    "webshade-lynx",
    "runeportal-owl",
    "gamma-boulder-bear",
]

CANVAS_SIZE = 256
TARGET_HEIGHT = 196
GROUND_Y = 242


def make_canvas():
    return Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))


def fit_proportional(img, max_w, max_h):
    w, h = img.size
    scale = min(max_w / w, max_h / h)
    new_w = max(1, round(w * scale))
    new_h = max(1, round(h * scale))
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def paste_anchored(canvas, img, anchor_bottom_y=GROUND_Y):
    x = (CANVAS_SIZE - img.width) // 2
    y = anchor_bottom_y - img.height
    canvas.paste(img, (x, y), img)
    return canvas


def create_actions_for_hero(hero_id, source_path, is_final=False):
    stage_prefix = "final/" if is_final else ""
    base_8bit_dir = PROJECT_ROOT / "assets" / "8bit" / stage_prefix
    pet_q_dir = PROJECT_ROOT / "assets" / "pet-interactions" / "pets"
    pet_q_dir.mkdir(parents=True, exist_ok=True)

    # 1. Open source and crop transparent bbox
    raw = Image.open(source_path).convert("RGBA")
    bbox = raw.getbbox()
    if bbox:
        raw = raw.crop(bbox)

    # 2. Q-style pet interaction image (512x512)
    if not is_final:
        q_canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        q_fit = fit_proportional(raw, 460, 460)
        qx = (512 - q_fit.width) // 2
        qy = (512 - q_fit.height) // 2
        q_canvas.paste(q_fit, (qx, qy), q_fit)
        q_canvas.save(pet_q_dir / f"{hero_id}-q.png", "PNG", optimize=True)

    # 3. Base idle pose
    idle_fit = fit_proportional(raw, 210, TARGET_HEIGHT)
    idle_canvas = paste_anchored(make_canvas(), idle_fit, GROUND_Y)

    # 4. Run pose: lean forward ~7 deg, stretch X slightly
    run_img = idle_fit.resize((round(idle_fit.width * 1.05), round(idle_fit.height * 0.98)), Image.Resampling.LANCZOS)
    run_rotated = run_img.rotate(7, expand=True, resample=Image.Resampling.BICUBIC)
    run_canvas = paste_anchored(make_canvas(), run_rotated, GROUND_Y)

    # 5. Jump pose: higher in canvas, slightly scaled up
    jump_img = fit_proportional(raw, 220, round(TARGET_HEIGHT * 1.04))
    jump_rotated = jump_img.rotate(-4, expand=True, resample=Image.Resampling.BICUBIC)
    jump_canvas = paste_anchored(make_canvas(), jump_rotated, GROUND_Y - 32)

    # 6. Crouch pose: squash vertically, widen horizontally
    crouch_w = round(idle_fit.width * 1.10)
    crouch_h = round(idle_fit.height * 0.78)
    crouch_img = idle_fit.resize((crouch_w, crouch_h), Image.Resampling.LANCZOS)
    crouch_canvas = paste_anchored(make_canvas(), crouch_img, GROUND_Y)

    # 7. Lie pose: rotated onto side and flattened down to floor
    lie_w = round(idle_fit.width * 1.15)
    lie_h = round(idle_fit.height * 0.70)
    lie_img = idle_fit.resize((lie_w, lie_h), Image.Resampling.LANCZOS)
    lie_rotated = lie_img.rotate(82, expand=True, resample=Image.Resampling.BICUBIC)
    lie_canvas = paste_anchored(make_canvas(), lie_rotated, GROUND_Y)

    # 8. Head avatar: top 44% of raw image
    head_bbox = (0, 0, raw.width, round(raw.height * 0.44))
    head_crop = raw.crop(head_bbox)
    head_fit = fit_proportional(head_crop, 180, 180)
    head_canvas = make_canvas()
    hx = (CANVAS_SIZE - head_fit.width) // 2
    hy = (CANVAS_SIZE - head_fit.height) // 2
    head_canvas.paste(head_fit, (hx, hy), head_fit)

    # 9. Mirrored poses
    idle_left = ImageOps.mirror(idle_canvas)
    run_left = ImageOps.mirror(run_canvas)
    jump_left = ImageOps.mirror(jump_canvas)
    crouch_left = ImageOps.mirror(crouch_canvas)
    lie_left = ImageOps.mirror(lie_canvas)

    # 10. Save all folders
    targets = [
        ("characters", idle_canvas),
        ("characters-idle", idle_canvas),
        ("characters-idle-left", idle_left),
        ("characters-run-right", run_canvas),
        ("characters-run-left", run_left),
        ("characters-jump", jump_canvas),
        ("characters-jump-left", jump_left),
        ("characters-crouch", crouch_canvas),
        ("characters-crouch-left", crouch_left),
        ("characters-lie", lie_canvas),
        ("characters-lie-left", lie_left),
        ("heads", head_canvas),
    ]

    for folder, img in targets:
        folder_path = base_8bit_dir / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        img.save(folder_path / f"{hero_id}-8bit.png", "PNG", optimize=True)


def main():
    for hero_id in HEROES:
        source_card = PROJECT_ROOT / "assets" / "roles" / "hero-gacha" / f"{hero_id}-card.png"
        if not source_card.exists():
            print(f"Warning: source card not found for {hero_id}")
            continue

        # Base form
        create_actions_for_hero(hero_id, source_card, is_final=False)

        # Final form
        create_actions_for_hero(hero_id, source_card, is_final=True)

        print(f"Built complete 5-action 8bit sprites for: {hero_id}")


if __name__ == "__main__":
    main()
