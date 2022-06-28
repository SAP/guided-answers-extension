# Developer Guide

For general development setup see [README.md -> Development Setup](../README.md#development-setup) at root of this repository.

## Code quality

We enforce code style rules using [ESLint](https://eslint.org/). Execute `pnpm lint` to check your code for style issues. You may also find an ESLint integration for your favorite IDE [here](https://eslint.org/docs/user-guide/integrations).

You can fix auto-fixable problems by running:
```shell
pnpm lint:fix
```

In addition to ESLint, we run [SonarCloud](https://sonarcloud.io/project/overview?id=SAP_guided-answers-extension) scans to check code quality and code security.

## Create changesets for feature or bug fix branches

A [changeset](https://github.com/atlassian/changesets) workflow has been setup to version and publish release to this GitHub repository. To create changesets in a feature or bug fix branch, run one the following command:

```shell
pnpm changeset
```

This command brings up an [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) style command line interface with prompts to capture changed packages, bump versions (patch, minor or major) and a message to be included in the changelog files. The changeset configuration files in the `.changeset` folder at the root need to be committed and pushed to the branch. These files will be used in the GitHub Actions workflow to bump versions and publish the packages.

The general recommendation is to run this changeset command after a feature or bug fix is completed and before creating a pull request. 

A GitHub bot [changeset-bot](https://github.com/apps/changeset-bot) has been enabled that adds a comment to pull requests with changeset information from the branch and includes a warning when no changesets are found. If a changeset was found, a new [GitHub release](https://github.com/SAP/guided-answers-extension/releases) will be created.

## Git Guidelines

We adhere to the [Conventional Commits](https://conventionalcommits.org) specification. Commit message validation is enforced using [husky](https://github.com/typicode/husky) Git hook `commit-msg`, which runs [`@commitlint/cli`](https://github.com/conventional-changelog/commitlint) to validate against config [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).

### Commit Message Style
The commit message consists of three parts:
- header
- body (optional)
- footer (optional)

#### Commit Header
The commit header is the first line of the commit message. It consists of three parts: type, scope and description.

##### Commit Type
- It must be one of the following:
    + `fix` - a bug fix (note: this will indicate a release)
    + `feat` - a new feature (note: this will indicate a release)
    + `docs` - documentation only changes
    + `style` - changes that do not affect the meaning of the code
    + `refactor` - a code change that neither fixes a bug nor adds a feature
    + `perf` - a code change that improves performance
    + `test` - adding missing tests
    + `chore` - changes to the build process or auxiliary tools and libraries such as documentation generation
    + `revert` - revert to a commit
    + `WIP` - work in progress

##### Commit Scope (optional)
- It points to a specific component which is affected by the change. For example, ui5-button, ui5-card and ui5-table.

##### Commit Description
- Use the **imperative present tense**. Instead of "I added feature xy" or "Adding tests for" use "Add feature xy" or "Add tests for".
- It should be no more than **100 characters** long.


#### Commit Body (optional)
After the commit header, there should be an empty line followed by the optional commit body.
- Describe the intention and reasoning of the change.

#### Commit Footer (optional)
After the optional commit body, there should be an empty line followed by the optional footer.
- If the change introduces a breaking change, it should start with **BREAKING CHANGE:** followed by a description of the change.
    + `BREAKING CHANGE: remove support for UI5 version 1.38`
- If the change fixes an issue reported on GitHub, add the following line to the commit message:
    + `Fixes #<issueNumber>` (e.g. `Fixes #42`)
