# 5. Use cases: the patterns everyone reuses

Nearly every workflow in the wild is one of about seven patterns. This doc shows each in its minimal form so you can recognize them and adapt them. Skim now, return when you need one.

## 1. CI - check every change

The workhorse. On every push and PR, run the project's tests/linters so breakage is caught before it matters.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci          # clean, reproducible install from package-lock.json
      - run: npm test
```

New pieces: `actions/setup-node` installs a specific Node version (there are equivalents: `setup-python`, `setup-java`, ...), and `with:` is how you pass options to an action - each action documents its own options on its repo page.

## 2. Scheduled jobs - do it every night

Anything periodic: sync data (our capstone), check for broken links, ping a health endpoint, file a reminder issue.

```yaml
name: Nightly link check

on:
  schedule:
    - cron: "23 3 * * *"
  workflow_dispatch:

permissions: {}

jobs:
  linkcheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check links in all Markdown files
        uses: lycheeverse/lychee-action@v2
        with:
          args: --no-progress "**/*.md"
```

The shape to remember: `schedule` + `workflow_dispatch` together, always (doc 3 explains why).

## 3. Deployment - ship when main changes

With Vercel you rarely write this yourself (Vercel watches the repo directly - see [doc 6](06-vercel-and-actions.md)), but the general pattern is: on push to `main`, build, then push the result somewhere.

```yaml
name: Deploy

on:
  push:
    branches: [main]

concurrency:
  group: deploy
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./build.sh
      - name: Upload to the server
        run: rsync -az --delete dist/ deploy@example.com:/var/www/site/
        env:
          RSYNC_PASSWORD: ${{ secrets.DEPLOY_PASSWORD }}
```

The `concurrency` block from doc 3 belongs on every deploy workflow.

## 4. Releases - package when you tag

Trigger on version tags; build the thing; attach it to a GitHub Release.

```yaml
name: Release

on:
  push:
    tags: ["v*"]           # v1.0, v2.3.1, ...

permissions:
  contents: write           # needed to create the release

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: zip -r site.zip . -x ".git/*"
      - name: Create GitHub release with the zip attached
        run: gh release create "$TAG" site.zip --title "$TAG" --generate-notes
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAG: ${{ github.ref_name }}
```

`github.ref_name` is the tag that triggered the run - one of many built-in context values (`github.sha`, `github.actor`, `github.repository`, ...).

## 5. Repo automation - housekeeping

React to repository events: label new issues, greet first-time contributors, close stale issues. These use the `GITHUB_TOKEN` with write permissions - the example in [doc 4](04-secrets-and-permissions.md) (auto-labeling issues) is exactly this pattern. A popular ready-made one:

```yaml
name: Close stale issues

on:
  schedule:
    - cron: "41 2 * * *"

permissions:
  issues: write
  pull-requests: write

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v9
        with:
          days-before-stale: 60
          days-before-close: 14
```

## 6. Matrix builds - same job, many variants

Run one job definition across combinations (OS versions, language versions, browsers) in parallel:

```yaml
name: Test matrix

on: [push, pull_request]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [20, 22]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci && npm test
```

That's 3 OSes x 2 Node versions = 6 parallel jobs from nine lines. Overkill for a portfolio site; indispensable for libraries.

## 7. Caching and artifacts - don't redo, don't lose

**Caching** carries dependency downloads *between* runs so repeat installs are fast:

```yaml
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm        # caches the npm download cache between runs
```

(The setup-* actions have caching built in; the general-purpose tool is `actions/cache`.)

**Artifacts** save files *out of* a run so humans or later jobs can grab them - build outputs, test reports, screenshots:

```yaml
      - name: Save the built site for inspection
        uses: actions/upload-artifact@v4
        with:
          name: site
          path: dist/
```

Artifacts appear as downloads on the run's summary page.

## Choosing, in one table

| You want to... | Pattern | Trigger |
|---|---|---|
| Catch mistakes in every change | CI | `push` + `pull_request` |
| Refresh something periodically | Scheduled job | `schedule` + `workflow_dispatch` |
| Ship when main changes | Deploy | `push` to `main` (or let Vercel do it) |
| Package versioned releases | Release | `push` tags |
| Keep issues/PRs tidy | Repo automation | issue/PR events or `schedule` |
| Test across environments | Matrix | any |
| Speed up installs / keep outputs | Cache / artifacts | (additions to any job) |

## Try it

1. This repo's `checks.yml` from doc 2 is pattern 1 (CI). Extend it to also run on `pull_request`, then open a test PR from a branch and watch the check appear on the PR page.
2. Add `actions/upload-artifact` to any workflow and upload a file it creates (even `run: date > report.txt` then upload `report.txt`). Find and download it from the run summary page.

## Reference

- Workflow examples from GitHub: <https://docs.github.com/en/actions/examples>
- The actions marketplace (browse published actions): <https://github.com/marketplace?type=actions>

Next: [6. Vercel and Actions](06-vercel-and-actions.md)
