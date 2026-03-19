#!/usr/bin/env python3
"""
Banner Video Skill - 动态 Banner 视频/GIF 生成器

流程:
  1. 用背景图 URL 调用 Wuli 图生视频 API (可灵 O1 / Seedance 1.5 Pro)
  2. 轮询完成后下载无水印视频
  3. Pillow 逐帧叠加渐变蒙层 + 文字 (钉钉进步体 + PingFang SC)
  4. 可选导出 GIF (ffmpeg 调色板两步法)

Usage:
  python3 skill.py --title "呜哩Skill登陆OpenClaw" --subtitle "3步搞定龙虾生图" \\
                   --image_url "https://..." --color warm

  python3 skill.py --title "..." --record_id "01kky5ay5xr67vt2rpaegpt7ak" --gif
"""

import argparse
import json
import os
import platform
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ─── Wuli API ────────────────────────────────────────────────────────────────

API_BASE = "https://platform.wuli.art/api/v1/platform"


def api_request(method, url, token, data=None):
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print(f"Error: HTTP {e.code} - {err}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Error: {e.reason}", file=sys.stderr)
        sys.exit(1)


def download_file(url, path):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as resp:
        Path(path).write_bytes(resp.read())


def open_file(path):
    system = platform.system()
    try:
        if system == "Darwin":
            subprocess.Popen(["open", str(path)])
        elif system == "Windows":
            os.startfile(str(path))
        elif system == "Linux":
            subprocess.Popen(["xdg-open", str(path)])
    except Exception:
        pass


# ─── ffmpeg discovery ────────────────────────────────────────────────────────

FFMPEG_CANDIDATES = [
    "ffmpeg",
    "/usr/local/bin/ffmpeg",
    "/opt/homebrew/bin/ffmpeg",
    "/Applications/Wondershare UniConverter.app/Contents/MacOS/ffmpeg",
    "/Applications/VideoFusion-macOS.app/Contents/Resources/ffmpeg",
]


def find_ffmpeg():
    for candidate in FFMPEG_CANDIDATES:
        try:
            result = subprocess.run(
                [candidate, "-version"],
                capture_output=True, timeout=5
            )
            if result.returncode == 0:
                return candidate
        except (FileNotFoundError, subprocess.TimeoutExpired):
            continue
    return None


# ─── Color palettes (from banner-gen) ────────────────────────────────────────

COLOR_PALETTES = {
    "purple-dark": {
        "gradient_start": (35, 36, 40),
        "gradient_end":   (75, 20, 148),
        "overlay_alpha":  180,
    },
    "purple": {
        "gradient_start": (105, 40, 254),
        "gradient_end":   (158, 109, 251),
        "overlay_alpha":  180,
    },
    "purple-pink": {
        "gradient_start": (130, 58, 255),
        "gradient_end":   (247, 159, 235),
        "overlay_alpha":  120,
    },
    "blue-purple": {
        "gradient_start": (69, 13, 196),
        "gradient_end":   (155, 175, 242),
        "overlay_alpha":  180,
    },
    "warm": {
        "gradient_start": (255, 108, 68),
        "gradient_end":   (249, 240, 255),
        "overlay_alpha":  120,
    },
    "dark": {
        "gradient_start": (2, 2, 2),
        "gradient_end":   (75, 20, 148),
        "overlay_alpha":  180,
    },
}

# ─── Font paths ───────────────────────────────────────────────────────────────

SKILL_DIR = Path(__file__).parent
TITLE_FONT_PATH = str(SKILL_DIR / "fonts" / "DingTalk-JinBuTi.ttf")
SUBTITLE_FONT_PATHS = [
    "/System/Library/AssetsV2/com_apple_MobileAsset_Font7/"
    "3419f2a427639ad8c8e139149a287865a90fa17e.asset/AssetData/PingFang.ttc",
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
]


def find_subtitle_font():
    for p in SUBTITLE_FONT_PATHS:
        if os.path.exists(p):
            return p
    return TITLE_FONT_PATH


# ─── Gradient overlay builder ─────────────────────────────────────────────────

def build_gradient(w, h, color):
    palette = COLOR_PALETTES.get(color, COLOR_PALETTES["warm"])
    gs = palette["gradient_start"]
    ge = palette["gradient_end"]
    alpha = palette["overlay_alpha"]
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    end_x = int(w * 0.6)
    for x in range(end_x):
        ratio = x / end_x
        a = int(alpha * (1 - ratio ** 1.5))
        r = int(gs[0] + (ge[0] - gs[0]) * ratio)
        g = int(gs[1] + (ge[1] - gs[1]) * ratio)
        b = int(gs[2] + (ge[2] - gs[2]) * ratio)
        draw.line([(x, 0), (x, h)], fill=(r, g, b, a))
    return overlay


# ─── Frame compositor ─────────────────────────────────────────────────────────

def make_compositor(w, h, title, subtitle, color,
                    title_size_ratio=0.10, subtitle_size_ratio=0.06,
                    margin_left_ratio=0.07):
    gradient = build_gradient(w, h, color)

    title_size    = max(int(h * title_size_ratio), 12)
    subtitle_size = max(int(h * subtitle_size_ratio), 8)
    title_font    = ImageFont.truetype(TITLE_FONT_PATH, title_size)
    subtitle_font = ImageFont.truetype(find_subtitle_font(), subtitle_size)

    margin_left  = int(w * margin_left_ratio)
    visual_gap   = max(8, int(h * 0.04))   # gap between title bottom and subtitle top
    block_height = title_size + visual_gap + subtitle_size
    title_top    = (h - block_height) // 2
    subtitle_top = title_top + title_size + visual_gap

    shadow_blur     = max(6, int(h * 0.04))
    shadow_offset_x = max(1, int(h * 0.01))
    shadow_offset_y = max(2, int(h * 0.015))

    display_subtitle = subtitle if subtitle.rstrip().endswith(">") else f"{subtitle} >" if subtitle else ""

    def composite(frame_img):
        frame = frame_img.convert("RGBA")
        frame = Image.alpha_composite(frame, gradient)

        shadow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow_layer)
        sd.text((margin_left + shadow_offset_x, title_top + shadow_offset_y),
                title, font=title_font, fill=(0, 0, 0, 70))
        if display_subtitle:
            sd.text((margin_left + shadow_offset_x, subtitle_top + shadow_offset_y),
                    display_subtitle, font=subtitle_font, fill=(0, 0, 0, 50))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=shadow_blur))
        frame = Image.alpha_composite(frame, shadow_layer)

        draw = ImageDraw.Draw(frame)
        draw.text((margin_left, title_top), title, font=title_font, fill=(255, 255, 255))
        if display_subtitle:
            draw.text((margin_left, subtitle_top), display_subtitle,
                      font=subtitle_font, fill=(255, 255, 255))
        return frame.convert("RGB")

    return composite


# ─── Video compositing pipeline ───────────────────────────────────────────────

def composite_video(ffmpeg, video_in, video_out, compositor, w, h, fps):
    decode_cmd = [ffmpeg, "-y", "-i", video_in,
                  "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    encode_cmd = [
        ffmpeg, "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{w}x{h}", "-r", str(fps), "-i", "pipe:0",
        "-i", video_in, "-map", "0:v", "-map", "1:a?",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-pix_fmt", "yuv420p",
        video_out,
    ]

    frame_bytes = w * h * 3
    decoder = subprocess.Popen(decode_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    encoder = subprocess.Popen(encode_cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    frame_count, t0 = 0, time.time()
    while True:
        raw = decoder.stdout.read(frame_bytes)
        if len(raw) < frame_bytes:
            break
        img = Image.frombytes("RGB", (w, h), raw)
        encoder.stdin.write(compositor(img).tobytes())
        frame_count += 1

    decoder.stdout.close(); decoder.wait()
    encoder.stdin.close(); encoder.wait()
    print(f"  Composited {frame_count} frames in {time.time()-t0:.1f}s")


# ─── GIF export ───────────────────────────────────────────────────────────────

def export_gif(ffmpeg, video_in, gif_out, fps=12,
               crop_top=0, crop_bottom=0, scale_w=-1):
    # Read video dimensions
    probe = subprocess.run(
        [ffmpeg, "-i", video_in],
        capture_output=True, text=True
    )
    w, h = 0, 0
    for line in probe.stderr.splitlines():
        if "Video:" in line:
            import re
            m = re.search(r"(\d{3,5})x(\d{3,5})", line)
            if m:
                w, h = int(m.group(1)), int(m.group(2))
                break

    crop_h = h - crop_top - crop_bottom
    crop_filter = f"crop={w}:{crop_h}:0:{crop_top}," if (crop_top or crop_bottom) else ""
    scale = f"scale={scale_w}:-1:flags=lanczos" if scale_w > 0 else f"scale={w}:-1:flags=lanczos"

    vf_palette = f"{crop_filter}fps={fps},{scale},palettegen=max_colors=256"
    palette_path = "/tmp/_banner_palette.png"

    subprocess.run(
        [ffmpeg, "-y", "-i", video_in, "-vf", vf_palette, palette_path],
        capture_output=True
    )

    vf_gif = f"{crop_filter}fps={fps},{scale}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3"
    subprocess.run(
        [ffmpeg, "-y", "-i", video_in, "-i", palette_path,
         "-filter_complex", vf_gif, gif_out],
        capture_output=True
    )


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Banner Video Skill - 动态 Banner 生成器")
    parser.add_argument("--title",     required=True, help="主标题文字")
    parser.add_argument("--subtitle",  default="",    help="副标题文字")
    parser.add_argument("--image_url", default="",    help="背景图 CDN URL")
    parser.add_argument("--record_id", default="",    help="banner-gen 生成记录 ID（自动取第1张图URL）")
    parser.add_argument("--color",     default="warm",
                        choices=list(COLOR_PALETTES.keys()),
                        help="渐变配色方案")
    parser.add_argument("--model",     default="可灵 O1",
                        help="视频生成模型 (可灵 O1 / Seedance 1.5 Pro)")
    parser.add_argument("--prompt",    default="",
                        help="视频动画描述 prompt（留空使用默认光效流动描述）")
    parser.add_argument("--duration",  type=int, default=5, help="视频时长（秒）")
    parser.add_argument("--gif",       action="store_true", help="同时导出 GIF")
    parser.add_argument("--gif_fps",   type=int, default=12, help="GIF 帧率")
    parser.add_argument("--crop_top",    type=int, default=0, help="GIF 上裁切像素")
    parser.add_argument("--crop_bottom", type=int, default=0, help="GIF 下裁切像素")
    parser.add_argument("--output_dir", default=".", help="输出目录")
    args = parser.parse_args()

    # ── Token ──
    token = os.environ.get("WULI_API_TOKEN")
    if not token:
        print("Error: WULI_API_TOKEN not set\n"
              "  export WULI_API_TOKEN=\"wuli-your-token\"", file=sys.stderr)
        sys.exit(1)

    # ── ffmpeg ──
    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        print("Error: ffmpeg not found. Install ffmpeg or ensure it's in PATH.", file=sys.stderr)
        sys.exit(1)
    print(f"  ffmpeg: {ffmpeg}")

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = time.strftime("%Y%m%d_%H%M%S")

    # ── Resolve image URL ──
    image_url = args.image_url
    if not image_url and args.record_id:
        print(f"Fetching image URL from record {args.record_id}...")
        resp = api_request("GET",
            f"{API_BASE}/predict/query?recordId={args.record_id}", token)
        results = resp.get("data", {}).get("results", [])
        if not results:
            print("Error: no results found for record_id", file=sys.stderr)
            sys.exit(1)
        # Try no-watermark first
        task_id = results[0].get("taskId")
        nw = api_request("POST", f"{API_BASE}/predict/noWatermarkImage", token,
                         data={"taskId": task_id})
        image_url = (nw.get("data", {}).get("url")
                     or results[0].get("imageUrl", ""))

    if not image_url:
        print("Error: --image_url or --record_id is required", file=sys.stderr)
        sys.exit(1)

    print(f"  Image URL: {image_url[:80]}...")

    # ── Default video prompt ──
    prompt = args.prompt or (
        "画面中的金色光晕和粒子光效缓缓流动，像流水一样自然涌动，"
        "整体光效有流动感和呼吸感，主体角色保持静止，背景渐变不变"
    )

    # ── Submit video generation ──
    print(f"\n{'='*55}")
    print(f"  Banner Video Generator")
    print(f"{'='*55}")
    print(f"  Title:    {args.title}")
    if args.subtitle:
        print(f"  Subtitle: {args.subtitle}")
    print(f"  Color:    {args.color}")
    print(f"  Model:    {args.model}")
    print(f"  Duration: {args.duration}s")
    print(f"{'='*55}\n")

    body = {
        "modelName":      args.model,
        "mediaType":      "VIDEO",
        "predictType":    "FF_2_VIDEO",
        "prompt":         prompt,
        "aspectRatio":    "16:9",
        "resolution":     "720P",
        "videoTotalSeconds": args.duration,
        "n":              1,
        "optimizePrompt": False,
        "inputImageList": [{"imageUrl": image_url, "width": 1920, "height": 1080}],
        "inputVideoList": [],
    }
    resp = api_request("POST", f"{API_BASE}/predict/submit", token, data=body)
    if not resp.get("success"):
        print(f"Error: {json.dumps(resp, ensure_ascii=False)}", file=sys.stderr)
        sys.exit(1)

    record_id = resp["data"]["recordId"]
    print(f"Submitted. Record ID: {record_id}")
    print("Waiting for video generation...\n")

    # ── Poll ──
    for attempt in range(1, 120):
        time.sleep(10)
        q = api_request("GET",
            f"{API_BASE}/predict/query?recordId={record_id}", token)
        status = q.get("data", {}).get("recordStatus", "UNKNOWN")
        print(f"  [{attempt*10}s] {status}")

        if status == "SUCCEED":
            results = q["data"].get("results", [])
            task_id = results[0].get("taskId")

            # No-watermark URL
            nw = api_request("POST", f"{API_BASE}/predict/noWatermarkImage", token,
                             data={"taskId": task_id})
            video_url = (nw.get("data", {}).get("url")
                         or results[0].get("imageUrl", ""))

            raw_video = output_dir / f"banner_video_raw_{timestamp}.mp4"
            print(f"\nDownloading no-watermark video...")
            download_file(video_url, str(raw_video))
            print(f"  -> {raw_video.name}")
            break

        if status in ("FAILED", "REVIEW_FAILED", "TIMEOUT", "CANCELLED"):
            print(f"Generation {status}", file=sys.stderr)
            sys.exit(1)
    else:
        print("Timeout", file=sys.stderr)
        sys.exit(1)

    # ── Get video dimensions ──
    probe = subprocess.run([ffmpeg, "-i", str(raw_video)],
                           capture_output=True, text=True)
    import re
    vw, vh, vfps = 1280, 720, 24
    for line in probe.stderr.splitlines():
        if "Video:" in line:
            m = re.search(r"(\d{3,5})x(\d{3,5})", line)
            if m:
                vw, vh = int(m.group(1)), int(m.group(2))
            m2 = re.search(r"(\d+)\s+fps", line)
            if m2:
                vfps = int(m2.group(1))
    print(f"\nVideo: {vw}x{vh} @ {vfps}fps")

    # ── Text compositing ──
    compositor = make_compositor(vw, vh, args.title, args.subtitle, args.color)
    final_video = output_dir / f"banner_video_{timestamp}.mp4"
    print(f"Compositing text overlay...")
    composite_video(ffmpeg, str(raw_video), str(final_video), compositor, vw, vh, vfps)
    print(f"  -> {final_video.name}")
    open_file(final_video)

    # ── GIF export ──
    if args.gif:
        gif_out = output_dir / f"banner_{timestamp}.gif"
        print(f"\nExporting GIF (fps={args.gif_fps}, "
              f"crop_top={args.crop_top}, crop_bottom={args.crop_bottom})...")
        export_gif(ffmpeg, str(final_video), str(gif_out),
                   fps=args.gif_fps,
                   crop_top=args.crop_top, crop_bottom=args.crop_bottom)
        size_mb = gif_out.stat().st_size / 1024 / 1024
        print(f"  -> {gif_out.name}  ({size_mb:.1f}MB)")
        open_file(gif_out)

    print(f"\n{'='*55}")
    print(f"  Done!")
    print(f"{'='*55}")
    print(f"  Video: {final_video}")
    if args.gif:
        print(f"  GIF:   {output_dir / f'banner_{timestamp}.gif'}")


if __name__ == "__main__":
    main()
