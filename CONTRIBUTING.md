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

Releases are automated with [release-please][release-please]. There is no release branch and no manual version bump.

1. **Merge changes into `main`.** Use [Conventional Commits][conventional-commits] for PR titles (`feat:`, `fix:`, `docs:`, `chore(deps):`, and so on). The title determines the version bump and changelog section.
2. **Review the release PR.** Release-please keeps a `chore: release X.Y.Z` pull request current as changes land. It updates `package.json`, `.release-please-manifest.json`, `CHANGELOG.md`, and `sonar.projectVersion`. Review the [Renovate Dependency Dashboard][github-dependency-dashboard] for updates to include before shipping.
3. **Merge the release PR when ready to ship.** GitHub Actions creates a draft release, validates the app, builds and signs macOS, Windows, and Linux artifacts, and publishes only after every platform succeeds. Publication creates the `vX.Y.Z` tag, then the release workflow redeploys the website and allows update clients to discover the release.
4. **Optionally update milestones.** Add the release link and date to the current [Milestone][github-milestones], close it, and create a [New Milestone][github-new-milestone] for the next cycle.

#### Release automation prerequisites

- Repository Actions permissions must allow GitHub Actions to create and approve pull requests.
- The `release` label must exist, and the semantic-title and auto-label checks must be allowed on release-please PRs.
- Branch protection for `main` must require the normal CI and triage checks; it must not require a `release/v*` branch.
- Repository secrets must include `APTABASE_KEY`, `SONAR_TOKEN`, `CSC_LINK`, `CSC_KEY_PASSWORD`, `WIN_CSC_LINK`, `WIN_CSC_KEY_PASSWORD`, `APPLE_ID_USERNAME`, `APPLE_ID_PASSWORD`, `APPLE_ID_TEAM_ID`, and `NETLIFY_BUILD_HOOK_URL`.
- The release and publish jobs use least-privilege `contents: write` and `pull-requests: write` permissions; validation jobs remain read-only.

For a signing-only check, manually run the Publish workflow with an empty tag. Supplying a tag publishes that existing draft after all platform jobs succeed.


### Locales

Atlassify supports multiple languages/locales.

To add a new locale:
- Add a new locale file under `./src/renderer/i18n/locales`.
- Import and update the resources in `./src/renderer/i18n/index.ts`.
- Use the VSCode Extension `i18n Ally` to automatically translate the keys.
- Carefully verify the translated values. **Do not translate placeholder variables** like `{{ }}`.  You may need to manually update these if needed.


<!-- LINK LABELS -->
[biome-website]: https://biomejs.dev/
[conventional-commits]: https://www.conventionalcommits.org
[github-dependency-dashboard]: https://github.com/setchy/atlassify/issues/1
[github-issues]: https://github.com/setchy/atlassify/issues
[github-milestones]: https://github.com/setchy/atlassify/milestones
[github-new-milestone]: https://github.com/setchy/atlassify/milestones/new
[github-new-release]: https://github.com/setchy/atlassify/releases/new
[homebrew-cask-autobump-workflow]: https://github.com/Homebrew/homebrew-cask/actions/workflows/autobump.yml
[release-please]: https://github.com/googleapis/release-please
[vitest-website]: https://vitest.dev/

