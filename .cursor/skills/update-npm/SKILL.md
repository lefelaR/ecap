---
name: update-npm
description: >-
  Clean-reinstall and update frontend npm packages on Node 24. Use when the user
  asks to update packages, refresh dependencies, fix npm deprecations, or
  reinstall node_modules in frontend/.
---

# Update Frontend Packages

Run this workflow in order. All commands target `frontend/` unless noted.

## Workflow

```
Task Progress:
- [ ] Step 1: Delete node_modules
- [ ] Step 2: Use Node 24 via nvm
- [ ] Step 3: Install packages
- [ ] Step 4: Resolve deprecations
- [ ] Step 5: Verify build
```

### Step 1: Delete node_modules

Remove the existing install:

```bash
rm -rf frontend/node_modules
```

Do not delete `package.json` or `package-lock.json`.

### Step 2: Use Node 24 via nvm

Ensure Node v24 is active before installing:

```bash
cd frontend
source ~/.nvm/nvm.sh
nvm use
node -v
```

- `frontend/.nvmrc` pins the required version (Node 24).
- If `nvm use` fails, run `nvm install` then `nvm use`.
- Confirm `node -v` reports v24.x — do not proceed on io.js or Node versions below 18.

### Step 3: Install packages

```bash
npm install
```

Capture deprecation warnings from the install output.

### Step 4: Resolve deprecations

1. List outdated packages:

```bash
npm outdated
```

2. For each deprecation or outdated package:
   - Prefer patch/minor updates within the same major version.
   - Update `frontend/package.json` with the target version.
   - Run `npm install` again after changes.

3. Common fixes:
   - Align `eslint-config-next` with the installed `next` version.
   - Align `@types/react` and `@types/react-dom` with the installed `react` version.
   - Replace packages flagged as deprecated with their recommended replacements when npm suggests one.

4. For major version bumps (e.g. Next.js, ESLint), check breaking changes before upgrading. If risky, update everything else first and note the major bump for the user.

5. Repeat `npm install` until deprecation warnings are resolved or only unavoidable transitive warnings remain. Document any that cannot be fixed without a major upgrade.

### Step 5: Verify build

```bash
npm run build
```

If the build fails, fix dependency or compatibility issues before finishing. Report what was updated and any remaining deprecations.

## Rules

- Run commands yourself; do not only instruct the user.
- Work from `frontend/` after step 2.
- Do not commit unless the user explicitly asks.
- Do not modify `.env` or commit secrets.
