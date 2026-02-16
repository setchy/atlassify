# Atlassify

[![CI Workflow][ci-workflow-badge]][github-actions] [![Release Workflow][release-workflow-badge]][github-actions] [![Netlify Status][netlify-badge]][netlify-deploys] [![Coverage][coverage-badge]][coverage] [![Quality Gate Status][quality-badge]][quality] [![Contributors][contributors-badge]][github] [![OSS License][license-badge]][license] [![Renovate enabled][renovate-badge]][renovate] [![Downloads - Total][downloads-total-badge]][website] [![Downloads - Latest Release][downloads-latest-badge]][website] [![Latest Release][github-release-badge]][github-releases] [![wakatime][wakatime-badge]][watatime]

> Atlassian notifications on your menu bar. Available on macOS, Windows and Linux.

![Atlassify][social]

---


## Features

- 🔔 Unified notifications from Atlassian Cloud products
- 💻 Cross-platform: macOS, Windows, and Linux
- 🎨 Customizable settings, filters and themes
- 🖥️ Tray/menu bar integration
- ⚡ Fast, native experience
- 🌐 Multi-language/localization support


## Quick Start

1. **Download** Atlassify for free from [atlassify.io][website].
2. **Install** and launch the app for your platform.
3. **Authenticate** with your Atlassian account and start receiving notifications.

#### Experimental 
macOS users can also install via [Homebrew][brew]
```shell
brew install --cask setchy/brews/atlassify
```


## Build & Development

To build and run Atlassify locally:

```shell
pnpm install
pnpm build
pnpm dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full development and contribution instructions.


## FAQ

See our [Atlassify FAQs][faqs] for answers to common questions.


## Community & Support

- Open an [issue][github-issues] for bugs or feature requests
- See [CONTRIBUTING.md](CONTRIBUTING.md) for more ways to get involved


## License

Atlassify is licensed under the MIT Open Source license. See [LICENSE](LICENSE) for details.


## Acknowledgements

I would like to acknowledge the following projects and resources that have inspired and contributed to the development of Atlassify:

1. [Gitify][attribution-gitify] – An open-source GitHub notification app, which I am the lead maintainer of, served as the launchpad for Atlassify.
2. [Atlassian Design System][attribution-atlassian] – The design principles and UI components (@atlaskit) from Atlassian have helped shape the user interface of Atlassify.


<!-- LINK LABELS -->
[social]: docs/public/images//social.png
[website]: https://atlassify.io
[faqs]: https://atlassify.io/faq

[attribution-gitify]: https://gitify.io
[attribution-atlassian]: https://atlassian.design

[github]: https://github.com/setchy/atlassify
[github-actions]: https://github.com/setchy/atlassify/actions
[github-issues]: https://github.com/setchy/atlassify/issues
[github-releases]: https://github.com/setchy/atlassify/releases/latest
[github-website]: https://github.com/setchy/atlassify-website
[github-website-pulls]: https://github.com/setchy/atlassify-website/pulls
[brew]: https://brew.sh

[coverage-badge]: https://img.shields.io/sonar/coverage/setchy_atlassify?server=https%3A%2F%2Fsonarcloud.io&logo=sonarqubecloud
[coverage]: https://sonarcloud.io/summary/new_code?id=setchy_atlassify
[quality-badge]: https://img.shields.io/sonar/quality_gate/setchy_atlassify?server=https%3A%2F%2Fsonarcloud.io&logo=sonarqubecloud
[quality]: https://sonarcloud.io/summary/new_code?id=setchy_atlassify

[ci-workflow-badge]: https://img.shields.io/github/actions/workflow/status/setchy/atlassify/ci.yml?logo=github&label=CI
[release-workflow-badge]: https://img.shields.io/github/actions/workflow/status/setchy/atlassify/release.yml?logo=github&label=Release
[downloads-total-badge]: https://img.shields.io/github/downloads/setchy/atlassify/total?label=downloads@all&logo=github
[downloads-latest-badge]: https://img.shields.io/github/downloads/setchy/atlassify/latest/total?logo=github
[contributors-badge]: https://img.shields.io/github/contributors/setchy/atlassify?logo=github
[github-release-badge]: https://img.shields.io/github/v/release/setchy/atlassify?logo=github
[license]: LICENSE
[license-badge]: https://img.shields.io/github/license/setchy/atlassify?logo=github
[netlify-badge]: https://api.netlify.com/api/v1/badges/8e836542-4728-433c-9b38-17b98edea7aa/deploy-status
[netlify-deploys]: https://app.netlify.com/projects/atlassify/deploys
[renovate]: https://github.com/setchy/atlassify/issues/1
[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovate&logoColor=white
[wakatime-badge]: https://wakatime.com/badge/user/2b948ae2-4be1-4020-8a57-7de60b53fe1d/project/60db4d24-0691-43a4-8762-9823d1ad5784.svg
[watatime]: https://wakatime.com
