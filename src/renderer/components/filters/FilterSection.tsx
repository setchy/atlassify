import { memo, useMemo } from 'react';

import Badge from '@atlaskit/badge';
import Checkbox from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { useAppContext } from '../../hooks/useAppContext';

import useFiltersStore from '../../stores/useFiltersStore';
import type { FiltersState } from '../../stores/types';
import { cn } from '../../utils/cn';
import { formatProperCase } from '../../utils/helpers';
import type { Filter } from '../../utils/notifications/filters';

export interface FilterSectionProps<K extends keyof FiltersState> {
  title: string;
  filter: Filter<FiltersState[K][number]>;
  filterSetting: K;
}

const FilterSectionComponent = <K extends keyof FiltersState>({
  title,
  filter,
  filterSetting,
}: FilterSectionProps<K>) => {
  const { notifications } = useAppContext();
  const updateFilter = useFiltersStore((s) => s.updateFilter);
  // Subscribe to the specific filter state so component re-renders when filters change
  useFiltersStore((s) => s[filterSetting]);

  // Memoize filter counts to avoid recalculating on every render
  const filterCounts = useMemo(() => {
    const counts = new Map<FiltersState[K][number], number>();
    for (const type of Object.keys(
      filter.FILTER_TYPES,
    ) as FiltersState[K][number][]) {
      counts.set(type, filter.getFilterCount(notifications, type));
    }
    return counts;
  }, [notifications, filter]);

  return (
    <Stack space="space.050">
      <Heading size="small">{title}</Heading>
      <Box>
        {(Object.keys(filter.FILTER_TYPES) as FiltersState[K][number][]).map(
          (type) => {
            const typeDetails = filter.getTypeDetails(type);
            const typeLabel = formatProperCase(typeDetails.name);
            const isChecked = filter.isFilterSet(type);
            const count = filterCounts.get(type) ?? 0;

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
                <Badge
                  appearance={isChecked ? 'primary' : 'default'}
                  max={false}
                >
                  {count}
                </Badge>
              </Inline>
            );
          },
        )}
      </Box>
    </Stack>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const FilterSection = memo(
  FilterSectionComponent,
) as typeof FilterSectionComponent;
