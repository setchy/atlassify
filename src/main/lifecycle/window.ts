import { app } from 'electron';
import type { Menubar } from 'electron-menubar';

import { isMacOS } from '../../shared/platform';

import { WindowConfig } from '../config';
import type MenuBuilder from '../menu';

let isQuitting = false;
let appEventsConfigured = false;
let configuredWindows = new WeakSet<Electron.BrowserWindow>();

/**
 * Reset module-level lifecycle flags. Module-level state is unavoidable
 * because `app.on(...)` listeners are registered once at startup; this
 * helper lets tests start each case from a clean slate.
 *
 * @internal
 */
export function __resetWindowLifecycleForTests(): void {
  isQuitting = false;
  appEventsConfigured = false;
  configuredWindows = new WeakSet<Electron.BrowserWindow>();
}

/**
 * Apply the user's "keep window open when it loses focus" preference.
 *
 * Delegates blur behavior to `electron-menubar` without changing window
 * z-order semantics.
 */
export function applyKeepWindowOnBlur(mb: Menubar, value: boolean): void {
  mb.setOption('hideOnBlur', !value);
}

/**
 * Attach window-level event listeners for DevTools and visibility sync.
 *
 * Window close-as-hide, the Wayland half-closed-surface defer, and the
 * Escape-to-hide handler are all provided by `electron-menubar` via
 * `hideOnClose` and `escapeToHide` options (configured in `main/index.ts`).
 *
 * @param mb - The menubar instance whose window events are configured.
 * @param menuBuilder - The menu builder used to keep the Show / Hide tray
 *   menu items in sync with window visibility.
 */
export function configureWindowEvents(
  mb: Menubar,
  menuBuilder: MenuBuilder,
): void {
  const configureCurrentWindow = () => {
    const win = mb.window;
    if (!win || configuredWindows.has(win)) {
      return;
    }
    configuredWindows.add(win);

    win.on('show', () => {
      menuBuilder.setWindowVisibility(true);
    });

    win.on('hide', () => {
      menuBuilder.setWindowVisibility(false);
    });

    win.webContents.on('devtools-opened', () => {
      if (!mb.window) {
        return;
      }

      mb.window.setSize(800, 600);
      mb.window.center();
      mb.window.resizable = true;
    });

    win.webContents.on('devtools-closed', () => {
      if (!mb.window) {
        return;
      }

      mb.window.setSize(WindowConfig.width!, WindowConfig.height!);
      mb.recenterOnTray();
      mb.window.resizable = false;
    });
  };

  mb.on('after-create-window', configureCurrentWindow);
  configureCurrentWindow();

  if (appEventsConfigured) {
    return;
  }
  appEventsConfigured = true;

  app.on('before-quit', () => {
    isQuitting = true;
  });

  /**
   * Safety net: if the WM tears down the window despite our `hideOnClose`
   * preventDefault (a known Wayland edge case), suppress the default
   * Electron quit so the tray icon stays put and `electron-menubar` can recreate
   * the window on the next tray click.
   */
  app.on('window-all-closed', () => {
    if (!isQuitting) {
      return;
    }
    if (!isMacOS()) {
      app.quit();
    }
  });
}
