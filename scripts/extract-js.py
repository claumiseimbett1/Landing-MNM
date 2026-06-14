from pathlib import Path

html_path = Path(__file__).resolve().parent.parent / "index.html"
html = html_path.read_text(encoding="utf-8")
marker_start = '    <script>\n        // Funcionalidad del men'
marker_end = '    </script>\n</body>'
start = html.find(marker_start)
end = html.find(marker_end)
if start == -1 or end == -1:
    raise SystemExit(f"markers not found start={start} end={end}")

script = html[start + len("    <script>\n") : end]
js_path = html_path.parent / "js" / "app.js"
js_path.parent.mkdir(exist_ok=True)
js_path.write_text(script, encoding="utf-8")

replacement = '    <script src="/js/app.js" defer></script>\n'
new_html = html[:start] + replacement + html[end + len("    </script>\n") :]
html_path.write_text(new_html, encoding="utf-8")
print(f"Wrote {js_path} ({js_path.stat().st_size} bytes)")
