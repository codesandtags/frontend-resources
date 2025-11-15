# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the frontend-resources repository.

## Active Workflow

### `check-readme.yml`

**Purpose**: Validates that README.md is in sync with resources.json

**When it runs**:

- On pull requests when `resources.json`, `generator.ts`, or `layout.json` are modified
- On pushes to main/master branch when these files are modified

**What it does**:

- Generates README.md from resources.json
- Checks if the generated README.md matches the committed version
- Fails the CI check if they don't match, requiring manual update
- Provides clear error messages with instructions on how to fix

**Why this approach**:

- ✅ Ensures README.md changes are reviewed before merging
- ✅ Contributors can see exactly what changed in the README
- ✅ Prevents accidental or unwanted README updates
- ✅ Maintains clean PR history with intentional commits

## Manual Update

To manually update README.md:

```bash
npm run generate:readme
```

Then commit the changes:

```bash
git add README.md
git commit -m "chore: update README.md"
```
