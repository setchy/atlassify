import { useContext } from 'react';

import Badge from '@atlaskit/badge';
import Checkbox from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { AppContext } from '../../context/App';
import type { FilterSettingsState, FilterValue } from '../../types';
import { formatProperCase } from '../../utils/helpers';
import type { Filter } from '../../utils/notifications/filters';

export interface IFilterSection<T extends FilterValue> {
  title: string;
  filter: Filter<T>;
  filterSetting: keyof FilterSettingsState;
}

export const FilterSection = <T extends FilterValue>({
  title,
  filter,
  filterSetting,
}: IFilterSection<T>) => {
  const { updateFilter, settings, notifications } = useContext(AppContext);

  return (
    <Stack space="space.050">
      <Heading size="small">{title}</Heading>
      <Box>
        {(Object.keys(filter.FILTER_TYPES) as T[]).map((type) => {
          const typeDetails = filter.getTypeDetails(type);
          const typeLabel = formatProperCase(typeDetails.name);
          const isChecked = filter.isFilterSet(settings, type);
          const count = filter.getFilterCount(notifications, type);

          return (
            // <Box key={typeDetails.name} paddingBlock="space.0">
            <Inline
              key={typeDetails.name}
              space="space.050"
              alignBlock="center"
            >
              <Checkbox
                aria-label={typeDetails.name}
                label={typeLabel}
                isChecked={isChecked}
                onChange={(evt) =>
                  updateFilter(filterSetting, type, evt.target.checked)
                }
              />
              {typeDetails.icon && (
                <IconTile
                  icon={typeDetails.icon}
                  label=""
                  appearance={isChecked ? 'blue' : 'gray'}
                  shape="square"
                  size="16"
                />
              )}
              {typeDetails.logo && (
                <typeDetails.logo
                  size="xsmall"
                  appearance={isChecked ? 'brand' : 'neutral'}
                />
              )}
              <Badge max={false} appearance={isChecked ? 'primary' : 'default'}>
                {count}
              </Badge>
            </Inline>
            // </Box>
          );
        })}
      </Box>
    </Stack>
  );
};
