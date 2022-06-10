# Developer Guide

For general development setup see [README.md -> Development Setup](../README.md#development-setup) at root of this repository.

## Code quality

We enforce code style rules using [ESLint](https://eslint.org/). Execute `pnpm lint` to check your code for style issues. You may also find an ESLint integration for your favorite IDE [here](https://eslint.org/docs/user-guide/integrations).

You can fix auto-fixable problems by running:
```shell
pnpm lint:fix
```

In addition to ESLint, we run [SonarCloud](https://sonarcloud.io/project/overview?id=SAP_guided-answers-extension) scans.

## Create changesets for feature or bug fix branches

A [changeset](https://github.com/atlassian/changesets) workflow has been setup to version and publish release to this GitHub repository. To create changesets in a feature or bug fix branch, run one the following command:

```shell
pnpm changeset
```

This command brings up an [inquirer.js](https://github.com/SBoudrias/Inquirer.js/) style command line interface with prompts to capture changed packages, bump versions (patch, minor or major) and a message to be included in the changelog files. The changeset configuration files in the `.changeset` folder at the root need to be committed and pushed to the branch. These files will be used in the GitHub Actions workflow to bump versions and publish the packages.

The general recommendation is to run this changeset command after a feature or bug fix is completed and before creating a pull request. 

A GitHub bot [changeset-bot](https://github.com/apps/changeset-bot) has been enabled that adds a comment to pull requests with changeset information from the branch and includes a warning when no changesets are found. If a changeset was found, a new [GitHub release](https://github.com/SAP/guided-answers-extension/releases) will be created.