#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont

output_path = '/Users/wongjunjie/.gemini/antigravity-ide/brain/8de7b9f2-94ba-41c6-8d5a-5143ea525e06/room_actions_design_preview.png'

W, H = 1600, 920
canvas = Image.new('RGBA', (W, H), (18, 20, 30, 255))
draw = ImageDraw.Draw(canvas)

panther_cutout = Image.open('assets/roles/hero-gacha/vibranium-panther-card.png').convert('RGBA')
panther_bg_card = Image.open('assets/roles/hero-gacha/vibranium-panther/base-card.png').convert('RGBA')
room_bg = Image.open('assets/room-demo/map-paris-garden-square.png').convert('RGBA')

street_slice = room_bg.crop((100, 150, 860, 530)).resize((710, 350), Image.Resampling.LANCZOS)

# 1. Bad example (Current state)
bad_card = panther_bg_card.resize((240, 135), Image.Resampling.LANCZOS)
scene_bad = street_slice.copy()
scene_bad.paste(bad_card, (235, 200), bad_card)
bad_draw = ImageDraw.Draw(scene_bad)
bad_draw.rectangle([232, 197, 478, 338], outline=(255, 60, 60, 255), width=4)

# 2. Good example (Transparent action sprite with floor shadow)
scene_good = street_slice.copy()
shadow = Image.new('RGBA', (130, 32), (0, 0, 0, 0))
s_draw = ImageDraw.Draw(shadow)
s_draw.ellipse([0, 0, 130, 32], fill=(15, 12, 20, 170))
scene_good.paste(shadow, (290, 312), shadow)

panther_idle = panther_cutout.resize((150, 150), Image.Resampling.LANCZOS)
scene_good.paste(panther_idle, (280, 175), panther_idle)
good_draw = ImageDraw.Draw(scene_good)
good_draw.rectangle([275, 165, 435, 335], outline=(46, 213, 115, 255), width=4)

canvas.paste(scene_bad, (60, 140))
canvas.paste(scene_good, (830, 140))

font_title = ImageFont.load_default()
font_sub = ImageFont.load_default()
font_desc = ImageFont.load_default()
font_badge = ImageFont.load_default()

draw.text((60, 35), 'INTERACTIVE ROOM (PET WALL) - ACTION SPRITE ARCHITECTURE & PREVIEW', fill=(255, 255, 255), font=font_title)
draw.text((60, 65), 'Root Cause Fix: Upgrading from rigid background card fallback to 5 Dedicated Transparent Action Sprites', fill=(160, 174, 192), font=font_sub)

draw.rectangle([60, 110, 420, 140], fill=(235, 77, 75, 240))
draw.text((75, 118), 'CURRENT BUG: Giant 16:9 Card Pasted on Ground', fill=(255, 255, 255), font=font_badge)

draw.rectangle([830, 110, 1200, 140], fill=(46, 213, 115, 240))
draw.text((845, 118), 'PROPOSED FIX: Transparent Cutout Character with Actions', fill=(255, 255, 255), font=font_badge)

draw.text((60, 515), '5-ACTION SPRITE SPECIFICATION (Responsive to Player Buttons & Room Physics):', fill=(255, 215, 0), font=font_title)

actions = [
    ('1. Idle (Stand)', 'Gentle breathing & alert stance', 0, 0, 1.0),
    ('2. Run (Moving)', 'Triggered by <- and -> buttons', 12, 0, 1.05),
    ('3. Jump (Airborne)', 'Triggered by UP arrow button', 0, -28, 1.1),
    ('4. Crouch (Ducking)', 'Triggered by DOWN arrow button', 0, 22, 0.85),
    ('5. Lie (Sleeping)', 'Triggered by LIE sleep button', 90, 35, 0.75),
]

box_w = 270
box_h = 300
start_y = 575

for i, (name, detail, angle, dy, scale) in enumerate(actions):
    bx = 60 + i * (box_w + 32)
    draw.rounded_rectangle([bx, start_y, bx + box_w, start_y + box_h], radius=12, fill=(28, 32, 48, 255), outline=(70, 80, 105, 255), width=2)
    draw.text((bx + 16, start_y + 16), name, fill=(255, 255, 255), font=font_badge)
    draw.text((bx + 16, start_y + 46), detail, fill=(160, 174, 192), font=font_desc)
    
    sprite_w = int(120 * scale)
    sprite_h = int(120 * scale)
    sp = panther_cutout.resize((sprite_w, sprite_h), Image.Resampling.LANCZOS)
    if angle:
        sp = sp.rotate(angle, expand=True)
    
    paste_x = bx + (box_w - sp.width) // 2
    paste_y = start_y + 155 - (sp.height // 2) + dy
    
    s_w = int(80 * scale)
    s_h = 16
    draw.ellipse([bx + (box_w - s_w) // 2, start_y + 250, bx + (box_w + s_w) // 2, start_y + 250 + s_h], fill=(10, 10, 18, 180))
    canvas.paste(sp, (paste_x, paste_y), sp)

canvas.save(output_path, 'PNG', optimize=True)
print('Successfully generated design preview:', output_path)
