import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

  return (
    <Page id="filters">
      <Header fetchOnBack={true}>{t('filters.title')}</Header>

      <Contents>
        <Box paddingInlineStart="space.400">
          <Inline space="space.200">
            <Stack space="space.200">
              <FilterSection
                title={t('filters.time_sensitive.title')}
                filter={timeSensitiveFilter}
                filterSetting="filterTimeSensitive"
              />

              <FilterSection
                title={t('filters.category.title')}
                filter={categoryFilter}
                filterSetting="filterCategories"
              />

              <FilterSection
                title={t('filters.actors.title')}
                filter={actorFilter}
                filterSetting="filterActors"
              />

              <FilterSection
                title={t('filters.read_state.title')}
                filter={readStateFilter}
                filterSetting="filterReadStates"
              />
            </Stack>

            <Stack>
              <FilterSection
                title={t('filters.products.title')}
                filter={productFilter}
                filterSetting="filterProducts"
              />
            </Stack>
          </Inline>
        </Box>
      </Contents>

      <Footer justify="end">
        <Button
          title={t('filters.actions.clear')}
          onClick={clearFilters}
          appearance="discovery"
          spacing="compact"
          testId="filters-clear"
        >
          {t('filters.actions.clear')}
        </Button>
      </Footer>
    </Page>
  );
};
