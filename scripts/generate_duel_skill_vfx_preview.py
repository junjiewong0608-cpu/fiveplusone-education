#!/usr/bin/env python3
"""Generate high-fidelity preview diagram for the redesigned Duel Battle Skill System and Real VFX."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = Path("/Users/wongjunjie/.gemini/antigravity-ide/brain/8de7b9f2-94ba-41c6-8d5a-5143ea525e06/duel_skills_and_vfx_design_preview.png")

CANVAS_W = 1600
CANVAS_H = 1100

def create_preview():
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (10, 14, 26, 255))
    draw = ImageDraw.Draw(canvas)
    
    font_path = "/System/Library/Fonts/STHeiti Medium.ttc"
    font_title = ImageFont.truetype(font_path, 26)
    font_h2 = ImageFont.truetype(font_path, 20)
    font_body = ImageFont.truetype(font_path, 16)
    font_small = ImageFont.truetype(font_path, 13)
    font_badge = ImageFont.truetype(font_path, 14)

    # Background ambient grid & lighting
    for y in range(0, CANVAS_H, 40):
        draw.line([(0, y), (CANVAS_W, y)], fill=(20, 28, 48, 80), width=1)
    for x in range(0, CANVAS_W, 40):
        draw.line([(x, 0), (x, CANVAS_H)], fill=(20, 28, 48, 80), width=1)

    # Top Header
    draw.text((50, 25), "DUEL ARENA (PEAK BATTLE) - SKILL BAR & REAL ATTACK VFX ARCHITECTURE", fill=(255, 215, 0), font=font_title)
    draw.text((50, 50), "1. Genuine pet skill icons | 2. Ultimate skill triggers Quiz Challenge | 3. Real multi-tier Attack VFX", fill=(148, 163, 184), font=font_body)

    # SECTION 1: Skill Bar Redesign (Current vs Proposed)
    draw.rectangle([50, 85, 1550, 360], fill=(15, 23, 42, 220), outline=(51, 65, 85), width=2)
    draw.text((70, 95), "PART 1: 4-BUTTON COMMAND BAR REDESIGN (USING VIBRANIUM PANTHER AS EXAMPLE)", fill=(56, 189, 248), font=font_h2)

    # Draw 4 Buttons
    btn_w = 345
    btn_h = 100
    gap = 20
    start_x = 75
    start_y = 125

    # Button 1: Basic Attack
    draw.rounded_rectangle([start_x, start_y, start_x + btn_w, start_y + btn_h], radius=16, fill=(30, 41, 59, 230), outline=(71, 85, 105), width=2)
    draw.rounded_rectangle([start_x + 12, start_y + 16, start_x + 80, start_y + 84], radius=12, fill=(15, 23, 42), outline=(148, 163, 184), width=1)
    # Draw crossed swords vector
    bx, by = start_x + 46, start_y + 50
    draw.line([(bx - 16, by - 16), (bx + 16, by + 16)], fill=(241, 245, 249), width=3)
    draw.line([(bx + 16, by - 16), (bx - 16, by + 16)], fill=(241, 245, 249), width=3)
    draw.text((start_x + 92, start_y + 20), "1. 普通攻击 (Attack)", fill=(255, 255, 255), font=font_body)
    draw.text((start_x + 92, start_y + 44), "基础物理/光刃挥击伤害", fill=(148, 163, 184), font=font_small)
    draw.text((start_x + 92, start_y + 64), "恢复 +20 MP · 无需答题直接出招", fill=(52, 211, 153), font=font_small)

    # Button 2: Pet Exclusive Skill (Skill 1 - Purple Claws)
    b2_x = start_x + btn_w + gap
    draw.rounded_rectangle([b2_x, start_y, b2_x + btn_w, start_y + btn_h], radius=16, fill=(45, 27, 78, 230), outline=(168, 85, 247), width=2)
    # Paste real skill-1 icon
    panther_s1_path = PROJECT_ROOT / "assets" / "roles" / "hero-gacha" / "vibranium-panther" / "skill-1.png"
    if panther_s1_path.exists():
        s1_img = Image.open(panther_s1_path).convert("RGBA").resize((68, 68), Image.Resampling.LANCZOS)
        canvas.paste(s1_img, (b2_x + 12, start_y + 16), s1_img)
    draw.rectangle([b2_x + 12, start_y + 16, b2_x + 80, start_y + 84], outline=(192, 132, 252), width=2)
    draw.text((b2_x + 92, start_y + 20), "2. 专属小技能 (紫光利爪)", fill=(243, 232, 255), font=font_body)
    draw.text((b2_x + 92, start_y + 44), "宠物专属核心主动技 · 高速爪击", fill=(216, 180, 254), font=font_small)
    draw.text((b2_x + 92, start_y + 64), "消耗 50 MP · 直接释放 (无需答题)", fill=(192, 132, 252), font=font_small)

    # Button 3: Guard
    b3_x = b2_x + btn_w + gap
    draw.rounded_rectangle([b3_x, start_y, b3_x + btn_w, start_y + btn_h], radius=16, fill=(30, 41, 59, 230), outline=(71, 85, 105), width=2)
    draw.rounded_rectangle([b3_x + 12, start_y + 16, b3_x + 80, start_y + 84], radius=12, fill=(15, 23, 42), outline=(148, 163, 184), width=1)
    # Draw shield vector
    sx, sy = b3_x + 46, start_y + 50
    draw.polygon([(sx, sy - 18), (sx + 16, sy - 8), (sx + 14, sy + 12), (sx, sy + 20), (sx - 14, sy + 12), (sx - 16, sy - 8)], outline=(59, 130, 246), fill=(30, 58, 138), width=2)
    draw.text((b3_x + 92, start_y + 20), "3. 坚壁守御 (Guard)", fill=(255, 255, 255), font=font_body)
    draw.text((b3_x + 92, start_y + 44), "格挡 65% 伤害 · 恢复 10% 生命", fill=(148, 163, 184), font=font_small)
    draw.text((b3_x + 92, start_y + 64), "恢复 +15 MP · 展开蜂巢光盾", fill=(52, 211, 153), font=font_small)

    # Button 4: Ultimate Skill (Quiz Burst - King Shockwave)
    b4_x = b3_x + btn_w + gap
    draw.rounded_rectangle([b4_x, start_y, b4_x + btn_w, start_y + btn_h], radius=16, fill=(74, 30, 15, 240), outline=(245, 158, 11), width=3)
    # Paste real skill-ultimate icon
    panther_ult_path = PROJECT_ROOT / "assets" / "roles" / "hero-gacha" / "vibranium-panther" / "skill-ultimate.png"
    if panther_ult_path.exists():
        ult_img = Image.open(panther_ult_path).convert("RGBA").resize((68, 68), Image.Resampling.LANCZOS)
        canvas.paste(ult_img, (b4_x + 12, start_y + 16), ult_img)
    draw.rectangle([b4_x + 12, start_y + 16, b4_x + 80, start_y + 84], outline=(251, 191, 36), width=2)
    draw.text((b4_x + 92, start_y + 20), "4. 终极大招 (王者震荡)", fill=(254, 240, 138), font=font_body)
    draw.text((b4_x + 92, start_y + 44), "宠物真正大招图标 · 能量全爆发", fill=(252, 211, 77), font=font_small)
    draw.text((b4_x + 92, start_y + 64), "★ 唯一答题技能 · 答对触发 3.5x 暴击", fill=(248, 113, 113), font=font_small)

    # Notes under section 1
    draw.text((75, 245), "KEY IMPROVEMENT SUMMARY:", fill=(255, 215, 0), font=font_body)
    draw.text((75, 270), "• Button 2 uses Pet's TRUE Skill 1 (e.g., Purple Claws). Direct cast with 50 MP, no quiz blocking regular rotation.", fill=(226, 232, 240), font=font_small)
    draw.text((75, 295), "• Button 4 is the TRUE Ultimate Skill (e.g., King Shockwave). Replaces generic brain emoji with authentic pet icon!", fill=(226, 232, 240), font=font_small)
    draw.text((75, 320), "• Quiz Challenge is now ONLY triggered on Button 4 (The Ultimate). Answer right -> unleash Cinematic 3.5x Ultimate!", fill=(226, 232, 240), font=font_small)


    # SECTION 2: 6 Hero Pets True Skills & Ultimate Mapping Table
    draw.rectangle([50, 380, 1550, 680], fill=(15, 23, 42, 220), outline=(51, 65, 85), width=2)
    draw.text((70, 395), "PART 2: 6 HERO GODS - EXCLUSIVE SKILL & ULTIMATE ASSET MAPPING", fill=(56, 189, 248), font=font_h2)

    heroes = [
        ("vibranium-panther", "紫能守护豹", "紫光利爪 (Claw Slash)", "王者震荡 (King Shockwave)"),
        ("arcflare-fox", "赤焰机甲狐", "等离子爪 (Plasma Slash)", "星火超载 (Solar Overload)"),
        ("stormmane-lion", "雷霆战狮", "雷锤震地 (Thunder Slam)", "天穹雷域 (Tempest Domain)"),
        ("webshade-lynx", "蛛影战猫", "极光丝刃 (Laser String)", "蛛影绝杀 (Shadow Strike)"),
        ("runeportal-owl", "秘境传送鸮", "传送光环 (Rune Blink)", "万门星海 (Cosmic Gate)"),
        ("gamma-boulder-bear", "伽马巨岩熊", "重拳震波 (Titan Wave)", "伽马山崩 (Gamma Avalanche)"),
    ]

    card_w = 232
    card_h = 240
    card_start_y = 425

    for idx, (hid, hname, s1_name, ult_name) in enumerate(heroes):
        cx = 70 + idx * (card_w + 14)
        draw.rounded_rectangle([cx, card_start_y, cx + card_w, card_start_y + card_h], radius=12, fill=(24, 32, 54), outline=(71, 85, 105), width=1)
        draw.text((cx + 12, card_start_y + 12), hname, fill=(255, 255, 255), font=font_body)
        draw.text((cx + 12, card_start_y + 30), hid, fill=(100, 116, 139), font=font_small)

        # Skill 1 box
        draw.text((cx + 12, card_start_y + 58), "Skill 1 (普招):", fill=(192, 132, 252), font=font_small)
        s1_file = PROJECT_ROOT / "assets" / "roles" / "hero-gacha" / hid / "skill-1.png"
        if s1_file.exists():
            im = Image.open(s1_file).convert("RGBA").resize((50, 50), Image.Resampling.LANCZOS)
            canvas.paste(im, (cx + 12, card_start_y + 75), im)
        draw.rectangle([cx + 12, card_start_y + 75, cx + 62, card_start_y + 125], outline=(168, 85, 247), width=1)
        draw.text((cx + 68, card_start_y + 85), s1_name.split()[0], fill=(226, 232, 240), font=font_small)
        draw.text((cx + 68, card_start_y + 102), "Cost 50 MP", fill=(148, 163, 184), font=font_small)

        # Ultimate box
        draw.text((cx + 12, card_start_y + 138), "Ultimate (大招·需答题):", fill=(251, 191, 36), font=font_small)
        ult_file = PROJECT_ROOT / "assets" / "roles" / "hero-gacha" / hid / "skill-ultimate.png"
        if ult_file.exists():
            im_u = Image.open(ult_file).convert("RGBA").resize((50, 50), Image.Resampling.LANCZOS)
            canvas.paste(im_u, (cx + 12, card_start_y + 155), im_u)
        draw.rectangle([cx + 12, card_start_y + 155, cx + 62, card_start_y + 205], outline=(245, 158, 11), width=2)
        draw.text((cx + 68, card_start_y + 165), ult_name.split()[0], fill=(254, 240, 138), font=font_small)
        draw.text((cx + 68, card_start_y + 182), "3.5x Crit Burst", fill=(239, 68, 68), font=font_small)


    # SECTION 3: 3-Tier Attack Visual FX (Visual Demonstration)
    draw.rectangle([50, 700, 1550, 1060], fill=(15, 23, 42, 220), outline=(51, 65, 85), width=2)
    draw.text((70, 715), "PART 3: REAL IN-BATTLE ATTACK VISUAL FX (真实战斗打击光效设计)", fill=(56, 189, 248), font=font_h2)

    vfx_w = 465
    vfx_h = 300
    vfx_y = 745

    # FX 1: Basic Attack Slash
    fx1_x = 75
    draw.rounded_rectangle([fx1_x, vfx_y, fx1_x + vfx_w, vfx_y + vfx_h], radius=16, fill=(10, 15, 30), outline=(59, 130, 246), width=2)
    draw.text((fx1_x + 18, vfx_y + 15), "VFX 1: Basic Attack - Slash Blade FX (普攻利刃斩击)", fill=(147, 197, 253), font=font_body)
    # Simulated slash FX
    draw.line([(fx1_x + 70, vfx_y + 80), (fx1_x + 390, vfx_y + 220)], fill=(255, 255, 255), width=8)
    draw.line([(fx1_x + 65, vfx_y + 75), (fx1_x + 395, vfx_y + 225)], fill=(96, 165, 250), width=4)
    draw.line([(fx1_x + 100, vfx_y + 180), (fx1_x + 350, vfx_y + 120)], fill=(255, 255, 255), width=6)
    draw.text((fx1_x + 18, vfx_y + 245), "• Gold-white double slash cuts through the enemy target.", fill=(203, 213, 225), font=font_small)
    draw.text((fx1_x + 18, vfx_y + 265), "• Target flashes white + knocks back + spark particles fly.", fill=(148, 163, 184), font=font_small)

    # FX 2: Exclusive Skill - Elemental Burst
    fx2_x = fx1_x + vfx_w + 25
    draw.rounded_rectangle([fx2_x, vfx_y, fx2_x + vfx_w, vfx_y + vfx_h], radius=16, fill=(20, 10, 35), outline=(168, 85, 247), width=2)
    draw.text((fx2_x + 18, vfx_y + 15), "VFX 2: Exclusive Skill - Elemental Burst FX (专属小技能爆破)", fill=(216, 180, 254), font=font_body)
    # Simulated energy burst FX
    center_x = fx2_x + vfx_w // 2
    center_y = vfx_y + 140
    for r in [60, 45, 30, 15]:
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], outline=(192, 132, 252), width=3)
    for angle_offset in range(-60, 70, 30):
        draw.line([(center_x, center_y), (center_x + angle_offset * 2, center_y - 50)], fill=(243, 232, 255), width=4)
        draw.line([(center_x, center_y), (center_x - angle_offset * 2, center_y + 50)], fill=(168, 85, 247), width=4)
    draw.text((fx2_x + 18, vfx_y + 245), "• Heavy purple/elemental shockwaves blast centered on foe.", fill=(203, 213, 225), font=font_small)
    draw.text((fx2_x + 18, vfx_y + 265), "• Radial shockwave rings expand with sonic boom audio.", fill=(148, 163, 184), font=font_small)

    # FX 3: Ultimate Burst - Cinematic Full Screen Shake & Nova
    fx3_x = fx2_x + vfx_w + 25
    draw.rounded_rectangle([fx3_x, vfx_y, fx3_x + vfx_w, vfx_y + vfx_h], radius=16, fill=(35, 20, 10), outline=(245, 158, 11), width=3)
    draw.text((fx3_x + 18, vfx_y + 15), "VFX 3: ULTIMATE - Full-Screen Nova Burst (终极大招全屏核爆)", fill=(254, 240, 138), font=font_body)
    # Simulated massive pillar / nova
    draw.rectangle([fx3_x + 150, vfx_y + 55, fx3_x + 310, vfx_y + 230], fill=(254, 240, 138, 180))
    draw.rectangle([fx3_x + 180, vfx_y + 50, fx3_x + 280, vfx_y + 235], fill=(255, 255, 255, 240))
    for ring_r in [90, 70, 50]:
        draw.ellipse([fx3_x + 230 - ring_r, vfx_y + 145 - ring_r // 3, fx3_x + 230 + ring_r, vfx_y + 145 + ring_r // 3], outline=(245, 158, 11), width=3)
    draw.text((fx3_x + 18, vfx_y + 245), "• Screen darkens -> Giant magic circle appears -> Beam drops!", fill=(253, 230, 138), font=font_small)
    draw.text((fx3_x + 18, vfx_y + 265), "• Screen shakes violently + CRIT -1450 text pops up!", fill=(248, 113, 113), font=font_small)

    canvas.save(OUTPUT_PATH, "PNG", optimize=True)
    print(f"Successfully generated duel skills and VFX preview at: {OUTPUT_PATH}")

if __name__ == "__main__":
    create_preview()
