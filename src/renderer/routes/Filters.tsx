import { type FC, useContext } from 'react';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { Contents } from '../components/primitives/Contents';
import { Footer } from '../components/primitives/Footer';
import { Header } from '../components/primitives/Header';
import { Page } from '../components/primitives/Page';
import { AppContext } from '../context/App';
import type {
  CategoryFilterType,
  ProductName,
  ReadStateFilterType,
  TimeSensitiveFilterType,
} from '../types';
import {
  FILTERS_CATEGORIES,
  FILTERS_READ_STATES,
  FILTERS_TIME_SENSITIVE,
  getCategoryFilterCount,
  getCategoryFilterDetails,
  getProductFilterCount,
  getReadStateFilterCount,
  getReadStateFilterDetails,
  getTimeSensitiveFilterCount,
  getTimeSensitiveFilterDetails,
} from '../utils/filters';
import { formatProperCase } from '../utils/helpers';
import { PRODUCTS, getProductDetails } from '../utils/products';

export const FiltersRoute: FC = () => {
  const { settings, clearFilters, updateSetting, notifications } =
    useContext(AppContext);

  const checkboxPaddingHorizontal = 'space.050';
  const checkboxPaddingVertical = 'space.025';
  const checkboxIconProps: Record<string, string> = {
    size: 'small',
  };

  const shouldShowTimeSensitive = (timeSensitive: TimeSensitiveFilterType) => {
    return settings.filterTimeSensitive.includes(timeSensitive);
  };

  const updateTimeSensitiveFilter = (
    timeSensitive: TimeSensitiveFilterType,
    checked: boolean,
  ) => {
    let timeSensitives: TimeSensitiveFilterType[] =
      settings.filterTimeSensitive;

    if (checked) {
      timeSensitives.push(timeSensitive);
    } else {
      timeSensitives = timeSensitives.filter((t) => t !== timeSensitive);
    }

    updateSetting('filterTimeSensitive', timeSensitives);
  };

  const shouldShowCategory = (category: CategoryFilterType) => {
    return settings.filterCategories.includes(category);
  };

  const updateCategoryFilter = (
    category: CategoryFilterType,
    checked: boolean,
  ) => {
    let categories: CategoryFilterType[] = settings.filterCategories;

    if (checked) {
      categories.push(category);
    } else {
      categories = categories.filter((c) => c !== category);
    }

    updateSetting('filterCategories', categories);
  };

  const shouldShowReadState = (readState: ReadStateFilterType) => {
    return settings.filterReadStates.includes(readState);
  };

  const updateReadStateFilter = (
    readState: ReadStateFilterType,
    checked: boolean,
  ) => {
    let readStates: ReadStateFilterType[] = settings.filterReadStates;

    if (checked) {
      readStates.push(readState);
    } else {
      readStates = readStates.filter((rs) => rs !== readState);
    }

    updateSetting('filterReadStates', readStates);
  };

  const shouldShowProduct = (product: ProductName) => {
    return settings.filterProducts.includes(product);
  };

  const updateProductFilter = (product: ProductName, checked: boolean) => {
    let products: ProductName[] = settings.filterProducts;

    if (checked) {
      products.push(product);
    } else {
      products = products.filter((p) => p !== product);
    }

    updateSetting('filterProducts', products);
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
                    (timeSensitive: TimeSensitiveFilterType) => {
                      const timeSensitiveDetails =
                        getTimeSensitiveFilterDetails(timeSensitive);

                      return (
                        <Box
                          key={timeSensitive}
                          paddingBlock={checkboxPaddingVertical}
                        >
                          <Inline
                            space={checkboxPaddingHorizontal}
                            alignBlock="center"
                          >
                            <Checkbox
                              key={timeSensitive}
                              name={timeSensitive}
                              aria-label={timeSensitive}
                              label={formatProperCase(
                                timeSensitiveDetails.name,
                              )}
                              isChecked={shouldShowTimeSensitive(timeSensitive)}
                              onChange={(evt) =>
                                updateTimeSensitiveFilter(
                                  timeSensitive,
                                  evt.target.checked,
                                )
                              }
                            />
                            <timeSensitiveDetails.icon {...checkboxIconProps} />
                            <Badge
                              max={false}
                              appearance={
                                shouldShowTimeSensitive(timeSensitive)
                                  ? 'primary'
                                  : 'default'
                              }
                            >
                              {getTimeSensitiveFilterCount(
                                notifications,
                                timeSensitiveDetails,
                              )}
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
                    (category: CategoryFilterType) => {
                      const categoryDetails =
                        getCategoryFilterDetails(category);

                      return (
                        <Box
                          key={category}
                          paddingBlock={checkboxPaddingVertical}
                        >
                          <Inline
                            space={checkboxPaddingHorizontal}
                            alignBlock="center"
                          >
                            <Checkbox
                              name={category}
                              aria-label={category}
                              label={formatProperCase(categoryDetails.name)}
                              isChecked={shouldShowCategory(category)}
                              onChange={(evt) =>
                                updateCategoryFilter(
                                  category,
                                  evt.target.checked,
                                )
                              }
                            />
                            <categoryDetails.icon {...checkboxIconProps} />
                            <Badge
                              max={false}
                              appearance={
                                shouldShowCategory(category)
                                  ? 'primary'
                                  : 'default'
                              }
                            >
                              {getCategoryFilterCount(notifications, category)}
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
                    (readState: ReadStateFilterType) => {
                      const readStateDetails =
                        getReadStateFilterDetails(readState);
                      return (
                        <Box
                          key={readState}
                          paddingBlock={checkboxPaddingVertical}
                        >
                          <Inline
                            space={checkboxPaddingHorizontal}
                            alignBlock="center"
                          >
                            <Checkbox
                              name={readState}
                              aria-label={readState}
                              label={formatProperCase(readStateDetails.name)}
                              isChecked={shouldShowReadState(readState)}
                              onChange={(evt) =>
                                updateReadStateFilter(
                                  readState,
                                  evt.target.checked,
                                )
                              }
                            />
                            <Badge
                              max={false}
                              appearance={
                                shouldShowReadState(readState)
                                  ? 'primary'
                                  : 'default'
                              }
                            >
                              {getReadStateFilterCount(
                                notifications,
                                readState,
                              )}
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
                  const productIconProps: Record<string, string> = {
                    size: 'xsmall',
                    appearance: shouldShowProduct(product)
                      ? 'brand'
                      : 'neutral',
                  };

                  return (
                    <Box key={product} paddingBlock={checkboxPaddingVertical}>
                      <Inline
                        space={checkboxPaddingHorizontal}
                        alignBlock="center"
                      >
                        <Checkbox
                          name={product}
                          aria-label={product}
                          label={formatProperCase(productDetails.name)}
                          isChecked={shouldShowProduct(product)}
                          onChange={(evt) =>
                            updateProductFilter(product, evt.target.checked)
                          }
                        />
                        <productDetails.logo {...productIconProps} />
                        <Badge
                          max={false}
                          appearance={
                            shouldShowProduct(product) ? 'primary' : 'default'
                          }
                        >
                          {getProductFilterCount(notifications, product)}
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
        <Tooltip content="Clear all filters" position="left">
          <Button
            title="Clear Filters"
            onClick={clearFilters}
            appearance="discovery"
            spacing="compact"
            testId="filters-clear"
          >
            Clear Filters
          </Button>
        </Tooltip>
      </Footer>
    </Page>
  );
};
