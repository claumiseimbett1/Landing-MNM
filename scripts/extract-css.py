from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
html_path = ROOT / "index.html"
html = html_path.read_text(encoding="utf-8")

match = re.search(r"<style>\s*(.*?)\s*</style>", html, re.DOTALL)
if not match:
    raise SystemExit("No <style> block found")

css = match.group(1).strip()
css_dir = ROOT / "css"
css_dir.mkdir(exist_ok=True)
(css_dir / "styles.css").write_text(css, encoding="utf-8")

minified = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
minified = re.sub(r"\s+", " ", minified)
minified = re.sub(r"\s*([{}:;,>+~])\s*", r"\1", minified).strip()
(css_dir / "styles.min.css").write_text(minified, encoding="utf-8")

link = (
    '    <link rel="preload" href="/css/styles.min.css" as="style">\n'
    '    <link rel="stylesheet" href="/css/styles.min.css">'
)
new_html, count = re.subn(r"    <style>.*?</style>", link, html, count=1, flags=re.DOTALL)
if count != 1:
    raise SystemExit(f"Replacement failed: {count}")

html_path.write_text(new_html, encoding="utf-8")
print(f"CSS: {len(css)} -> {len(minified)} bytes")
print(f"HTML: {len(html)} -> {len(new_html)} bytes")
