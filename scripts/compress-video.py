"""Compress hero videos for web deployment."""
from pathlib import Path
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
VIDEO_DIR = ROOT / "video"
INPUT = VIDEO_DIR / "natacion-banner-original.mp4"
if not INPUT.exists():
    INPUT = VIDEO_DIR / "natacion-banner.mp4"

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

PRESETS = {
    "natacion-banner-compressed.mp4": ["-vf", "scale=1280:-2,fps=30", "-crf", "28"],
    "natacion-banner-mobile.mp4": ["-vf", "scale=854:-2,fps=24", "-crf", "30"],
}

def compress(name: str, extra_args: list[str]) -> None:
    import subprocess
    out = VIDEO_DIR / name
    cmd = [
        FFMPEG, "-y", "-i", str(INPUT), "-an",
        *extra_args,
        "-c:v", "libx264", "-preset", "medium",
        "-movflags", "+faststart", "-pix_fmt", "yuv420p",
        str(out),
    ]
    subprocess.run(cmd, check=True)
    size_kb = out.stat().st_size // 1024
    print(f"{name}: {size_kb} KB")

def main():
    if not INPUT.exists():
        raise SystemExit(f"No se encontró video de entrada en {VIDEO_DIR}")
    for name, args in PRESETS.items():
        compress(name, args)
    print("Listo. Copia natacion-banner-compressed.mp4 a natacion-banner.mp4 para producción.")

if __name__ == "__main__":
    main()
