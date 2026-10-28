#!/usr/bin/env bash
# 把检查结果（文件或目录）提交到 reports 分支，便于在本地用 git 取回查看。用法：save_report.sh <路径…>
set -euo pipefail
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
dir=$(mktemp -d)
if git ls-remote --exit-code --heads origin reports >/dev/null; then
  git fetch --depth=1 origin reports
  git worktree add "$dir" FETCH_HEAD
else
  git worktree add --orphan -b reports "$dir"
fi
for p in "$@"; do cp -r "$p" "$dir/"; done
cd "$dir"
git add -A
git diff --cached --quiet && exit 0
git commit -m "Report from ${GITHUB_WORKFLOW:-local}"
git push origin HEAD:refs/heads/reports
