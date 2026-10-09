# atlassify.io 

> The source code for our atlassify.io website

> Made with Astro.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Logo.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the `docs/` directory, from a terminal:

| Command             | Action                                             |
| :------------------ | :------------------------------------------------- |
| `pnpm install`      | Installs dependencies                              |
| `pnpm run dev`      | Starts local dev server at `http://localhost:4321` |
| `pnpm check`        | Check Astro and TypeScript diagnostics             |
| `pnpm run build`    | Check diagnostics, then build to `./dist/`          |
| `pnpm test`         | Run unit tests with Node.js                        |
| `pnpm test:coverage` | Run tests and write `coverage/lcov.info`           |
| `pnpm run preview`  | Preview your build locally, before deploying       |
| `pnpm astro ...`    | Run CLI commands like `astro add`, `astro check`   |
| `pnpm astro --help` | Get help using the Astro CLI                       |

`pnpm check` reports Astro and TypeScript errors without building the site.
Errors cause a nonzero exit status; warnings and hints remain advisory.
`pnpm build` runs this check before generating production output, including
Netlify builds, and stops if the check fails. Docs CI also runs the check
alongside lint and unit-test coverage for website pull requests and pushes to
`main`.

Build environments must install development dependencies for the checker.
Netlify does this by default; avoid production-only dependency installation
(such as setting `NODE_ENV=production` during installation).

### GitHub API access

Repository stats and download links use GitHub's API. To increase the request
quota, optionally set `GITHUB_TOKEN` in a local `docs/.env` file or your build
environment. A token with access to public repository metadata is sufficient;
do not expose it through a `PUBLIC_` environment variable or commit it.

Requests are shared and cached for five minutes per server/build process,
including failures. API requests time out after five seconds and are not
automatically retried. If GitHub is unavailable or rate-limited, the site uses
cached data when available, otherwise links to GitHub Releases without stats.

Run the API caching and fallback tests with `pnpm test`. Tests also run in the
Docs CI workflow on pull requests and pushes to `main` that affect the website.

Coverage uses c8 with settings in `.c8rc.json`. Docs CI runs
`pnpm test:coverage` and uploads the LCOV report. Atlassify's existing SonarQube
workflow also runs docs coverage before scanning and imports both the app and
docs LCOV reports. Test files are classified as tests, not production sources.
