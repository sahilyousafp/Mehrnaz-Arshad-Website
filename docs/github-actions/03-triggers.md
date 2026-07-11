# 3. Triggers: choosing when workflows run

Everything under the `on:` key is a trigger. Picking the right trigger is most of the design work in a workflow - the steps are usually obvious once you know *when* they should run.

## The five triggers you'll actually use

### `push` - code landed

```yaml
on:
  push:
    branches: [main]        # only pushes to main
    paths:                  # ...and only if these files changed
      - "assets/**"
      - "index.html"
```

Runs when commits are pushed. The `branches` and `paths` filters keep noise down: the example above ignores pushes to other branches and pushes that only touch, say, documentation. Filters are optional - plain `on: push` means every push everywhere.

Use it for: checks on your own work, deploying when `main` changes.

### `pull_request` - someone proposes changes

```yaml
on:
  pull_request:
    branches: [main]        # PRs that target main
```

Runs when a pull request is opened or updated. The crucial difference from `push`: it runs against the *merged result* of the PR, so checks tell you whether the PR would break `main`, before merging. This is the backbone of code review automation - GitHub shows each workflow's green check or red X right on the PR page, and you can make passing checks a requirement for merging (repo Settings → Branches → branch protection).

Use it for: tests and validation that gate merging.

### `schedule` - a timer

```yaml
on:
  schedule:
    - cron: "0 4 * * *"     # every day at 04:00 UTC
```

Runs on a timer, no human involved. This is how our image sync will work. The `cron` string is five fields, left to right:

```text
┌──────── minute        (0-59)
│ ┌────── hour          (0-23, in UTC - not your timezone!)
│ │ ┌──── day of month  (1-31)
│ │ │ ┌── month         (1-12)
│ │ │ │ ┌ day of week   (0-6, Sunday = 0)
│ │ │ │ │
0 4 * * *
```

`*` means "every". Examples:

| Cron | Meaning |
|------|---------|
| `0 4 * * *` | daily at 04:00 UTC |
| `0 */6 * * *` | every 6 hours, on the hour |
| `30 8 * * 1` | Mondays at 08:30 UTC |
| `0 0 1 * *` | first day of each month, midnight UTC |

Use <https://crontab.guru> to sanity-check any cron string - it translates them to English.

Three gotchas worth memorizing:

1. **Times are UTC.** `0 4 * * *` is 06:00 in Madrid in summer.
2. **Schedules are best-effort.** Runs regularly start 5 to 15 minutes late during busy periods, and the popular `0 0 * * *` slot is the busiest. Pick an odd minute like `17 4 * * *` for more punctual starts.
3. **Schedules pause on inactive repos.** If a public repo sees no commits for 60 days, GitHub disables its scheduled workflows and emails you a warning. Any commit re-enables them.

Use it for: periodic syncs (our case), nightly checks, cleanup jobs, link checkers.

### `workflow_dispatch` - a manual button

```yaml
on:
  workflow_dispatch:
```

Adds a **"Run workflow"** button to the workflow's page in the Actions tab, so you can trigger it by hand whenever you want. Almost every scheduled workflow should *also* have this, because you'll want to test it now, not at 04:00 UTC.

It can take typed inputs:

```yaml
on:
  workflow_dispatch:
    inputs:
      reason:
        description: "Why are you running this manually?"
        required: false
        default: "manual sync"
```

The value is available in steps as `${{ inputs.reason }}`.

Use it for: "sync now" buttons, one-off maintenance, testing scheduled workflows.

### `repository_dispatch` - an external poke

```yaml
on:
  repository_dispatch:
    types: [image-updated]
```

Lets anything *outside* GitHub start the workflow by sending an authenticated HTTP request to GitHub's API. It's the inverse of a deploy hook: instead of your workflow calling out, someone calls in. You likely won't need it for this project, but it's the answer to "can another service trigger my workflow?" - yes, this is how.

## Combining triggers

`on:` takes any mix. Our capstone workflow uses exactly this trio:

```yaml
on:
  schedule:
    - cron: "17 4 * * *"    # daily, automatically
  workflow_dispatch:         # ...and on demand via the button
  push:
    branches: [main]         # ...and when the site's code changes
```

Inside a run you can check what triggered it with the built-in variable `${{ github.event_name }}` (`"schedule"`, `"workflow_dispatch"`, or `"push"`).

## Concurrency: preventing pile-ups

If a run is still going when another starts (you push twice quickly, or click the button during the scheduled run), both run in parallel by default. For deployments that's wasteful and can even race. Declare a concurrency group:

```yaml
concurrency:
  group: deploy
  cancel-in-progress: true
```

All runs in the same group are serialized, and `cancel-in-progress: true` kills the older run when a newer one arrives - for deploys you only ever care about the latest. Put this at the top level of the workflow file, alongside `name:` and `on:`.

## Try it

1. Take your `checks.yml` from doc 2 and add `workflow_dispatch:` under `on:`. Push, open the workflow in the Actions tab, and press **Run workflow**. Confirm a run starts with no push involved.
2. Add a `schedule` trigger with a cron that fires a few minutes from now (remember: UTC). Push and wait for it. Note how late it actually starts versus the cron time - that's normal.
3. Translate these at crontab.guru before peeking: `*/15 * * * *`, `0 9 * * 1-5`, `0 3 * * 0`.

## Reference

- Events that trigger workflows: <https://docs.github.com/en/actions/reference/events-that-trigger-workflows>
- Concurrency: <https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency>

Next: [4. Secrets and permissions](04-secrets-and-permissions.md)
