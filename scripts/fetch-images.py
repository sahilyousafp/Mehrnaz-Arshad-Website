"""Fetch exhibition images and event logos from the shared Google Drive folders.

Runs as the first step of the build (see "prebuild" in package.json).
Downloads the public Drive folder - laid out as
<Year>/<Event>/<Client>/<Location>_<Partner>/*.ext - into
public/exhibitions/<client-slug>/ (one project per client folder, images
flattened), and the flat EVENTS logo folder into public/logos/, so the site
can serve them. Also downloads one pinned single-file image (Mehrnaz's fixed
choice for the hero and footer/contact backgrounds) into
public/pinned/hero-contact.jpg. Images are never committed to git; each
Vercel build re-fetches them, which is how new photos Mehrnaz drops into
Drive reach the live site.

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
# Fixed image Mehrnaz wants used for both the hero and the footer/contact
# background, regardless of which projects are currently synced.
PINNED_IMAGE_FILE_ID = "1_w_tHs4aL3_8y5il1m9IBRCk7o0GWv--"
REPO_ROOT = Path(__file__).resolve().parent.parent
DEST = REPO_ROOT / "public" / "exhibitions"
LOGOS_DEST = REPO_ROOT / "public" / "logos"
PINNED_DEST = REPO_ROOT / "public" / "pinned" / "hero-contact.jpg"
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


def should_fetch_file(dest: Path) -> bool:
    if os.environ.get("VERCEL") or os.environ.get("FORCE_FETCH"):
        return True
    if dest.is_file() and dest.stat().st_size > 0:
        print(f"{dest} already present - skipping download (set FORCE_FETCH=1 to refresh)")
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


def parse_location_partner(client_dir: Path) -> tuple[str | None, str | None]:
    """The single expected subfolder of a client folder is named
    "<Location>_<Partner>" (the partner's base city, not necessarily the show
    venue - e.g. "Madrid_Standecor" for a Nantes show built by a Madrid-based
    partner). Ambiguous (zero or several) subfolders yield unknown fields
    rather than guessing."""
    subdirs = [d for d in client_dir.iterdir() if d.is_dir()]
    if len(subdirs) != 1:
        return None, None
    location, _, partner = subdirs[0].name.partition("_")
    return location.strip() or None, partner.strip() or None


def fetch_exhibitions() -> None:
    tmp = REPO_ROOT / ".drive-download"
    download_folder(DRIVE_FOLDER_URL, tmp)

    if DEST.exists():
        shutil.rmtree(DEST)
    DEST.mkdir(parents=True)

    # Drive layout: <Year>/<Event>/<Client>/<Location>_<Partner>/*.ext. One
    # project per client folder (images from any deeper nesting flattened
    # into it); stray files directly under the root, a year folder, or an
    # event folder (booklet pages, notes) are not part of any gallery and
    # are left out of the site.
    projects = 0
    used_slugs: set[str] = set()
    folders: dict[str, dict] = {}
    for year_dir in sorted(tmp.iterdir()):
        if not year_dir.is_dir():
            continue
        year = int(year_dir.name) if year_dir.name.isdigit() else None
        for event_dir in sorted(year_dir.iterdir()):
            if not event_dir.is_dir():
                continue
            event = event_dir.name
            for client_dir in sorted(event_dir.iterdir()):
                if not client_dir.is_dir():
                    continue
                client = client_dir.name
                image_files = [
                    f for f in sorted(client_dir.rglob("*"))
                    if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
                ]
                if not image_files:
                    continue

                base_slug = slugify(client)
                slug = base_slug
                n = 2
                while slug in used_slugs:
                    slug = f"{base_slug}-{n}"
                    n += 1
                used_slugs.add(slug)

                target = DEST / slug
                target.mkdir()
                for file in image_files:
                    shutil.copy2(file, target / file.name)

                location, partner = parse_location_partner(client_dir)
                print(
                    f"  {year_dir.name}/{event}/{client} -> "
                    f"{target.relative_to(REPO_ROOT)} ({len(image_files)} images)"
                )
                folders[slug] = {
                    "year": year,
                    "event": event,
                    "client": client,
                    "location": location,
                    "partner": partner,
                }
                projects += 1

    shutil.rmtree(tmp)

    if projects == 0:
        sys.exit("No project folders found in the Drive folder - aborting build.")

    # Structured metadata per slug, so lib/content.ts can synthesize a
    # project entry for client folders not yet curated in
    # content/projects.ts. An entry added there always takes precedence.
    folders_file = REPO_ROOT / "content" / "drive-folders.json"
    folders_file.write_text(json.dumps(folders, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

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


def fetch_pinned_image() -> None:
    try:
        import gdown
    except ImportError:
        sys.exit("gdown is not installed. Run: pip install gdown")

    PINNED_DEST.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading pinned image into {PINNED_DEST} ...")
    gdown.download(id=PINNED_IMAGE_FILE_ID, output=str(PINNED_DEST), quiet=False)


def main() -> None:
    if should_fetch(DEST):
        fetch_exhibitions()
    if should_fetch(LOGOS_DEST):
        fetch_logos()
    if should_fetch_file(PINNED_DEST):
        fetch_pinned_image()


if __name__ == "__main__":
    main()
