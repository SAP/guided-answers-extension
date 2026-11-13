---
"@sap/guided-answers-extension-core": patch
"@sap/guided-answers-extension-types": patch
"@sap/guided-answers-extension-webapp": patch
"sap-guided-answers-extension": patch
---

chore: upgrade pnpm to 12.18.0 and migrate ESLint to flat config

- Upgrade pnpm from 8.15.9 to 12.18.0 (supports Node 22 and Node 26)
- Move pnpm overrides from `package.json` to `pnpm-workspace.yaml` (required by pnpm 12)
- Migrate ESLint from legacy `.eslintrc` files to a single flat `eslint.config.mjs` (required by ESLint 10)
- Upgrade `@vscode/vsce` from 2.22.0 to 4.1.1
- Update security overrides to address known CVEs in transitive dependencies
- Fix CI pipeline to use `pnpm/action-setup@v6.1.1` which correctly handles pnpm path setup on Windows
