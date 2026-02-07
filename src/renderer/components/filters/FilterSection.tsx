import { useMemo } from 'react';

import Badge from '@atlaskit/badge';
import Checkbox from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { useAppContext } from '../../hooks/useAppContext';

import type { FilterSettingsState, FilterSettingsValue } from '../../types';

import { useNotificationsStore } from '../../stores/notifications';
import { cn } from '../../utils/cn';
import { formatProperCase } from '../../utils/helpers';
import type { Filter } from '../../utils/notifications/filters';
import { filterVisibleNotifications } from '../../utils/notifications/notifications';

export interface FilterSectionProps<T extends FilterSettingsValue> {
  title: string;
  filter: Filter<T>;
  filterSetting: keyof FilterSettingsState;
}

export const FilterSection = <T extends FilterSettingsValue>({
  title,
  filter,
  filterSetting,
}: FilterSectionProps<T>) => {
  const { updateFilter, settings } = useAppContext();

  const allNotifications = useNotificationsStore(
    (state) => state.allNotifications,
  );

  const allVisibleNotifications = useMemo(
    () =>
      allNotifications.map((accountNotifications) => ({
        ...accountNotifications,
        notifications: filterVisibleNotifications(
          accountNotifications.notifications,
          settings,
        ),
      })),
    [allNotifications, settings],
  );

  return (
    <Stack space="space.050">
      <Heading size="small">{title}</Heading>
      <Box>
        {(Object.keys(filter.FILTER_TYPES) as T[]).map((type) => {
          const typeDetails = filter.getTypeDetails(type);
          const typeLabel = formatProperCase(typeDetails.name);
          const isChecked = filter.isFilterSet(settings, type);
          const count = filter.getFilterCount(allVisibleNotifications, type);

          return (
            <Inline
              alignBlock="center"
              key={typeDetails.name}
              space="space.050"
            >
              <Checkbox
                aria-label={typeDetails.name}
                isChecked={isChecked}
                label={typeLabel}
                onChange={() => updateFilter(filterSetting, type, !isChecked)}
              />
              {typeDetails.icon && (
                <IconTile
                  appearance={isChecked ? 'blue' : 'gray'}
                  icon={typeDetails.icon}
                  label=""
                  size="16"
                />
              )}
              {typeDetails.logo && (
                <typeDetails.logo
                  appearance={isChecked ? 'brand' : 'neutral'}
                  shouldUseNewLogoDesign
                  size="xxsmall"
                />
              )}
              {typeDetails.heroicon && (
                <typeDetails.heroicon
                  className={cn(
                    'size-4 p-px rounded border',
                    isChecked
                      ? 'text-atlassify-heroicon-selected-outline bg-atlassify-heroicon-selected-background border-atlassify-heroicon-selected-background'
                      : 'text-atlassify-heroicon-neutral-outline bg-atlassify-heroicon-neutral-background border-atlassify-heroicon-neutral-background',
                  )}
                />
              )}
              <Badge appearance={isChecked ? 'primary' : 'default'} max={false}>
                {count}
              </Badge>
            </Inline>
          );
        })}
      </Box>
    </Stack>
  );
};
