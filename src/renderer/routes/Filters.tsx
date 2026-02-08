import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@atlaskit/button/new';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { FilterSection } from '../components/filters/FilterSection';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';

import useFiltersStore from '../stores/useFiltersStore';
import {
  actorFilter,
  categoryFilter,
  engagementFilter,
  productFilter,
  readStateFilter,
} from '../utils/notifications/filters';

export const FiltersRoute: FC = () => {
  const { t } = useTranslation();
  const clearFilters = useFiltersStore((s) => s.clearFilters);

  return (
    <Page testId="filters">
      <Header fetchOnBack={true}>{t('filters.title')}</Header>

      <Contents>
        <Box paddingBlockEnd="space.200" paddingInlineStart="space.250">
          <Inline space="space.200">
            <Stack space="space.200">
              <FilterSection
                filter={engagementFilter}
                filterSetting="engagementStates"
                title={t('filters.engagement.title')}
              />

              <FilterSection
                filter={categoryFilter}
                filterSetting="categories"
                title={t('filters.category.title')}
              />

              <FilterSection
                filter={actorFilter}
                filterSetting="actors"
                title={t('filters.actors.title')}
              />

              <FilterSection
                filter={readStateFilter}
                filterSetting="readStates"
                title={t('filters.read_state.title')}
              />
            </Stack>

            <Stack>
              <FilterSection
                filter={productFilter}
                filterSetting="products"
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
