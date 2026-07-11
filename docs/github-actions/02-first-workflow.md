# 2. Your first workflow

Time to run something. You'll write the smallest possible workflow, push it, and watch it execute. Then you'll replace it with one that does something genuinely useful for this repository.

## Step 1: create the file

In your local clone of this repository, create the folder and file (the names of the folders are exact and required; the filename is your choice):

```text
.github/workflows/hello.yml
```

With this content:

```yaml
name: Hello

on: push

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: echo "Hello, Actions! Today is $(date)"
```

Line by line:

- `name: Hello` - the label shown in the Actions tab.
- `on: push` - run this workflow every time anyone pushes any commit to any branch.
- `jobs:` - the list of jobs; here just one, which we've called `hello`.
- `runs-on: ubuntu-latest` - rent a fresh Ubuntu Linux machine for this job.
- `steps:` - what to do; one step that runs a shell command.

Note this workflow never checks out your code - it doesn't need to, since it only echoes text. The runner starts truly empty.

## Step 2: push it

```bash
git add .github/workflows/hello.yml
git commit -m "Add hello workflow"
git push
```

## Step 3: watch it run

1. Open the repository on GitHub and click the **Actions** tab.
2. Within a few seconds a run named after your commit message appears with a yellow spinner, then a green check.
3. Click the run → click the `hello` job → expand **Say hello**. There's your `Hello, Actions!` with the date, printed by a computer GitHub created and destroyed just for you.

That loop - edit YAML, push, watch the Actions tab - is the entire development cycle for workflows. There is no way to run them "locally" that's worth learning first; everyone iterates by pushing.

### When it fails

Make it fail on purpose once, so a red X never scares you:

```yaml
      - name: Fail on purpose
        run: exit 1
```

Add that step, push, and open the run. The job stops at that step, marked red, and later steps don't run. A step fails when its command exits with a non-zero code - the same convention as every shell script. Delete the step and push again; back to green. (Each push is a new run - old runs are history, never re-run in place.)

## Step 4: a workflow that earns its place

"Hello" proves the plumbing. Here's one that does a real job for this repository: every push, it checks that any workflow YAML is valid and that the HTML has no broken structure. Replace `hello.yml` with a file named `.github/workflows/checks.yml`:

```yaml
name: Checks

on: push

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository
        uses: actions/checkout@v4

      - name: Validate all workflow YAML files
        run: |
          pip install --quiet yamllint
          yamllint --no-warnings .github/workflows/

      - name: Check HTML files are well formed
        run: |
          pip install --quiet html5validator
          html5validator --root . --also-check-css || true
```

New things here:

- `uses: actions/checkout@v4` - now we DO need the repository's files on the runner, so the first step clones them. Almost every real workflow starts with this line.
- `run: |` - the pipe lets a step contain multiple shell lines, run in order.
- The Ubuntu runner comes with Python, pip, Node, git and dozens of common tools preinstalled, so `pip install` just works.
- `|| true` on the HTML check means "don't fail the workflow over this" - useful while a check is advisory. Remove it when you want the check to be enforced.

Push it, watch it run, and from now on every push to this repository gets checked automatically. This pattern - "on push, check my work" - is called **CI (continuous integration)** and is the single most common use of Actions.

## Try it

1. Get `hello.yml` running and find its log output, then make it fail with `exit 1` and read the failed log.
2. Replace it with `checks.yml` and push. Then deliberately break something - add a `.yml` file with bad indentation under `.github/workflows/` - push, and confirm the workflow catches it with a red X. Fix it and watch it go green.
3. Bonus: change `on: push` to `on: [push, pull_request]` (a list of two triggers) and see [doc 3](03-triggers.md) for what that means.

## Reference

- Quickstart: <https://docs.github.com/en/actions/get-started/quickstart>
- Workflow syntax: <https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions>

Next: [3. Triggers](03-triggers.md)
