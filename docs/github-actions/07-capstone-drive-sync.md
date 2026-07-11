# 7. Capstone: the Drive image sync pipeline

Everything from docs 1-6, assembled into this project's real pipeline. The goal, restated:

> Mehrnaz's exhibition photos live in a public Google Drive folder. When she adds or replaces images there, the live site should update by itself - no commits, no manual deploys.

## The design

- **Vercel** hosts the site and rebuilds it whenever its Deploy Hook is called (doc 6).
- **The build command** (a script Vercel runs on every deploy) downloads the current contents of the Drive folder and optimizes the images into the site's output. So *every* deploy - push, hook, or dashboard button - ships whatever is in Drive at that moment.
- **A GitHub Actions workflow** with a daily `schedule` and a manual `workflow_dispatch` button (doc 3) POSTs to the Deploy Hook, whose URL lives in a repository secret (doc 4).

The workflow never touches images and never commits anything. The repo stays code-only.

## Part A: the image-fetch script (runs on Vercel)

The public Drive folder is `1HINqeqV_5ayFWX65cD7hS1cO6CnykXlQ`. Because it's shared as "anyone with the link", the `gdown` tool can download it without any Google credentials:

```bash
pip install gdown
gdown --folder "https://drive.google.com/drive/folders/1HINqeqV_5ayFWX65cD7hS1cO6CnykXlQ" -O assets/projects
```

The real script for this site (`scripts/fetch_images.py`, built in the website task) wraps that and then optimizes: resizes to web sizes, converts to WebP, and writes a `manifest.json` the site's JavaScript reads. For this doc, what matters is only *where it runs*: it is the project's **build command**, configured in `vercel.json` at the repo root:

```json
{
  "buildCommand": "pip install gdown pillow && python scripts/fetch_images.py",
  "outputDirectory": "."
}
```

One caveat to know about `gdown` and public folders: Google throttles anonymous downloads. If Drive ever rate-limits the build, the script should fail loudly (non-zero exit) so Vercel keeps the *previous* working deployment live rather than publishing a site with missing images. Vercel never replaces production with a failed build - that safety comes free.

## Part B: create the Deploy Hook and the secret

1. In Vercel: **Project → Settings → Git → Deploy Hooks**. Name: `drive-sync`, branch: `main`. Create, and copy the URL.
2. In GitHub: **repo → Settings → Secrets and variables → Actions → New repository secret**. Name: `VERCEL_DEPLOY_HOOK_URL`, value: the URL you copied.

That URL is the only credential in the whole pipeline, and it can do exactly one thing: trigger a build. Least privilege by construction.

## Part C: the workflow

Create `.github/workflows/sync-images.yml`:

```yaml
name: Sync images from Google Drive

on:
  schedule:
    - cron: "17 4 * * *"        # daily at 04:17 UTC (odd minute = punctual, doc 3)
  workflow_dispatch:             # manual "Run workflow" button for on-demand syncs

permissions: {}                  # needs no access to the repo at all (doc 4)

concurrency:
  group: drive-sync
  cancel-in-progress: true       # a newer sync supersedes an in-flight one (doc 3)

jobs:
  trigger-rebuild:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel deployment via deploy hook
        run: |
          echo "Triggered by: ${{ github.event_name }}"
          curl --fail --silent --show-error --retry 3 --retry-delay 10 \
            -X POST "$DEPLOY_HOOK"
          echo "Vercel deployment triggered. Watch it at the Vercel dashboard."
        env:
          DEPLOY_HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
```

Read it as a checklist of the whole course:

- No `actions/checkout` - the job never needs the code (doc 1: runners start empty, and empty is fine here).
- `schedule` + `workflow_dispatch` together (doc 3).
- `permissions: {}` because it doesn't touch GitHub's API (doc 4).
- `concurrency` so syncs never pile up (doc 3).
- The secret arrives via `env:`, never spliced into the command or echoed (doc 4).
- `curl --fail` makes a non-2xx HTTP response fail the step, so a dead hook shows up as a red X and emails you, instead of silently doing nothing. `--retry 3` rides out transient network blips.

Commit, push, then test the whole chain **now** rather than waiting for 04:17 UTC: Actions tab → "Sync images from Google Drive" → **Run workflow**. Within seconds a new deployment should appear in the Vercel dashboard; when it finishes, the site reflects the current Drive contents.

## The complete flow, end to end

```text
Mehrnaz adds photos to the Drive folder
        (nothing happens yet - and that's expected)
                        │
   04:17 UTC daily      │      or you press "Run workflow"
                        ▼
GitHub Actions: POST $VERCEL_DEPLOY_HOOK_URL
                        │
                        ▼
Vercel: clone main → run buildCommand
        → fetch_images.py downloads the Drive folder (gdown)
        → optimizes images, writes manifest
                        │
              build succeeded? ──no──▶ previous deployment stays live,
                        │              error visible in Vercel build logs
                       yes
                        ▼
        new deployment goes live with the new images
```

Worst-case freshness is one day; the button makes it one minute when it matters.

## Troubleshooting

| Symptom | Where to look | Likely cause and fix |
|---|---|---|
| Red X on the workflow run | Actions tab → run → step log | `curl` got a non-2xx or couldn't connect. Hook deleted or URL secret wrong - create a new hook, update the secret. |
| Workflow green, but no deployment in Vercel | Vercel dashboard → Deployments | Hook belongs to a different project/branch than you think. Recreate it against `main`. |
| Deployment appears but build fails | Vercel → the deployment → Build Logs | Usually the Drive fetch: rate-limited (`gdown` prints a quota message - wait and re-run) or folder permissions changed (must be "anyone with the link"). |
| Build succeeds but images stale | Vercel build logs | Check the fetch script actually ran (look for its output in the log) and that `buildCommand` in `vercel.json` wasn't removed. |
| Scheduled runs stopped happening | Actions tab (look for a banner) | 60 days without commits disables schedules on public repos (doc 3). Any commit re-enables; GitHub also emails a warning first. |
| Run starts 10+ minutes after 04:17 | Nowhere - it's fine | Schedules are best-effort (doc 3). If punctuality ever truly matters, an external cron service POSTing the hook is the escape hatch. |

## Try it (the real thing)

1. Do Part B (hook + secret) and Part C (the workflow) in this repository.
2. Trigger it manually and follow one request through all three systems: the Actions log ("Triggered by: workflow_dispatch"), the Vercel deployment it spawned, and the live site afterwards.
3. Have Mehrnaz drop one new image into a Drive project folder, run the workflow again, and confirm the image reaches the live site with zero commits. That's the pipeline, proven.

## Reference

- Vercel Deploy Hooks: <https://vercel.com/docs/deploy-hooks>
- Workflow syntax (the full reference for everything above): <https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions>
- gdown (Drive downloader): <https://github.com/wkentaro/gdown>

You've completed the course. Back to the [index](00-index.md).
