# Contribution Guidelines

## Branching Conventions

We follow a structured branching strategy to ensure smooth development and deployment. Below are the details of each branch type:

> **⚠️ IMPORTANT**
>
> - **NEVER** commit or push directly to the `main` branch
> - **ALWAYS** create a feature, bugfix, or docs branch for your work
> - Delete branches after merging

### Main Branch (`main`)

- The `main` branch contains the production-ready code.
- This branch should be stable and contain thoroughly tested code.
- Only updated via `feature`, or `bugfix` branch merges.

### Feature Branches (`feature/*`)

- Feature branches are used to develop new features.
- Each feature branch is created from the `main` branch and is merged back into `main` once the feature is complete and tested.
- Naming convention: `feature/feature-name`

### Bugfix Branches (`bugfix/*`)

- Bugfix branches are used to fix bugs in the `main` branch.
- They are merged back into `main` after the bug is fixed.
- Naming convention: `bugfix/bug-description`

## Branch Naming Guidelines

- Use lowercase letters for all branch names.
- Use hyphens (-) to separate words in branch names.
- Keep names concise but descriptive.
- Examples:
  - `feature/add-login-page`
  - `bugfix/fix-login-route`

## Keeping Your Branch Updated

To stay up-to-date with `main` and reduce merge conflicts, regularly rebase your branch:

1. Make sure your local changes are committed:

   ```bash
   git add .
   git commit -m ":gitmoji: <type> [TAG]: Brief description"
   ```

2. Fetch the latest changes from remote:

   ```bash
   git fetch origin
   ```

3. Rebase your branch on top of `main`:

   ```bash
   git rebase origin/main
   ```

   or

   ```bash
   git rebase origin/main --interactive
   ```

4. If conflicts occur:
   - Resolve them manually
   - Mark them as resolved: `git add <conflicted-files>`
   - Continue the rebase: `git rebase --continue`

5. If you've already pushed the branch before rebasing, force-push it:

   ```bash
   git push --force-with-lease
   ```

## Workflow Examples

### Creating a Feature Branch

1. Create a feature branch:

   ```bash
   git checkout -b feature/awesome-feature main
   ```

2. Work on the feature, commit changes, and push to the remote repository.
3. Create a pull request to merge into `main`
4. After review and approval, merge the feature branch into `main`

### Fixing a Bug

1. Create a bugfix branch:

   ```bash
   git checkout -b bugfix/fix-login main
   ```

2. Fix the bug, commit changes, and push to the remote repository.
3. Create a pull request to merge into `main`
4. After review and approval, merge the bugfix branch into `main`

## Commit Message Guidelines

Write clear, concise commit messages following the Conventional Commits specification combined with our discipline-based tagging:

```md
:gitmoji: <type> [TAG]: Brief description

[optional body]

[optional footer(s)]
```

Where `<type>` is one of:

### General Types

- ✨ `feat`: A new feature
- 🐛 `fix`: A bug fix
- 📝 `docs`: Documentation only changes
- 💄 `style`: Changes that don't affect code meaning (formatting, etc)
- ♻️ `refactor`: Code changes that neither fix a bug nor add a feature
- ✅ `test`: Adding or modifying tests
- 🔧 `chore`: Changes to build process or auxiliary tools
- 👷 `ci`: Changes to CI configuration files and scripts

### Tags

- `[ARCH]`: Software architectural changes or large refactors.
- `[UI]`: Frontend or user interface changes.
- `[BACKEND]`: Backend changes — APIs, logic, auth, DB.
- `[TEST]`: Unit, integration, or e2e testing.
- `[DOCS]`: Documentation updates (user or dev-facing)

### Examples

```md
✨ feat [UI]: Add dark mode toggle

- Implements a switch to toggle between light and dark themes.
- Updates global styles and theme provider.
```

```md
🐛 fix [BACKEND]: Correct null value handling in user service

- Prevents crash when optional fields are missing
```

```md
♻️ refactor [ARCH]: Extract shared validation logic to utility module

- Consolidates validation used in both UI and backend
```

```md
📝 docs [DOCS]: Add setup instructions to README

- Covers local dev setup and common pitfalls
```

### Combined Usage Examples (for multiple commits on the same branch)

```md
Branch: feature/user-authentication

Commits:

- ✨ feat [BACKEND]: Add login and signup API endpoints
- ✨ feat [UI]: Build login and signup forms
- ✅ test [TEST]: Add unit tests for auth module
- 🐛 fix [BACKEND]: Fix incorrect password hashing
- 📝 docs [DOCS]: Document authentication flow in API.md
```
