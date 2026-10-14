#!/usr/bin/env bash
# guard: boundary check for PRs from non-owners (Claude Tag, teammates).
# guard.yml runs the BASE branch copy of this file, so a PR cannot loosen its own rules.
# The PR can still edit guard.yml; CODEOWNERS on /.github/ + code-owner review covers that.
# Spec: claude-tag-governance REPORT.md, "the model".
set -euo pipefail
: "${PR_AUTHOR:?}" "${BASE_SHA:?}" "${HEAD_SHA:?}"

# ---------------- CONFIG (per repo) ----------------
OWNERS="ak--47"
SELF_PATHS_RE='^(\.github/|\.claude/)'
repo_rules() {
  # a new one-off must not overwrite an app route, a reserved folder, or another one-off in out/
  local f n
  local reserved="financial wellness checkout streaming admin lifestyle oneoffs deliverables _next fixpanel"
  while IFS= read -r f; do
    case "$f" in oneoffs/*/*)
      n=${f#oneoffs/}; n=${n%%/*}
      if git cat-file -e "$BASE_SHA:oneoffs/$n" 2>/dev/null; then continue; fi
      for r in $reserved; do [ "$n" = "$r" ] && fail "one-off name '$n' overwrites /$r/ in the build. Pick another name."; done
      [ -e "app/$n" ] && fail "one-off name '$n' matches app route app/$n. Pick another name."
      [ -e "public/$n" ] && fail "one-off name '$n' matches public/$n. Pick another name."
    ;; esac
  done <<< "$ADDED"
  return 0
}
# ---------------- END CONFIG -----------------------

FAILS=()
fail() { FAILS+=("$1"); }

is_owner() {
  local o
  for o in $OWNERS; do [ "$PR_AUTHOR" = "$o" ] && return 0; done
  return 1
}

# json_at <sha> <path> -> file content, or {} when the file does not exist at that sha
json_at() { git show "$1:$2" 2>/dev/null || echo '{}'; }

# deps_equal <path>: exit 0 when the dependency blocks of package.json match between base and head
deps_equal() {
  node -e '
    const keys = ["dependencies","devDependencies","optionalDependencies","peerDependencies","overrides"];
    const [a, b] = process.argv.slice(1).map(s => JSON.parse(s));
    const pick = o => JSON.stringify(keys.map(k => o[k] || {}));
    process.exit(pick(a) === pick(b) ? 0 : 1);
  ' "$(json_at "$BASE_SHA" "$1")" "$(json_at "$HEAD_SHA" "$1")"
}

if is_owner; then
  echo "owner @$PR_AUTHOR: guard does not apply"
  exit 0
fi

CHANGED=$(git diff --name-only "$BASE_SHA" "$HEAD_SHA")
ADDED=$(git diff --name-only --diff-filter=A "$BASE_SHA" "$HEAD_SHA")

# 1. self-modification and deploy/secrets plumbing.
# dependabot is exempt: its github-actions and docker bumps edit these files, main-checks has no
# bypass, and CODEOWNERS already makes AK approve them. Without this, those bumps could never merge.
if [ "$PR_AUTHOR" != "dependabot[bot]" ]; then
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    if printf '%s\n' "$f" | grep -Eq "$SELF_PATHS_RE"; then fail "protected path: $f"; fi
  done <<< "$CHANGED"
fi

# 2. dependency changes (dependabot is exempt; owners exited above)
if [ "$PR_AUTHOR" != "dependabot[bot]" ]; then
  while IFS= read -r f; do
    case "$f" in
      ''|*/node_modules/*) ;;
      package-lock.json|*/package-lock.json) fail "dependency change: $f" ;;
      package.json|*/package.json) deps_equal "$f" || fail "dependency change: $f" ;;
    esac
  done <<< "$CHANGED"
fi

# 3. repo-specific rules
repo_rules

if [ "${#FAILS[@]}" -eq 0 ]; then
  echo "guard: pass for @$PR_AUTHOR"
  exit 0
fi

echo "guard: @$PR_AUTHOR is not an owner (owners: $OWNERS). This PR crosses the boundary:"
printf '  - %s\n' "${FAILS[@]}"
echo
echo "These need AK. Ask in the channel, or remove these changes from the PR."
echo "Boundary: .github/CODEOWNERS and the 'Slack sessions' section of AGENTS.md."
exit 1
