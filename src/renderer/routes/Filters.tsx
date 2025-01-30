import { type FC, useContext } from 'react';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { Contents } from '../components/primitives/Contents';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';
import { Page } from '../components/primitives/Page';
import { AppContext } from '../context/App';
import type {
  CategoryType,
  ProductName,
  ReadStateType,
  TimeSensitiveType,
} from '../types';
import { formatProperCase } from '../utils/helpers';
import {
  FILTERS_CATEGORIES,
  getCategoryFilterCount,
  getCategoryFilterDetails,
  isCategoryFilterSet,
} from '../utils/notifications/filters/category';
import {
  getProductFilterCount,
  isProductFilterSet,
} from '../utils/notifications/filters/product';
import {
  FILTERS_READ_STATES,
  getReadStateFilterCount,
  getReadStateFilterDetails,
  isReadStateFilterSet,
} from '../utils/notifications/filters/readState';
import {
  FILTERS_TIME_SENSITIVE,
  getTimeSensitiveFilterCount,
  getTimeSensitiveFilterDetails,
  isTimeSensitiveFilterSet,
} from '../utils/notifications/filters/timeSensitive';
import { PRODUCTS, getProductDetails } from '../utils/products';

export const FiltersRoute: FC = () => {
  const { settings, clearFilters, updateFilter, notifications } =
    useContext(AppContext);

  const checkboxPaddingHorizontal = 'space.050';
  const checkboxPaddingVertical = 'space.025';
  const checkboxIconProps: Record<string, string> = {
    size: 'small',
  };

  return (
    <Page id="filters">
      <Header fetchOnBack={true}>Filters</Header>

      <Contents>
        <Box paddingInlineStart="space.400">
          <Inline space="space.200">
            <Stack space="space.200">
              <Stack space="space.100">
                <Heading size="small">Time Sensitive</Heading>
                <Box>
                  {Object.keys(FILTERS_TIME_SENSITIVE).map(
                    (timeSensitive: TimeSensitiveType) => {
                      const timeSensitiveDetails =
                        getTimeSensitiveFilterDetails(timeSensitive);
                      const timeSensitiveLabel = formatProperCase(
                        timeSensitiveDetails.name,
                      );
                      const isTimeSensitiveChecked = isTimeSensitiveFilterSet(
                        settings,
                        timeSensitive,
                      );
                      const timeSensitiveCount = getTimeSensitiveFilterCount(
                        notifications,
                        timeSensitive,
                      );

                      return (
                        <Box
                          key={timeSensitiveDetails.name}
                          paddingBlock={checkboxPaddingVertical}
                        >
                          <Inline
                            space={checkboxPaddingHorizontal}
                            alignBlock="center"
                          >
                            <Checkbox
                              aria-label={timeSensitiveDetails.name}
                              label={timeSensitiveLabel}
                              isChecked={isTimeSensitiveChecked}
                              onChange={(evt) =>
                                updateFilter(
                                  'filterTimeSensitive',
                                  timeSensitive,
                                  evt.target.checked,
                                )
                              }
                            />
                            <timeSensitiveDetails.icon {...checkboxIconProps} />
                            <Badge
                              max={false}
                              appearance={
                                isTimeSensitiveChecked ? 'primary' : 'default'
                              }
                            >
                              {timeSensitiveCount}
                            </Badge>
                          </Inline>
                        </Box>
                      );
                    },
                  )}
                </Box>
              </Stack>

              <Stack space="space.100">
                <Heading size="small">Category</Heading>
                <Box>
                  {Object.keys(FILTERS_CATEGORIES).map(
                    (category: CategoryType) => {
                      const categoryDetails =
                        getCategoryFilterDetails(category);
                      const categoryLabel = formatProperCase(
                        categoryDetails.name,
                      );
                      const isCategoryChecked = isCategoryFilterSet(
                        settings,
                        category,
                      );
                      const categoryCount = getCategoryFilterCount(
                        notifications,
                        category,
                      );

                      return (
                        <Box
                          key={categoryDetails.name}
                          paddingBlock={checkboxPaddingVertical}
                        >
                          <Inline
                            space={checkboxPaddingHorizontal}
                            alignBlock="center"
                          >
                            <Checkbox
                              aria-label={categoryDetails.name}
                              label={categoryLabel}
                              isChecked={isCategoryChecked}
                              onChange={(evt) =>
                                updateFilter(
                                  'filterCategories',
                                  category,
                                  evt.target.checked,
                                )
                              }
                            />
                            <categoryDetails.icon {...checkboxIconProps} />
                            <Badge
                              max={false}
                              appearance={
                                isCategoryChecked ? 'primary' : 'default'
                              }
                            >
                              {categoryCount}
                            </Badge>
                          </Inline>
                        </Box>
                      );
                    },
                  )}
                </Box>
              </Stack>

              <Stack space="space.100">
                <Heading size="small">Read State</Heading>
                <Box>
                  {Object.keys(FILTERS_READ_STATES).map(
                    (readState: ReadStateType) => {
                      const readStateDetails =
                        getReadStateFilterDetails(readState);
                      const readStateLabel = formatProperCase(
                        readStateDetails.name,
                      );
                      const isReadStateChecked = isReadStateFilterSet(
                        settings,
                        readState,
                      );
                      const readStateCount = getReadStateFilterCount(
                        notifications,
                        readState,
                      );

                      return (
                        <Box
                          key={readStateDetails.name}
                          paddingBlock={checkboxPaddingVertical}
                        >
                          <Inline
                            space={checkboxPaddingHorizontal}
                            alignBlock="center"
                          >
                            <Checkbox
                              aria-label={readStateDetails.name}
                              label={readStateLabel}
                              isChecked={isReadStateChecked}
                              onChange={(evt) =>
                                updateFilter(
                                  'filterReadStates',
                                  readState,
                                  evt.target.checked,
                                )
                              }
                            />
                            <Badge
                              max={false}
                              appearance={
                                isReadStateChecked ? 'primary' : 'default'
                              }
                            >
                              {readStateCount}
                            </Badge>
                          </Inline>
                        </Box>
                      );
                    },
                  )}
                </Box>
              </Stack>
            </Stack>

            <Stack space="space.100">
              <Heading size="small">Products</Heading>
              <Box>
                {Object.keys(PRODUCTS).map((product: ProductName) => {
                  const productDetails = getProductDetails(product);
                  const productLabel = formatProperCase(productDetails.name);
                  const isProductChecked = isProductFilterSet(
                    settings,
                    product,
                  );
                  const productIconProps: Record<string, string> = {
                    size: 'xsmall',
                    appearance: isProductChecked ? 'brand' : 'neutral',
                  };
                  const productCount = getProductFilterCount(
                    notifications,
                    product,
                  );

                  return (
                    <Box
                      key={productDetails.name}
                      paddingBlock={checkboxPaddingVertical}
                    >
                      <Inline
                        space={checkboxPaddingHorizontal}
                        alignBlock="center"
                      >
                        <Checkbox
                          aria-label={productDetails.name}
                          label={productLabel}
                          isChecked={isProductChecked}
                          onChange={(evt) =>
                            updateFilter(
                              'filterProducts',
                              product,
                              evt.target.checked,
                            )
                          }
                        />
                        <productDetails.logo {...productIconProps} />
                        <Badge
                          max={false}
                          appearance={isProductChecked ? 'primary' : 'default'}
                        >
                          {productCount}
                        </Badge>
                      </Inline>
                    </Box>
                  );
                })}
              </Box>
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
