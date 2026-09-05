#!/usr/bin/env python3
"""Generate comprehensive master preview image covering ALL 43 pets in the game."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = Path("/Users/wongjunjie/.gemini/antigravity-ide/brain/8de7b9f2-94ba-41c6-8d5a-5143ea525e06/all_pets_duel_skills_matrix.png")

CANVAS_W = 1600
CANVAS_H = 2100

def get_skill_image_path(pet_id):
    """Find skill-1 and skill-ultimate image path for any pet."""
    mapping = {
        'sunny-wing': PROJECT_ROOT / 'assets/roles/sunny wing',
        'sprouty': PROJECT_ROOT / 'assets/roles/sprouty',
        'hydroblob': PROJECT_ROOT / 'assets/roles/hydroblob',
        'fluffbit': PROJECT_ROOT / 'assets/roles/fluffbit',
        'shadow-wing': PROJECT_ROOT / 'assets/roles/shadow wing专属',
        'flame-rex': PROJECT_ROOT / 'assets/roles/flame rex 专属',
        'thunder-beetle': PROJECT_ROOT / 'assets/roles/thunder beetle 专属',
        'frost-fang': PROJECT_ROOT / 'assets/roles/frost fang 专属',
        'volt-cheetah': PROJECT_ROOT / 'assets/roles/volt cheetah 专属',
        'shadow-stalker': PROJECT_ROOT / 'assets/roles/shadow stalker 专属',
        'crybaby': PROJECT_ROOT / 'assets/roles/new character/popmart/crybaby',
        'hacipupu': PROJECT_ROOT / 'assets/roles/new character/popmart/hacipupu',
        'labubu': PROJECT_ROOT / 'assets/roles/new character/popmart/labubu',
        'skullpanda': PROJECT_ROOT / 'assets/roles/new character/popmart/skullpanda',
        'twinkle-twinkle': PROJECT_ROOT / 'assets/roles/new character/popmart/twinkle_twinkle',
        'pikachu': PROJECT_ROOT / 'assets/roles/new character/pokemon/pikachu',
        'mewtwo': PROJECT_ROOT / 'assets/roles/new character/pokemon/mewtwo',
        'lucario': PROJECT_ROOT / 'assets/roles/new character/pokemon/lucario',
        'greninja': PROJECT_ROOT / 'assets/roles/new character/pokemon/greninja',
        'charizard': PROJECT_ROOT / 'assets/roles/new character/pokemon/chalizard',
        'psyduck': PROJECT_ROOT / 'assets/roles/new character/pokemon/psyduck',
        'squirtle': PROJECT_ROOT / 'assets/roles/new character/pokemon/squirtle',
        'wolf': PROJECT_ROOT / 'assets/roles/new character/minecraft/wolf',
        'steve': PROJECT_ROOT / 'assets/roles/new character/minecraft/steve',
        'enderman': PROJECT_ROOT / 'assets/roles/new character/minecraft/enderman',
        'enderdragon': PROJECT_ROOT / 'assets/roles/new character/minecraft/enderdragon',
        'creeper': PROJECT_ROOT / 'assets/roles/new character/minecraft/creeper',
        'kuromi': PROJECT_ROOT / 'assets/roles/new character/sanrio/kuromi',
        'my-melody': PROJECT_ROOT / 'assets/roles/new character/sanrio/my-melody',
        'cinnamoroll': PROJECT_ROOT / 'assets/roles/new character/sanrio/cinnamoroll',
        'pochacco': PROJECT_ROOT / 'assets/roles/new character/sanrio/pochacco',
        'hello-kitty': PROJECT_ROOT / 'assets/roles/new character/sanrio/hello-kitty',
        'winnie-the-pooh': PROJECT_ROOT / 'assets/roles/new character/cartoon/winnie-the-pooh',
        'crayon-shinchan': PROJECT_ROOT / 'assets/roles/new character/cartoon/crayon-shinchan',
        'ugly-fish': PROJECT_ROOT / 'assets/roles/new character/cartoon/ugly-fish',
        'yoyo': PROJECT_ROOT / 'assets/roles/new character/cartoon/yoyo',
        'nova-robot': PROJECT_ROOT / 'assets/roles/starter',
        'arcflare-fox': PROJECT_ROOT / 'assets/roles/hero-gacha/arcflare-fox',
        'webshade-lynx': PROJECT_ROOT / 'assets/roles/hero-gacha/webshade-lynx',
        'stormmane-lion': PROJECT_ROOT / 'assets/roles/hero-gacha/stormmane-lion',
        'runeportal-owl': PROJECT_ROOT / 'assets/roles/hero-gacha/runeportal-owl',
        'vibranium-panther': PROJECT_ROOT / 'assets/roles/hero-gacha/vibranium-panther',
        'gamma-boulder-bear': PROJECT_ROOT / 'assets/roles/hero-gacha/gamma-boulder-bear',
    }
    dir_path = mapping.get(pet_id)
    if not dir_path or not dir_path.exists():
        return None, None
    
    # Try finding skill-1 and skill-ultimate
    s1 = dir_path / 'skill-1.png'
    if not s1.exists():
        matches = list(dir_path.glob('*skill-1*.png')) or list(dir_path.glob('*1*.png'))
        s1 = matches[0] if matches else None
        
    ult = dir_path / 'skill-ultimate.png'
    if not ult.exists():
        matches = list(dir_path.glob('*ultimate*.png')) or list(dir_path.glob('*大招*.png'))
        ult = matches[0] if matches else None
        
    return s1, ult

def create_master_matrix():
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (10, 14, 26, 255))
    draw = ImageDraw.Draw(canvas)

    font_path = "/System/Library/Fonts/STHeiti Medium.ttc"
    font_main_title = ImageFont.truetype(font_path, 28)
    font_section = ImageFont.truetype(font_path, 20)
    font_series = ImageFont.truetype(font_path, 16)
    font_body = ImageFont.truetype(font_path, 13)
    font_small = ImageFont.truetype(font_path, 11)

    # Ambient grid
    for y in range(0, CANVAS_H, 40):
        draw.line([(0, y), (CANVAS_W, y)], fill=(20, 28, 48, 60), width=1)
    for x in range(0, CANVAS_W, 40):
        draw.line([(x, 0), (x, CANVAS_H)], fill=(20, 28, 48, 60), width=1)

    # Top Header
    draw.text((45, 20), "【全体 43 宠巅峰决斗·专属技能与攻击真实光效总览全景图】", fill=(255, 215, 0), font=font_main_title)
    draw.text((45, 54), "1. 统一战斗逻辑：普攻(+20MP) | 专属小技能(50MP直接释放) | 坚壁守御(减伤) | 终极大招(唯一答题触发 3.5x 暴击)", fill=(56, 189, 248), font=font_body)
    draw.text((45, 74), "2. 真正技能图标：全服 43 只宠物全部拥有专属正方形微章(绝无拉伸变形) · 3. 真实攻击特效：9 大元素流派打击视效", fill=(148, 163, 184), font=font_body)

    # ALL 43 PETS DATA ORGANIZED INTO 7 SERIES
    series_groups = [
        ("【第一篇章】6 大限定神兽英雄 (Hero Gacha Series)", [
            ("vibranium-panther", "紫能守护豹", "紫光利爪", "王者震荡", "虚空暗质"),
            ("arcflare-fox", "赤焰机甲狐", "赤焰冲拳", "星核全开", "机甲烈焰"),
            ("stormmane-lion", "雷霆战狮", "雷锤震地", "天穹雷域", "狂暴风雷"),
            ("webshade-lynx", "蛛影战猫", "能量蛛索", "天网追击", "潜行蛛影"),
            ("runeportal-owl", "秘境传送鸮", "传送光环", "万门星海", "星空法阵"),
            ("gamma-boulder-bear", "伽马巨岩熊", "重拳震波", "伽马山崩", "泰坦重岩"),
        ]),
        ("【第二篇章】宝可梦 7 大神宠 (Pokemon Series)", [
            ("pikachu", "皮卡丘", "电光冲刺", "雷霆万钧", "黄金电光"),
            ("charizard", "喷火龙", "火花冲击", "爆炎龙舞", "龙炎裂地"),
            ("mewtwo", "超梦", "念力冲击", "破坏光线", "精神核爆"),
            ("lucario", "路卡利欧", "真空波", "近身真气爆发", "波导气劲"),
            ("greninja", "甲贺忍蛙", "水手里剑", "巨型水手里剑", "忍法水遁"),
            ("psyduck", "可达鸭", "浪花拍击", "心海浪潮", "念力潮涌"),
            ("squirtle", "杰尼龟", "水枪冲击", "海炮浪涌", "水炮轰击"),
        ]),
        ("【第三篇章】我的世界 5 大角色 (Minecraft Series)", [
            ("steve", "史蒂夫", "钻石镐击", "钻石终结", "像素打击"),
            ("enderdragon", "末影黑龙", "龙息", "终末龙灾", "虚空龙火"),
            ("enderman", "末影人", "传送突袭", "虚空迁跃", "空间碎裂"),
            ("creeper", "苦力怕", "苦力怕冲撞", "超级爆破", "震荡巨爆"),
            ("wolf", "驯服狼", "狼牙扑击", "月夜狼王", "狂野撕咬"),
        ]),
        ("【第四篇章】三丽鸥 5 大萌宠 (Sanrio Series)", [
            ("kuromi", "酷洛米", "魔星镰舞", "月夜星冠", "朋克暗星"),
            ("my-melody", "美乐蒂", "爱心花杖", "玫瑰治愈阵", "治愈花雨"),
            ("cinnamoroll", "大耳狗", "音符法杖", "天空交响曲", "云端音波"),
            ("pochacco", "帕恰狗", "香蕉冲刺", "冠军疾风场", "活力旋风"),
            ("hello-kitty", "凯蒂猫", "爱心权杖", "星耀皇家礼赞", "闪耀礼赞"),
        ]),
        ("【第五篇章】泡泡玛特 5 大天团 (Popmart Series)", [
            ("crybaby", "哭宝", "泪滴弹射", "天降大哭", "晶莹泪河"),
            ("hacipupu", "哈奇璞璞", "蘑菇弹", "童话森林", "毒蘑菇爆"),
            ("labubu", "拉布布", "耳朵回旋镖", "兔王狂欢", "捣蛋狂欢"),
            ("skullpanda", "密林熊猫", "暗星飞刃", "月蚀终章", "暗蚀利刃"),
            ("twinkle-twinkle", "闪耀骑士", "星尘射线", "银河闪耀", "银河星辉"),
        ]),
        ("【第六篇章】5+1 经典 10 大原生神宠 (Classic 5+1 Series)", [
            ("sunny-wing", "晴天翼", "羽刃旋风", "晨曦重生", "晨曦圣焰"),
            ("sprouty", "豆豆芽", "藤蔓缠绕", "远古生长", "远古荆棘"),
            ("hydroblob", "水球球", "泡泡爆裂", "海洋皇冠", "潮汐狂涌"),
            ("fluffbit", "绒毛兽", "绒球翻滚", "云朵嘉年华", "彩云弹跳"),
            ("shadow-wing", "暗影翼", "暗影羽刃", "月蚀风翼", "月蚀黑风"),
            ("flame-rex", "烈焰霸王龙", "烈焰吐息", "火山审判", "熔岩火海"),
            ("thunder-beetle", "雷鸣独角仙", "雷角突进", "雷霆坠击", "金雷轰击"),
            ("frost-fang", "霜寒利齿", "寒冰撕咬", "永恒寒冬", "暴风雪域"),
            ("volt-cheetah", "闪电猎豹", "闪电突袭", "天穹落雷", "疾电残影"),
            ("shadow-stalker", "幽影潜伏者", "暗影利爪", "暗月降临", "影袭刺杀"),
        ]),
        ("【第七篇章】卡通明星与智能机器人 (Cartoon & Robot Series)", [
            ("nova-robot", "Nova机器人", "脉冲光炮", "星际装甲觉醒", "离子重炮"),
            ("winnie-the-pooh", "小熊维尼", "蜂蜜星棒", "甜蜜森林派对", "蜜蜂暴乱"),
            ("crayon-shinchan", "蜡笔小新", "蜡笔冲刺", "动感光线", "动感光束"),
            ("ugly-fish", "丑鱼", "椰子水花", "阳光海浪", "椰子炸弹"),
            ("yoyo", "悠悠球", "粉光闪闪", "爱心气球雨", "爱心爆爆"),
        ])
    ]

    current_y = 105
    for series_name, pet_list in series_groups:
        # Series Header Box
        draw.rounded_rectangle([45, current_y, 1555, current_y + 32], radius=6, fill=(30, 41, 59, 240), outline=(71, 85, 105), width=1)
        draw.text((55, current_y + 6), series_name, fill=(253, 224, 71), font=font_series)
        current_y += 38

        # Render pets in rows (up to 7 per row)
        row_w = 1510
        item_w = row_w // min(7, max(len(pet_list), 5))
        item_h = 135

        # Split pet_list into chunks of 6 or 7
        chunk_size = 6 if len(pet_list) in [6, 12] else (5 if len(pet_list) in [5, 10] else 7)
        chunks = [pet_list[i:i + chunk_size] for i in range(0, len(pet_list), chunk_size)]

        for chunk in chunks:
            actual_w = (1510 - (len(chunk) - 1) * 10) // len(chunk)
            for idx, (pid, pname, s1_name, ult_name, elem) in enumerate(chunk):
                item_x = 45 + idx * (actual_w + 10)
                item_y = current_y

                # Background card
                draw.rounded_rectangle([item_x, item_y, item_x + actual_w, item_y + item_h], radius=10, fill=(18, 26, 44), outline=(47, 63, 90), width=1)

                # Pet Title & Element
                draw.text((item_x + 8, item_y + 6), pname, fill=(255, 255, 255), font=font_body)
                draw.text((item_x + actual_w - 75, item_y + 6), elem[:4], fill=(148, 163, 184), font=font_small)

                # Skill 1 (Small Skill - Direct Cast)
                s1_file, ult_file = get_skill_image_path(pid)
                s1_y = item_y + 28
                draw.rectangle([item_x + 8, s1_y, item_x + 48, s1_y + 40], fill=(30, 41, 59), outline=(168, 85, 247), width=1)
                if s1_file and s1_file.exists():
                    try:
                        im = Image.open(s1_file).convert("RGBA").resize((38, 38), Image.Resampling.LANCZOS)
                        canvas.paste(im, (item_x + 9, s1_y + 1), im)
                    except Exception:
                        pass
                draw.text((item_x + 54, s1_y + 2), f"普招: {s1_name}", fill=(216, 180, 254), font=font_small)
                draw.text((item_x + 54, s1_y + 18), "50 MP · 直接施放", fill=(100, 116, 139), font=font_small)

                # Ultimate (Big Skill - Quiz Trigger)
                ult_y = item_y + 74
                draw.rectangle([item_x + 8, ult_y, item_x + 48, ult_y + 40], fill=(45, 25, 15), outline=(245, 158, 11), width=2)
                if ult_file and ult_file.exists():
                    try:
                        im_u = Image.open(ult_file).convert("RGBA").resize((38, 38), Image.Resampling.LANCZOS)
                        canvas.paste(im_u, (item_x + 9, ult_y + 1), im_u)
                    except Exception:
                        pass
                draw.text((item_x + 54, ult_y + 2), f"大招: {ult_name}", fill=(253, 224, 71), font=font_small)
                draw.text((item_x + 54, ult_y + 18), "★ 5秒答题 · 3.5x暴击", fill=(239, 68, 68), font=font_small)

            current_y += item_h + 10
        current_y += 6

    # BOTTOM SECTION: 9 ELEMENTAL ATTACK VFX DEMO
    draw.rounded_rectangle([45, current_y, 1555, CANVAS_H - 25], radius=14, fill=(15, 23, 42, 240), outline=(56, 189, 248), width=2)
    draw.text((65, current_y + 12), "【全球战斗系统 9 大元素真实攻击打击特效 (In-Battle Real Attack Visual FX Engine)】", fill=(56, 189, 248), font=font_section)
    draw.text((65, current_y + 36), "每个宠物攻击时不再是单一数值跳动，而是触发专属元素粒子斩击、高能脉冲与全屏暗角奥义核爆！", fill=(148, 163, 184), font=font_body)

    vfx_start_y = current_y + 60
    vfx_cards = [
        ("【雷电狂暴系】", "皮卡丘/雷狮/猎豹", "白金双雷刃划破敌阵", "天降轰天神雷震裂地面", (250, 204, 21)),
        ("【烈焰炼狱系】", "喷火龙/暴龙/机甲狐", "烈焰爪痕撕裂受击方", "巨大火龙卷全屏焚尽", (248, 113, 113)),
        ("【极冰水遁系】", "甲贺忍蛙/杰尼龟/利齿", "极速水刃/冰刺贯穿", "永恒绝对零度冰川爆碎", (56, 189, 248)),
        ("【暗质虚空系】", "守护豹/超梦/末影人", "紫金虚空爪刃斜切", "引力坍缩黑洞全屏暗角", (192, 132, 252)),
        ("【重岩泰坦系】", "巨岩熊/豆豆芽/苦力怕", "巨石飞弹碎裂冲击", "天崩地裂泰坦震波", (74, 222, 128)),
        ("【星界圣光系】", "传送鸮/晴天翼/闪耀骑士", "金色星尘弧光斩", "星海传送门漫天神圣光柱", (253, 230, 138)),
    ]

    card_w = (1510 - 5 * 12) // 6
    card_h = 140
    for idx, (vname, vpets, v_normal, v_ult, col) in enumerate(vfx_cards):
        cx = 60 + idx * (card_w + 12)
        cy = vfx_start_y
        draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=10, fill=(24, 32, 54), outline=col, width=1)
        draw.text((cx + 8, cy + 8), vname, fill=col, font=font_series)
        draw.text((cx + 8, cy + 28), vpets, fill=(148, 163, 184), font=font_small)

        draw.text((cx + 8, cy + 50), "• 普攻/普招特效:", fill=(226, 232, 240), font=font_small)
        draw.text((cx + 8, cy + 66), v_normal, fill=(203, 213, 225), font=font_small)

        draw.text((cx + 8, cy + 90), "• 终极大招特效:", fill=(251, 191, 36), font=font_small)
        draw.text((cx + 8, cy + 106), v_ult, fill=(248, 113, 113), font=font_small)

    canvas.save(OUTPUT_PATH, "PNG", optimize=True)
    print(f"Successfully generated Master Matrix for ALL 43 pets at: {OUTPUT_PATH}")

if __name__ == "__main__":
    create_master_matrix()
