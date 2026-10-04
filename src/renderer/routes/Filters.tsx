import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@atlaskit/button/new';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { useFiltersStore } from '../stores';

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
  const { t } = useTranslation();

  const clearFilters = useFiltersStore((s) => s.reset);

  return (
    <Page testId="filters">
      <Header>{t('filters.title', { defaultValue: 'Filters' })}</Header>

      <Contents>
        <Box paddingBlockEnd="space.200" paddingInlineStart="space.250">
          <Inline space="space.200">
            <Stack space="space.200">
              <FilterSection
                filter={engagementFilter}
                filterSetting="engagementStates"
                title={t('filters.engagement.title', {
                  defaultValue: 'Engagement',
                })}
              />

              <FilterSection
                filter={categoryFilter}
                filterSetting="categories"
                title={t('filters.category.title', {
                  defaultValue: 'Category',
                })}
              />

              <FilterSection
                filter={actorFilter}
                filterSetting="actors"
                title={t('filters.actors.title', { defaultValue: 'Actors' })}
              />

              <FilterSection
                filter={readStateFilter}
                filterSetting="readStates"
                title={t('filters.read_state.title', {
                  defaultValue: 'Read State',
                })}
              />
            </Stack>

            <Stack>
              <FilterSection
                filter={productFilter}
                filterSetting="products"
                title={t('filters.products.title', {
                  defaultValue: 'Products',
                })}
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
          title={t('filters.actions.clear', { defaultValue: 'Clear Filters' })}
        >
          {t('filters.actions.clear', { defaultValue: 'Clear Filters' })}
        </Button>
      </Footer>
    </Page>
  );
};
