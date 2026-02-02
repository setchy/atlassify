# Atlassify Contributing Guide

Hi, we're really excited that you're interested in contributing to Atlassify! 

Before submitting your contribution, please read through the following guide.

### Project Philosophy

This project is a tool for monitoring new notifications from Atlassian.

### Installation

To get started, you'll need to clone the repository and install the dependencies.

```shell
pnpm install
```

### Development


To watch for changes (`webpack`) in the `src` directory:

```shell
pnpm watch
```

To run the **electron app**:

```shell
pnpm start
```

To reload the app with the changes that `pnpm watch` has detected, you can use the `CmdOrCtrl+R` shortcut.

### Tests

There are 2 checks:
1. linter & formatter with [biome][biome-website]
2. unit tests with [vitest][vitest-website]

```shell
# Run biome to check linting and formatting
pnpm lint:check

# Run unit tests with coverage
pnpm test

# Update vitest snapshots
pnpm test -u
```

### Releases

The release process is automated. Follow the steps below.

1. Verify that all features you want targeted in the release have been merged to `main`.
2. Check the [Renovate Dependency Dashboard][github-dependency-dashboard] to see if there are any updates you want included.
3. Create a [new **draft** release][github-new-release]. Set the tag version to something with the format of `v1.2.3`. Save as a **draft** before moving to the next step
4. Create a branch that starts with `release/vX.X.X` (ie. `release/v1.2.3`).  In this branch you need to:
  * Run `pnpm version <new-version-number` to **bump the version** of the app. 
  * Commit these changes and open a PR. A GitHub Actions workflow will build, sign and upload the release assets for each commit to that branch as long as a branch is named like `release/vX.X.X` and there is a draft release with the same version number(`package.json`).
5. Merge your release branch into `main`.
6. Publish the release once you've finalized the release notes and confirmed all assets are there.
7. Edit current [Milestone][github-milestones] to have: 
   * description: link to the release notes
   * due date: date of release
   * close milestone
8. Create a [New Milestone][github-new-milestone] for upcoming release.


### Locales

Atlassify supports multiple languages / locales.

To add new locales
- Add a new locale file under `./src/renderer/i18n/locales`
- Import and update the resources in `./src/renderer/i18n/index.ts`
- Use the VSCode Extensions `i18n Ally` to automatically translate the keys
- Verify the translated values. It's important that the placeholder variables `{{ }}` are not translated.  You may need to manually update these.


<!-- LINK LABELS -->
[biome-website]: https://biomejs.dev/
[github-dependency-dashboard]: https://github.com/setchy/atlassify/issues/1
[github-milestones]: https://github.com/setchy/atlassify/milestones
[github-new-milestone]: https://github.com/setchy/atlassify/milestones/new
[github-new-release]: https://github.com/setchy/atlassify/releases/new
[homebrew-cask-autobump-workflow]: https://github.com/Homebrew/homebrew-cask/actions/workflows/autobump.yml
[vitest-website]: https://vitest.dev/

