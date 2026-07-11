# 6. Vercel and Actions: who does what

Vercel and GitHub Actions overlap just enough to confuse. This doc draws the line so you never build in Actions what Vercel already gives you for free - and know exactly where Actions still earns its place.

## What Vercel's git integration already does

When you import a GitHub repository into Vercel (vercel.com → Add New → Project → pick the repo), Vercel installs its own GitHub integration and from then on, **with zero workflow files**:

- **Every push to `main` deploys to production.** Vercel clones the commit, runs your build command (if any), and publishes the output to your live URL. For a static site like ours the "build" can be as simple as running one script, or nothing at all.
- **Every pull request gets a preview deployment.** Vercel builds the PR's version and comments on the PR with a private URL where you can see it live before merging. This is genuinely excellent for reviewing visual changes to a portfolio.
- **Build logs, rollbacks, custom domains, HTTPS** - all handled in the Vercel dashboard.

So the deploy pattern from doc 5? You don't write it. Vercel *is* your deploy workflow.

## What Vercel does NOT do

Vercel deploys **when the git repository changes**. It has no idea that anything else changed. For this project that's precisely the gap:

> The site's images live in a Google Drive folder. Mehrnaz drops new exhibition photos into Drive. **No commit happened**, so Vercel never rebuilds, and the site never sees the new images.

Vercel also won't run your repo's own checks (linting, HTML validation) as merge gates, and its free (Hobby) plan gives you only limited built-in cron (2 cron jobs, once per day, and they invoke serverless functions rather than rebuilding the site).

## The bridge: Deploy Hooks

A **Deploy Hook** is Vercel's answer to "rebuild for reasons Vercel can't see." In the Vercel dashboard (Project → Settings → Git → Deploy Hooks) you create one and get a secret URL like:

```text
https://api.vercel.com/v1/integrations/deploy/prj_AbC123.../XyZ456...
```

Any HTTP POST to that URL makes Vercel do a fresh clone-build-publish of your chosen branch, exactly as if you had pushed. No authentication beyond possessing the URL - which is why the URL goes in a repository **secret** ([doc 4](04-secrets-and-permissions.md)), never in code.

Triggering it is one command:

```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_AbC123.../XyZ456..."
```

Now the design snaps together: **GitHub Actions is the timer, Vercel is the builder.**

```text
schedule (daily cron)                     Vercel build
        │                                      │
        ▼                                      ▼
GitHub Actions run ──POST──▶ Deploy Hook ──▶ clone repo ──▶ run build command
                                               (fetches fresh images from Drive)
                                                    │
                                                    ▼
                                              publish site
```

The workflow itself is tiny - it doesn't fetch images or build anything. It just pokes Vercel on a schedule. The image fetching lives in the *build command* on Vercel's side, so it runs identically whether a deploy came from a push, the hook, or a manual redeploy in the dashboard.

## Division of labor for this project

| Concern | Owner | Why |
|---|---|---|
| Build and host the site, HTTPS, domain | Vercel | Its core job |
| Deploy on every push to `main` | Vercel git integration | Automatic, no YAML |
| Preview deployments for PRs | Vercel git integration | Automatic, no YAML |
| Fetch + optimize Drive images | Build script, run by Vercel's build command | Runs on every deploy, whatever triggered it |
| Rebuild daily so new Drive images appear | GitHub Actions (`schedule` → deploy hook) | Vercel can't see Drive; Actions owns timers |
| "Sync now" button | Same workflow (`workflow_dispatch`) | Free, one extra line |
| Validate YAML/HTML on PRs | GitHub Actions (CI pattern) | Vercel builds but doesn't gate merges |

## When you'd still deploy *from* Actions

For completeness: some teams disable Vercel's git integration and run the Vercel CLI inside a workflow (`vercel build && vercel deploy --prebuilt`) instead. That's for monorepos, unusual build environments, or compliance rules about where builds run. It costs you the zero-config previews and adds token management. For a portfolio site it's strictly worse - know it exists, don't do it.

## Try it

1. Import this repository into Vercel (Add New → Project). Accept the defaults for a static site, deploy, and confirm you get a live URL.
2. Create a Deploy Hook (Project → Settings → Git → Deploy Hooks, name it `manual-test`, branch `main`). Trigger it from your own terminal with `curl -X POST "<the url>"` and watch a new deployment appear in the Vercel dashboard within seconds.
3. Delete that hook (you'll make a proper one in the capstone, and the URL just passed through your shell history).

## Reference

- Vercel git integration: <https://vercel.com/docs/git>
- Vercel Deploy Hooks: <https://vercel.com/docs/deploy-hooks>
- Vercel Hobby plan limits: <https://vercel.com/docs/plans/hobby>

Next: [7. Capstone - the Drive image sync](07-capstone-drive-sync.md)
