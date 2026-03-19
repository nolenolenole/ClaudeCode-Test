---
name: banner-gen
description: Generate high-quality marketing banners with smart prompt engineering, templates, and intelligent recommendations. Supports promotional campaigns, product launches, brand announcements, and holiday events. Uses a 3-layer compositing architecture (background + gradient overlay + text) for professional banner output.
version: 1.0.0
author: sir1st
requires:
  env:
    - WULI_API_TOKEN
primaryEnv: WULI_API_TOKEN
tags:
  - banner
  - marketing
  - design
  - ai
  - image-generation
  - promotion
triggers:
  - generate banner
  - create banner
  - banner design
  - marketing banner
  - promotional banner
  - 生成横幅
  - 生成banner
  - 营销banner
---

# Banner Generator - 营销横幅三层合成生成器

Generate professional marketing banners using a 3-layer compositing architecture:

1. **主体物背景层** - AI-generated background with 3D decorative elements (via Wuli.art)
2. **渐变色蒙层** - Programmatic gradient overlay for text readability
3. **文字层** - Title (钉钉进步体) + Subtitle (PingFang SC) rendered with Pillow

## Claude Execution Workflow（必须严格遵守）

每次用户请求生成 banner，Claude 必须按以下步骤执行，不得跳过：

**Step 1 — 语义研究（WebSearch）**
- 对标题中的品牌名、产品名用 WebSearch 搜索，了解其真实含义、产品品类和视觉特征
- 例如："可灵O3" → 搜索 "可灵AI 视频生成模型"，确认是视频生成工具 → 主体应为摄像机/胶片，而非大脑
- 若 WebSearch 不可用（报错/网络限制），基于已有知识推断产品品类，并告知用户

**Step 2 — 确定主体元素**
- 基于 Step 1 的研究结果，明确 3D 视觉主体（`--element` 参数）
- 不依赖 SEMANTIC_KEYWORDS 字典的字面匹配；字典是辅助，语义理解是主导
- 将确定的主体元素告知用户，征得认可后再执行

**Step 3 — 生成背景（Layer 1）**
- 运行 `skill.py`，通过 Wuli API 生成 AI 背景图
- **必须先用 `--no_composite` 单独预览背景**，给用户确认后再叠加文字
- **左侧文字区可见性检查**：banner 左侧约 60% 区域将叠加文字，背景该区域必须是**深色/暗色**，不能是浅色、白色或亮色渐变。若背景左侧偏浅，需在 element 描述中明确要求 "dark left side, keep left area deep dark for text overlay"，或重新生成

**Step 4 — 叠加文字（Layer 2 + 3）**
- 在背景上叠加渐变蒙层和文字，输出最终 banner
- 若用户对背景不满意，回到 Step 3 调整参数重新生成背景，不必重做 Step 1-2

## Setup

```bash
export WULI_API_TOKEN="wuli-your-token-here"
pip install Pillow  # Required for text compositing
```

## Quick Start

```bash
# Simple banner (large size, auto color)
python3 skill.py --title "会员积分功能上线" --subtitle "邀请好友福利叠加"

# Promotional banner (purple-pink theme)
python3 skill.py --title "双11大促" --subtitle "限时优惠立即抢购" --scene promotion --color purple-pink --style cute

# Tech product launch (small size, blue-purple theme)
python3 skill.py --title "Qwen Image 2.0上新" --subtitle "更准文字渲染，更强语义遵循" --size small --scene launch --style tech --color blue-purple
```

## Parameters

| Parameter | Default | Description |
|---|---|---|
| `--title` | *(required)* | Main title text |
| `--subtitle` | *(empty)* | Subtitle / CTA text (auto-appends ">" arrow) |
| `--size` | large | Banner size preset (see Sizes below) |
| `--scene` | general | Scene type (see below) |
| `--style` | modern | Visual style (see below) |
| `--color` | auto | Color theme (auto = smart recommendation) |
| `--element` | auto | 3D decorative element description |
| `--aspect_ratio` | *(from size)* | Custom aspect ratio override |
| `--model` | Seedream | AI model for background generation |
| `--resolution` | 2K | Resolution (2K or 4K) |
| `--n` | 4 | Number of variants (1-4) |
| `--negative_prompt` | — | Elements to exclude |
| `--optimize` | false | Enable AI prompt optimization |
| `--lang` | zh | Prompt language (zh or en) |
| `--no_composite` | false | Only generate backgrounds, skip text overlay |
| `--output_dir` | . | Output directory |

### Sizes (from Figma design specs)

| Size | Dimensions | @2x Render | Use Case |
|---|---|---|---|
| `large` | 480x100 | 960x200 | 首页主 banner、功能发布 |
| `small` | 300x100 | 600x200 | 品牌宣传、侧边位 |

### Scenes

| Scene | Description | Auto Color | Auto Elements |
|---|---|---|---|
| `promotion` | Promotional campaigns, sales | purple-pink/warm | Gift boxes, coins, confetti |
| `launch` | New product/feature launch | blue-purple/purple | Rockets, portals, devices |
| `brand` | Brand awareness | dark/warm | Abstract shapes, mascots |
| `holiday` | Holiday events | warm/purple-pink | Lanterns, balloons, streamers |
| `feature` | Feature updates | purple-dark/blue-purple | UI windows, tool icons |
| `general` | General purpose | purple/blue-purple | Geometric shapes, fluid |

### Styles

| Style | Description |
|---|---|
| `modern` | Clean minimalist, ample whitespace, premium feel |
| `tech` | Futuristic glow, digital elements, dark + bright accents |
| `cute` | 3D cartoon, rounded shapes, vibrant and playful |
| `luxury` | Gold accents, rich textures, elegant |
| `fresh` | Bright colors, natural elements, light and airy |
| `gradient` | Smooth color transitions, abstract, dreamy |

### Colors (from Figma design specs)

| Color | Theme | Text Color | Example |
|---|---|---|---|
| `auto` | Smart recommendation based on scene | — | — |
| `purple-dark` | Deep charcoal → dark violet | White | 无限画布上新 |
| `purple` | Brand violet (#6928FE) → soft lavender | White | Hailuo上线 |
| `purple-pink` | Violet → soft pink (light bg) | Dark | 会员积分功能 |
| `blue-purple` | Deep indigo → periwinkle | White | Qwen Image上新 |
| `warm` | Orange-red → pinkish white (light bg) | Dark | 呜哩AI暖色版 |
| `dark` | Pure black → deep purple | White | 呜哩AI暗色版 |

## Semantic Element Matching

When `--element` is not specified, the generator automatically analyzes the title and subtitle text to extract semantically relevant visual elements:

**Priority order:**
1. `--element` (user-specified) — highest priority
2. **Semantic extraction** from title+subtitle keywords — auto-matched
3. Scene preset fallback — lowest priority

> **⚠️ 语义遵循原则（Claude 执行规则）**
>
> 在生成 banner 前，**必须先用 WebSearch 搜索标题中的品牌/产品名**，了解其真实含义和视觉特征，再决定主体元素。
> 不能仅靠关键词字面含义匹配——例如"可灵O3模型"中的「模型」应匹配视频生成摄像机，而非大脑神经元。
> 若 WebSearch 不可用，应基于已有知识推断产品品类（视频/图像/语音/代码等），选择最贴切的视觉主体，而非使用通用 fallback。

**Examples:**
| Title/Subtitle contains | Auto-generated element |
|---|---|
| 龙虾 / lobster / claw | 3D cartoon lobster with claws |
| AI / 模型 | Glowing AI chip with neural particles |
| 可灵 / kling / 视频生成 | Cinema camera with lens flare & light particles |
| Skill / 插件 | Magic scroll with light particles |
| 积分 / 会员 | Golden coins / VIP crown |
| 生图 / 画布 | Magic picture frame / floating canvas |
| 春节 / 中秋 | Red lanterns / Moon with jade rabbit |

The system also injects a semantic context hint (e.g., "themed around '呜哩Skill + OpenClaw'") into the AI prompt to further guide background generation.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Layer 3: Text                                   │
│  ┌──────────────┐    Figma Layout Specs:         │
│  │ 主标题        │    - title:    top=27% left=7% │
│  │ 副标题 >      │    - subtitle: top=58% left=7% │
│  └──────────────┘    - font: 钉钉进步体 + PingFang │
├─────────────────────────────────────────────────┤
│  Layer 2: Gradient Overlay                       │
│  left (opaque) → right (transparent), 60% width  │
│  alpha: 180 (dark themes) / 120 (light themes)   │
├─────────────────────────────────────────────────┤
│  Layer 1: Background + Main Object (AI generated)│
│           [gradient bg]         [3D element]     │
│           ↑ semantic context from title/subtitle  │
└─────────────────────────────────────────────────┘
```

## Fonts

- **Title**: 钉钉进步体 (DingTalk-JinBuTi.ttf) — bundled in `fonts/`
- **Subtitle**: PingFang SC (macOS system font, with fallbacks to STHeiti/Hiragino)

## Output

Each run generates:
- `banner_bg_TIMESTAMP_N.png` — Raw AI backgrounds (N = 1-4)
- `banner_TIMESTAMP_N.png` — Final composited banners with text overlay

All files are auto-opened after generation.

## Examples

```bash
# 会员积分活动 banner (large, purple-pink, cute style)
python3 skill.py --title "会员积分功能上线" --subtitle "邀请好友福利叠加" \
  --scene promotion --style cute --color purple-pink

# 新功能发布 banner (large, dark theme)
python3 skill.py --title "无限画布上新" --subtitle "立即体验" \
  --scene feature --style tech --color purple-dark --element "glowing portal with light beams"

# 品牌宣传 banner (small size, dark theme)
python3 skill.py --title "呜哩AI，认识一下" --subtitle "关注官方小红书" \
  --size small --scene brand --style cute --color dark --element "cute yellow mascot on skateboard" --optimize

# 产品上新 (small, blue-purple)
python3 skill.py --title "Qwen Image 2.0上新" --subtitle "更准文字渲染，更强语意遵循" \
  --size small --scene launch --style gradient --color blue-purple

# 暖色风格品牌 banner
python3 skill.py --title "呜哩AI，认识一下" --subtitle "关注官方小红书" \
  --size small --scene brand --color warm

# 仅生成背景（不叠加文字）
python3 skill.py --title "placeholder" --scene general --no_composite --n 4
```

## Troubleshooting

- **"WULI_API_TOKEN not set"**: `export WULI_API_TOKEN="wuli-your-token"`. Get from [wuli.art](https://wuli.art) bottom-left -> API.
- **"Pillow not available"**: `pip install Pillow`. Without it, only background images are generated (no text overlay).
- **Font not found**: Title font is bundled. Subtitle uses PingFang SC (macOS) with fallback to STHeiti/Hiragino.
- **Text too large/small**: Font size auto-scales with banner height. Use `--aspect_ratio` to control proportions.
