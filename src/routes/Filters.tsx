import { type FC, useContext } from 'react';

import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives';

import { Header } from '../components/Header';
import { AppContext } from '../context/App';
import type { Category, Product, ReadState } from '../utils/api/types';
import {
  CATEGORIES,
  READ_STATES,
  getCategoryDetails,
  getReadStateDetails,
} from '../utils/filters';
import { formatProperCase } from '../utils/helpers';
import { PRODUCTS, getProductDetails } from '../utils/products';

export const FiltersRoute: FC = () => {
  const { settings, clearFilters, updateSetting } = useContext(AppContext);

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

  const shouldShowProduct = (product: Product) => {
    return settings.filterProducts.includes(product);
  };

  const updateProductFilter = (product: Product, checked: boolean) => {
    let products: Product[] = settings.filterProducts;

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
                        label={formatProperCase(categoryDetails.name)}
                        isChecked={shouldShowCategory(category)}
                        onChange={(evt) =>
                          updateCategoryFilter(category, evt.target.checked)
                        }
                      />
                      <categoryDetails.icon {...categoryIconProps} />
                    </Inline>
                  );
                })}
              </Box>
            </Stack>
          </Box>
          <Box>
            <Stack space="space.100">
              <Heading size="small">Read State</Heading>
              <Box>
                {Object.keys(READ_STATES).map((readState: ReadState) => {
                  return (
                    <Checkbox
                      key={readState}
                      name={readState}
                      label={formatProperCase(
                        getReadStateDetails(readState).name,
                      )}
                      isChecked={shouldShowReadState(readState)}
                      onChange={(evt) =>
                        updateReadStateFilter(readState, evt.target.checked)
                      }
                    />
                  );
                })}
              </Box>
            </Stack>
          </Box>
          <Box>
            <Stack space="space.100">
              <Heading size="small">Products</Heading>
              <Box>
                {Object.keys(PRODUCTS).map((product: Product) => {
                  const productDetails = getProductDetails(product);
                  const productIconProps: Record<string, string> = {
                    size: 'xsmall',
                    appearance: 'subtle',
                  };

                  return (
                    <Inline key={product} space="space.050" alignBlock="center">
                      <Checkbox
                        name={product}
                        label={formatProperCase(productDetails.name)}
                        isChecked={shouldShowProduct(product)}
                        onChange={(evt) =>
                          updateProductFilter(product, evt.target.checked)
                        }
                      />
                      <productDetails.icon {...productIconProps} />
                    </Inline>
                  );
                })}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </div>

      <div className="text-sm bg-gray-200 dark:bg-gray-darker">
        <Box padding="space.100">
          <Flex justifyContent="end">
            <Button
              title="Clear filters"
              onClick={clearFilters}
              appearance="discovery"
              spacing="compact"
            >
              Clear filters
            </Button>
          </Flex>
        </Box>
      </div>
    </div>
  );
};
