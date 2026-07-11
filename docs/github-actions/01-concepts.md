# 1. Concepts: what GitHub Actions actually is

GitHub Actions is GitHub's built-in automation service. You describe a process in a YAML file, commit that file to your repository, and GitHub runs the process for you on its own servers whenever a chosen event happens.

"Process" can be anything you could type into a terminal: run tests, build a website, send a request to another service, resize images, publish a release. If you can script it, Actions can run it.

## The mental model

Think of it as: **"When X happens, rent a fresh computer, and run these commands on it."**

- **When X happens** - the *trigger*: a push, a pull request, a timer, a button click.
- **Rent a fresh computer** - the *runner*: a clean virtual machine (usually Ubuntu Linux) that exists only for this run and is thrown away afterwards.
- **Run these commands** - the *steps*: shell commands and reusable building blocks.

Because the machine is always fresh, every run starts from nothing: your code is not on it until a step checks it out, and no tools you installed last run survive. This feels wasteful at first but is the feature - runs are reproducible and can't be polluted by leftover state.

## The building blocks

A workflow file has a strict hierarchy:

```text
Workflow  (one YAML file, one purpose, e.g. "deploy the site")
└── Job(s)  (each job = one runner machine; jobs run in parallel by default)
    └── Step(s)  (run in order on that machine; if one fails, the job stops)
```

Here is a tiny but complete workflow with every level labeled:

```yaml
name: Demo                      # workflow name, shown in the Actions tab

on: push                        # trigger: run on every push, any branch

jobs:
  say-hello:                    # job id (your choice of name)
    runs-on: ubuntu-latest      # which runner machine to rent
    steps:
      - name: Check out the repository
        uses: actions/checkout@v4      # a step that USES a published action

      - name: Greet
        run: echo "Hello from a fresh Ubuntu machine"   # a step that RUNS a command
```

Two kinds of steps appear here, and they're the only two kinds:

- `run:` executes shell commands you write, exactly as if you typed them on the runner.
- `uses:` executes an **action** - a reusable step someone packaged and published. `actions/checkout@v4` is the most common one in the world: it clones your repository onto the runner. Actions live in ordinary GitHub repos; `actions/checkout` is just github.com/actions/checkout, and `@v4` pins which version you get.

The difference matters: `run:` is for your logic, `uses:` is for solved problems (checking out code, installing Python, uploading files). You'll combine both in almost every workflow.

## Where the files live

Workflows must be in one exact place: the `.github/workflows/` directory at the root of your repository.

```text
Mehrnaz-Arshad-Website/
├── .github/
│   └── workflows/
│       ├── hello.yml          <- one workflow
│       └── sync-images.yml    <- another workflow
├── index.html
└── README.md
```

- Each `.yml` file is one independent workflow.
- The file must be on the branch where the event happens (for most projects: commit it to `main`).
- There is nothing to enable or install. The moment the file lands on GitHub, it's live.

## Where runs appear

Every repository has an **Actions** tab (github.com/you/your-repo/actions). It shows:

- A list of workflows on the left, and every **run** on the right, newest first.
- Click a run to see its jobs; click a job to see each step's full log output.
- A green check means every step succeeded; a red X means a step failed - the log shows exactly which command failed and its output.
- Failed runs also email you by default.

This tab is where you'll live while learning. Push a workflow, open the tab, watch it go.

## What it costs

For **public repositories, GitHub Actions is free with unlimited minutes** on standard runners.

For **private repositories**, the free plan includes 2,000 runner-minutes per month (a "minute" is one minute of one runner working). A typical small workflow takes 1 to 3 minutes, so 2,000 minutes is roughly 30 runs a day, every day, for free. Beyond that, it's pay-per-minute. Note that macOS runners burn minutes 10x faster and Windows 2x faster than Linux - one more reason `ubuntu-latest` is the default choice.

For this project (a public portfolio repo, one small scheduled workflow), the cost is exactly zero.

## What Actions is NOT

- It is not a server. Runs start, do their work, and end (max 6 hours, realistically minutes). You can't host a website *on* Actions - that's what Vercel is for.
- It is not instant. A run takes a few seconds to be picked up, and scheduled runs can start several minutes late (more in [doc 3](03-triggers.md)).
- It does not watch external services. Actions reacts to GitHub events and timers - it cannot natively "notice" that a Google Drive folder changed. It *can* check on a schedule, which is exactly what our capstone does.

## Try it

No code yet - just look around:

1. Open any popular open-source repo (for example github.com/vercel/next.js) and click its **Actions** tab.
2. Click into a recent run, then into a job, and expand a few steps. Notice the structure: workflow → job → steps, and that every step's terminal output is right there.
3. Find the workflow file that produced the run: it's linked at the top of the run page and lives under `.github/workflows/` in the repo. Skim its YAML and see if you can spot `on:`, `jobs:`, `runs-on:`, `uses:`, and `run:`.

## Reference

- Understanding GitHub Actions: <https://docs.github.com/en/actions/get-started/understanding-github-actions>
- Billing and free minutes: <https://docs.github.com/en/billing/concepts/product-billing/github-actions>

Next: [2. Your first workflow](02-first-workflow.md)
