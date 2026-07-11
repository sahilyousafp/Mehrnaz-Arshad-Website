"""Fetch exhibition images from the shared Google Drive folder.

Runs as the first step of the build (see "prebuild" in package.json).
Downloads every project subfolder of the public Drive folder into
public/exhibitions/<project-slug>/ so the site can serve them. Images are
never committed to git; each Vercel build re-fetches them, which is how new
photos Mehrnaz drops into Drive reach the live site.

Skips the download when public/exhibitions already has content, so local
rebuilds stay fast. Set FORCE_FETCH=1 to re-download anyway.
"""

import os
import re
import shutil
import sys
from pathlib import Path

DRIVE_FOLDER_URL = (
    "https://drive.google.com/drive/folders/1HINqeqV_5ayFWX65cD7hS1cO6CnykXlQ"
)
REPO_ROOT = Path(__file__).resolve().parent.parent
DEST = REPO_ROOT / "public" / "exhibitions"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "untitled"


def main() -> None:
    # On Vercel always re-fetch - the deploy-hook rebuild exists precisely to
    # pick up new images. The skip is a local-development convenience only.
    on_vercel = bool(os.environ.get("VERCEL"))
    force = bool(os.environ.get("FORCE_FETCH"))
    if DEST.is_dir() and any(DEST.iterdir()) and not on_vercel and not force:
        print(f"{DEST} already populated - skipping download (set FORCE_FETCH=1 to refresh)")
        return

    try:
        import gdown
    except ImportError:
        sys.exit("gdown is not installed. Run: pip install gdown")

    tmp = REPO_ROOT / ".drive-download"
    if tmp.exists():
        shutil.rmtree(tmp)

    print(f"Downloading Drive folder into {tmp} ...")
    gdown.download_folder(url=DRIVE_FOLDER_URL, output=str(tmp), quiet=False)

    if DEST.exists():
        shutil.rmtree(DEST)
    DEST.mkdir(parents=True)

    # Each Drive subfolder is one project; files at the root (booklet pages)
    # are not part of any gallery and are left out of the site.
    projects = 0
    for entry in sorted(tmp.iterdir()):
        if not entry.is_dir():
            continue
        target = DEST / slugify(entry.name)
        target.mkdir()
        images = 0
        for file in sorted(entry.rglob("*")):
            if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS:
                shutil.copy2(file, target / file.name)
                images += 1
        print(f"  {entry.name} -> {target.relative_to(REPO_ROOT)} ({images} images)")
        projects += 1

    shutil.rmtree(tmp)

    if projects == 0:
        sys.exit("No project folders found in the Drive folder - aborting build.")
    print(f"Fetched {projects} project folders.")


if __name__ == "__main__":
    main()
