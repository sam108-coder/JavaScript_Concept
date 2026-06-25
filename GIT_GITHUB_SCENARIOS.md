# Git & GitHub: Scenario-Based Guide

A practical guide covering real-world Git workflows, branching strategies, merge conflicts, rebasing, collaboration patterns, and troubleshooting scenarios — from beginner to professional.

---

## Table of Contents

1. [Core Concepts & Configuration](#1-core-concepts--configuration)
2. [Branching Strategies & Workflows](#2-branching-strategies--workflows)
3. [Daily Development Scenarios](#3-daily-development-scenarios)
4. [Merge Conflict Scenarios](#4-merge-conflict-scenarios)
5. [Rebasing Scenarios](#5-rebasing-scenarios)
6. [Collaboration & Pull Request Scenarios](#6-collaboration--pull-request-scenarios)
7. [Undoing & Recovery Scenarios](#7-undoing--recovery-scenarios)
8. [CI/CD & Automation Scenarios](#8-cicd--automation-scenarios)
9. [Monorepo & Submodule Scenarios](#9-monorepo--submodule-scenarios)
10. [Security & Compliance Scenarios](#10-security--compliance-scenarios)
11. [Quick Reference](#11-quick-reference)

---

## 1. Core Concepts & Configuration

### 1.1 Git Object Model

```git
Git is a content-addressable filesystem. Everything is an object:

- Blob: file content (no metadata, just bytes)
- Tree: directory listing (blobs + subtrees with mode/name/SHA)
- Commit: snapshot + metadata (tree, parent, author, message, time)
- Tag: named reference to a commit (optional GPG signature)
- Ref: pointer to a commit (branch, HEAD, tag)

Object storage: .git/objects/ab/cdef1234... (SHA-1 hash, content-addressed)

Internal commands:
git hash-object -w file    # store a blob
git cat-file -p <sha>      # view object
git ls-tree <sha>          # view tree contents
git ls-files --stage       # view staging area
```

### 1.2 Configuration Levels

```bash
# Order: local < global < system (last overrides first)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.editor "code --wait"
git config --global init.defaultBranch main
git config --global pull.rebase true      # rebase on pull by default
git config --global fetch.prune true      # prune remote-tracking branches
git config --global rebase.autoStash true # auto stash on rebase
git config --global push.autoSetupRemote true # auto-setup upstream
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.amend "commit --amend --no-edit"
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"
git config --global alias.visual "!gitk"
git config --global core.autocrlf input   # LF endings (macOS/Linux)
git config --global core.autocrlf true    # CRLF -> LF on commit, LF -> CRLF on checkout (Windows)
```

### 1.3 .gitignore Patterns

```gitignore
# OS files
.DS_Store
Thumbs.db
*.swp
*.swo

# Dependencies
node_modules/
vendor/
.pnp/
.pnp.js

# Build output
dist/
build/
out/
*.js.map
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local
*.pem

# IDE
.idea/
.vscode/
*.sublime-*

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Temp
tmp/
temp/
*.tmp

# Git
.gitignore       # Track this file!
!.gitkeep        # Allow empty directories to be tracked
```

---

## 2. Branching Strategies & Workflows

### Scenario 2.1: Git Flow (Release-Centric)

**Use Case:** Projects with scheduled releases, hotfixes, and multiple environments (classic enterprise).

```bash
# Branches:
# - main: production-ready code
# - develop: integration branch for features
# - feature/*: new features (branch from develop, merge to develop)
# - release/*: preparation for release (branch from develop, merge to main + develop)
# - hotfix/*: urgent production fixes (branch from main, merge to main + develop)

# Feature workflow:
git checkout -b feature/user-auth develop
# ... work, commit, push ...
git checkout develop
git merge --no-ff feature/user-auth
git branch -d feature/user-auth

# Release workflow:
git checkout -b release/1.2.0 develop
# ... bump version, final tests ...
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"
git checkout develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0

# Hotfix workflow:
git checkout -b hotfix/1.2.1 main
# ... fix bug, commit ...
git checkout main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1 -m "Hotfix v1.2.1"
git checkout develop
git merge --no-ff hotfix/1.2.1
git branch -d hotfix/1.2.1
```

### Scenario 2.2: GitHub Flow (Continuous Deployment)

**Use Case:** CI/CD with frequent deployments, PR-based workflow (modern, simple).

```bash
# Branches: main only (everything else is a feature branch)
# Every merge to main == deploy

# Workflow:
# 1. Create branch from main
git checkout -b feature/awesome-feature main

# 2. Make changes, commit frequently
git add -A
git commit -m "feat: add awesome feature"

# 3. Push and create PR
git push -u origin feature/awesome-feature
# → Create Pull Request on GitHub

# 4. PR is reviewed, CI passes, squash-merged to main
# → Automated deploy to production

# 5. Delete the feature branch (on GitHub or locally)
git branch -d feature/awesome-feature
git push origin --delete feature/awesome-feature
```

### Scenario 2.3: GitLab Flow (Environment Branches)

**Use Case:** Multiple environments (staging, pre-prod, production) with environment-specific branches.

```bash
# Branches:
# - main: latest stable code
# - staging: deployed to staging environment
# - production: deployed to production (or use tags)

# Workflow:
git checkout -b feature/new-dashboard main
# ... work ...
git push -u origin feature/new-dashboard
# → Merge to main via MR
# → Deploy main to staging
# → After staging validation, merge main to production branch
git checkout production
git merge main
git push origin production
# → Deploy production to production environment
```

### Scenario 2.4: Trunk-Based Development

**Use Case:** High-velocity teams, feature flags, short-lived branches (hours, not days).

```bash
# Principle: Short-lived branches (max 1-2 days), merge directly to main
# Feature flags gate incomplete features in production

git checkout -b fb/short-feature main
# ... small change, commit ...
git push -u origin fb/short-feature
# → Create PR immediately (small diff), reviewer approves fast
# → Squash-merge to main
# → Feature is behind a flag, deploy safely
```

---

## 3. Daily Development Scenarios

### Scenario 3.1: Starting a New Feature

```bash
# Get latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/payment-integration

# Work iteratively
git add src/payment.js
git commit -m "feat: add payment processor interface"

# Update with latest main mid-feature (rebase to keep linear history)
git fetch origin
git rebase origin/main

# Push for backup or early feedback
git push -u origin feature/payment-integration
```

### Scenario 3.2: Committing Changes (Atomic Commits)

```bash
# Stage specific changes (not everything!)
git add src/payment.js          # single file
git add src/*.js                # all JS in src/
git add -p src/payment.js       # interactive hunk staging (split commits!)

# Commit types (conventional commits):
git commit -m "feat: add payment processor"
git commit -m "fix: handle network timeout in payment"
git commit -m "refactor: extract payment validation"
git commit -m "docs: update API documentation"
git commit -m "test: add payment unit tests"
git commit -m "chore: update dependencies"

# If you forgot something in the last commit:
git add forgotten-file.js
git commit --amend --no-edit    # amend without changing message
```

### Scenario 3.3: Syncing Feature Branch with Main

```bash
# Option A: Merge (preserves history, creates merge commit)
git checkout feature/my-feature
git merge main
# Pros: preserves exact timeline, safe for shared branches
# Cons: creates merge commits in feature branch history

# Option B: Rebase (linear history, rewrites commits)
git checkout feature/my-feature
git rebase main
# Pros: clean linear history, easier code review
# Cons: rewrites history (NEVER rebase shared/pushed commits)

# Option C: Merge with --no-ff (always creates merge commit)
git checkout main
git merge --no-ff feature/my-feature
# Pros: clearly shows feature branches in history
```

### Scenario 3.4: Stashing Work-in-Progress

```bash
# Save uncommitted changes temporarily
git stash                 # stash tracked files
git stash -u              # stash tracked + untracked files
git stash -a              # stash everything (including ignored)

# List stashes
git stash list
# stash@{0}: WIP on feature: abc1234 feat: add payment
# stash@{1}: WIP on main: def5678 fix: handle timeout

# Apply a stash
git stash pop             # apply + remove from stash list
git stash apply           # apply + keep in stash
git stash apply stash@{1} # apply specific stash

# Create branch from stash
git stash branch feature/new-branch stash@{0}

# Partial stash (stage what you want to keep first, then stash --keep-index)
git add kept-file.js
git stash --keep-index    # stash only unstaged changes

# Drop/clear
git stash drop stash@{1}
git stash clear
```

### Scenario 3.5: Interactive Staging (Partial Commits)

```bash
# Stage portions of a file (split hunks)
git add -p src/large-file.js
# y - stage this hunk
# n - don't stage this hunk
# s - split into smaller hunks
# e - manually edit hunk (advanced)
# q - quit

# Unstage portions of a file
git reset -p src/file.js
```

---

## 4. Merge Conflict Scenarios

### Scenario 4.1: Classic Merge Conflict

```bash
# Two developers modified the same file at the same location
# On branch feature/messages:
git merge main
# Auto-merging src/chat.js
# CONFLICT (content): Merge conflict in src/chat.js
# Automatic merge failed; fix conflicts and then commit the result.

# The conflict markers in the file:
<<<<<<< HEAD
console.log("Feature version");
=======
console.log("Main version");
>>>>>>> main

# Fix: Edit to desired resolution:
console.log("Feature version with main fix");

# Then:
git add src/chat.js
git commit -m "merge: resolve conflict in chat.js"
```

### Scenario 4.2: Deleted File Conflict

```bash
# Developer A renamed a file, Developer B modified it
# CONFLICT (rename/delete): file.js renamed to new.js in HEAD, but deleted in main

git rm file.js          # If you want to keep the rename
git add new.js

# OR
git rm new.js           # If you want to keep the deletion
git add file.js
```

### Scenario 4.3: Directory/File Conflict

```bash
# Branch A created a file, Branch B created a directory with the same name
# CONFLICT (file/directory): src/utils

# Solution:
git mv src/utils src/utils_bak   # Rename the conflicting file
git add -A
git commit -m "fix: resolve file/directory conflict"
```

### Scenario 4.4: Merge Conflict During Rebase

```bash
git rebase main
# First, rewind HEAD to replay your work on top of it...
# Applying: feat: add payment
# Using index info to reconstruct a base tree...
# Falling back to patching base and 3-way merge...
# CONFLICT (content): Merge conflict in src/payment.js

# Fix the conflict, then:
git add src/payment.js
git rebase --continue    # Continue to next commit in the rebase
# OR
git rebase --skip        # Skip this commit entirely
# OR
git rebase --abort       # Cancel the entire rebase
```

### Scenario 4.5: Conflict Resolution Tools

```bash
# Use mergetool (configure once)
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd "code --wait \$MERGED"
git mergetool
# This opens the configured tool with three-way merge view

# For simple conflicts, Git's CLI markers are often faster:
# 1. Search for conflict markers
git diff --check         # Check for unresolved conflicts
# 2. Accept theirs or ours entirely for a file
git checkout --ours src/file.js      # Keep our version
git checkout --theirs src/file.js    # Keep their version
# 3. Then add and continue
git add src/file.js
```

---

## 5. Rebasing Scenarios

### Scenario 5.1: Interactive Rebase (Clean Up Local Commits)

```bash
# Before pushing, clean up your commits
git log --oneline -10
# abc1234 WIP: trying something
# def5678 fix: typo
# ghi9012 feat: implement payment
# jkl3456 chore: add comment
# mno7890 feat: add payment validation

# Squash WIP and fixup commits into meaningful commits
git rebase -i HEAD~5

# In editor:
# pick ghi9012 feat: implement payment
# squash mno7890 feat: add payment validation     # combine with previous
# fixup def5678 fix: typo                           # combine, discard message
# fixup abc1234 WIP: trying something
# pick jkl3456 chore: add comment

# Result: 3 clean commits instead of 5
# fea1234 feat: implement payment (with validation)
# fed5678 chore: add comment
```

### Scenario 5.2: Rebase Onto Another Branch

```bash
# You branched from main, but need to rebase onto release/v2
# before: feature -> main
# after:  feature -> release/v2
git rebase --onto release/v2 main feature
# Takes commits from feature that aren't in main, replays on release/v2
```

### Scenario 5.3: Split a Commit

```bash
# You have one big commit that should be two smaller ones
git rebase -i HEAD~3
# Mark commit as 'edit'
# Stop and edit

git reset HEAD^          # Uncommit but keep changes staged
git add -p src/file.js   # Stage first logical change
git commit -m "feat: add schema"
git add -p src/file.js   # Stage second logical change
git commit -m "feat: add validator"
git rebase --continue
```

### Scenario 5.4: Reorder Commits

```bash
# During interactive rebase, simply reorder lines
git rebase -i HEAD~5
# In editor:
# pick def5678 fix: typo
# pick abc1234 WIP: trying
# pick ghi9012 feat: implement
# Becomes:
# pick ghi9012 feat: implement
# pick def5678 fix: typo
# pick abc1234 WIP: trying
```

### Scenario 5.5: When NOT to Rebase

```bash
# NEVER rebase commits that exist on a shared remote branch
# If you force-push a rebased shared branch, you:
# 1. Rewrite history that others have pulled
# 2. Force them to do git reset --hard or re-clone
# 3. Risk losing their changes

# Safe to rebase: local branches, PR branches (your own)
# NOT safe: main, develop, release/* shared with team

# If you must force-push (e.g., fixing a PR branch):
git push --force-with-lease origin feature/my-feature
# Safer than --force: prevents overwriting remote changes you haven't seen
```

---

## 6. Collaboration & Pull Request Scenarios

### Scenario 6.1: Creating a Pull Request

```bash
# 1. Ensure your branch is up to date
git checkout main
git pull origin main
git checkout feature/my-feature
git rebase main   # or git merge main

# 2. Push feature branch
git push -u origin feature/my-feature

# 3. Create PR on GitHub/GitLab/Bitbucket
# Title: "feat: implement payment processing"
# Description:
# ## What
# - Add Stripe payment processor
# - Handle webhook callbacks
# - Add error handling for declined cards
#
# ## Testing
# - Added unit tests for processor
# - Tested webhook signature verification manually
#
# ## Closes
# Closes #123, #124

# 4. Request reviewers, add labels, link issues
```

### Scenario 6.2: Reviewing a Pull Request

```bash
# Checkout the PR branch locally for testing
git fetch origin pull/123/head:pr-123
git checkout pr-123

# Or using GitHub CLI
gh pr checkout 123

# Test the changes
npm test
npm run build
# Manually verify the feature

# Check what changed
git log main..HEAD --oneline
git diff main...HEAD       # three-dot: changes since branch point
git diff main..HEAD        # two-dot: changes between tips

# Leave review comments on specific lines in GitHub UI
# Approve, request changes, or comment
```

### Scenario 6.3: Addressing PR Feedback

```bash
# Make requested changes
git add src/payment.js
git commit -m "fix: address PR feedback - handle empty webhook payload"

# Push to same branch (updates PR automatically)
git push origin feature/my-feature

# If new commits are too granular, squash before merge
git rebase -i HEAD~3
# squash fixup commits together

# Force push after rebase
git push --force-with-lease origin feature/my-feature
```

### Scenario 6.4: Merging Strategies

```bash
# Three merge options on GitHub:

# 1. Create a merge commit (--no-ff)
# Pros: preserves branch history, easy to revert
# Cons: extra merge commits in main
git checkout main
git merge --no-ff feature/my-feature
git push origin main

# 2. Squash and merge
# Pros: single clean commit in main, linear history
# Cons: loses granular commit history
git checkout main
git merge --squash feature/my-feature
git commit -m "feat: implement payment processing (#123)"

# 3. Rebase and merge (fast-forward)
# Pros: linear history, preserves individual commits
# Cons: every commit must pass CI, harder to revert en masse
git checkout feature/my-feature
git rebase main
git checkout main
git merge feature/my-feature   # fast-forward
git push origin main
```

### Scenario 6.5: Syncing a Fork (Open Source)

```bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Sync fork with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# Create feature from updated main
git checkout -b feature/contribution main
# ... work, push, create PR ...
# When PR is merged, clean up:
git branch -d feature/contribution
git remote remove upstream
```

### Scenario 6.6: Handling Large PR Reviews

```bash
# For very large PRs, review by commits:
git log --oneline main..HEAD
# Check each commit separately:
git show <commit-sha> --stat   # what files changed
git show <commit-sha>          # full diff for commit

# Or review by file:
git diff main...HEAD -- src/important-file.js

# Use GitHub's "View changes" in the Files Changed tab
# Collapse reviewed files, use "Viewed" checkbox
# Request changes if: bugs, security issues, violations of project conventions
# Approve if: code is correct, tested, follows conventions
```

---

## 7. Undoing & Recovery Scenarios

### Scenario 7.1: Undo Last Commit (Keep Changes)

```bash
# Soft reset: undo commit, keep changes staged
git reset --soft HEAD~1

# Mixed reset (default): undo commit, keep changes unstaged
git reset HEAD~1

# Unstage files (but keep changes)
git reset HEAD file.js     # or git restore --staged file.js
```

### Scenario 7.2: Discard Local Changes

```bash
# Discard unstaged changes in working directory
git restore file.js
git restore .               # all files

# Discard staged + unstaged changes (DANGER)
git reset --hard HEAD

# Discard all untracked files
git clean -fd               # -f: force, -d: directories
git clean -fdn              # dry run (preview what would be deleted)
```

### Scenario 7.3: Revert a Pushed Commit

```bash
# Create a new commit that undoes the previous commit (safe for shared history)
git revert HEAD                  # revert last commit
git revert abc1234               # revert specific commit
git revert HEAD~3..HEAD          # revert range of commits
# This creates a new commit with the inverse changes

# If the revert was a mistake, revert the revert:
git revert <revert-commit-sha>
```

### Scenario 7.4: Recover Lost Commits (reflog)

```bash
# git reflog records all HEAD movements (local only, not pushed)
git reflog
# abc1234 HEAD@{0}: commit: feat: add payment
# def5678 HEAD@{1}: reset: moving to HEAD~1
# ghi9012 HEAD@{2}: commit: feat: add validation

# Recover a commit from reflog
git checkout -b recovered-branch ghi9012
# OR
git cherry-pick ghi9012   # apply the commit to current branch

# Reflog expiry: default 90 days for reachable, 30 days for unreachable
git reflog expire --expire=now --all  # clear reflog (rarely needed)
```

### Scenario 7.5: Wrong Branch — Move Commit to Correct Branch

```bash
# You accidentally committed on main instead of feature branch

# Create the correct branch (it will include the commit)
git branch feature/payment

# Reset main back one commit (keep changes if you want)
git reset --hard HEAD~1

# Switch to the feature branch
git checkout feature/payment

# Verify the commit is there
git log --oneline -3
```

### Scenario 7.6: Partial Undo (Unstage Specific Lines)

```bash
# Unstage specific hunks from a file
git reset -p src/file.js

# Discard specific hunks from working directory
git checkout -p src/file.js

# Split a hunk into smaller parts interactively
# s - split
# e - manually edit (delete lines you want to keep)
```

### Scenario 7.7: Fix Author on Last Commit

```bash
git commit --amend --author="Correct Name <email@example.com>" --no-edit

# Rewrite author for multiple commits (interactive rebase, then edit each)
git rebase -i HEAD~5
# Mark commits to edit, then:
git commit --amend --author="Name <email>" --no-edit
git rebase --continue

# Set correct author for all future commits on this repo:
git config user.name "Correct Name"
git config user.email "email@example.com"
```

### Scenario 7.8: Detached HEAD Recovery

```bash
# You're in detached HEAD state (checked out a commit directly, not a branch)
git log --oneline -1
# abc1234 HEAD is at abc1234 some commit

# Create a branch to save your work
git checkout -b rescue-branch

# OR cherry-pick the commit to the correct branch
git checkout main
git cherry-pick abc1234
```

---

## 8. CI/CD & Automation Scenarios

### Scenario 8.1: GitHub Actions — CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Fetch all history for proper diffs

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: coverage/

  build:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - run: npm ci
      - run: npm run build
      - run: npm run build-storybook

      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
```

### Scenario 8.2: GitHub Actions — Deploy to Staging

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Staging
        run: |
          echo "Deploying branch ${{ github.ref_name }} to staging..."
          # Your deploy script here
          ./scripts/deploy.sh staging

      - name: Run Smoke Tests
        run: |
          npx playwright test tests/smoke --project=chromium
          # If smoke tests fail, auto-rollback
          if [ $? -ne 0 ]; then
            echo "Smoke tests failed! Rolling back..."
            ./scripts/rollback.sh staging
            exit 1
          fi

      - name: Notify Team
        if: always()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"text": "Deploy to staging: ${{ job.status }}"}'
```

### Scenario 8.3: Git Hooks (Pre-commit & Pre-push)

```bash
# .husky/pre-commit (using husky + lint-staged)
#!/usr/bin/env sh
npx lint-staged

# package.json for lint-staged
{
  "lint-staged": {
    "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json,yaml}": ["prettier --write"],
    "*.css": ["stylelint --fix"]
  }
}

# .husky/pre-push
#!/usr/bin/env sh
npm run typecheck
npm run test -- --changed

# .husky/commit-msg
#!/usr/bin/env sh
npx --no -- commitlint --edit $1

# commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf']],
  },
};
```

### Scenario 8.4: Auto-merge Dependabot PRs

```yaml
# .github/workflows/dependabot-auto-merge.yml
name: Dependabot Auto-Merge

on: pull_request

permissions:
  pull-requests: write
  contents: write

jobs:
  auto-merge:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Wait for CI
        uses: lewagon/wait-on-check-action@v1
        with:
          check-name: lint-and-test
          ref: ${{ github.event.pull_request.head.sha }}

      - name: Enable Auto-Merge
        run: gh pr merge --auto --squam "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 9. Monorepo & Submodule Scenarios

### Scenario 9.1: Submodules

```bash
# Add submodule (references a specific commit in another repo)
git submodule add https://github.com/company/shared-lib.git libs/shared
git submodule status

# Clone repo with submodules
git clone --recurse-submodules https://github.com/company/main-repo.git
# OR if already cloned:
git submodule update --init --recursive

# Update submodule to latest commit on default branch
cd libs/shared
git checkout main
git pull origin main
cd ../..
git add libs/shared
git commit -m "chore: update shared-lib to latest"

# Pull and update all submodules
git pull --recurse-submodules
git submodule update --remote --merge

# Submodule commands
git submodule foreach 'git checkout main && git pull'
```

### Scenario 9.2: Monorepo with Workspaces (npm/pnpm)

```bash
# Monorepo structure:
my-monorepo/
  package.json          # root: workspaces: ["packages/*"]
  packages/
    core/               # @myorg/core
    web/                # @myorg/web (depends on core)
    api/                # @myorg/api (depends on core)
    shared/             # @myorg/shared (no deps)

# Git workflow for monorepos:
# Option A: Single branch (all packages in same branch)
# - PRs can span multiple packages
# - Atomic changes across packages
# - CI runs all tests, but can optimize to run only affected:

# Detect changed packages:
git diff --name-only origin/main...HEAD
# Filter to specific package directory
git diff --name-only origin/main...HEAD -- packages/core/

# Option B: Independent versioning with changesets
# https://github.com/changesets/changesets
npx changeset init
# Create changeset for each PR
npx changeset
# Version and publish
npx changeset version
npx changeset publish

# Option C: Git subtrees (alternative to submodules)
git subtree add --prefix=libs/shared https://github.com/company/shared-lib.git main
git subtree pull --prefix=libs/shared https://github.com/company/shared-lib.git main
git subtree push --prefix=libs/shared https://github.com/company/shared-lib.git main
```

---

## 10. Security & Compliance Scenarios

### Scenario 10.1: Remove Sensitive Data from History

```bash
# If you committed a password, API key, or secret:

# 1. Use git filter-repo (recommended, faster than filter-branch)
pip install git-filter-repo
git filter-repo --path .env --invert-paths   # remove .env from all history
git filter-repo --path-glob '*.pem' --invert-paths  # remove all .pem files

# 2. Or git-filter-branch (older, slower)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 3. After cleaning, force push
git push origin --force --all

# 4. Rotate the compromised secret immediately
# 5. NOTIFY YOUR TEAM — force push requires everyone to re-clone

# 6. Prevent future secrets from being committed
# Install git-secrets or use a pre-commit hook
npm install -g secrets-sniffer
# OR use .gitignore + pre-commit hook to block secrets
```

### Scenario 10.2: GPG Signing Commits

```bash
# Generate GPG key
gpg --full-generate-key
gpg --list-secret-keys --keyid-format LONG
# sec   rsa4096/ABC123DE... 2024-01-01

# Configure Git to use GPG
git config --global user.signingkey ABC123DE...
git config --global commit.gpgSign true   # sign ALL commits
git config --global tag.gpgSign true       # sign ALL tags

# Or sign individual commits:
git commit -S -m "feat: add payment"

# Show signatures
git log --show-signature
git verify-commit HEAD

# Add GPG key to GitHub:
# 1. Copy public key: gpg --armor --export ABC123DE...
# 2. GitHub Settings -> SSH and GPG keys -> New GPG key

# SSH signing (alternative to GPG, simpler):
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git commit -S -m "feat: add payment"
```

### Scenario 10.3: Signed Tags

```bash
# Create signed tag
git tag -s v1.2.0 -m "Release v1.2.0"
git tag -v v1.2.0             # verify signature

# Lightweight vs annotated vs signed:
git tag v1.0                   # lightweight (no extra info)
git tag -a v1.1.0 -m "msg"    # annotated (has metadata)
git tag -s v1.2.0 -m "msg"    # signed (annotated + GPG signature)

# Push tags
git push origin v1.2.0
git push origin --tags         # push all tags
```

### Scenario 10.4: Branch Protection Rules (GitHub)

```yaml
# GitHub Settings -> Branches -> Branch protection rules
# Recommended rules for main branch:

# ☑ Require pull request reviews before merging
#   - Required approving reviews: 2
#   - Dismiss stale approvals
#   - Require review from Code Owners

# ☑ Require status checks before merging
#   - Require branches to be up to date
#   - Status checks: CI / lint-and-test, CI / build
#   - Require deployment to staging

# ☑ Require signed commits

# ☑ Include administrators (applies rules to admins too)

# ☑ Restrict push (only specific users/teams can push directly)

# ☑ Allow force pushes (never — main should never be force-pushed)

# ☑ Allow deletions (never)
```

### Scenario 10.5: Audit & Compliance

```bash
# View all changes to a specific file
git log --all --follow -- src/sensitive-file.js

# Search commit messages for sensitive keywords
git log --all --grep="password\|secret\|api.key\|token" --oneline

# Show changes containing specific text (useful for audit)
git log -S "API_KEY" --oneline          # commits that added/removed "API_KEY"
git log -G "API_KEY" --oneline          # commits where "API_KEY" appears in diff

# Show all branches containing a commit
git branch -a --contains abc1234

# Show commit stats per author
git shortlog -sn --all --since="2024-01-01"

# Generate a report of changes between tags
git log v1.0.0...v1.1.0 --oneline --no-merges
```

---

## 11. Quick Reference

### 11.1 Essential Commands

```bash
# Setup & Config
git init                                  # create new repo
git clone <url>                           # copy remote repo
git remote add origin <url>               # add remote
git remote -v                             # list remotes

# Basic Workflow
git status                                # show working tree status
git add <file>                            # stage file
git commit -m "msg"                       # commit staged
git log --oneline --graph --decorate      # pretty history
git diff                                  # unstaged changes
git diff --staged                         # staged changes

# Branching
git branch <name>                         # create branch
git checkout <branch>                     # switch branch
git checkout -b <branch>                  # create + switch
git branch -d <branch>                    # delete merged branch
git branch -D <branch>                    # force delete (unmerged)
git branch -a                             # list all branches

# Merging
git merge <branch>                        # merge branch into current
git merge --no-ff <branch>                # always create merge commit
git merge --abort                         # abort conflicted merge

# Rebasing
git rebase <branch>                       # replay commits on top of branch
git rebase -i HEAD~3                      # interactive rebase
git rebase --onto <base> <old> <topic>    # transplant commits
git rebase --continue                     # continue after conflict resolve
git rebase --skip                         # skip a commit
git rebase --abort                        # cancel rebase

# Remote
git fetch origin                         # fetch remote commits (no merge)
git pull origin main                      # fetch + merge
git pull --rebase origin main             # fetch + rebase
git push origin <branch>                  # push branch
git push -u origin <branch>               # push + set upstream
git push origin --delete <branch>         # delete remote branch
git push --tags                           # push tags

# Stash
git stash                                 # stash changes
git stash -u                              # stash including untracked
git stash pop                             # apply + remove from stash
git stash list                            # list stashes

# Undo
git restore <file>                        # discard unstaged changes
git restore --staged <file>                # unstage
git reset --soft HEAD~1                   # undo commit, keep staged
git reset --hard HEAD~1                   # undo commit, discard changes
git revert HEAD                           # create undo commit (safe for shared)
git cherry-pick <sha>                     # apply specific commit

# Log
git log --oneline -10                     # last 10 commits (one line each)
git log --author="name" --since="2 weeks"
git log -p <file>                         # show patch per commit for file
git log --graph --all --oneline --decorate

# Diff
git diff HEAD~2 HEAD                      # diff between two commits
git diff main...feature                   # changes on feature vs main (three-dot)
git diff --stat                           # summary of changes
git diff --name-only                      # just file names

# Tag
git tag <name>                            # lightweight tag
git tag -a v1.0 -m "msg"                 # annotated tag
git tag -d <name>                         # delete local tag
git push origin --delete <tagname>        # delete remote tag

# Search
git grep "pattern"                        # search working tree
git grep "pattern" $(git rev-list --all)  # search entire history
git log -S "text" --oneline               # commits that changed "text"
git bisect start                          # binary search for bug-introducing commit
git bisect bad                            # mark current as bad
git bisect good <sha>                     # mark known-good commit
```

### 11.2 Branch Naming Convention

```
feature/description          # new features (merge to develop/main)
bugfix/issue-description     # bug fixes
hotfix/issue-description     # urgent production fixes (merge to main + develop)
release/version              # release preparation
chore/task-description       # maintenance tasks
docs/description             # documentation changes
refactor/description         # code refactoring
test/description             # adding tests
experiment/description       # experimental work (may be discarded)
```

### 11.3 Conventional Commit Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build
Breaking changes: `feat!: change API` or append `BREAKING CHANGE:` in footer

### 11.4 Common Patterns

```bash
# Squash last N commits into one
git reset --soft HEAD~N && git commit -m "squashed message"

# List files changed between two branches
git diff --name-only main...HEAD

# Show who changed each line of a file (blame)
git blame src/file.js

# Find when a specific line was introduced
git log -S "specific string" --oneline

# Delete all local branches that have been merged
git branch --merged main | grep -v "\* main" | xargs -n 1 git branch -d

# Rename branch
git branch -m old-name new-name

# Pull all submodules to latest
git submodule foreach 'git pull origin main'

# Commit with current date as author date
git commit --date="$(date -R)" -m "msg"

# Show remote URL
git remote get-url origin
```

### 11.5 Useful Aliases

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"
git config --global alias.visual "!gitk"
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.squash "rebase -i"
git config --global alias.wip "!git add -A && git commit -m 'WIP'"
git config --global alias.cleanup "!git branch --merged main | grep -v '\* main' | xargs -r git branch -d"
```

### 11.6 GitHub CLI (gh)

```bash
gh repo create my-repo --public --clone
gh pr create --title "feat: add payment" --body "Description"
gh pr checkout 123
gh pr list --author @me --state open
gh pr review 123 --approve --body "LGTM"
gh pr merge 123 --squash
gh issue list --label bug
gh issue create --title "Bug" --body "Steps to reproduce..."
gh run list --limit 5
gh run watch <run-id>
gh release create v1.0 --notes "First release"
gh auth login
```

### 11.7 Troubleshooting Checklist

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `fatal: not a git repository` | Wrong directory or .git deleted | Check `git rev-parse --git-dir` |
| `Permission denied (publickey)` | SSH key not set up | `ssh-keygen`, add to GitHub |
| `Failed to push some refs` | Remote has new commits | `git pull --rebase` first |
| `CONFLICT` | Parallel changes to same file | Resolve conflicts manually |
| `You are in 'detached HEAD'` | Checked out a commit directly | Create a branch: `git checkout -b name` |
| `Your branch is ahead` | Local commits not pushed | `git push origin branch` |
| `There is no tracking info` | Branch has no upstream | `git push -u origin branch` |
| `refusing to merge unrelated histories` | Merging unrelated repos | `git merge --allow-unrelated-histories` |
| `error: RPC failed` | Large file or network issue | Increase buffer: `git config http.postBuffer 524288000` |
| `LF will be replaced by CRLF` | Line ending mismatch | Configure `core.autocrlf` |

---

*Last updated: May 2026 | Scenario-based Git & GitHub guide for teams of all sizes.*
