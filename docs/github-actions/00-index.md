# Learning GitHub Actions

A hands-on course in seven parts, written for this project (the Mehrnaz Arshad portfolio website). It assumes you know basic git (commit, push, branches) but have never opened the **Actions** tab on GitHub.

By the end you will understand how GitHub Actions works, when to use it, and you will be able to build this project's real pipeline yourself: a scheduled workflow that tells Vercel to rebuild the site so new images from Google Drive appear automatically.

## Reading order

| # | Doc | What you'll learn |
|---|-----|-------------------|
| 1 | [Concepts](01-concepts.md) | What a workflow is, the building blocks, where files live, what it costs |
| 2 | [Your first workflow](02-first-workflow.md) | Write, push, and watch a workflow run; then a useful one |
| 3 | [Triggers](03-triggers.md) | push, pull_request, schedule (cron), manual buttons, and picking the right one |
| 4 | [Secrets and permissions](04-secrets-and-permissions.md) | Storing credentials safely, the GITHUB_TOKEN, security habits |
| 5 | [Use cases](05-use-cases.md) | The common patterns: CI, scheduled jobs, deploys, releases, matrices, caching |
| 6 | [Vercel and Actions](06-vercel-and-actions.md) | What Vercel already does for free, and where Actions actually add value |
| 7 | [Capstone: Drive image sync](07-capstone-drive-sync.md) | This project's pipeline, end to end, with the complete workflow file |

Read 1 through 4 in order - each builds on the last. 5 and 6 can be read in any order. 7 puts everything together.

## Glossary

| Term | Meaning |
|------|---------|
| **Workflow** | An automated process defined in one YAML file in `.github/workflows/`. |
| **Event / trigger** | The thing that starts a workflow: a push, a schedule, a button click. |
| **Job** | A group of steps that runs on one machine. A workflow has one or more jobs. |
| **Step** | A single command or action inside a job. Steps run in order. |
| **Action** | A reusable, packaged step someone published (e.g. `actions/checkout`). |
| **Runner** | The virtual machine GitHub spins up to run a job (Ubuntu, Windows, or macOS). |
| **Run** | One execution of a workflow. Each run has logs in the Actions tab. |
| **Secret** | An encrypted value (token, URL, password) the workflow can use but logs never show. |
| **Artifact** | A file a run produces and stores so you (or a later job) can download it. |
| **Cron** | The five-field time syntax used to schedule workflows (e.g. `0 4 * * *` = daily at 04:00 UTC). |
| **Deploy Hook** | A secret URL from Vercel; sending a request to it triggers a fresh deployment. |

## Official documentation

Everything here is distilled from the official docs, which are excellent for reference (less so for learning, which is why these files exist):

- GitHub Actions home: <https://docs.github.com/en/actions>
- Workflow syntax reference: <https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions>
- Vercel Deploy Hooks: <https://vercel.com/docs/deploy-hooks>

Start with [01-concepts.md](01-concepts.md).
