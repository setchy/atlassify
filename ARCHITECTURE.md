# Atlassify Project Architecture

## Overview
Atlassify is a cross-platform desktop app for monitoring notifications from Atlassian Cloud products. Built with Electron, React, and TypeScript, it provides a fast, native experience with customizable filters, themes, and tray/menu bar integration.

## Folder Structure
```
/
├── src/
│   ├── main/        # Electron main process (app lifecycle, events)
│   ├── preload/     # Preload scripts (secure bridge between main & renderer)
│   ├── renderer/    # React UI, stores, hooks, components
│   ├── shared/      # Shared utilities and types
├── assets/          # Static assets (icons, images, sounds)
├── build/           # Build output (bundled JS, HTML, CSS)
├── docs/            # Documentation, FAQs, public site
├── scripts/         # Build and packaging scripts
├── coverage/        # Test coverage reports
├── ...              # Config files, project metadata
```

## Core Components
- **Main Process (`src/main`)**: Handles app lifecycle, system events, tray/menu bar, auto-launch, updater, and IPC communication.
- **Preload (`src/preload`)**: Secure bridge exposing whitelisted APIs to the renderer.
- **Renderer (`src/renderer`)**: React-based UI, state management (stores), hooks, components, and settings.
- **Shared (`src/shared`)**: Common utilities, types, and constants used across main, preload, and renderer.

## Data Flow
- **State Management**: Uses custom stores (e.g., `useSettingsStore`, `useAccountsStore`) for app state and settings.
- **Subscriptions**: Side-effect subscriptions sync store state to Electron APIs and UI.
- **IPC Communication**: Main ↔ Preload ↔ Renderer via secure IPC channels.

## API & Integrations
- **Atlassian API**: Accessed via secure requests, using API tokens with scopes.
- **Third-party Integrations**: Homebrew, Netlify, SonarCloud, GitHub Actions for CI/CD and releases.

## Build & Deployment
- **Build Tools**: Vite for frontend, Electron Builder for packaging.
- **CI/CD**: Automated workflows for linting, testing, building, signing, and releasing.
- **Release Process**: See CONTRIBUTING.md for details.

## Extensibility & Customization
- **Locales**: Add new language files in `src/renderer/i18n/locales`.
- **Themes & Filters**: Customizable via settings store and UI.
- **Components**: Modular React components for easy extension.

## Key Patterns & Conventions
- **TypeScript**: Strong typing throughout.
- **Biome**: Linting and formatting.
- **Testing**: Vitest for unit tests, coverage tracked.
- **Commit Style**: Clear, descriptive commit messages.

## Useful Links
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [README.md](README.md)
- [GitHub Issues](https://github.com/setchy/atlassify/issues)
