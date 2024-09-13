import { FilterIcon, FilterRemoveIcon, NoteIcon } from '@primer/octicons-react';
import { type FC, useContext } from 'react';
import { Header } from '../components/Header';
import { Checkbox } from '../components/fields/Checkbox';
import { Legend } from '../components/settings/Legend';
import { AppContext } from '../context/App';
import { BUTTON_CLASS_NAME } from '../styles/gitify';
import { Size } from '../types';
import type { Product } from '../utils/api/typesGitHub';

export const FiltersRoute: FC = () => {
  const { settings, clearFilters, updateSetting } = useContext(AppContext);

  const updateProductFilter = (product: Product, checked: boolean) => {
    let products: Product[] = settings.filterProducts;

    if (checked) {
      products.push(product);
    } else {
      products = products.filter((r) => r !== product);
    }

    updateSetting('filterProducts', products);
  };

  const shouldShowProduct = (product: Product) => {
    return settings.filterProducts.includes(product);
  };

  return (
    <div className="flex h-screen flex-col" data-testid="filters">
      <Header fetchOnBack={true} icon={FilterIcon}>
        Filters
      </Header>
      <div className="flex-grow overflow-x-auto px-8">
        <fieldset className="mb-3">
          <Legend icon={NoteIcon}>Reason</Legend>

          <span className="text-xs italic">
            Note: if no reasons are selected, all notifications will be shown.
          </span>
          {Object.keys([]).map((product: Product) => {
            return (
              <Checkbox
                key={product}
                name={product}
                label={product}
                checked={shouldShowProduct(product)}
                onChange={(evt) =>
                  updateProductFilter(product, evt.target.checked)
                }
                tooltip={<div>{product}</div>}
              />
            );
          })}
        </fieldset>
      </div>

      <div className="flex items-center justify-between bg-gray-200 px-3 py-1 text-sm dark:bg-gray-darker">
        <div />
        <div>
          <button
            type="button"
            className={BUTTON_CLASS_NAME}
            title="Clear filters"
            onClick={clearFilters}
          >
            <FilterRemoveIcon
              size={Size.LARGE}
              className="mr-2"
              aria-label="Clear filters"
            />
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
};
