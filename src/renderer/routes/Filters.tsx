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
                filter={timeSensitiveFilter}
                filterSetting="filterTimeSensitive"
                title={t('filters.time_sensitive.title')}
              />

              <FilterSection
                filter={categoryFilter}
                filterSetting="filterCategories"
                title={t('filters.category.title')}
              />

              <FilterSection
                filter={actorFilter}
                filterSetting="filterActors"
                title={t('filters.actors.title')}
              />

              <FilterSection
                filter={readStateFilter}
                filterSetting="filterReadStates"
                title={t('filters.read_state.title')}
              />
            </Stack>

            <Stack>
              <FilterSection
                filter={productFilter}
                filterSetting="filterProducts"
                title={t('filters.products.title')}
              />
            </Stack>
          </Inline>
        </Box>
      </Contents>

      <Footer justify="end">
        <Button
          appearance="discovery"
          onClick={clearFilters}
          spacing="compact"
          testId="filters-clear"
          title={t('filters.actions.clear')}
        >
          {t('filters.actions.clear')}
        </Button>
      </Footer>
    </Page>
  );
};
