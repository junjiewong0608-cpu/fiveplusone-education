import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "/Users/wongjunjie/.gemini/antigravity-ide/brain/8de7b9f2-94ba-41c6-8d5a-5143ea525e06"
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "hok_style_hero_gacha_design_preview.png")

W, H = 1600, 960
img = Image.new("RGBA", (W, H), (8, 14, 30, 255))

# Font paths
font_path = "/System/Library/Fonts/Hiragino Sans GB.ttc"
font_title = ImageFont.truetype(font_path, 28)
font_sub = ImageFont.truetype(font_path, 16)
font_card_title = ImageFont.truetype(font_path, 15)
font_card_tag = ImageFont.truetype(font_path, 11)
font_large_num = ImageFont.truetype(font_path, 34)
font_btn = ImageFont.truetype(font_path, 17)
font_small = ImageFont.truetype(font_path, 13)
font_tiny = ImageFont.truetype(font_path, 11)

# Base draw
draw = ImageDraw.Draw(img)

# 1. Background gradient layer
bg_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bg_draw = ImageDraw.Draw(bg_glow)
for r in range(700, 0, -25):
    alpha = int(24 * (1 - r / 700))
    bg_draw.ellipse([W//2 - r, H//2 - int(r*0.65), W//2 + r, H//2 + int(r*0.65)], fill=(20, 60, 140, alpha))
img = Image.alpha_composite(img, bg_glow)
draw = ImageDraw.Draw(img)

# Top Title Bar
draw.rectangle([0, 0, W, 70], fill=(12, 20, 42, 250))
draw.line([0, 70, W, 70], fill=(40, 75, 140), width=2)
draw.text((30, 18), "★ 英雄扭蛋馆 · 《王者荣耀》夺宝级全新视觉设计方案", fill=(255, 230, 140), font=font_title)
draw.text((800, 24), "外圈14格跑马灯奖池 + 核心悬浮星核水晶 + 右侧累计进度宝箱 + 导航格置于商店旁", fill=(148, 180, 220), font=font_sub)

# Navigation Bar Reordering Banner (Demonstrating Requirement 2)
nav_y = 80
draw.rectangle([30, nav_y, W - 30, nav_y + 44], fill=(15, 26, 54, 230), outline=(35, 60, 110), width=1)
draw.text((45, nav_y + 12), "【导航排布新布局】已将【英雄扭蛋馆】移动至【宠物商店】右侧：", fill=(200, 220, 255), font=font_small)

nav_tabs = [
    ("学习大厅", False),
    ("学科试炼", False),
    ("迷你游戏", False),
    ("巅峰决斗", False),
    ("荣耀榜", False),
    ("我的宠物", False),
    ("宠物商店", False),
    ("★ 英雄扭蛋馆 (移至商店旁)", True),
    ("留言墙", False),
    ("好友", False),
    ("音乐盒", False),
]

tx = 440
for tab_name, is_highlight in nav_tabs:
    t_w = draw.textlength(tab_name, font=font_tiny) + 16
    if is_highlight:
        draw.rounded_rectangle([tx, nav_y + 8, tx + t_w, nav_y + 36], radius=6, fill=(245, 158, 11), outline=(253, 224, 71), width=1)
        draw.text((tx + 8, nav_y + 14), tab_name, fill=(15, 23, 42), font=font_tiny)
    elif "宠物商店" in tab_name:
        draw.rounded_rectangle([tx, nav_y + 8, tx + t_w, nav_y + 36], radius=6, fill=(30, 58, 110), outline=(56, 189, 248), width=1)
        draw.text((tx + 8, nav_y + 14), tab_name, fill=(255, 255, 255), font=font_tiny)
    else:
        draw.rounded_rectangle([tx, nav_y + 8, tx + t_w, nav_y + 36], radius=6, fill=(20, 35, 70))
        draw.text((tx + 8, nav_y + 14), tab_name, fill=(160, 185, 220), font=font_tiny)
    tx += t_w + 6

# Main Gacha Stage Layout Coordinates
stage_x = 30
stage_y = 135
stage_w = 1340
stage_h = 710

# Draw Gacha Main Board Frame
draw.rounded_rectangle([stage_x, stage_y, stage_x + stage_w, stage_y + stage_h], radius=16, fill=(10, 20, 44), outline=(30, 65, 130), width=2)

# Top Bar inside Gacha (Currencies & Countdown)
topbar_y = stage_y + 10
draw.text((stage_x + 25, topbar_y + 12), "★ 英雄夺宝 (HERO LUCKY DRAW)", fill=(254, 240, 138), font=font_btn)
draw.text((stage_x + 360, topbar_y + 14), "⏳ 限时奖池重置倒计时: 1天 21:03:26", fill=(147, 197, 253), font=font_small)

# Currencies
cur_x = stage_x + 750
currencies = [("学习金币", "5,776"), ("荣耀星星", "458"), ("英雄抽奖券", "18+")]
for c_label, c_val in currencies:
    draw.rounded_rectangle([cur_x, topbar_y + 8, cur_x + 175, topbar_y + 38], radius=8, fill=(18, 34, 70), outline=(50, 90, 160), width=1)
    draw.text((cur_x + 12, topbar_y + 14), c_label, fill=(203, 213, 225), font=font_tiny)
    draw.text((cur_x + 100, topbar_y + 14), c_val, fill=(253, 224, 71), font=font_tiny)
    cur_x += 185

# 14 Grid Layout coordinates
card_w = 145
card_h = 145
gap_x = 14
gap_y = 14

grid_start_x = stage_x + 25
grid_start_y = stage_y + 55

col_xs = [grid_start_x + i * (card_w + gap_x) for i in range(5)]
row_ys = [grid_start_y + i * (card_h + gap_y) for i in range(4)]

grid_slots = [
    {"pos": (col_xs[0], row_ys[0]), "name": "赤焰机甲狐", "type": "限定SSR", "is_grand": True, "img_key": "arcflare-fox"},
    {"pos": (col_xs[1], row_ys[0]), "name": "紫能守护豹", "type": "限定SSR", "is_hero": True, "img_key": "vibranium-panther"},
    {"pos": (col_xs[2], row_ys[0]), "name": "雷霆战狮", "type": "限定SSR", "is_hero": True, "img_key": "stormmane-lion"},
    {"pos": (col_xs[3], row_ys[0]), "name": "4级烈焰符文", "type": "专属符文", "is_rune": True},
    {"pos": (col_xs[4], row_ys[0]), "name": "钻石礼包 48", "type": "稀有货币", "is_dia": True},
    {"pos": (col_xs[4], row_ys[1]), "name": "蛛影战猫", "type": "限定SSR", "is_hero": True, "img_key": "webshade-lynx"},
    {"pos": (col_xs[4], row_ys[2]), "name": "3级守护符文", "type": "防御符文", "is_rune": True},
    {"pos": (col_xs[4], row_ys[3]), "name": "学习金币 288", "type": "大量金币", "is_gold": True},
    {"pos": (col_xs[3], row_ys[3]), "name": "英雄碎片 x5", "type": "万能碎片", "is_shard": True},
    {"pos": (col_xs[2], row_ys[3]), "name": "伽马巨岩熊", "type": "限定SSR", "is_hero": True, "img_key": "gamma-boulder-bear"},
    {"pos": (col_xs[1], row_ys[3]), "name": "全服大喇叭", "type": "广播道具", "is_horn": True},
    {"pos": (col_xs[0], row_ys[3]), "name": "2级敏捷符文", "type": "速度符文", "is_rune": True},
    {"pos": (col_xs[0], row_ys[2]), "name": "秘境传送鸮", "type": "限定SSR", "is_hero": True, "img_key": "runeportal-owl"},
    {"pos": (col_xs[0], row_ys[1]), "name": "专属钛合金刃", "type": "S级神装", "is_gear": True},
]

# Load all 14 slot images
item_images = {}
hero_dir = "/Users/wongjunjie/Documents/CodexProjects/fiveplusone-education/assets/roles/hero-gacha"
items_dir = "/Users/wongjunjie/Documents/CodexProjects/fiveplusone-education/assets/roles/hero-gacha/items"

for hid in ['arcflare-fox', 'vibranium-panther', 'stormmane-lion', 'webshade-lynx', 'gamma-boulder-bear', 'runeportal-owl']:
    cpath = os.path.join(hero_dir, f"{hid}-card.png")
    if os.path.exists(cpath):
        try:
            h_img = Image.open(cpath).convert("RGBA").resize((100, 100), Image.Resampling.LANCZOS)
            item_images[hid] = h_img
        except Exception:
            pass

item_files_map = {
    'rune-flame': 'rune-flame.png',
    'diamonds-pack': 'diamonds-pack.png',
    'rune-shield': 'rune-shield.png',
    'coins-pack': 'coins-pack.png',
    'hero-shards': 'hero-shards.png',
    'server-horn': 'server-horn.png',
    'rune-speed': 'rune-speed.png',
    'titanium-blade': 'titanium-blade.png'
}
for key, fname in item_files_map.items():
    ipath = os.path.join(items_dir, fname)
    if os.path.exists(ipath):
        try:
            i_img = Image.open(ipath).convert("RGBA").resize((96, 96), Image.Resampling.LANCZOS)
            item_images[key] = i_img
        except Exception:
            pass

# Map grid slots to their image keys
grid_slots_keys = [
    "arcflare-fox", "vibranium-panther", "stormmane-lion", "rune-flame", "diamonds-pack",
    "webshade-lynx", "rune-shield", "coins-pack", "hero-shards", "gamma-boulder-bear",
    "server-horn", "rune-speed", "runeportal-owl", "titanium-blade"
]

# Draw 14 Grid Slots
for idx, slot in enumerate(grid_slots):
    sx, sy = slot["pos"]
    is_active_marquee = (idx == 0)

    bg_color = (20, 36, 75)
    border_color = (45, 80, 140)
    border_w = 1

    if slot.get("is_grand"):
        bg_color = (45, 24, 65)
        border_color = (251, 191, 36)
        border_w = 2
    elif is_active_marquee:
        border_color = (253, 224, 71)
        border_w = 3

    draw.rounded_rectangle([sx, sy, sx + card_w, sy + card_h], radius=12, fill=bg_color, outline=border_color, width=int(border_w))

    # Corner Badge
    badge_bg = (168, 85, 247) if "SSR" in slot["type"] else ((217, 119, 6) if "S级" in slot["type"] else (30, 58, 138))
    draw.rounded_rectangle([sx + 6, sy + 6, sx + 58, sy + 22], radius=4, fill=badge_bg)
    draw.text((sx + 10, sy + 8), slot["type"], fill=(255, 255, 255), font=font_card_tag)

    # Content Icon / Image (Every slot has its real artwork!)
    ikey = grid_slots_keys[idx]
    if ikey in item_images:
        thumb = item_images[ikey]
        img.paste(thumb, (int(sx + (card_w - thumb.width) // 2), int(sy + 20)), thumb)

    # Card Title
    t_name = slot["name"]
    t_color = (254, 240, 138) if slot.get("is_grand") else (226, 232, 240)
    draw.text((sx + 15, sy + card_h - 25), t_name, fill=t_color, font=font_card_title)

    # Active Marquee Light Indicator on Slot 0
    if is_active_marquee:
        draw.polygon([(sx + card_w//2, sy - 4), (sx + card_w//2 - 9, sy - 15), (sx + card_w//2 + 9, sy - 15)], fill=(250, 204, 21))

# Center Core Area (Cols 1, 2, 3 and Rows 1, 2)
core_x = col_xs[1]
core_y = row_ys[1]
core_w = (col_xs[3] + card_w) - col_xs[1]
core_h = (row_ys[2] + card_h) - row_ys[1]

# Draw Central Lucky Core Panel with deep glass
draw.rounded_rectangle([core_x, core_y, core_x + core_w, core_y + core_h], radius=16, fill=(12, 24, 52), outline=(56, 189, 248), width=2)

# Central Core Crystal Position
cx, cy = core_x + 95, core_y + core_h//2 - 20

# Floating Star Crystal Core image
core_img_path = os.path.join(items_dir, "star-crystal-core.png")
if os.path.exists(core_img_path):
    try:
        core_orb = Image.open(core_img_path).convert("RGBA").resize((130, 130), Image.Resampling.LANCZOS)
        img.paste(core_orb, (cx - 65, cy - 65), core_orb)
    except Exception:
        pass

# Rule button in top right of Core
draw.rounded_rectangle([core_x + core_w - 80, core_y + 15, core_x + core_w - 15, core_y + 40], radius=6, fill=(28, 55, 105), outline=(56, 189, 248), width=1)
draw.text((core_x + core_w - 68, core_y + 20), "规则 ⓘ", fill=(203, 213, 225), font=font_small)

# Lucky Value info
info_x = core_x + 185
draw.text((info_x, core_y + 36), "当前幸运值", fill=(203, 213, 225), font=font_btn)
draw.text((info_x + 110, core_y + 28), "18", fill=(56, 189, 248), font=font_large_num)
draw.text((info_x + 160, core_y + 40), "/ 50", fill=(148, 163, 184), font=font_small)

# Lucky meter progress bar
draw.rounded_rectangle([info_x, core_y + 76, info_x + 235, core_y + 88], radius=6, fill=(15, 23, 42))
draw.rounded_rectangle([info_x, core_y + 76, info_x + int(235 * (18/50)), core_y + 88], radius=6, fill=(56, 189, 248))

draw.text((info_x, core_y + 102), "幸运值越高，获得稀有神兽英雄的机会越大！", fill=(254, 240, 138), font=font_small)
draw.text((info_x, core_y + 124), "达到 50 幸运值必定触发【SSR 终极保底】直接获得限定英雄！", fill=(148, 180, 220), font=font_tiny)

# Draw Two Action Buttons at bottom of center core
btn_y = core_y + core_h - 85
btn_w = 205
btn_h = 56

# Single pull button
b1_x = core_x + 35
draw.rounded_rectangle([b1_x, btn_y, b1_x + btn_w, btn_y + btn_h], radius=14, fill=(14, 116, 144), outline=(56, 189, 248), width=2)
draw.text((b1_x + 35, btn_y + 17), "🪙 60 召唤一次", fill=(255, 255, 255), font=font_btn)

# Five pull button (with discount)
b2_x = core_x + core_w - btn_w - 35
draw.rounded_rectangle([b2_x, btn_y, b2_x + btn_w, btn_y + btn_h], radius=14, fill=(194, 65, 12), outline=(251, 191, 36), width=2)
draw.text((b2_x + 30, btn_y + 17), "🪙 270 召唤五次", fill=(255, 255, 255), font=font_btn)

# 9折 discount badge on 5-pull
draw.rounded_rectangle([b2_x + btn_w - 55, btn_y - 10, b2_x + btn_w + 5, btn_y + 10], radius=6, fill=(239, 68, 68), outline=(254, 202, 202), width=1)
draw.text((b2_x + btn_w - 48, btn_y - 8), "9折特惠", fill=(255, 255, 255), font=font_tiny)

# Right Sidebar: Weekly Cumulative Chest Milestones (右侧累计宝箱进度条)
side_x = stage_x + stage_w + 18
side_w = 190
side_h = stage_h

draw.rounded_rectangle([side_x, stage_y, side_x + side_w, stage_y + side_h], radius=16, fill=(12, 22, 48), outline=(40, 75, 140), width=2)

# Sidebar title
draw.text((side_x + 22, stage_y + 15), "★ 额外奖励", fill=(253, 224, 71), font=font_btn)
draw.text((side_x + 22, stage_y + 44), "本周累计: 12 次", fill=(148, 163, 184), font=font_small)

# Vertical milestone progress track
track_x = side_x + 36
track_top = stage_y + 85
track_bot = stage_y + stage_h - 50
draw.line([track_x, track_top, track_x, track_bot], fill=(30, 58, 110), width=4)
cur_prog_y = track_top + int((track_bot - track_top) * (12 / 65))
draw.line([track_x, track_top, track_x, cur_prog_y], fill=(250, 204, 21), width=4)

chests = [
    {"pulls": 5, "label": "5次", "status": "已领取", "reward": "100 金币", "file": "chest-bronze.png", "y": track_top + 30},
    {"pulls": 15, "label": "15次", "status": "可领取", "reward": "抽奖券 x1", "file": "chest-silver.png", "y": track_top + 160},
    {"pulls": 35, "label": "35次", "status": "待解锁", "reward": "神装宝箱", "file": "chest-gold.png", "y": track_top + 300},
    {"pulls": 65, "label": "65次", "status": "待解锁", "reward": "自选英雄", "file": "chest-crystal.png", "y": track_top + 450},
]

for c in chests:
    cy = c["y"]
    is_claimed = c["status"] == "已领取"
    is_claimable = c["status"] == "可领取"
    node_fill = (16, 185, 129) if is_claimed else ((245, 158, 11) if is_claimable else (30, 41, 59))
    node_border = (250, 204, 21) if is_claimable else (71, 85, 105)

    draw.ellipse([track_x - 18, cy - 18, track_x + 18, cy + 18], fill=node_fill, outline=node_border, width=2)
    # Load and paste real chest artwork
    c_img_path = os.path.join(items_dir, c["file"])
    if os.path.exists(c_img_path):
        try:
            c_thumb = Image.open(c_img_path).convert("RGBA").resize((38, 38), Image.Resampling.LANCZOS)
            img.paste(c_thumb, (track_x - 19, cy - 19), c_thumb)
        except Exception:
            pass

    # Box card
    bx = track_x + 26
    draw.rounded_rectangle([bx, cy - 26, bx + 110, cy + 28], radius=8, fill=(20, 36, 75), outline=node_border, width=1)
    draw.text((bx + 8, cy - 22), c["label"], fill=(255, 255, 255), font=font_card_title)
    draw.text((bx + 8, cy - 4), c["reward"], fill=(253, 224, 71), font=font_tiny)
    st_color = (74, 222, 128) if is_claimed else ((251, 191, 36) if is_claimable else (148, 163, 184))
    draw.text((bx + 52, cy - 22), c["status"], fill=st_color, font=font_tiny)

# Bottom Comparison & Implementation Notes Card
note_y = stage_y + stage_h + 12
draw.rounded_rectangle([30, note_y, W - 30, H - 15], radius=10, fill=(15, 23, 42), outline=(40, 75, 140), width=1)
draw.text((45, note_y + 12), "★ 本次方案设计亮点：", fill=(253, 224, 71), font=font_btn)
draw.text((230, note_y + 14), "1. 完美复刻《王者荣耀》夺宝 14 格跑马灯矩阵与悬浮星核水晶界面", fill=(226, 232, 240), font=font_small)
draw.text((790, note_y + 14), "2. 纯正转盘动效：点击召唤后金光环绕外环高速旋转渐停至中奖格", fill=(226, 232, 240), font=font_small)
draw.text((45, note_y + 40), "3. 右侧累计抽数里程宝箱 (5/15/35/65抽)：学生周常活跃正向激励", fill=(203, 213, 225), font=font_small)
draw.text((580, note_y + 40), "4. 导航栏完美重排：【宠物商店】与【英雄扭蛋馆】紧密并列，逛街与抽奖一目了然！", fill=(125, 211, 252), font=font_small)

# Save
img.save(OUTPUT_PATH, "PNG")
print(f"Refined design preview generated successfully at: {OUTPUT_PATH}")
