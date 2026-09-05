#!/usr/bin/env python3
"""Split one approved hero board into the app's standard hero asset template."""

from argparse import ArgumentParser
from pathlib import Path
from shutil import copyfile

from PIL import Image


SKILL_FILES = (
    "skill-passive.png",
    "skill-1.png",
    "skill-2.png",
    "skill-3.png",
    "skill-ultimate.png",
)


def crop_ratio(image: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    width, height = image.size
    return image.crop(tuple(round(value * size) for value, size in zip(box, (width, height, width, height))))


def main() -> None:
    parser = ArgumentParser()
    parser.add_argument("hero_id")
    parser.add_argument("board", type=Path)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()

    hero_dir = args.root / "assets" / "roles" / "hero-gacha" / args.hero_id
    equipment_dir = args.root / "assets" / "equipment-items" / "exclusive" / args.hero_id
    hero_dir.mkdir(parents=True, exist_ok=True)
    equipment_dir.mkdir(parents=True, exist_ok=True)

    board_path = hero_dir / "hero-template-board.png"
    copyfile(args.board, board_path)
    board = Image.open(board_path).convert("RGB")

    crop_ratio(board, (0.01, 0.01, 0.495, 0.755)).save(hero_dir / "base-card.png", optimize=True)
    crop_ratio(board, (0.505, 0.01, 0.99, 0.755)).save(hero_dir / "evolved-card.png", optimize=True)

    # Slicing 5 skills (144x144 squares on the left)
    for index, filename in enumerate(SKILL_FILES):
        x1 = round(42 + index * 158)
        y1 = 737
        x2 = x1 + 144
        y2 = 881
        icon = board.crop((x1, y1, x2, y2))
        icon.save(hero_dir / filename, optimize=True)
        icon.save(hero_dir / f"after-{filename}", optimize=True)

        stem = filename.replace(".png", "")
        thumb_dir = args.root / "assets" / "optimized" / "role-thumbs"
        thumb_dir.mkdir(parents=True, exist_ok=True)
        icon_thumb = icon.resize((96, 96), Image.Resampling.LANCZOS)
        icon_thumb.save(thumb_dir / f"hero-gacha-{args.hero_id}-{stem}.webp", "WEBP", quality=90)
        icon_thumb.save(thumb_dir / f"hero-gacha-{args.hero_id}-after-{stem}.webp", "WEBP", quality=90)

    # Slicing 5 equipment items (144x144 squares on the right)
    for index in range(5):
        x1 = round(878 + index * 158)
        y1 = 737
        x2 = x1 + 144
        y2 = 881
        icon = board.crop((x1, y1, x2, y2))
        icon.save(equipment_dir / f"{index + 1:02}.png", optimize=True)

    thumb_dir = args.root / "assets" / "optimized" / "role-thumbs"
    thumb_dir.mkdir(parents=True, exist_ok=True)
    for card_name in ("base-card", "evolved-card"):
        card_img = Image.open(hero_dir / f"{card_name}.png")
        if card_img.width > 640 or card_img.height > 640:
            ratio = card_img.width / card_img.height
            new_w = 640 if card_img.width >= card_img.height else round(640 * ratio)
            new_h = round(640 / ratio) if card_img.width >= card_img.height else 640
            card_img = card_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        card_img.save(thumb_dir / f"hero-gacha-{args.hero_id}-{card_name}.webp", "WEBP", quality=85)

    print(f"Built hero template and thumbnails: {args.hero_id}")


if __name__ == "__main__":
    main()
