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

## State Management

The app uses a deliberate three-layer approach. Use the following decision rule when choosing where state belongs:

| Layer                        | Use when                                                                       | Examples                                                  |
| ---------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| **Zustand (persisted)**      | Data must survive app restarts; serialisable config or credentials             | `useAccountsStore`, `useFiltersStore`, `useSettingsStore` |
| **Zustand (non-persisted)**  | Volatile state that must be readable _outside_ React (e.g. tray subscriptions) | `useRuntimeStore`                                         |
| **AppContext + React Query** | Ephemeral, async, React-lifecycle-bound state; cannot be serialised            | notifications, loading/error status, mutations            |

**Persisted Zustand stores** (`src/renderer/stores`):

- `useAccountsStore` — Authenticated accounts; tokens are encrypted via `electron.safeStorage` before being written to local storage.
- `useFiltersStore` — Active notification filter values (products, categories, read-states, etc.).
- `useSettingsStore` — All UI and behaviour preferences (theme, zoom, shortcuts).

**Non-persisted Zustand store**:

- `useRuntimeStore` — The React→Electron bridge. The `useNotifications` hook writes filtered counts and error state into this store each render, so that `subscriptions.ts` (which runs outside of React) can read pre-filtered values without re-applying filter logic or touching the React Query cache.

**AppContext** (`src/renderer/context/AppContext.tsx`):

- Acts as a façade/coordinator, not a `useState` holder. It composes hooks and stores into a single stable, memoised context value that route-level components consume via `useAppContext()`.
- Does **not** hold persistent config — components that need settings, filters, or account data access those stores directly, avoiding unnecessary re-renders.

**Subscriptions** (`src/renderer/stores/subscriptions.ts`): Store subscriptions synchronize state with Electron APIs and system events (e.g. updating the tray icon when notification counts change).

## Hooks

All hooks live in `src/renderer/hooks`. Each hook has a single, named responsibility.

**Data fetching**:

- `useNotifications` — Fetches, filters, and caches notifications via React Query. Applies `useFiltersStore` values as a `select` transformer (instant filtering, no re-fetch). Writes filtered counts into `useRuntimeStore` for tray updates.
- `useAccounts` — Periodically refreshes authenticated account profiles (1hr interval).

**Lifecycle & side-effects** (called inside `AppProvider`):

- `useOnlineSync` — Subscribes to TanStack Query's `onlineManager` and keeps `useRuntimeStore.isOnline` in sync. Also corrects `onlineManager`'s initial state from `navigator.onLine` on mount.
- `useAppReset` — Listens for the `onResetApp` IPC event and calls `reset()` on every persisted store. Add new persisted stores here.
- `useKeyboardNavigation` — Tracks the focused notification ID for keyboard traversal.
- `useGlobalShortcuts` — Registers system-level keyboard shortcuts from settings.

**Utilities**:

- `useIntervalTimer` — Wraps `setInterval` for reliable background polling regardless of window visibility (see polling strategy below).
- `useNavigationAnalytics` — Tracks route transitions.
- `useAppContext` — Type-safe accessor for `AppContext`; throws if used outside `AppProvider`.

**IPC Communication**: Main ↔ Preload ↔ Renderer via secure, typed IPC channels for data, commands, and notifications.

## Data Flow

- **Background Polling Strategy**:
  - **Manual Interval Polling**: Uses `useIntervalTimer` with `refetch()` instead of TanStack Query's `refetchInterval` for reliable background updates.
  - **Why**: Electron tray apps have `document.hidden === true` when the window is hidden (normal state for menubar apps). TanStack Query's Page Visibility API would pause `refetchInterval`, breaking background updates.
  - **Solution**: JavaScript `setInterval` continues running regardless of window visibility, ensuring data stays fresh even when the app is hidden in the system tray.
  - **Benefits**: Survives system sleep/wake cycles and provides consistent polling (60s for notifications, 1hr for accounts) regardless of app state.
  - **Implementation**: Applied in both `useNotifications` (60s interval) and `useAccounts` (1hr interval) hooks.
- **Mutation Optimizations**:
  - **Optimistic Updates**: Cache updated immediately on user action (mark as read/unread) for instant UI feedback.
  - **Multi-Query Sync**: Uses `setQueriesData` with `notificationsKeys.all` to update all cached query variations simultaneously.
  - **Error Recovery**: Full rollback of all queries on mutation failure.
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
