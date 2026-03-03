# Atlassify Project Architecture

## Overview
Atlassify is a cross-platform desktop app for monitoring notifications from Atlassian Cloud products. Built with Electron, React, and TypeScript, it provides a fast, native experience with customizable filters, themes, and tray/menu bar integration.


## Folder Structure
```
/
├── src/
│   ├── main/        # Electron main process (lifecycle, events, updater, menu, tray)
│   ├── preload/     # Preload scripts (secure bridge between main & renderer)
│   ├── renderer/    # React UI, state, components, hooks, stores, i18n
│   ├── shared/      # Shared utilities, constants, logger
├── assets/          # Static assets (icons, images, sounds)
├── build/           # Build output (bundled JS, HTML, CSS, assets)
├── docs/            # Documentation, FAQs, public site
├── scripts/         # Build and packaging scripts
├── coverage/        # Test coverage reports
├── ...              # Config files, project metadata
```


## Core Components
- **Main Process (`src/main`)**: Handles app lifecycle, system events, tray/menu bar, auto-launch, updater, and IPC communication.
- **Preload (`src/preload`)**: Secure bridge exposing whitelisted APIs to the renderer.
- **Renderer (`src/renderer`)**: React-based UI, state management (stores via [Zustand](https://github.com/pmndrs/zustand)), hooks, components, and settings. Uses [TanStack Query](https://tanstack.com/query/latest) for data fetching and caching.
- **Shared (`src/shared`)**: Common utilities, types, and constants used across main, preload, and renderer.


## Data Flow
- **State Management**: 
  - Uses modular Zustand stores in `src/renderer/stores` for persistent state.
    - `useAccountsStore` - Authenticated accounts
    - `useFiltersStore` - Notification filter settings
    - `useRuntimeStore` - derived notification values for use outside of React components
    - `useSettingsStore` - Atlassify application settings
  - Hooks in `src/renderer/hooks` (e.g., `useNotifications`, `useAccounts`) provide derived state, effects, and business logic. Store subscriptions and selectors optimize reactivity and performance.
- **Subscriptions**: Store subscriptions and effects synchronize state with Electron APIs, system events, and UI updates.
- **IPC Communication**: Main ↔ Preload ↔ Renderer via secure, typed IPC channels for data, commands, and notifications.
- **Background Polling Strategy**: 
  - **Manual Interval Polling**: Uses `useIntervalTimer` with `refetch()` instead of TanStack Query's `refetchInterval` for reliable background updates.
  - **Why**: Electron tray apps have `document.hidden === true` when the window is hidden (normal state for menubar apps). TanStack Query's Page Visibility API would pause `refetchInterval`, breaking background updates.
  - **Solution**: JavaScript `setInterval` continues running regardless of window visibility, ensuring notifications stay fresh even when the app is hidden in the system tray.
  - **Benefits**: Survives system sleep/wake cycles and provides consistent 60-second polling regardless of app state.
- **Mutation Optimizations**: 
  - **Optimistic Updates**: Cache updated immediately on user action (mark as read/unread) for instant UI feedback.
  - **Multi-Query Sync**: Uses `setQueriesData` with `notificationsKeys.all` to update all cached query variations simultaneously.
  - **Error Recovery**: Full rollback of all queries on mutation failure with component-level animation reversal.
  - **Animation Coordination**: Components manage their own exit animations independently of cache updates, decoupling UI timing from data layer.

## UI
- **Component Library**: Uses [Atlassian @atlaskit](https://atlassian.design/components/) for UI components, ensuring a native Atlassian look and feel.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) is used for utility-first styling and layout.
- **Design Tokens**: Atlassian design tokens are integrated for consistent theming and design language across the app.

## API & Integrations
- **Atlassian API**: Accessed via secure requests, using API tokens with scopes.
- **State & Query**: [Zustand](https://github.com/pmndrs/zustand) for state management, [TanStack Query](https://tanstack.com/query/latest) for server state and caching.
- **Third-party Integrations**: Homebrew, Netlify, SonarCloud, GitHub Actions for CI/CD and releases.

## Build & Deployment
- **Build Tools**: Vite for frontend, Electron Builder for packaging.
- **Testing**: [Vitest](https://vitest.dev/) for unit tests and coverage.
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
