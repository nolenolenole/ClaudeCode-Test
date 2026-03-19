# Banner Video Skill - 动态 Banner 视频/GIF 生成器

从背景图生成带文字的动态 Banner 视频，一键输出 MP4 或 GIF。

## 架构

```
背景图 URL
   ↓
[Wuli API] 图生视频 (可灵 O1 / Seedance 1.5 Pro)
   ↓
无水印 MP4 下载
   ↓
[Pillow 逐帧] 渐变蒙层 + 钉钉进步体主标题 + PingFang 副标题
   ↓
最终 MP4  →  (可选) GIF 导出 (ffmpeg 调色板两步法)
```

## Setup

```bash
export WULI_API_TOKEN="wuli-your-token"
pip install Pillow
# ffmpeg: 系统自带或 brew install ffmpeg
```

## Quick Start

```bash
# 用背景图 URL 生成视频
python3 skill.py \
  --title "呜哩Skill登陆OpenClaw" \
  --subtitle "3步搞定龙虾生图" \
  --image_url "https://wuli-ai.oss-cn-zhangjiakou.aliyuncs.com/image/xxx.jpeg" \
  --color warm

# 用 banner-gen 的 record_id 自动获取背景图
python3 skill.py \
  --title "呜哩Skill登陆OpenClaw" \
  --subtitle "3步搞定龙虾生图" \
  --record_id "01kky5ay5xr67vt2rpaegpt7ak" \
  --color warm

# 同时导出 GIF，裁切上下各 100px
python3 skill.py \
  --title "呜哩Skill登陆OpenClaw" \
  --subtitle "3步搞定龙虾生图" \
  --image_url "https://..." \
  --color warm \
  --gif --crop_top 120 --crop_bottom 80
```

## Parameters

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--title` | *(必填)* | 主标题文字 |
| `--subtitle` | 空 | 副标题文字（自动追加 `>`） |
| `--image_url` | — | 背景图 CDN URL（与 record_id 二选一）|
| `--record_id` | — | banner-gen 生成的 recordId，自动获取无水印图 URL |
| `--color` | warm | 渐变配色：`warm` `purple` `purple-dark` `purple-pink` `blue-purple` `dark` |
| `--model` | 可灵 O1 | 视频模型：`可灵 O1` / `Seedance 1.5 Pro` |
| `--prompt` | 光效流动描述 | 自定义视频动画描述 |
| `--duration` | 5 | 视频时长（秒） |
| `--gif` | false | 同时导出 GIF |
| `--gif_fps` | 12 | GIF 帧率 |
| `--crop_top` | 0 | GIF 上裁切像素 |
| `--crop_bottom` | 0 | GIF 下裁切像素 |
| `--output_dir` | `.` | 输出目录 |

## Output

| 文件 | 说明 |
|------|------|
| `banner_video_raw_TIMESTAMP.mp4` | 无水印原始视频（无文字） |
| `banner_video_TIMESTAMP.mp4` | 文字叠加后的最终视频 |
| `banner_TIMESTAMP.gif` | GIF（`--gif` 时生成） |

## 与 banner-gen 配合使用

```bash
# 步骤 1：用 banner-gen 生成背景图，记录 record_id
cd ../banner-gen
python3 skill.py --title "..." --subtitle "..." --no_composite

# 步骤 2：用 banner-video 生成动态版本
cd ../banner-video
python3 skill.py \
  --title "..." --subtitle "..." \
  --record_id "<banner-gen 输出的 record_id>" \
  --color warm --gif
```

## Colors

| Color | 渐变 | 适用场景 |
|-------|------|----------|
| `warm` | 橙红 → 浅粉白 | 龙虾、红色主体、活动 |
| `purple` | 品牌紫 → 浅紫 | 通用、科技 |
| `purple-dark` | 深灰黑 → 深紫 | 高端、暗色 |
| `purple-pink` | 紫 → 粉 | 活动、促销 |
| `blue-purple` | 深蓝紫 → 浅蓝 | AI、科技 |
| `dark` | 纯黑 → 深紫 | 暗黑风格 |

## Troubleshooting

- **`WULI_API_TOKEN not set`**: `export WULI_API_TOKEN="wuli-..."`
- **`ffmpeg not found`**: `brew install ffmpeg` 或确认路径正确
- **`Pillow not installed`**: `pip install Pillow`
- **视频生成失败**: 检查 `--image_url` 是否可访问（URL 有有效期）
