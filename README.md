# Mehrnaz-Arshad-Website

Portfolio website for Mehrnaz Arshad, exhibition stand designer. Next.js (App Router), deployed on Vercel; exhibition images are synced automatically from a shared Google Drive folder - they are never committed to git.

## Running locally

Requires Node 20+ and Python 3 (for the Drive fetch).

```bash
npm install
pip install gdown
npm run fetch-images   # downloads images from Drive into public/exhibitions/ and public/logos/
npm run manifest       # records image dimensions in content/manifest.json and content/logos.json
npm run dev            # http://localhost:3000
```

`npm run build` runs the fetch + manifest steps automatically (they skip the download if images are already present; set `FORCE_FETCH=1` to refresh).

## How content works

- **Images** live in the shared Google Drive folder, one subfolder per project (`FITUR/2026_Standecor/...`). The build downloads them; nothing is committed.
- **The card/hero image** for a project is whichever image has `_key` in its filename (e.g. `ITALIA_key.jpg`) - no code change needed. A `hero` filename set in `content/projects.ts` overrides it; if neither is present, the first image is used.
- **Project text** (client, event, location, partner) normally lives in [`content/projects.ts`](content/projects.ts) - `slug` must match the slugified Drive folder name. Projects whose Drive folder has no images yet stay hidden automatically.
- **New Drive folders with no entry in `content/projects.ts` still appear on the site automatically.** The build parses the raw folder name against the convention `Year - Event - Client - Location - Partner` (e.g. `2026 - FITUR - CAF - Madrid, Spain - Standecor`) and fills in those fields. A folder name that doesn't match the convention still appears, just with the folder name as its only title until it's either renamed to match the convention or given a proper entry in `content/projects.ts` (which always takes priority).
- **Event logos** for the home-page logo wall live in the shared Drive `EVENTS` folder and are synced into `public/logos/` the same way. [`content/events.ts`](content/events.ts) maps each filename to a display name (and flags light-on-dark logos for inversion); logos not yet in Drive are skipped automatically.
- **Contact details and the partner map** live in [`content/site.ts`](content/site.ts) (the email/LinkedIn placeholders there still need real values).

## Deployment

1. Import the GitHub repo into Vercel (framework: Next.js). `vercel.json` makes the build install `gdown` and fetch the Drive images first.
2. In Vercel: Settings → Git → Deploy Hooks → create a hook for `main` and copy its URL.
3. In GitHub: Settings → Secrets and variables → Actions → new secret `VERCEL_DEPLOY_HOOK_URL` with that URL.
4. The scheduled workflow [`.github/workflows/sync-images.yml`](.github/workflows/sync-images.yml) then rebuilds the site daily (and on demand via the Actions tab), so new photos dropped into Drive appear automatically.

The full walkthrough - with troubleshooting - is doc 07 of the course below.

## Learning: GitHub Actions

A seven-part hands-on course on GitHub Actions, written around this project's real automation (the scheduled Drive-to-Vercel image sync), lives in [`docs/github-actions/`](docs/github-actions/00-index.md). Start at the index and read in order.
