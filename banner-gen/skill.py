#!/usr/bin/env python3
"""
Banner Generation Skill - 营销 Banner 三层合成生成器

Layer architecture:
  1. 主体物背景层 (Background + Main Object) - AI generated via Wuli API
  2. 渐变色蒙层 (Gradient Overlay) - Programmatic
  3. 文字层 (Text Layer) - Programmatic (Pillow)

Usage:
  python3 skill.py --title "会员积分功能上线" --subtitle "邀请好友福利叠加 >"
  python3 skill.py --title "新品发布" --scene launch --style tech --color blue
"""

import argparse
import json
import math
import os
import platform
import struct
import subprocess
import sys
import time
import urllib.request
import urllib.error
import urllib.parse
import zlib
from pathlib import Path

# ─── Wuli API ───────────────────────────────────────────────────────────────

API_BASE = "https://platform.wuli.art/api/v1/platform"


def api_request(method, url, token, data=None):
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        print(f"Error: HTTP {e.code} - {err_body}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Error: {e.reason}", file=sys.stderr)
        sys.exit(1)


def get_no_watermark_urls(task_ids, token):
    urls = {}
    for task_id in task_ids:
        try:
            resp = api_request("POST", f"{API_BASE}/predict/noWatermarkImage", token,
                               data={"taskId": task_id})
            if resp.get("success") and resp.get("data", {}).get("url"):
                urls[task_id] = resp["data"]["url"]
        except Exception:
            pass
    return urls


def download_file(url, filename):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as resp:
        Path(filename).write_bytes(resp.read())


def open_file(filepath):
    system = platform.system()
    try:
        if system == "Darwin":
            subprocess.Popen(["open", filepath])
        elif system == "Windows":
            os.startfile(filepath)
        elif system == "Linux":
            subprocess.Popen(["xdg-open", filepath])
    except Exception:
        pass


# ─── Size Presets (from Figma design specs @2x) ───────────────────────────

SIZE_PRESETS = {
    "large": {"width": 1920, "height": 400, "aspect_ratio": "21:9", "desc": "大尺寸 (960x200 @2x, 1920x400 @4x)"},
    "small": {"width": 1200, "height": 400, "aspect_ratio": "3:1",  "desc": "小尺寸 (600x200 @2x, 1200x400 @4x)"},
}

# ─── Prompt Engineering ─────────────────────────────────────────────────────

# Scene -> default element, color, style suggestions
SCENE_PRESETS = {
    "promotion": {
        "name": "促销活动",
        "elements": ["3D gift box with ribbon", "golden coins and sparkles", "shopping bag with confetti"],
        "colors": ["purple-pink", "warm", "purple"],
        "styles": ["modern", "cute"],
        "keywords_zh": "促销、优惠、活动、福利",
        "keywords_en": "promotion, discount, sale, reward",
    },
    "launch": {
        "name": "新品发布",
        "elements": ["rocket launching with smoke trail", "glowing portal with light beams", "futuristic floating device"],
        "colors": ["blue-purple", "purple", "purple-dark"],
        "styles": ["tech", "modern"],
        "keywords_zh": "新品、发布、上线、首发",
        "keywords_en": "launch, new release, debut, unveil",
    },
    "brand": {
        "name": "品牌宣传",
        "elements": ["abstract 3D shapes floating", "minimal geometric sculpture", "brand mascot character"],
        "colors": ["dark", "warm", "purple"],
        "styles": ["modern", "luxury"],
        "keywords_zh": "品牌、关注、了解、探索",
        "keywords_en": "brand, discover, explore, follow",
    },
    "holiday": {
        "name": "节日活动",
        "elements": ["festive lanterns and fireworks", "decorated christmas tree", "celebration balloons and streamers"],
        "colors": ["warm", "purple-pink"],
        "styles": ["cute", "modern"],
        "keywords_zh": "节日、庆祝、欢乐、祝福",
        "keywords_en": "holiday, celebration, festive, joy",
    },
    "feature": {
        "name": "功能上新",
        "elements": ["glowing UI window with abstract particles", "3D tool icons floating", "abstract wave patterns with sparkles"],
        "colors": ["purple-dark", "blue-purple", "purple"],
        "styles": ["tech", "gradient"],
        "keywords_zh": "功能、更新、体验、上新",
        "keywords_en": "feature, update, upgrade, new",
    },
    "general": {
        "name": "通用",
        "elements": ["abstract 3D geometric shapes", "colorful fluid shapes", "minimal decorative elements"],
        "colors": ["purple", "blue-purple", "purple-pink"],
        "styles": ["modern", "gradient"],
        "keywords_zh": "通用、展示、推广",
        "keywords_en": "general, showcase, display",
    },
}

# Style descriptors for prompt
STYLE_PROMPTS = {
    "modern": {
        "zh": "现代简约设计风格，干净利落，留白充足，高级感",
        "en": "modern minimalist design, clean layout, ample whitespace, premium feel",
    },
    "tech": {
        "zh": "科技感设计风格，未来感光效，数字化元素，深色调搭配亮色光芒",
        "en": "tech-inspired design, futuristic glow effects, digital elements, dark tones with bright accents",
    },
    "cute": {
        "zh": "可爱卡通风格，3D渲染质感，圆润造型，柔和色彩，充满活力",
        "en": "cute cartoon style, 3D rendered, rounded shapes, soft colors, vibrant and playful",
    },
    "luxury": {
        "zh": "高端奢华风格，金色点缀，质感纹理，优雅大气",
        "en": "luxury premium style, gold accents, rich textures, elegant and sophisticated",
    },
    "fresh": {
        "zh": "清新自然风格，明亮色彩，自然元素，轻盈通透",
        "en": "fresh natural style, bright colors, natural elements, light and airy",
    },
    "gradient": {
        "zh": "渐变抽象风格，流畅的色彩过渡，抽象光影，梦幻感",
        "en": "gradient abstract style, smooth color transitions, abstract light and shadow, dreamy feel",
    },
}

# Color palettes (extracted from Figma design specs)
COLOR_PALETTES = {
    "purple-dark": {
        "gradient_start": (35, 36, 40),      # #232428
        "gradient_end": (75, 20, 148),       # #4B1494
        "text_color": (255, 255, 255),
        "subtitle_color": (255, 255, 255),
        "text_on_light": False,
        "overlay_alpha": 180,
        "prompt_zh": "深色紫调背景，从深灰黑到深紫渐变，神秘科技感",
        "prompt_en": "dark purple background, transitioning from charcoal black to deep violet, mysterious tech feel",
    },
    "purple": {
        "gradient_start": (105, 40, 254),    # #6928FE
        "gradient_end": (158, 109, 251),     # #9E6DFB
        "text_color": (255, 255, 255),
        "subtitle_color": (255, 255, 255),
        "text_on_light": False,
        "overlay_alpha": 180,
        "prompt_zh": "紫色系渐变背景，从品牌紫到浅紫过渡，高级优雅",
        "prompt_en": "purple gradient background, transitioning from brand violet to soft lavender, premium and elegant",
    },
    "purple-pink": {
        "gradient_start": (130, 58, 255),    # #823AFF
        "gradient_end": (247, 159, 235),     # #F79FEB
        "text_color": (255, 255, 255),
        "subtitle_color": (255, 255, 255),
        "text_on_light": True,
        "overlay_alpha": 120,
        "prompt_zh": "浅紫粉渐变背景，从紫色到粉色过渡，柔和温馨，适合活动促销",
        "prompt_en": "light purple-pink gradient, transitioning from violet to soft pink, warm and inviting, good for promotions",
    },
    "blue-purple": {
        "gradient_start": (69, 13, 196),     # #450DC4
        "gradient_end": (155, 175, 242),     # #9BAFF2
        "text_color": (255, 255, 255),
        "subtitle_color": (255, 255, 255),
        "text_on_light": False,
        "overlay_alpha": 180,
        "prompt_zh": "蓝紫渐变背景，从深蓝紫到浅蓝过渡，科技感十足",
        "prompt_en": "blue-purple gradient, transitioning from deep indigo to light periwinkle, tech-forward feel",
    },
    "warm": {
        "gradient_start": (255, 108, 68),    # #FF6C44
        "gradient_end": (249, 240, 255),     # #F9F0FF
        "text_color": (255, 255, 255),
        "subtitle_color": (255, 255, 255),
        "text_on_light": True,
        "overlay_alpha": 120,
        "prompt_zh": "暖色渐变背景，从橙红到浅粉白过渡，温暖活力",
        "prompt_en": "warm gradient background, from orange-red to soft pinkish white, warm and vibrant",
    },
    "dark": {
        "gradient_start": (2, 2, 2),         # #020202
        "gradient_end": (75, 20, 148),       # #4B1494
        "text_color": (255, 255, 255),
        "subtitle_color": (255, 255, 255),
        "text_on_light": False,
        "overlay_alpha": 180,
        "prompt_zh": "深黑色背景，搭配紫色光晕，暗黑酷炫风格",
        "prompt_en": "deep black background with purple glow accents, dark and cool style",
    },
}


def auto_select_color(scene, title="", subtitle=""):
    """Auto-select the best color: semantic keywords first, scene fallback."""
    best_color = None
    best_score = 0
    for keyword, color in SEMANTIC_COLOR_HINTS.items():
        if keyword.lower() in title.lower():
            score = 2
        elif keyword.lower() in subtitle.lower():
            score = 1
        else:
            continue
        if score > best_score:
            best_score = score
            best_color = color
    if best_color:
        return best_color
    preset = SCENE_PRESETS.get(scene, SCENE_PRESETS["general"])
    return preset["colors"][0]


def auto_select_element(scene):
    """Auto-select a decorative element based on scene."""
    import random
    preset = SCENE_PRESETS.get(scene, SCENE_PRESETS["general"])
    return random.choice(preset["elements"])


# ─── Semantic Element Mapping ──────────────────────────────────────────────
# Maps keywords found in title/subtitle to visually relevant 3D element descriptions.
# Each entry: keyword -> (element_description_zh, element_description_en)

SEMANTIC_KEYWORDS = {
    # Animals / Mascots
    "龙虾": ("可爱的3D卡通龙虾角色，红色身体，大钳子，活泼的表情", "cute 3D cartoon lobster character, red body, big claws, lively expression"),
    "lobster": ("可爱的3D卡通龙虾角色，红色身体，大钳子", "cute 3D cartoon lobster character, red body, big claws, lively expression"),
    "claw": ("可爱的3D卡通龙虾角色，张开大钳子", "cute 3D cartoon lobster character with open claws"),
    "猫": ("可爱的3D卡通猫咪，毛茸茸，大眼睛", "cute 3D cartoon cat, fluffy, big eyes"),
    "狗": ("可爱的3D卡通小狗，活泼可爱", "cute 3D cartoon puppy, lively and adorable"),
    "兔": ("可爱的3D卡通兔子，长耳朵，粉色鼻子", "cute 3D cartoon bunny, long ears, pink nose"),
    "鸟": ("可爱的3D卡通小鸟，展开翅膀", "cute 3D cartoon bird, wings spread"),
    "鱼": ("可爱的3D卡通鱼，闪闪发光的鳞片", "cute 3D cartoon fish, shiny scales"),
    "龙": ("精致的3D中国龙，祥云环绕", "detailed 3D Chinese dragon, surrounded by auspicious clouds"),

    # Tech / AI / Product
    "ai": ("发光的3D AI芯片与神经网络粒子", "glowing 3D AI chip with neural network particles"),
    "AI": ("发光的3D AI芯片与神经网络粒子", "glowing 3D AI chip with neural network particles"),
    "skill": ("发光的3D魔法卷轴，展开状态，有光线粒子", "glowing 3D magic skill scroll, unrolled, with light particles"),
    "Skill": ("发光的3D魔法卷轴，展开状态，有光线粒子", "glowing 3D magic skill scroll, unrolled, with light particles"),
    "插件": ("3D拼图方块组合，发光连接线", "3D puzzle blocks combining together, glowing connection lines"),
    "plugin": ("3D拼图方块组合，发光连接线", "3D puzzle blocks combining together, glowing connection lines"),
    "模型": ("3D立体大脑模型，神经元发光连接", "3D brain model with glowing neuron connections"),
    "画布": ("3D浮空画板，画笔悬浮，彩色颜料飞溅", "3D floating canvas, hovering brushes, colorful paint splashes"),
    "生图": ("3D魔法画框，图像从中浮出，光线粒子四溅", "3D magic picture frame with images floating out, light particles"),
    "视频": ("3D电影胶片卷轴，发光播放按钮", "3D film reel with glowing play button"),
    "视频生成": ("3D摄像机镜头特写，光圈发光，胶片从镜头飘出", "3D camera lens closeup, glowing aperture, film strips floating out"),
    "可灵": ("3D电影摄像机，镜头反光，动态光线粒子环绕", "3D cinema camera with lens flare, surrounded by dynamic light particles"),
    "kling": ("3D cinema camera with lens flare, surrounded by dynamic light particles", "3D cinema camera with lens flare, surrounded by dynamic light particles"),
    "代码": ("3D浮空代码窗口，发光的终端界面", "3D floating code window, glowing terminal interface"),
    "机器人": ("可爱的3D机器人助手，蓝色光效眼睛", "cute 3D robot assistant, blue glowing eyes"),

    # Commerce / Events
    "积分": ("3D金色硬币堆叠，星光闪烁", "3D golden coin stacks with sparkles"),
    "会员": ("3D金色VIP皇冠，宝石镶嵌，光芒四射", "3D golden VIP crown, jewel-encrusted, radiating light"),
    "优惠": ("3D礼物盒打开，金色光芒涌出", "3D gift box opening, golden light pouring out"),
    "红包": ("3D红色红包，金色纹饰，硬币飞出", "3D red envelope, golden patterns, coins flying out"),
    "购物": ("3D购物车装满彩色商品，星光环绕", "3D shopping cart full of colorful items, surrounded by sparkles"),
    "直播": ("3D摄像机与麦克风，发光信号波纹", "3D camera and microphone, glowing signal waves"),
    "音乐": ("3D耳机与音符，彩色声波", "3D headphones with music notes, colorful sound waves"),
    "游戏": ("3D游戏手柄，发光按钮，能量粒子", "3D game controller, glowing buttons, energy particles"),

    # Holidays
    "春节": ("3D红灯笼与烟花，金色祥云", "3D red lanterns and fireworks, golden auspicious clouds"),
    "中秋": ("3D月亮与玉兔，云层环绕", "3D moon with jade rabbit, surrounded by clouds"),
    "圣诞": ("3D圣诞树与雪花，金色星星", "3D Christmas tree with snowflakes, golden stars"),
    "新年": ("3D彩色烟花绽放，庆祝丝带", "3D colorful fireworks bursting, celebration ribbons"),
    "双11": ("3D数字11，霓虹灯效果，购物符号环绕", "3D neon number 11 with shopping symbols orbiting"),
    "618": ("3D数字618，霓虹灯效果，礼盒环绕", "3D neon number 618 with gift boxes orbiting"),

    # Abstract / Nature
    "宇宙": ("3D星球与星云，浩瀚太空感", "3D planet with nebula, vast space feeling"),
    "海洋": ("3D海浪与气泡，深海光线", "3D ocean waves and bubbles, deep sea light"),
    "森林": ("3D树木与萤火虫，魔法光点", "3D trees with fireflies, magical light dots"),
    "城市": ("3D未来城市天际线，霓虹灯光", "3D futuristic city skyline, neon lights"),
    "火箭": ("3D火箭升空，尾焰与烟雾", "3D rocket launching, exhaust flames and smoke trail"),
}


# ─── Semantic Color Hints ─────────────────────────────────────────────────
# Maps keywords found in title/subtitle to harmonious color themes.
# Checked before scene-based fallback so --color auto respects the main object's hue.

SEMANTIC_COLOR_HINTS = {
    # Animals / Mascots — lobster is red-orange → warm; cute animals → purple-pink
    "龙虾": "warm",
    "lobster": "warm",
    "claw": "warm",
    "猫": "purple-pink",
    "狗": "purple-pink",
    "兔": "purple-pink",
    "鸟": "purple-pink",
    "鱼": "blue-purple",
    "龙": "warm",

    # Tech / AI
    "ai": "blue-purple",
    "AI": "blue-purple",
    "skill": "purple",
    "Skill": "purple",
    "插件": "purple",
    "plugin": "purple",
    "模型": "blue-purple",
    "画布": "purple-pink",
    "生图": "purple-pink",
    "视频": "purple",
    "代码": "purple-dark",
    "机器人": "blue-purple",

    # Commerce / Events
    "积分": "warm",
    "会员": "purple-dark",
    "优惠": "warm",
    "红包": "warm",
    "购物": "purple-pink",
    "直播": "purple",
    "音乐": "purple-pink",
    "游戏": "purple",

    # Holidays
    "春节": "warm",
    "中秋": "purple-dark",
    "圣诞": "warm",
    "新年": "warm",
    "双11": "purple-pink",
    "618": "warm",

    # Nature / Abstract
    "宇宙": "blue-purple",
    "海洋": "blue-purple",
    "森林": "purple-pink",
    "城市": "blue-purple",
    "火箭": "blue-purple",
}


def extract_semantic_element(title, subtitle, lang="zh"):
    """Extract a semantically relevant 3D element from title and subtitle text.

    Scans the title+subtitle for known keywords and builds a combined element
    description that reflects the actual content. Falls back to None if no
    keywords match (caller should use scene preset fallback).
    """
    combined_text = f"{title} {subtitle}".lower()
    matched_elements = []
    matched_keys = set()

    # Score keywords: title matches weigh more than subtitle matches
    for keyword, (desc_zh, desc_en) in SEMANTIC_KEYWORDS.items():
        kw_lower = keyword.lower()
        if kw_lower in matched_keys:
            continue
        if kw_lower in combined_text:
            # Determine if match is in title (higher priority) or subtitle
            in_title = kw_lower in title.lower()
            score = 2 if in_title else 1
            desc = desc_zh if lang == "zh" else desc_en
            matched_elements.append((score, keyword, desc))
            matched_keys.add(kw_lower)

    if not matched_elements:
        return None

    # Sort by score desc, take top 2 to avoid overly complex prompts
    matched_elements.sort(key=lambda x: -x[0])
    top_matches = matched_elements[:2]

    if len(top_matches) == 1:
        return top_matches[0][2]

    # Combine top 2: primary element + secondary as accessory
    primary = top_matches[0][2]
    secondary_kw = top_matches[1][1]
    secondary_desc = top_matches[1][2]

    if lang == "zh":
        return f"{primary}，旁边搭配{secondary_desc}"
    else:
        return f"{primary}, accompanied by {secondary_desc}"


def build_background_prompt(args):
    """Build the AI prompt for background + main object generation (no text).

    When --element is not specified, analyzes the title and subtitle text to
    extract semantic keywords and generate a visually relevant 3D element
    description, ensuring the background image matches the banner's message.
    """
    scene = args.scene
    style = args.style
    color = args.color if args.color != "auto" else auto_select_color(scene, args.title, args.subtitle)
    lang = args.lang

    # Element selection priority:
    # 1. User-specified --element (highest)
    # 2. Semantic extraction from title+subtitle
    # 3. Scene preset fallback (lowest)
    if args.element:
        element = args.element
        element_source = "user"
    else:
        semantic_element = extract_semantic_element(args.title, args.subtitle, lang)
        if semantic_element:
            element = semantic_element
            element_source = "semantic"
        else:
            element = auto_select_element(scene)
            element_source = "scene"

    color_palette = COLOR_PALETTES.get(color, COLOR_PALETTES["purple"])
    style_desc = STYLE_PROMPTS.get(style, STYLE_PROMPTS["modern"])
    scene_preset = SCENE_PRESETS.get(scene, SCENE_PRESETS["general"])

    if lang == "zh":
        prompt = (
            f"横幅背景设计图，{style_desc['zh']}，"
            f"{color_palette['prompt_zh']}，"
            f"画面右侧放置一个精致的{element}作为视觉主体，"
            f"左侧留出大面积空白用于放置文字，"
            f"整体构图平衡，画面干净通透，"
            f"不要包含任何文字、字母、数字或标题，"
            f"高品质渲染，4K分辨率质感，"
            f"适合用作{scene_preset['name']}宣传横幅背景"
        )
    else:
        prompt = (
            f"Banner background design, {style_desc['en']}, "
            f"{color_palette['prompt_en']}, "
            f"a detailed {element} placed on the right side as the visual focal point, "
            f"large blank space on the left for text overlay, "
            f"balanced composition, clean and airy look, "
            f"absolutely no text, letters, numbers, or titles in the image, "
            f"high quality render, 4K resolution feel, "
            f"suitable for {scene_preset['name']} marketing banner background"
        )

    negative = args.negative_prompt or ""
    base_negative = "text, letters, words, numbers, watermark, logo, title, subtitle, caption, typography, blurry, low quality, distorted"
    if negative:
        negative = f"{base_negative}, {negative}"
    else:
        negative = base_negative

    print(f"  [Element source: {element_source}] {element}")

    return prompt, negative, color


# ─── Image Compositing (Pure Python PNG, no Pillow) ─────────────────────────

def try_import_pillow():
    """Try to import Pillow, return None if not available."""
    try:
        from PIL import Image, ImageDraw, ImageFont
        return True
    except ImportError:
        return False


def ensure_pillow():
    """Install Pillow if not available."""
    if try_import_pillow():
        return True
    print("Installing Pillow for image compositing...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "-q"])
        return try_import_pillow()
    except Exception as e:
        print(f"Warning: Could not install Pillow: {e}", file=sys.stderr)
        return False


# Font paths - title uses DingDing JinBuTi, subtitle uses PingFang SC
SKILL_DIR = Path(__file__).parent
TITLE_FONT_PATH = str(SKILL_DIR / "fonts" / "DingTalk-JinBuTi.ttf")

# PingFang SC locations on macOS (searched in order)
PINGFANG_CANDIDATES = [
    "/System/Library/AssetsV2/com_apple_MobileAsset_Font7/3419f2a427639ad8c8e139149a287865a90fa17e.asset/AssetData/PingFang.ttc",
    "/System/Library/Fonts/PingFang.ttc",
    "/Library/Fonts/PingFang.ttc",
]

# Fallback Chinese fonts if PingFang not found
FALLBACK_FONTS = [
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/Supplemental/Songti.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
]


def find_title_font():
    """Get the DingDing JinBuTi font path for titles."""
    if os.path.exists(TITLE_FONT_PATH):
        return TITLE_FONT_PATH
    # Fallback to system fonts
    for path in FALLBACK_FONTS:
        if os.path.exists(path):
            return path
    return None


def find_subtitle_font():
    """Get the PingFang SC font path for subtitles."""
    for path in PINGFANG_CANDIDATES:
        if os.path.exists(path):
            return path
    # Fallback
    for path in FALLBACK_FONTS:
        if os.path.exists(path):
            return path
    return None


def crop_to_fill(img, target_w, target_h):
    """Scale image to cover target area, then center-crop vertically.

    Scales by width to preserve the full horizontal composition (left=text area,
    right=main subject), then crops top/bottom evenly. This avoids any seam or
    stretching artifacts — the result is a clean crop of the original AI image.
    """
    from PIL import Image
    src_w, src_h = img.size

    # Scale to match target width (preserves full horizontal composition)
    scale = target_w / src_w
    new_w = target_w
    new_h = int(src_h * scale)

    # If scaled height < target, scale by height instead (shouldn't happen with 21:9→4.8:1)
    if new_h < target_h:
        scale = target_h / src_h
        new_w = int(src_w * scale)
        new_h = target_h

    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Center-crop vertically
    top = (new_h - target_h) // 2
    left = (new_w - target_w) // 2
    return img.crop((left, top, left + target_w, top + target_h))


def composite_banner(bg_image_path, output_path, title, subtitle, color_name, width=None, height=None):
    """Composite the 3 layers: background + gradient overlay + text.

    Layout specs (from Figma design):
      - Title:    top=27%, left=7%, font_size=18% of height
      - Subtitle: top=58%, left=7%, font_size=13% of height
      - Gradient: left→right, 60% coverage
      - Corners:  5% of min(w,h)
    """
    from PIL import Image, ImageDraw, ImageFont, ImageFilter

    # Load background image
    bg = Image.open(bg_image_path).convert("RGBA")

    if width and height:
        # Scale to cover target, center-crop vertically (no seam, no distortion)
        bg = crop_to_fill(bg, width, height)

    w, h = bg.size

    # ─── Layer 2: Gradient Overlay ───
    palette = COLOR_PALETTES.get(color_name, COLOR_PALETTES["purple"])
    gs = palette["gradient_start"]
    ge = palette["gradient_end"]
    overlay_alpha = palette.get("overlay_alpha", 180)

    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)

    # Gradient from left (opaque) to right (transparent)
    # Left ~60% has gradient overlay for text readability
    gradient_end_x = int(w * 0.6)
    for x in range(gradient_end_x):
        ratio = x / gradient_end_x
        # Stronger on the left, fading to the right
        alpha = int(overlay_alpha * (1 - ratio ** 1.5))
        r = int(gs[0] + (ge[0] - gs[0]) * ratio)
        g = int(gs[1] + (ge[1] - gs[1]) * ratio)
        b = int(gs[2] + (ge[2] - gs[2]) * ratio)
        draw_ov.line([(x, 0), (x, h)], fill=(r, g, b, alpha))

    bg = Image.alpha_composite(bg, overlay)

    # ─── Layer 3: Text ───
    draw = ImageDraw.Draw(bg)

    # Find fonts (DingDing JinBuTi for title, PingFang SC for subtitle)
    title_font_path = find_title_font()
    subtitle_font_path = find_subtitle_font()

    # Scale font size based on banner height (Figma specs: title=20px, subtitle=12px @1x)
    title_size = max(int(h * 0.20), 24)
    subtitle_size = max(int(h * 0.12), 14)

    try:
        title_font = ImageFont.truetype(title_font_path, title_size) if title_font_path else ImageFont.load_default()
    except Exception:
        print(f"Warning: Could not load title font, using default", file=sys.stderr)
        title_font = ImageFont.load_default()

    try:
        subtitle_font = ImageFont.truetype(subtitle_font_path, subtitle_size) if subtitle_font_path else ImageFont.load_default()
    except Exception:
        print(f"Warning: Could not load subtitle font, using default", file=sys.stderr)
        subtitle_font = ImageFont.load_default()

    # Text color: pure white for all themes
    text_color = (255, 255, 255)
    subtitle_color = (255, 255, 255)
    is_light_bg = palette.get("text_on_light", False)

    # Shadow params: diffuse blur to avoid ghost-text doubling effect.
    # Large blur radius + moderate alpha + clear offset ensures shadow looks
    # like a soft glow rather than a second copy of the text.
    shadow_base_color = (120, 80, 160) if is_light_bg else (0, 0, 0)
    shadow_alpha_title = 55 if is_light_bg else 70
    shadow_alpha_subtitle = 35 if is_light_bg else 50
    shadow_blur = max(10, int(h * 0.07))  # ~14px blur at 200px — wide diffuse glow
    shadow_offset_x = max(2, int(h * 0.015))
    shadow_offset_y = max(3, int(h * 0.025))

    # Text positioning (Figma specs: title@27% top, subtitle@58% top, left@7%)
    margin_left = int(w * 0.07)
    title_top = int(h * 0.27)
    subtitle_top = int(h * 0.58)

    # ─── Draw text with gaussian-blur shadow ───
    # Render shadow on a separate transparent layer, blur it, then composite
    shadow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)

    # Title shadow
    shadow_draw.text(
        (margin_left + shadow_offset_x, title_top + shadow_offset_y),
        title, font=title_font,
        fill=(*shadow_base_color, shadow_alpha_title),
    )

    # Subtitle shadow
    if subtitle:
        display_subtitle = subtitle if subtitle.rstrip().endswith(">") else f"{subtitle} >"
        shadow_draw.text(
            (margin_left + shadow_offset_x, subtitle_top + shadow_offset_y),
            display_subtitle, font=subtitle_font,
            fill=(*shadow_base_color, shadow_alpha_subtitle),
        )

    # Apply gaussian blur to the entire shadow layer
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=shadow_blur))

    # Composite: blurred shadow → background
    bg = Image.alpha_composite(bg, shadow_layer)

    # Draw crisp text on top
    draw = ImageDraw.Draw(bg)
    draw.text((margin_left, title_top), title, font=title_font, fill=text_color)

    if subtitle:
        display_subtitle = subtitle if subtitle.rstrip().endswith(">") else f"{subtitle} >"
        draw.text((margin_left, subtitle_top), display_subtitle, font=subtitle_font, fill=subtitle_color)

    # Save final banner
    bg.save(output_path, "PNG")
    return output_path


def add_rounded_corners(img, radius):
    """Add rounded corners to the image."""
    from PIL import Image, ImageDraw

    # Create a mask with rounded rectangle
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), img.size], radius=radius, fill=255)

    # Apply mask
    output = Image.new("RGBA", img.size, (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    return output


# ─── Main ───────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Banner Generation Skill - 营销 Banner 三层合成")
    parser.add_argument("--title", required=True, help="Banner main title text")
    parser.add_argument("--subtitle", default="", help="Banner subtitle / CTA text")
    parser.add_argument("--scene", default="general",
                        choices=["promotion", "launch", "brand", "holiday", "feature", "general"],
                        help="Banner scene type")
    parser.add_argument("--style", default="modern",
                        choices=["modern", "tech", "cute", "luxury", "fresh", "gradient"],
                        help="Visual style")
    parser.add_argument("--color", default="auto",
                        choices=["purple-dark", "purple", "purple-pink", "blue-purple", "warm", "dark", "auto"],
                        help="Color theme (auto = smart recommendation)")
    parser.add_argument("--element", default="", help="Main 3D decorative element description")
    parser.add_argument("--size", default="large",
                        choices=["large", "small"],
                        help="Banner size preset (large=960x200/480x100, small=600x200/300x100)")
    parser.add_argument("--aspect_ratio", default="",
                        help="Custom aspect ratio override (e.g. 21:9, 16:9). If set, overrides --size for AI generation.")
    parser.add_argument("--model", default="Seedream 4.5", help="AI model name")
    parser.add_argument("--resolution", default="4K", choices=["2K", "4K"], help="Resolution")
    parser.add_argument("--n", type=int, default=4, help="Number of variants (1-4)")
    parser.add_argument("--negative_prompt", default="", help="Elements to exclude")
    parser.add_argument("--optimize", action="store_true", help="Enable AI prompt optimization")
    parser.add_argument("--lang", default="zh", choices=["zh", "en"], help="Prompt language")
    parser.add_argument("--no_composite", action="store_true",
                        help="Skip compositing, only generate background images")
    parser.add_argument("--output_dir", default=".", help="Output directory")
    args = parser.parse_args()

    # ─── Check token ───
    token = os.environ.get("WULI_API_TOKEN")
    if not token:
        print("Error: WULI_API_TOKEN environment variable is not set\n"
              "Get your API token from https://wuli.art (左下角 -> API 开放平台)\n"
              "Then set it:\n"
              '  export WULI_API_TOKEN="wuli-your-token-here"', file=sys.stderr)
        sys.exit(1)

    # ─── Check Pillow (unless --no_composite) ───
    has_pillow = False
    if not args.no_composite:
        has_pillow = ensure_pillow()
        if not has_pillow:
            print("Warning: Pillow not available. Will generate background images only (no text overlay).")
            print("Install Pillow for full compositing: pip install Pillow\n")

    # ─── Resolve size preset ───
    size_preset = SIZE_PRESETS.get(args.size, SIZE_PRESETS["large"])
    target_width = size_preset["width"]
    target_height = size_preset["height"]
    # Use size preset's aspect_ratio unless custom --aspect_ratio is provided
    if not args.aspect_ratio:
        args.aspect_ratio = size_preset["aspect_ratio"]

    # ─── Build prompt ───
    prompt, negative_prompt, resolved_color = build_background_prompt(args)

    print(f"\n{'='*60}")
    print(f"  Banner Generator - 营销横幅生成")
    print(f"{'='*60}")
    print(f"  Title:    {args.title}")
    if args.subtitle:
        print(f"  Subtitle: {args.subtitle}")
    print(f"  Scene:    {SCENE_PRESETS.get(args.scene, {}).get('name', args.scene)}")
    print(f"  Style:    {args.style}")
    print(f"  Color:    {resolved_color}")
    print(f"  Size:     {args.size} ({target_width}x{target_height})")
    print(f"  Ratio:    {args.aspect_ratio}")
    print(f"  Model:    {args.model}")
    print(f"  Variants: {args.n}")
    print(f"{'='*60}")
    print(f"\n[Prompt]\n{prompt}\n")
    if negative_prompt:
        print(f"[Negative]\n{negative_prompt}\n")

    # ─── Submit to Wuli API ───
    body = {
        "modelName": args.model,
        "mediaType": "IMAGE",
        "predictType": "TXT_2_IMG",
        "prompt": prompt,
        "aspectRatio": args.aspect_ratio,
        "resolution": args.resolution,
        "n": min(max(args.n, 1), 4),
        "optimizePrompt": args.optimize,
        "negativePrompt": negative_prompt,
        "inputImageList": [],
        "inputVideoList": [],
    }

    print("Submitting generation request...")
    resp = api_request("POST", f"{API_BASE}/predict/submit", token, data=body)
    if not resp.get("success"):
        print(f"Error: Submit failed - {json.dumps(resp, ensure_ascii=False)}", file=sys.stderr)
        sys.exit(1)

    record_id = resp["data"]["recordId"]
    credit_info = resp.get("data", {}).get("credit", {})
    print(f"Record ID: {record_id}")
    if credit_info:
        print(f"Credits: {credit_info.get('previousFreeUsage', '?')} -> {credit_info.get('currentFreeUsage', '?')}")
    print("Waiting for generation...\n")

    # ─── Poll for results ───
    poll_interval = 5
    max_attempts = 60

    for attempt in range(1, max_attempts + 1):
        time.sleep(poll_interval)

        query_resp = api_request("GET", f"{API_BASE}/predict/query?recordId={record_id}", token)
        status = query_resp.get("data", {}).get("recordStatus", "UNKNOWN")

        if status == "SUCCEED":
            print("Background generation completed!\n")
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            results = query_resp["data"].get("results", [])

            # Fetch no-watermark URLs
            task_ids = [item["taskId"] for item in results if item.get("taskId")]
            print("Fetching no-watermark URLs...")
            nw_urls = get_no_watermark_urls(task_ids, token)

            output_dir = Path(args.output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)

            bg_files = []
            final_files = []

            for i, item in enumerate(results, 1):
                task_id = item.get("taskId")
                url = nw_urls.get(task_id) or item.get("imageUrl")
                if not url:
                    continue

                bg_filename = output_dir / f"banner_bg_{timestamp}_{i}.png"
                src = "no-watermark" if task_id in nw_urls else "watermarked"
                print(f"Downloading background ({src}): {bg_filename.name}")
                download_file(url, str(bg_filename))
                bg_files.append(bg_filename)

                # Composite if Pillow available
                if has_pillow and not args.no_composite:
                    final_filename = output_dir / f"banner_{timestamp}_{i}.png"
                    print(f"Compositing banner: {final_filename.name}")
                    try:
                        composite_banner(
                            str(bg_filename),
                            str(final_filename),
                            args.title,
                            args.subtitle,
                            resolved_color,
                            width=target_width,
                            height=target_height,
                        )
                        final_files.append(final_filename)
                    except Exception as e:
                        print(f"  Warning: Compositing failed: {e}", file=sys.stderr)
                        final_files.append(bg_filename)

            # Summary
            print(f"\n{'='*60}")
            print(f"  Generation Complete!")
            print(f"{'='*60}")
            print(f"  Background images: {len(bg_files)}")
            if final_files:
                print(f"  Composited banners: {len(final_files)}")
            print(f"  Output directory: {output_dir.resolve()}")
            print()

            # Open results
            files_to_open = final_files if final_files else bg_files
            for f in files_to_open:
                print(f"  -> {f.name}")
                open_file(str(f))

            return

        if status in ("FAILED", "REVIEW_FAILED", "TIMEOUT", "CANCELLED"):
            print(f"Generation {status}")
            for item in query_resp.get("data", {}).get("results", []):
                err = item.get("errorMsg")
                if err:
                    print(f"  Task {item.get('taskId')}: {err}")
            sys.exit(1)

        elapsed = attempt * poll_interval
        print(f"  Status: {status} ({elapsed}s elapsed)")

    print(f"Timeout: Generation took too long (>{max_attempts * poll_interval}s)")
    sys.exit(1)


if __name__ == "__main__":
    main()
