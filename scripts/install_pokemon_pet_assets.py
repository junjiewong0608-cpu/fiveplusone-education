#!/usr/bin/env python3
from __future__ import annotations

import json
import os
from collections import deque
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageChops, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
GEN = Path(os.environ.get("CY_PETS_GENERATED_IMAGE_DIR", ROOT / "asset-sources" / "generated-images"))

SKILL_NAMES = ["passive", "1", "2", "3", "ultimate"]


ROLE_IMAGES = {
    "psyduck": {
        "folder": ROOT / "assets/roles/new character/pokemon/psyduck",
        "before": GEN / "call_tNizo4QB8FCLmdAqLXU3ees9.png",
        "mini": GEN / "call_4QbakCpvzKHeup8YwO9TFkZ0.png",
        "after": GEN / "call_eSogncJXJfil82tT6GKjzqkm.png",
        "cute": GEN / "call_8wsIJ2iHqzD8Pd0eWNqn6Yra.png",
        "skills_before": GEN / "call_1pFUpCyiOvcEgcGcdWVhl4jv.png",
        "skills_after": GEN / "call_TD3wkWT0a3n7CJQ6Z5PANmqg.png",
        "equipment": GEN / "call_8foYkrDzlW0KvDMPrx8YE3Jg.png",
    },
    "squirtle": {
        "folder": ROOT / "assets/roles/new character/pokemon/squirtle",
        "before": GEN / "call_w71aCjIykd1aPSCM2vcjDkWH.png",
        "mini": GEN / "call_blITHtOdVQGubu50BhxwqcTl.png",
        "after": GEN / "call_ipCXAK3SY7ZqMKJ3f0AYx0tF.png",
        "cute": GEN / "call_TvhQKd7dE5mVtXxvhR6ExPmz.png",
        "skills_before": GEN / "call_c2YDJ8cO1bWu0CC5Vou71DtU.png",
        "skills_after": GEN / "call_iXGpyWHsyeOuitVVwAq5FYKW.png",
        "equipment": GEN / "call_Stzso0Q5eFpSsiAC4gYPOseX.png",
    },
}

SPRITE_SOURCES = {
    "psyduck": {
        "base": {
            "stand": GEN / "call_93uKqJ3IEVgFh9beSnRwbw4M.png",
            "idle": GEN / "call_2trzTpH7I902qFTcmuU1LTUU.png",
            "run": GEN / "call_bNpfEVmAU34BobQUxFztEdu3.png",
            "jump": GEN / "call_UgssuuO24ReNByKkYSNihWBe.png",
            "crouch": GEN / "call_cAXjDmKsCQy1GuGPYNLGscl7.png",
            "lie": GEN / "call_pnPMo5cn8HMoXh10RkmgPUvR.png",
            "head": GEN / "call_SUsBwBg0cM50HoFR14EC3Pzb.png",
        },
        "final": {
            "stand": GEN / "call_l72xEmSMSCPyIaFEh0ZzPm86.png",
            "idle": GEN / "call_4sioF9ZHl2RgIW4zCoNyl1Pr.png",
            "run": GEN / "call_jNQ4G6GbbhaeCWB4dYNByzny.png",
            "jump": GEN / "call_8RLtF7OtghuJDbk93MJ5vqZy.png",
            "crouch": GEN / "call_p6J75P2uhntBa8sOBhA28p1s.png",
            "lie": GEN / "call_PtjsenBjHhHUpXYPJV0TtoS9.png",
            "head": GEN / "call_xthPIbvJnCcRWUqN28VFOffn.png",
        },
        "cute-final": {
            "stand": GEN / "call_TWGg1RcQ41ZTBbpAlqo3glKi.png",
            "idle": GEN / "call_gDMY3C7ifjcnkkfO6EoGtaTI.png",
            "run": GEN / "call_W1NhBevog7dTRA8c3L7LzafN.png",
            "jump": GEN / "call_22aLYALWYOWUpid7IZyq9VEM.png",
            "crouch": GEN / "call_3orznBkss4jzQ7YxSHyUrAJ5.png",
            "lie": GEN / "call_cNGg8If1ZJvIgRp3nLTeth98.png",
            "head": GEN / "call_Mr9ucCI3lvoMUrUQVkijdSYZ.png",
        },
    },
    "squirtle": {
        "base": {
            "stand": GEN / "call_B52MfEFT7aqAqCJrLlrUPu1z.png",
            "idle": GEN / "call_X60YwtTc4Elqu4DUHnxxfXrS.png",
            "run": GEN / "call_aEvyNDGsqAcZnosfDca449SY.png",
            "jump": GEN / "call_ZZffMVIsWqJIteuyaTrvSvHk.png",
            "crouch": GEN / "call_20T9brhyVxvqPqfcqFQJYO5F.png",
            "lie": GEN / "call_NfjBi9Q8VyPbOVrbO5ke8mhK.png",
            "head": GEN / "call_mRI0x2ys4cZEd3Hf6RkOM6nd.png",
        },
        "final": {
            "stand": GEN / "call_ecVCugaP2n423VhdCMkMpM3Q.png",
            "idle": GEN / "call_56cECXHSMmevHFT3jTGeESLa.png",
            "run": GEN / "call_dHNC8IJh9wxEoiLRiPVYwZY2.png",
            "jump": GEN / "call_6kPAjbr8f81BfBfIOeIc0d4p.png",
            "crouch": GEN / "call_KBN0jJbGZjmLowbzZWfGayoH.png",
            "lie": GEN / "call_Fk2jUIfksEnxmxHAltPgNwsX.png",
            "head": GEN / "call_toxELspDUYhJU8sXY2k9jhGd.png",
        },
        "cute-final": {
            "stand": GEN / "call_SzHTm9K5VaQZBL67ts2rCqcO.png",
            "idle": GEN / "call_d3TZowTi8Ul5gN8pAI9uZcEs.png",
            "run": GEN / "call_yiH61ha6qDGI5UWVHPV6w478.png",
            "jump": GEN / "call_ad3PgzgVpDnrMR1zqbCnzPK0.png",
            "crouch": GEN / "call_MIBIJEreRHWrmGZnVLnUOZ6V.png",
            "lie": GEN / "call_c4leis60Uw2tjBk9feUZm1Kw.png",
            "head": GEN / "call_SRZh8AsHQw0wUHIgc86VWqSl.png",
        },
    },
}

FORM_PREFIX = {
    "base": ROOT / "assets/8bit",
    "final": ROOT / "assets/8bit/final",
    "cute-final": ROOT / "assets/8bit/cute-final",
}

SPRITE_DIRS = {
    "stand": "characters",
    "idle": "characters-idle",
    "idle-left": "characters-idle-left",
    "run": "characters-run-right",
    "run-left": "characters-run-left",
    "jump": "characters-jump",
    "jump-left": "characters-jump-left",
    "crouch": "characters-crouch",
    "crouch-left": "characters-crouch-left",
    "sit": "characters-sit",
    "sit-left": "characters-sit-left",
    "lie": "characters-lie",
    "lie-left": "characters-lie-left",
    "head": "heads",
}


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def open_rgba(path: Path) -> Image.Image:
    if not path.exists():
        raise FileNotFoundError(path)
    return Image.open(path).convert("RGBA")


def save_center_crop(src: Path, dest: Path, size: tuple[int, int]) -> None:
    img = open_rgba(src)
    target_w, target_h = size
    scale = max(target_w / img.width, target_h / img.height)
    resized = img.resize((round(img.width * scale), round(img.height * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - target_w) // 2)
    top = max(0, (resized.height - target_h) // 2)
    cropped = resized.crop((left, top, left + target_w, top + target_h))
    ensure_parent(dest)
    cropped.save(dest)


def crop_sheet(src: Path, dests: list[Path]) -> None:
    img = open_rgba(src)
    count = len(dests)
    cell_w = img.width / count
    for index, dest in enumerate(dests):
        box = (
            round(index * cell_w),
            0,
            round((index + 1) * cell_w),
            img.height,
        )
        cell = img.crop(box)
        square = crop_content_to_square(cell)
        square = square.resize((512, 512), Image.Resampling.LANCZOS)
        ensure_parent(dest)
        square.save(dest)


def crop_content_to_square(img: Image.Image, padding_ratio: float = 0.08) -> Image.Image:
    bg = Image.new("RGBA", img.size, img.getpixel((0, 0)))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    if not bbox:
        bbox = (0, 0, img.width, img.height)
    left, top, right, bottom = bbox
    pad = round(max(right - left, bottom - top) * padding_ratio)
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(img.width, right + pad)
    bottom = min(img.height, bottom + pad)
    crop = img.crop((left, top, right, bottom))
    side = max(crop.width, crop.height)
    square = Image.new("RGBA", (side, side), (255, 255, 255, 0))
    square.alpha_composite(crop, ((side - crop.width) // 2, (side - crop.height) // 2))
    return square


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])


def is_background_pixel(
    rgba: tuple[int, int, int, int],
    edge_colors: list[tuple[int, int, int]],
) -> bool:
    r, g, b, a = rgba
    if a <= 12:
        return True
    rgb = (r, g, b)
    if min(color_distance(rgb, edge) for edge in edge_colors) <= 58:
        return True
    mx = max(r, g, b)
    mn = min(r, g, b)
    if mx - mn <= 24 and mx >= 178:
        return True
    if mx <= 35:
        return True
    return False


def edge_cleanup(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    alpha = img.getchannel("A")
    if alpha.getextrema()[0] < 8:
        return img

    edge_samples: list[tuple[int, int, int]] = []
    for x in range(img.width):
        edge_samples.append(img.getpixel((x, 0))[:3])
        edge_samples.append(img.getpixel((x, img.height - 1))[:3])
    for y in range(img.height):
        edge_samples.append(img.getpixel((0, y))[:3])
        edge_samples.append(img.getpixel((img.width - 1, y))[:3])

    edge_colors: list[tuple[int, int, int]] = []
    for rgb in edge_samples[:: max(1, len(edge_samples) // 160)]:
        if not any(color_distance(rgb, seen) <= 24 for seen in edge_colors):
            edge_colors.append(rgb)
    if not edge_colors:
        return img

    visited = bytearray(img.width * img.height)
    queue: deque[tuple[int, int]] = deque()
    for x in range(img.width):
        queue.append((x, 0))
        queue.append((x, img.height - 1))
    for y in range(img.height):
        queue.append((0, y))
        queue.append((img.width - 1, y))

    px = img.load()
    while queue:
        x, y = queue.popleft()
        idx = y * img.width + x
        if visited[idx]:
            continue
        visited[idx] = 1
        if not is_background_pixel(px[x, y], edge_colors):
            continue
        px[x, y] = (0, 0, 0, 0)
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < img.width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < img.height:
            queue.append((x, y + 1))

    return img


def opaque_bbox(img: Image.Image, alpha_threshold: int = 16) -> tuple[int, int, int, int]:
    alpha = img.getchannel("A")
    mask = alpha.point(lambda value: 255 if value > alpha_threshold else 0)
    return mask.getbbox() or (0, 0, img.width, img.height)


def sprite_canvas(src: Path, dest: Path, *, occupancy: float = 0.86, bottom_bias: bool = True) -> None:
    img = edge_cleanup(open_rgba(src))
    bbox = opaque_bbox(img)
    crop = img.crop(bbox)
    max_w = round(256 * occupancy)
    max_h = round(256 * occupancy)
    scale = min(max_w / crop.width, max_h / crop.height, 1.0)
    if crop.width > max_w or crop.height > max_h:
        crop = crop.resize((max(1, round(crop.width * scale)), max(1, round(crop.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    x = (256 - crop.width) // 2
    y = (256 - crop.height) // 2
    if bottom_bias:
        y = max(8, 256 - crop.height - 12)
    canvas.alpha_composite(crop, (x, y))
    ensure_parent(dest)
    canvas.save(dest)


def mirror(src: Path, dest: Path) -> None:
    img = open_rgba(src)
    ensure_parent(dest)
    img.transpose(Image.Transpose.FLIP_LEFT_RIGHT).save(dest)


def sprite_path(pet_id: str, form: str, action: str) -> Path:
    root = FORM_PREFIX[form]
    return root / SPRITE_DIRS[action] / f"{pet_id}-8bit.png"


def install_role_assets() -> None:
    for pet_id, spec in ROLE_IMAGES.items():
        folder = spec["folder"]
        save_center_crop(spec["before"], folder / f"{pet_id}_before.png", (1920, 1080))
        save_center_crop(spec["after"], folder / f"{pet_id}_after.png", (1920, 1080))
        save_center_crop(spec["mini"], ROOT / "assets/roles/mini-evolved" / f"{pet_id}.png", (1920, 1080))
        save_center_crop(spec["cute"], ROOT / "assets/roles/cute-evolved" / f"{pet_id}.png", (1920, 1080))

        before_dests = [folder / f"skill-{name}.png" for name in SKILL_NAMES]
        after_dests = [folder / f"after-skill-{name}.png" for name in SKILL_NAMES]
        crop_sheet(spec["skills_before"], before_dests)
        crop_sheet(spec["skills_after"], after_dests)
        crop_sheet(spec["equipment"], [ROOT / "assets/equipment-items/exclusive" / pet_id / f"{index:02}.png" for index in range(1, 5)])

        thumb_sources = [
            folder / f"{pet_id}_before.png",
            folder / f"{pet_id}_after.png",
            ROOT / "assets/roles/mini-evolved" / f"{pet_id}.png",
            ROOT / "assets/roles/cute-evolved" / f"{pet_id}.png",
        ]
        install_thumbnails(thumb_sources)


def thumb_slug(source: Path) -> str:
    rel = source.relative_to(ROOT / "assets/roles")
    return "-".join(rel.with_suffix("").parts).replace(" ", "-").lower()


def install_thumbnails(sources: Iterable[Path]) -> None:
    manifest_path = ROOT / "assets/optimized/role-thumbs-manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    for source in sources:
        thumb = ROOT / "assets/optimized/role-thumbs" / f"{thumb_slug(source)}.webp"
        img = open_rgba(source).convert("RGB")
        img.thumbnail((640, 360), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (640, 360), (245, 245, 255))
        canvas.paste(img, ((640 - img.width) // 2, (360 - img.height) // 2))
        ensure_parent(thumb)
        canvas.save(thumb, "WEBP", quality=82, method=6)
        source_rel = source.relative_to(ROOT).as_posix()
        thumb_rel = thumb.relative_to(ROOT).as_posix()
        manifest[source_rel] = {"thumb": thumb_rel, "width": 640, "height": 360, "bytes": thumb.stat().st_size}
    ensure_parent(manifest_path)
    manifest_path.write_text(json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, indent=2) + "\n")


def install_sprites() -> None:
    for pet_id, forms in SPRITE_SOURCES.items():
        for form, actions in forms.items():
            for action in ["stand", "idle", "run", "jump", "crouch", "lie", "head"]:
                occupancy = 0.9 if action == "head" else 0.86
                bottom_bias = action != "head"
                sprite_canvas(actions[action], sprite_path(pet_id, form, action), occupancy=occupancy, bottom_bias=bottom_bias)
            mirror(sprite_path(pet_id, form, "idle"), sprite_path(pet_id, form, "idle-left"))
            mirror(sprite_path(pet_id, form, "run"), sprite_path(pet_id, form, "run-left"))
            mirror(sprite_path(pet_id, form, "jump"), sprite_path(pet_id, form, "jump-left"))
            mirror(sprite_path(pet_id, form, "crouch"), sprite_path(pet_id, form, "crouch-left"))
            mirror(sprite_path(pet_id, form, "lie"), sprite_path(pet_id, form, "lie-left"))
            sprite_canvas(actions["crouch"], sprite_path(pet_id, form, "sit"), occupancy=0.86, bottom_bias=True)
            mirror(sprite_path(pet_id, form, "sit"), sprite_path(pet_id, form, "sit-left"))

        q_dest = ROOT / "assets/pet-interactions/pets" / f"{pet_id}-q.png"
        sprite_canvas(forms["base"]["stand"], q_dest, occupancy=0.92, bottom_bias=True)


def update_manifest() -> None:
    manifest_path = ROOT / "assets/8bit/8bit-character-manifest.json"
    manifest = json.loads(manifest_path.read_text())
    by_id = {entry["id"]: entry for entry in manifest}
    for pet_id, name in {"psyduck": "Psyduck", "squirtle": "Squirtle"}.items():
        by_id[pet_id] = {
            "id": pet_id,
            "name": name,
            "source": f"assets/pet-interactions/pets/{pet_id}-q.png",
            "image": f"assets/8bit/characters/{pet_id}-8bit.png",
            "size": 256,
            "pixelGrid": 64,
            "idleImage": f"assets/8bit/characters-idle/{pet_id}-8bit.png",
            "runRightImage": f"assets/8bit/characters-run-right/{pet_id}-8bit.png",
            "motion": "run-right",
            "jumpImage": f"assets/8bit/characters-jump/{pet_id}-8bit.png",
            "idleLeftImage": f"assets/8bit/characters-idle-left/{pet_id}-8bit.png",
            "runLeftImage": f"assets/8bit/characters-run-left/{pet_id}-8bit.png",
            "jumpLeftImage": f"assets/8bit/characters-jump-left/{pet_id}-8bit.png",
            "crouchImage": f"assets/8bit/characters-crouch/{pet_id}-8bit.png",
            "crouchLeftImage": f"assets/8bit/characters-crouch-left/{pet_id}-8bit.png",
            "sitImage": f"assets/8bit/characters-sit/{pet_id}-8bit.png",
            "sitLeftImage": f"assets/8bit/characters-sit-left/{pet_id}-8bit.png",
            "lieImage": f"assets/8bit/characters-lie/{pet_id}-8bit.png",
            "lieLeftImage": f"assets/8bit/characters-lie-left/{pet_id}-8bit.png",
        }
    order = [entry["id"] for entry in manifest if entry["id"] not in {"psyduck", "squirtle"}] + ["psyduck", "squirtle"]
    manifest_path.write_text(json.dumps([by_id[pet_id] for pet_id in order], ensure_ascii=False, indent=2) + "\n")

    for rel in ["assets/8bit/8bit-orientation-overrides.json", "assets/8bit/8bit-action-overrides.json"]:
        path = ROOT / rel
        data = json.loads(path.read_text())
        add_pets_to_json(data, ["psyduck", "squirtle"])
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def add_pets_to_json(value, pet_ids: list[str]) -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"characterOrder", "sprites", "characters", "pets"} and isinstance(child, list):
                for pet_id in pet_ids:
                    if pet_id not in child:
                        child.append(pet_id)
            else:
                add_pets_to_json(child, pet_ids)
    elif isinstance(value, list):
        for child in value:
            add_pets_to_json(child, pet_ids)


def make_red_qa() -> Path:
    forms = [
        ("psyduck", "base"),
        ("psyduck", "final"),
        ("psyduck", "cute-final"),
        ("squirtle", "base"),
        ("squirtle", "final"),
        ("squirtle", "cute-final"),
    ]
    columns = ["stand", "idle", "run", "run-left", "jump", "jump-left", "crouch", "crouch-left", "lie", "lie-left", "head"]
    cell = 132
    label_h = 28
    width = 170 + len(columns) * cell
    height = 46 + len(forms) * (cell + label_h)
    sheet = Image.new("RGB", (width, height), (255, 0, 0))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for i, column in enumerate(columns):
        draw.text((170 + i * cell + 8, 8), column, fill=(255, 255, 255), font=font)
    for row, (pet_id, form) in enumerate(forms):
        y = 36 + row * (cell + label_h)
        draw.text((8, y + 48), f"{pet_id} {form}", fill=(255, 255, 255), font=font)
        for col, action in enumerate(columns):
            x = 170 + col * cell
            path = sprite_path(pet_id, form, action)
            img = open_rgba(path)
            img.thumbnail((cell - 10, cell - 10), Image.Resampling.NEAREST)
            sheet.paste(img, (x + (cell - img.width) // 2, y + (cell - img.height) // 2), img)
            draw.rectangle((x, y, x + cell - 1, y + cell - 1), outline=(90, 0, 0), width=1)
    out = ROOT / "tmp/new-pokemon-8bit-red-qa.png"
    ensure_parent(out)
    sheet.save(out)
    return out


def validate_pngs() -> None:
    for pet_id in SPRITE_SOURCES:
        for form in SPRITE_SOURCES[pet_id]:
            for action in SPRITE_DIRS:
                path = sprite_path(pet_id, form, action)
                if not path.exists():
                    raise FileNotFoundError(path)
                img = open_rgba(path)
                if img.size != (256, 256):
                    raise ValueError(f"{path} is {img.size}")
                if not img.getchannel("A").getbbox():
                    raise ValueError(f"{path} has no visible pixels")


def main() -> None:
    install_role_assets()
    install_sprites()
    update_manifest()
    validate_pngs()
    qa = make_red_qa()
    print(f"red_qa={qa}")


if __name__ == "__main__":
    main()
