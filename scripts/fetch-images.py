"""Fetch exhibition images and event logos from the shared Google Drive folders.

Runs as the first step of the build (see "prebuild" in package.json).
Downloads every project subfolder of the public Drive folder into
public/exhibitions/<project-slug>/, and the flat EVENTS logo folder into
public/logos/, so the site can serve them. Images are never committed to
git; each Vercel build re-fetches them, which is how new photos Mehrnaz
drops into Drive reach the live site.

Skips a download when its destination already has content, so local
rebuilds stay fast. Set FORCE_FETCH=1 to re-download anyway.
"""

import json
import os
import re
import shutil
import sys
from pathlib import Path

DRIVE_FOLDER_URL = (
    "https://drive.google.com/drive/folders/1HINqeqV_5ayFWX65cD7hS1cO6CnykXlQ"
)
LOGOS_FOLDER_URL = (
    "https://drive.google.com/drive/folders/1vWglt_m4UwV78d61co0-xOW-G91v8H92"
)
REPO_ROOT = Path(__file__).resolve().parent.parent
DEST = REPO_ROOT / "public" / "exhibitions"
LOGOS_DEST = REPO_ROOT / "public" / "logos"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "untitled"


def should_fetch(dest: Path) -> bool:
    # On Vercel always re-fetch - the deploy-hook rebuild exists precisely to
    # pick up new images. The skip is a local-development convenience only.
    if os.environ.get("VERCEL") or os.environ.get("FORCE_FETCH"):
        return True
    if dest.is_dir() and any(dest.iterdir()):
        print(f"{dest} already populated - skipping download (set FORCE_FETCH=1 to refresh)")
        return False
    return True


def download_folder(url: str, tmp: Path) -> None:
    try:
        import gdown
    except ImportError:
        sys.exit("gdown is not installed. Run: pip install gdown")

    if tmp.exists():
        shutil.rmtree(tmp)
    print(f"Downloading Drive folder into {tmp} ...")
    gdown.download_folder(url=url, output=str(tmp), quiet=False)


def fetch_exhibitions() -> None:
    tmp = REPO_ROOT / ".drive-download"
    download_folder(DRIVE_FOLDER_URL, tmp)

    if DEST.exists():
        shutil.rmtree(DEST)
    DEST.mkdir(parents=True)

    # Each Drive subfolder is one project; files at the root (booklet pages)
    # are not part of any gallery and are left out of the site.
    projects = 0
    names: dict[str, str] = {}
    for entry in sorted(tmp.iterdir()):
        if not entry.is_dir():
            continue
        slug = slugify(entry.name)
        target = DEST / slug
        target.mkdir()
        images = 0
        for file in sorted(entry.rglob("*")):
            if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS:
                shutil.copy2(file, target / file.name)
                images += 1
        print(f"  {entry.name} -> {target.relative_to(REPO_ROOT)} ({images} images)")
        names[slug] = entry.name
        projects += 1

    shutil.rmtree(tmp)

    if projects == 0:
        sys.exit("No project folders found in the Drive folder - aborting build.")

    # Raw folder names, keyed by slug, so lib/content.ts can synthesize a
    # project entry (via the "Client - Event - Location - Year - Partner"
    # naming convention) for folders not yet curated in content/projects.ts.
    names_file = REPO_ROOT / "content" / "drive-folders.json"
    names_file.write_text(json.dumps(names, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Fetched {projects} project folders.")


def fetch_logos() -> None:
    tmp = REPO_ROOT / ".drive-download-logos"
    download_folder(LOGOS_FOLDER_URL, tmp)

    if LOGOS_DEST.exists():
        shutil.rmtree(LOGOS_DEST)
    LOGOS_DEST.mkdir(parents=True)

    # The EVENTS folder is flat: every image is one event/venue logo.
    logos = 0
    for file in sorted(tmp.rglob("*")):
        if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS:
            shutil.copy2(file, LOGOS_DEST / file.name)
            logos += 1

    shutil.rmtree(tmp)

    if logos == 0:
        sys.exit("No logos found in the Drive EVENTS folder - aborting build.")
    print(f"Fetched {logos} event logos into {LOGOS_DEST.relative_to(REPO_ROOT)}.")


def main() -> None:
    if should_fetch(DEST):
        fetch_exhibitions()
    if should_fetch(LOGOS_DEST):
        fetch_logos()


if __name__ == "__main__":
    main()
