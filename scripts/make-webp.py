"""Make 800 px and 1600 px WebP copies of every JPG the site uses
(any "/assets/....jpg" path in src/app/images.ts or content.ts). Skips ones already made.
Run after adding photos:  python3 scripts/make-webp.py"""
import pathlib, re
from PIL import Image
site = pathlib.Path(__file__).resolve().parent.parent
paths = set()
for f in ("src/app/images.ts", "src/app/content.ts"):
    paths |= set(re.findall(r'"(/assets/[^"]+\.jpe?g)"', (site / f).read_text()))
made = 0
for p in sorted(paths):
    jpg = site / "public" / p.lstrip("/")
    if not jpg.exists():
        print("missing", p); continue
    for w in (800, 1600):
        out = jpg.with_name(f"{jpg.stem}-{w}.webp")
        if out.exists() and out.stat().st_mtime >= jpg.stat().st_mtime:
            continue
        im = Image.open(jpg).convert("RGB")
        if im.width > w:
            im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(out, "WEBP", quality=78, method=6)
        made += 1
print(f"{len(paths)} photos, {made} WebP files written")
