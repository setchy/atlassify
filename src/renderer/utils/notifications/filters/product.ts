import type {
  AccountNotifications,
  AtlassifyNotification,
  ProductName,
  SettingsState,
} from '../../../types';

export function hasProductFilters(settings: SettingsState) {
  return settings.filterProducts.length > 0;
}

export function isProductFilterSet(
  settings: SettingsState,
  product: ProductName,
) {
  return settings.filterProducts.includes(product);
}

export function getProductFilterCount(
  notifications: AccountNotifications[],
  product: ProductName,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo +
      acc.notifications.filter((n) => filterNotificationByProduct(n, product))
        .length,
    0,
  );
}

export function filterNotificationByProduct(
  notification: AtlassifyNotification,
  product: ProductName,
): boolean {
  return notification.product.name === product;
}
