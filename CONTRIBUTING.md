# Atlassify Contributing Guide

Hi, we're really excited that you're interested in contributing to Atlassify! 

Before submitting your contribution, please read through the following guide.

### Project Philosophy

This project is a tool for monitoring new notifications from Atlassian Cloud products.

### Getting Started

To get started:

Clone the repository and install dependencies:
  ```shell
  pnpm install
  ```

Build static resources (tray icons, twemojis, etc). You only need to rebuild if you change static assets:
  ```shell
  pnpm build
  ```

Start development mode (includes GraphQL codegen and hot module reload):
  ```shell
  pnpm dev
  ```

### Tests

There are two main checks:
1. Linter & formatter with [Biome][biome-website]
2. Unit tests with [Vitest][vitest-website]

```shell
# Run biome to check linting and formatting
pnpm lint:check

# Run unit tests with coverage
pnpm test

# Update vitest snapshots
pnpm test -u
```

### Code Style & Conventions

- We use [Biome][biome-website] for linting and formatting. Please run `pnpm lint:check` before submitting a PR.
- Follow existing file and folder naming conventions.
- Keep commit messages clear and descriptive.


### How to Report Bugs or Request Features

If you encounter a bug or have a feature request, please [open an issue][github-issues] with clear steps to reproduce or a detailed description of your idea. Check for existing issues before creating a new one.

### Releases

The release process is automated. Follow the steps below.

1. **Verify features:** Ensure all features and fixes you want included in the release are merged into `main`.
2. **Check dependencies:** Review the [Renovate Dependency Dashboard][github-dependency-dashboard] for any dependency updates you want to include.
3. **Create a release branch:**
  - Name your branch `release/vX.X.X` (e.g., `release/v1.2.3`).
  - Run `pnpm version <new-version-number>` to **bump the version** in `package.json` and create a version commit/tag.
  - Update `sonar.projectVersion` within `sonar-project.properties`
  - Commit and push these changes.
  - Open a Pull Request (PR) from your release branch. 
4. **GitHub release:** GitHub Actions will automatically build, sign, and upload release assets to a new draft release with automated release notes.
5. **Merge the release branch:** Once the PR is approved and checks pass, merge your release branch into `main`.
6. **Publish the release:**
  - Finalize the release notes in the draft release on GitHub.
  - Confirm all assets are present and correct.
  - Publish the release.
7. **Update milestones:**
  - Edit the current [Milestone][github-milestones]:
    - Add a link to the release notes in the description.
    - Set the due date to the release date.
    - Close the milestone.
  - Create a [New Milestone][github-new-milestone] for the next release cycle.


### Locales

Atlassify supports multiple languages/locales.

To add a new locale:
- Add a new locale file under `./src/renderer/i18n/locales`.
- Import and update the resources in `./src/renderer/i18n/index.ts`.
- Use the VSCode Extension `i18n Ally` to automatically translate the keys.
- Carefully verify the translated values. **Do not translate placeholder variables** like `{{ }}`.  You may need to manually update these if needed.


<!-- LINK LABELS -->
[biome-website]: https://biomejs.dev/
[github-dependency-dashboard]: https://github.com/setchy/atlassify/issues/1
[github-issues]: https://github.com/setchy/atlassify/issues
[github-milestones]: https://github.com/setchy/atlassify/milestones
[github-new-milestone]: https://github.com/setchy/atlassify/milestones/new
[github-new-release]: https://github.com/setchy/atlassify/releases/new
[homebrew-cask-autobump-workflow]: https://github.com/Homebrew/homebrew-cask/actions/workflows/autobump.yml
[vitest-website]: https://vitest.dev/

