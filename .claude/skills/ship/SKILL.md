---
name: ship
description: >-
  FixPanel's "ship it" pipeline: move work onto a branch, push to origin
  (mixpanel/fixpanel), open a PR, wait for the required CI checks, squash-merge,
  wait for the GitHub Pages deploy, delete the branch, and return local to main
  updated. Use this WHENEVER the user says "ship it", "/ship", "ship this", "land
  it", or asks to get finished work merged and deployed in this repo — even if they
  don't spell out each step. Drives the whole flow with `git` + `gh` and stops
  loudly if a required check or the deploy fails.
---

# Ship (FixPanel)

Get reviewed work all the way to deployed `main`, then leave the local checkout
clean on the latest `main`. This is the closing ritual once the user is happy with
a change and wants it live at https://mixpanel.github.io/fixpanel/.

This skill is tuned to **this repo's shape**. The facts it relies on:

- Remote `origin` = `mixpanel/fixpanel`; default branch = `main`.
- `main` is branch-protected: **no direct pushes (admins included)**, strict
  required status checks **`verify`, `build`, `test-app`**, 0 required approvals
  (so you squash-merge your own PR), force-push/delete off.
- CI is `.github/workflows/nextjs.yml`. On a PR it runs `verify` (lint), `build`
  (Next.js build + typecheck), `test-app` (core smoke), and `test-oneoffs`
  (**advisory** — may be red without blocking). On push to `main` the same workflow
  also runs the `deploy` job → GitHub Pages.
- Most changes are a new/edited **oneoff** under `oneoffs/`, but the flow is the same
  for app changes.

Run it as a gated pipeline. Each step gates the next; if a required step fails,
**stop and report** — don't merge over a red required check or call it shipped when
the deploy failed.

## Preflight

- Confirm there's something to ship: `git status` and `git log --oneline origin/main..`. Clean and nothing ahead → say so and stop.
- `gh auth status` and `gh repo view --json viewerPermission` — confirm you can merge.

## Step 1 — work onto a branch

Never commit to `main` (it's protected and you'd be blocked anyway).

- Already on a feature branch with the work → use it.
- On `main`:
  ```bash
  git checkout -b <slug>      # uncommitted changes follow automatically
  ```
  If local-only commits were sitting on `main`, after branching reset local `main`
  back to the remote so the commits live only on the branch (verify first):
  ```bash
  git branch -f main origin/main
  ```
- Commit with clear messages, splitting into logical commits where natural. End each
  commit message with the trailer required by your harness instructions
  (`Co-Authored-By: ...`).

## Step 2 — push

```bash
git push -u origin HEAD
```

(Outside contributors working from a fork: push with the explicit refspec the fork
remote expects. You can push commits to a fork PR with maintainer access but
**cannot delete** the fork branch later — note that at Step 7.)

## Step 3 — open the PR

Reuse an existing PR for the branch if there is one; otherwise:

```bash
gh pr create --fill --base main
```

Write a real title/body when `--fill` is thin; follow any PR-body rules from your
instructions.

## Step 4 — wait for CI (required checks green)

```bash
gh pr checks <pr> --watch --interval 20
```

- Required `verify` / `build` / `test-app` all pass → continue.
- A **required** check fails → **stop**. Surface the failing job and a log snippet
  (`gh run view <run-id> --log-failed`). Fixing it is new work, not shipping.
- `test-oneoffs` is **advisory** — if it's the only thing red, mention it but don't
  let it block the merge.

## Step 5 — squash-merge

```bash
gh pr merge <pr> --squash --delete-branch
```

- Merge is blocked as **behind main** (strict checks)? Update and re-wait for checks:
  ```bash
  gh pr update-branch <pr>
  ```
- `--delete-branch` refused on a **fork** branch you don't own → expected; merge
  without it and clean up locally in Step 7.

## Step 6 — wait for the GitHub Pages deploy

The squash lands a commit on `main`, triggering the workflow with its `deploy` job.
Watch the run for the **merge commit** (not an older one):

```bash
MERGE_SHA=$(gh pr view <pr> --json mergeCommit --jq .mergeCommit.oid)
gh run list --branch main --limit 5 --json databaseId,headSha,status \
  --jq ".[] | select(.headSha==\"$MERGE_SHA\") | .databaseId"
gh run watch <run-id> --exit-status
```

Deploy fails → **stop and report**: the change is merged but **not live**, which the
user must know.

## Step 7 — delete the branch (only after a green deploy)

- Same-repo branch: gone if `--delete-branch` worked; else `git push origin --delete <branch>`.
- Fork branch you don't own: can't delete (`permission denied`) — say so; the fork owner can.

## Step 8 — back to main, updated

```bash
git checkout main
git pull origin main
git branch -D <branch>   # local cleanup if it still exists
```

## Finish

Tight summary: PR number + link, required checks passed, deploy succeeded with the
live URL (and the specific path for a new oneoff, e.g. https://mixpanel.github.io/fixpanel/<name>/),
local back on `main` at latest. Call out anything left undone (e.g. an undeletable
fork branch, an advisory `test-oneoffs` failure).

## Stop conditions

- Required CI check failed → stop, report it.
- Deploy failed → stop, report (merged but not live).
- Nothing to ship → say so, do nothing.
- No merge permission, or the change clearly isn't reviewed yet → confirm before merging.
