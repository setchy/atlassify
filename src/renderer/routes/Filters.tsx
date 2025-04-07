import { type FC, useContext } from 'react';

import Button from '@atlaskit/button/new';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { FilterSection } from '../components/filters/FilterSection';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';
import { AppContext } from '../context/App';

import {
  actorFilter,
  categoryFilter,
  productFilter,
  readStateFilter,
  timeSensitiveFilter,
} from '../utils/notifications/filters';

export const FiltersRoute: FC = () => {
  const { clearFilters } = useContext(AppContext);

  return (
    <Page id="filters">
      <Header fetchOnBack={true}>Filters</Header>

      <Contents>
        <Box paddingInlineStart="space.400">
          <Inline space="space.200">
            <Stack space="space.200">
              <FilterSection
                title="Time Sensitive"
                filter={timeSensitiveFilter}
                filterSetting="filterTimeSensitive"
              />

              <FilterSection
                title="Category"
                filter={categoryFilter}
                filterSetting="filterCategories"
              />

              <FilterSection
                title="Actors"
                filter={actorFilter}
                filterSetting="filterActors"
              />

              <FilterSection
                title="Read State"
                filter={readStateFilter}
                filterSetting="filterReadStates"
              />
            </Stack>

            <Stack>
              <FilterSection
                title="Products"
                filter={productFilter}
                filterSetting="filterProducts"
              />
            </Stack>
          </Inline>
        </Box>
      </Contents>

      <Footer justify="end">
        <Button
          title="Clear Filters"
          onClick={clearFilters}
          appearance="discovery"
          spacing="compact"
          testId="filters-clear"
        >
          Clear Filters
        </Button>
      </Footer>
    </Page>
  );
};
