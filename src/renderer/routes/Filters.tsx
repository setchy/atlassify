import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@atlaskit/button/new';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { AppContext } from '../context/App';

import { FilterSection } from '../components/filters/FilterSection';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';

import {
  actorFilter,
  categoryFilter,
  engagementFilter,
  productFilter,
  readStateFilter,
} from '../utils/notifications/filters';

export const FiltersRoute: FC = () => {
  const { clearFilters } = useContext(AppContext);

  const { t } = useTranslation();

  return (
    <Page testId="filters">
      <Header fetchOnBack={true}>{t('filters.title')}</Header>

      <Contents>
        <Box paddingBlockEnd="space.200" paddingInlineStart="space.250">
          <Inline space="space.200">
            <Stack space="space.200">
              <FilterSection
                filter={engagementFilter}
                filterSetting="filterEngagementStates"
                title={t('filters.engagement.title')}
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
