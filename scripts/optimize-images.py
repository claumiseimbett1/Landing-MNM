"""Optimize images for web: resize and convert to WebP."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# max width per category
SIZES = {
    "galeria": 800,
    "profesor": 400,
    "nadador": 480,
    "logo": 200,
    "nadador-destacado": 480,
}

def get_max_width(filename: str) -> int:
    name = filename.lower()
    if name.startswith("galeria"):
        return SIZES["galeria"]
    if name.startswith("profesor"):
        return SIZES["profesor"]
    if "nadador-trimestre" in name:
        return SIZES["nadador"]
    if "nadador-destacado" in name:
        return SIZES["nadador-destacado"]
    if name in ("mnm.png", "mnmkids.png", "logo-amarillo.png"):
        return SIZES["logo"]
    return 1200

def optimize_image(src: Path) -> tuple[int, int]:
    max_w = get_max_width(src.name)
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")

    w, h = img.size
    if w > max_w:
        ratio = max_w / w
        img = img.resize((max_w, int(h * ratio)), Image.LANCZOS)

    webp_path = src.with_suffix(".webp")
    save_kwargs = {"quality": 82, "method": 6}
    if img.mode == "RGBA":
        save_kwargs["lossless"] = False
    img.save(webp_path, "WEBP", **save_kwargs)

    orig_size = src.stat().st_size
    new_size = webp_path.stat().st_size
    return orig_size, new_size

def main():
    folders = [ROOT / "img", ROOT / "logo"]
    total_saved = 0
    for folder in folders:
        for ext in ("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG"):
            for path in folder.glob(ext):
                if path.suffix.lower() == ".webp":
                    continue
                try:
                    orig, new = optimize_image(path)
                    saved = orig - new
                    total_saved += saved
                    print(f"{path.name}: {orig//1024}KB -> {new//1024}KB (saved {saved//1024}KB)")
                except Exception as e:
                    print(f"ERROR {path}: {e}")

    # Hero poster from first frame alternative: use a compressed jpg poster
    poster_dir = ROOT / "video"
    poster_dir.mkdir(exist_ok=True)
    hero_img = ROOT / "img" / "galeria6.jpg"
    if hero_img.exists():
        img = Image.open(hero_img)
        img = img.convert("RGB")
        w, h = img.size
        if w > 1280:
            ratio = 1280 / w
            img = img.resize((1280, int(h * ratio)), Image.LANCZOS)
        poster = poster_dir / "hero-poster.webp"
        img.save(poster, "WEBP", quality=75, method=6)
        print(f"hero-poster.webp: {poster.stat().st_size // 1024}KB")

    print(f"\nTotal saved: {total_saved // 1024}KB")

if __name__ == "__main__":
    main()
