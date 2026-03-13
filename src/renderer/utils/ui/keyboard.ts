/**
 * Returns `true` if the keyboard event should be ignored by application-level key handlers.
 * Events targeting input/textarea elements or using modifier keys (Meta, Ctrl, Alt) are ignored.
 *
 * @param event - The keyboard event to evaluate.
 * @returns `true` if the event should be ignored, `false` if it should be handled.
 */
export function shouldIgnoreKeyboardEvent(event: KeyboardEvent): boolean {
  return (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey
  );
}

/**
 * Returns the normalized (lowercase) key identifier from a keyboard event.
 *
 * @param event - The keyboard event to read the key from.
 * @returns The lowercase key string (e.g. `'enter'`, `'escape'`, `'a'`).
 */
export function getNormalizedKey(event: KeyboardEvent): string {
  return event.key.toLowerCase();
}
