import type { AtlassifyNotification } from '../../../types';

export function groupNotifications<T extends string>(
  notifications: AtlassifyNotification[],
  getGroupKey: (n: AtlassifyNotification) => T | undefined,
): Map<T, AtlassifyNotification[]> {
  const groups = new Map<T, AtlassifyNotification[]>();

  for (const notification of notifications) {
    const key = getGroupKey(notification);
    if (!key) {
      continue;
    }

    const group = groups.get(key) ?? [];
    group.push(notification);
    groups.set(key, group);
  }

  return groups;
}

export function sortGroupedEntries<T extends string>(
  entries: [T, AtlassifyNotification[]][],
  alphabetically: boolean,
): [T, AtlassifyNotification[]][] {
  if (alphabetically) {
    return entries.sort((a, b) => a[0].localeCompare(b[0]));
  }
  return entries;
}
