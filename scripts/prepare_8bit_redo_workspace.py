#!/usr/bin/env python3
"""Prepare a clean redo workspace for final-route 8bit pet sprites.

This only creates manifests and prompt files. It does not generate images and it
does not overwrite game assets.
"""

import json
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
APP_JS = PROJECT_ROOT / "app.js"
WORK_ROOT = PROJECT_ROOT / "tmp/8bit-redo-20260827"

PET_ORDER = [
    "sunny-wing",
    "sprouty",
    "hydroblob",
    "fluffbit",
    "shadow-wing",
    "flame-rex",
    "thunder-beetle",
    "frost-fang",
    "volt-cheetah",
    "shadow-stalker",
    "crybaby",
    "hacipupu",
    "labubu",
    "skullpanda",
    "twinkle-twinkle",
    "pikachu",
    "mewtwo",
    "lucario",
    "greninja",
    "charizard",
    "wolf",
    "steve",
    "enderman",
    "enderdragon",
    "creeper",
    "kuromi",
    "my-melody",
    "cinnamoroll",
    "pochacco",
    "hello-kitty",
    "winnie-the-pooh",
    "crayon-shinchan",
    "ugly-fish",
    "yoyo",
]

ACTIONS = {
    "stand": {
        "folder": "characters",
        "description": "standing idle pose, full body, calm and readable",
    },
    "run-right": {
        "folder": "characters-run-right",
        "description": "running or walking toward screen-right, body and face clearly oriented right",
    },
    "jump-right": {
        "folder": "characters-jump",
        "description": "jumping upward while oriented toward screen-right",
    },
    "crouch-right": {
        "folder": "characters-crouch",
        "description": "crouching or ducking while oriented toward screen-right, full character still visible",
    },
    "lie-right": {
        "folder": "characters-lie",
        "description": "lying down or resting while oriented toward screen-right, full body visible",
    },
}

KEY_COLOR_BY_PET = {
    # Purple/pink-heavy pets use green so magenta body details never become key.
    "fluffbit": "#00ff00",
    "shadow-wing": "#00ff00",
    "shadow-stalker": "#00ff00",
    "crybaby": "#00ff00",
    "hacipupu": "#00ff00",
    "labubu": "#00ff00",
    "skullpanda": "#00ff00",
    "twinkle-twinkle": "#00ff00",
    "mewtwo": "#00ff00",
    "enderdragon": "#00ff00",
    "enderman": "#00ff00",
    "kuromi": "#00ff00",
    "my-melody": "#00ff00",
    "yoyo": "#00ff00",
}

USER_APPROVED_KEEP = {
    "creeper": "User confirmed Creeper is OK; keep current installed assets.",
    "enderman": "User approved the archmage-style Enderman assets.",
    "hydroblob": "User said water dragon/Hydroblob does not need more changes.",
    "pikachu": "User said Pikachu is already OK.",
}

KEY_COLOR_NAMES = {
    "#ff00ff": "pure magenta",
    "#00ff00": "pure green",
}


def find_assigned_array(source, var_name):
    start_token = f"const {var_name} = ["
    start = source.find(start_token)
    if start < 0:
        raise SystemExit(f"Cannot find {var_name}")
    index = start + len(start_token) - 1
    depth = 0
    quote = ""
    escaped = False
    for pos in range(index, len(source)):
        char = source[pos]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = ""
            continue
        if char in ("'", '"', "`"):
            quote = char
            continue
        if char == "[":
            depth += 1
            continue
        if char == "]":
            depth -= 1
            if depth == 0:
                return source[index + 1:pos]
    raise SystemExit(f"Cannot close {var_name}")


def top_level_object_literals(array_source):
    objects = []
    start = None
    depth = 0
    quote = ""
    escaped = False
    for pos, char in enumerate(array_source):
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = ""
            continue
        if char in ("'", '"', "`"):
            quote = char
            continue
        if char == "{":
            if depth == 0:
                start = pos
            depth += 1
            continue
        if char == "}":
            depth -= 1
            if depth == 0 and start is not None:
                objects.append(array_source[start:pos + 1])
                start = None
    return objects


def extract_catalog_entries(source):
    entries = {}
    catalog_source = find_assigned_array(source, "PET_CATALOG")
    for blob in top_level_object_literals(catalog_source):
        id_match = re.search(r"id:\s*'([^']+)'", blob)
        if not id_match:
            continue
        pet_id = id_match.group(1)
        if pet_id not in PET_ORDER:
            continue
        def get_field(field):
            field_match = re.search(rf"{field}:\s*'([^']+)'", blob)
            return field_match.group(1) if field_match else ""
        entries[pet_id] = {
            "id": pet_id,
            "name": get_field("name"),
            "rarity": get_field("rarity"),
            "baseImage": get_field("image"),
            "heroicReference": get_field("evolvedImage"),
            "cuteReference": get_field("cuteEvolvedImage"),
        }
    missing = [pet_id for pet_id in PET_ORDER if pet_id not in entries]
    if missing:
        raise SystemExit(f"Missing catalog entries: {missing}")
    return entries


def extract_evolution_names(source):
    names = {}
    block_match = re.search(r"const PET_EVOLUTION_NAMES = \{([\s\S]*?)\n\s*\};", source)
    if not block_match:
        return names
    block = block_match.group(1)
    for pet_id in PET_ORDER:
        key = f"'{pet_id}'" if "-" in pet_id else pet_id
        pattern = rf"{re.escape(key)}:\s*\{{([^}}]+)\}}"
        match = re.search(pattern, block)
        if not match:
            continue
        blob = match.group(1)
        route_names = {}
        for field in ("base", "mini", "heroic", "cute"):
            field_match = re.search(rf"{field}:\s*'([^']+)'", blob)
            if field_match:
                route_names[field] = field_match.group(1)
        names[pet_id] = route_names
    return names


def prompt_text(pet, route, action_id, action):
    route_label = "heroic final evolution" if route == "heroic" else "cute final evolution"
    route_name = pet.get("evolutionNames", {}).get(route, pet["name"])
    reference = pet["heroicReference"] if route == "heroic" else pet["cuteReference"]
    return f"""Use case: stylized-concept
Asset type: transparent 8-bit pixel-art game sprite for CY PETS STORY room and mini-game character
Primary request: create ONE isolated sprite of {route_name} ({pet['name']}), {route_label}, {action['description']}.
Input image: use the provided reference image as the character identity, outfit, colors, silhouette, and mood reference.
Subject: exactly one complete character, no duplicate poses, no extra characters, no detached decorative fragments.
Style/medium: crisp 8-bit pixel art, clean game sprite, readable at small size, polished and cute/fantasy friendly.
Composition/framing: centered in a square canvas, transparent background, at least 25 percent empty transparent padding around the whole character, no body part touches or nearly touches any canvas edge.
Direction: for this action, the character must face screen-right where applicable. The future left-facing sprite will be made by mirroring only after this right-facing asset passes QA.
Transparency: genuinely transparent background with alpha; no white background, no red background, no checkerboard, no scene, no shadow, no glow, no floor.
Crop safety: keep all ears, wings, horns, hands, feet, tail, props, eyes, mouth, and white details fully opaque and inside the character. Do not cut off thin details.
Avoid: text, logo, watermark, speech bubble, frame, border, multiple sprites, neighboring fragments, motion lines, ground shadow, scenery, background color."""


def key_prompt_text(pet, route, action_id, action, key_color):
    route_label = "heroic final evolution" if route == "heroic" else "cute final evolution"
    route_name = pet.get("evolutionNames", {}).get(route, pet["name"])
    key_name = KEY_COLOR_NAMES[key_color]
    return f"""Use case: stylized-concept
Asset type: single-action 8-bit pixel-art game sprite for CY PETS STORY room and mini-game character
Primary request: create ONE isolated sprite of {route_name} ({pet['name']}), {route_label}, {action['description']}.
Input image: use the provided reference image as the character identity, outfit, colors, silhouette, and mood reference. Do not copy text, UI panels, scenery, or side characters from the reference.
Subject: exactly one complete character, no duplicate poses, no extra characters, no detached decorative fragments.
Style/medium: crisp 8-bit pixel art, clean game sprite, readable at small size, polished and cute/fantasy friendly.
Composition/framing: centered in a square canvas, with generous empty {key_name} padding around the whole character. No body part touches or nearly touches any canvas edge.
Direction: for this action, the character must face screen-right where applicable. The future left-facing sprite will be made by mirroring only after this right-facing asset passes QA.
Background: uniform solid flat {key_name} background ({key_color}) only. No texture, no gradient, no checkerboard, no scene, no floor, no shadow, no glow.
Crop safety: keep all ears, wings, horns, hands, feet, tail, props, eyes, mouth, teeth, white details, and highlights fully visible and not {key_name}. Do not cut off thin details.
Avoid: text, logo, watermark, speech bubble, frame, border, multiple sprites, neighboring fragments, motion lines, ground shadow, scenery, visible guide marks."""


def main():
    source = APP_JS.read_text()
    entries = extract_catalog_entries(source)
    evolution_names = extract_evolution_names(source)

    tasks = []
    skipped = []
    for pet_id in PET_ORDER:
        pet = entries[pet_id]
        pet["evolutionNames"] = evolution_names.get(pet_id, {})
        pet["hasSeparateCuteHeroicRoute"] = bool(pet["heroicReference"] and pet["cuteReference"])
        if pet_id in USER_APPROVED_KEEP:
            pet["redoStatus"] = "user-approved-keep"
            skipped.append({"petId": pet_id, "status": pet["redoStatus"], "reason": USER_APPROVED_KEEP[pet_id]})
            continue
        if not pet["hasSeparateCuteHeroicRoute"]:
            pet["redoStatus"] = "outside-current-scope-single-route"
            skipped.append({
                "petId": pet_id,
                "status": pet["redoStatus"],
                "reason": "This pet has no separate cuteEvolvedImage route, so it is not treated as a heroic/cute split-route redo.",
            })
            continue
        pet["redoStatus"] = "needs-heroic-redo"
        routes = [("heroic", pet["heroicReference"])]
        for route, reference in routes:
            for action_id, action in ACTIONS.items():
                task_id = f"{pet_id}__{route}__{action_id}"
                prompt_rel = Path("prompts") / route / pet_id / f"{action_id}.md"
                key_prompt_rel = Path("key-prompts") / route / pet_id / f"{action_id}.md"
                output_rel = Path("generated") / route / pet_id / f"{action_id}.png"
                key_output_rel = Path("generated-key") / route / pet_id / f"{action_id}.png"
                key_color = KEY_COLOR_BY_PET.get(pet_id, "#ff00ff")
                task = {
                    "taskId": task_id,
                    "petId": pet_id,
                    "petName": pet["name"],
                    "route": route,
                    "action": action_id,
                    "targetFolder": action["folder"],
                    "reference": reference,
                    "referenceExists": (PROJECT_ROOT / reference).exists(),
                    "keyColor": key_color,
                    "prompt": prompt_rel.as_posix(),
                    "keyPrompt": key_prompt_rel.as_posix(),
                    "output": output_rel.as_posix(),
                    "keyOutput": key_output_rel.as_posix(),
                    "status": pet["redoStatus"],
                }
                tasks.append(task)
                prompt_path = WORK_ROOT / prompt_rel
                prompt_path.parent.mkdir(parents=True, exist_ok=True)
                prompt_path.write_text(prompt_text(pet, route, action_id, action))
                key_prompt_path = WORK_ROOT / key_prompt_rel
                key_prompt_path.parent.mkdir(parents=True, exist_ok=True)
                key_prompt_path.write_text(key_prompt_text(pet, route, action_id, action, key_color))

    manifest = {
        "status": "draft",
        "notes": [
            "Do not overwrite assets/8bit/final or assets/8bit/cute-final from this workspace.",
            "Current user scope is true heroic-route redo only.",
            "Pets without cuteEvolvedImage are single-route pets and must not be mislabeled as heroic-route work.",
            "Creeper, Enderman, Hydroblob, and Pikachu are locked as user-approved keep unless the user reopens them.",
            "Preferred path is built-in image generation with real transparent single-action assets.",
            "If built-in image generation returns RGB fake transparency, use the per-pet keyPrompt and remove only the configured key color before red QA.",
            "Install only after red-background QA passes.",
        ],
        "routes": {
            "heroic": "only pets that have both evolvedImage and cuteEvolvedImage are true split-route heroic work",
            "cute": "deferred; not generated in this current heroic-only pass",
            "single-route": "pets without cuteEvolvedImage are outside this pass",
        },
        "pets": [entries[pet_id] for pet_id in PET_ORDER],
        "skipped": skipped,
        "userApprovedKeep": USER_APPROVED_KEEP,
        "keyColorByPet": KEY_COLOR_BY_PET,
        "petCount": len(PET_ORDER),
        "taskCount": len(tasks),
        "tasks": tasks,
    }
    WORK_ROOT.mkdir(parents=True, exist_ok=True)
    (WORK_ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    summary = {
        "workRoot": str(WORK_ROOT),
        "petCount": len(PET_ORDER),
        "taskCount": len(tasks),
        "heroicTasks": len([task for task in tasks if task["route"] == "heroic"]),
        "cuteTasks": len([task for task in tasks if task["route"] == "cute"]),
        "missingReferences": [task for task in tasks if not task["referenceExists"]],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
