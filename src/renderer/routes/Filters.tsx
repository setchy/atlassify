import { type FC, useContext } from 'react';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { Header } from '../components/primitives/Header';
import { AppContext } from '../context/App';
import type { Category, ProductName, ReadState } from '../types';
import {
  CATEGORIES,
  READ_STATES,
  getCategoryDetails,
  getCategoryFilterCount,
  getProductFilterCount,
  getReadStateDetails,
  getReadStateFilterCount,
} from '../utils/filters';
import { formatProperCase } from '../utils/helpers';
import { PRODUCTS, getProductDetails } from '../utils/products';

export const FiltersRoute: FC = () => {
  const { settings, clearFilters, updateSetting, notifications } =
    useContext(AppContext);

  const shouldShowCategory = (category: Category) => {
    return settings.filterCategories.includes(category);
  };

  const updateCategoryFilter = (category: Category, checked: boolean) => {
    let categories: Category[] = settings.filterCategories;

    if (checked) {
      categories.push(category);
    } else {
      categories = categories.filter((c) => c !== category);
    }

    updateSetting('filterCategories', categories);
  };

  const shouldShowReadState = (readState: ReadState) => {
    return settings.filterReadStates.includes(readState);
  };

  const updateReadStateFilter = (readState: ReadState, checked: boolean) => {
    let readStates: ReadState[] = settings.filterReadStates;

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
    <div className="flex h-screen flex-col" data-testid="filters">
      <Header fetchOnBack={true}>Filters</Header>

      <div className="flex-grow overflow-x-auto px-8">
        <Stack space="space.300">
          <Box>
            <Inline space="space.600">
              <Stack space="space.100">
                <Heading size="small">Category</Heading>
                <Box>
                  {Object.keys(CATEGORIES).map((category: Category) => {
                    const categoryDetails = getCategoryDetails(category);
                    const categoryIconProps: Record<string, string> = {
                      size: 'small',
                    };
                    return (
                      <Inline
                        key={category}
                        space="space.050"
                        alignBlock="center"
                      >
                        <Checkbox
                          key={category}
                          name={category}
                          title={category}
                          label={formatProperCase(categoryDetails.name)}
                          isChecked={shouldShowCategory(category)}
                          onChange={(evt) =>
                            updateCategoryFilter(category, evt.target.checked)
                          }
                        />
                        <categoryDetails.icon {...categoryIconProps} />
                        <Badge
                          max={false}
                          appearance={
                            shouldShowCategory(category) ? 'primary' : 'default'
                          }
                        >
                          {getCategoryFilterCount(notifications, category)}
                        </Badge>
                      </Inline>
                    );
                  })}
                </Box>
              </Stack>

              <Stack space="space.100">
                <Heading size="small">Read State</Heading>
                <Box>
                  {Object.keys(READ_STATES).map((readState: ReadState) => {
                    const readStateDetails = getReadStateDetails(readState);
                    return (
                      <Inline
                        key={readState}
                        space="space.050"
                        alignBlock="center"
                      >
                        <Checkbox
                          key={readState}
                          name={readState}
                          title={readState}
                          label={formatProperCase(readStateDetails.name)}
                          isChecked={shouldShowReadState(readState)}
                          onChange={(evt) =>
                            updateReadStateFilter(readState, evt.target.checked)
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
                          {getReadStateFilterCount(notifications, readState)}
                        </Badge>
                      </Inline>
                    );
                  })}
                </Box>
              </Stack>
            </Inline>
          </Box>

          <Box>
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
                    <Inline key={product} space="space.050" alignBlock="center">
                      <Checkbox
                        name={product}
                        label={formatProperCase(productDetails.name)}
                        title={product}
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
                  );
                })}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </div>

      <Box
        padding="space.050"
        backgroundColor="color.background.accent.gray.subtlest"
      >
        <Flex justifyContent="end">
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
        </Flex>
      </Box>
    </div>
  );
};
