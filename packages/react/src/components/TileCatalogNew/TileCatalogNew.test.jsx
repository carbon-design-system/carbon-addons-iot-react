import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import TileCatalogNew from './TileCatalogNew';
import SampleTile from './SampleTile';

const { prefix } = settings;

const getTiles = (num) => {
  const tiles = [];
  Array(num)
    .fill(0)
    .map((i, idx) => {
      tiles[idx] = (
        <SampleTile title={`Tile ${idx + 1}`} description="This is a sample product tile" />
      );
      return tiles[idx];
    });
  return tiles;
};

describe('TileCatalogNew', () => {
  it('should be selectable by testId', () => {
    render(
      <TileCatalogNew
        tiles={getTiles(4, 'Tile')}
        title="Test Tile Catalog"
        numRows={1}
        numColumns={2}
        hasSearch
        hasSort
        hasPagination
        testId="tile_catalog_new"
      />
    );
    expect(screen.getByTestId('tile_catalog_new')).toBeDefined();
    expect(screen.getByTestId('tile_catalog_new-grid')).toBeDefined();
    expect(screen.getByTestId('tile_catalog_new-header')).toBeDefined();
    expect(screen.getByTestId('tile_catalog_new-title')).toBeDefined();
    expect(screen.getByTestId('tile_catalog_new-sort-select')).toBeDefined();
    expect(screen.getByTestId('tile_catalog_new-search-input')).toBeDefined();
    expect(screen.getByTestId('tile_catalog_new-pagination-backward-button')).toBeDefined();
    expect(screen.getByTestId('tile_catalog_new-pagination-foreward-button')).toBeDefined();
    expect(screen.getByTestId('tile_catalog_new-pagination-page-2-button')).toBeDefined();
  });
  it('TileCatalogNew gets rendered', () => {
    render(
      <TileCatalogNew
        tiles={getTiles(2, 'Tile')}
        title="Test Tile Catalog"
        numRows={1}
        numColumns={2}
      />
    );
    expect(screen.getByText('Tile 1')).toBeTruthy();
    expect(screen.getByText('Tile 2')).toBeTruthy();
  });

  it('TileCatalogNew placeholder tile are rendered', () => {
    render(
      <TileCatalogNew
        tiles={getTiles(6, 'Tile')}
        title="Test Tile Catalog"
        numRows={2}
        numColumns={2}
      />
    );
    expect(screen.getByText('Tile 1')).toBeTruthy();
    expect(screen.getByText('Tile 2')).toBeTruthy();
  });

  it('TileCatalogNew hasSearch set to true', () => {
    const onSearch = jest.fn();
    const { rerender } = render(
      <TileCatalogNew
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
        hasSearch
        onSearch={onSearch}
      />
    );
    userEvent.type(screen.getByPlaceholderText('Enter a value'), '5');
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(screen.getByPlaceholderText('Enter a value')).toHaveValue('5');

    jest.spyOn(TileCatalogNew.defaultProps, 'onSearch');
    rerender(<TileCatalogNew tiles={getTiles(8, 'Tile')} numColumns={2} numRows={2} hasSearch />);
    userEvent.type(screen.getByPlaceholderText('Enter a value'), '5');
    expect(TileCatalogNew.defaultProps.onSearch).toHaveBeenCalledTimes(1);
    expect(screen.getByPlaceholderText('Enter a value')).toHaveValue('55');
    jest.resetAllMocks();
  });

  it('TileCatalogNew hasSort set to true', () => {
    const sortOptions = [
      { text: 'Choose from options', id: 'Choose from options' },
      { text: 'A-Z', id: 'A-Z' },
      { text: 'Z-A', id: 'Z-A' },
    ];
    const selectedSortOption = 'Choose from options';
    const onSort = jest.fn();

    const { rerender } = render(
      <TileCatalogNew
        tiles={getTiles(2, 'Tile')}
        hasSort
        onSort={onSort}
        sortOptions={sortOptions}
        selectedSortOption={selectedSortOption}
      />
    );
    userEvent.selectOptions(screen.getByRole('listbox'), 'Z-A');
    expect(onSort).toHaveBeenCalledWith('Z-A');

    jest.spyOn(TileCatalogNew.defaultProps, 'onSort');
    rerender(
      <TileCatalogNew
        tiles={getTiles(2, 'Tile')}
        hasSort
        sortOptions={sortOptions}
        selectedSortOption={selectedSortOption}
        hasSearch
      />
    );
    userEvent.selectOptions(screen.getByRole('listbox'), 'Z-A');
    expect(TileCatalogNew.defaultProps.onSort).toHaveBeenCalledTimes(1);
    expect(TileCatalogNew.defaultProps.onSort).toHaveBeenCalledWith('Z-A');
    jest.resetAllMocks();
  });

  it('should go to the page clicked', () => {
    render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'page 2' }));
    expect(screen.getByText('Tile 5')).toBeVisible();
    expect(screen.getByText('Tile 6')).toBeVisible();
    expect(screen.getByText('Tile 7')).toBeVisible();
    expect(screen.getByText('Tile 8')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'page 1' }));
    expect(screen.getByText('Tile 1')).toBeVisible();
    expect(screen.getByText('Tile 2')).toBeVisible();
    expect(screen.getByText('Tile 3')).toBeVisible();
    expect(screen.getByText('Tile 4')).toBeVisible();
  });

  it('TileCatalogNew pagination next button', () => {
    render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Tile 5')).toBeVisible();
    expect(screen.getByText('Tile 6')).toBeVisible();
    expect(screen.getByText('Tile 7')).toBeVisible();
    expect(screen.getByText('Tile 8')).toBeVisible();
  });

  it('TileCatalogNew pagination previous button', () => {
    render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(screen.getByText('Tile 1')).toBeVisible();
    expect(screen.getByText('Tile 2')).toBeVisible();
    expect(screen.getByText('Tile 3')).toBeVisible();
    expect(screen.getByText('Tile 4')).toBeVisible();
  });

  it('TileCatalogNew pagination does not render with only one page', () => {
    render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(4, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );

    expect(screen.queryByText('Next page')).toBeNull();
  });

  it('TileCatalogNew pagination does not render with minTileWidth', () => {
    render(
      <TileCatalogNew title="Test Tile Catalog" tiles={getTiles(4, 'Tile')} minTileWidth="20rem" />
    );

    expect(screen.queryByText('Next page')).toBeNull();
  });

  it('TileCatalogNew renders loading state for each tile upto 4', () => {
    const { container, rerender } = render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(3, 'Tile')}
        numColumns={2}
        numRows={2}
        isLoading
      />
    );

    expect(container.querySelectorAll(`.${prefix}--skeleton__text`)).toHaveLength(3);

    rerender(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(5, 'Tile')}
        numColumns={2}
        numRows={2}
        isLoading
      />
    );

    expect(container.querySelectorAll(`.${prefix}--skeleton__text`)).toHaveLength(4);
  });

  it('TileCatalogNew renders error state', () => {
    // trigger an error by not giving the catalog tiles
    render(<TileCatalogNew title="Test Tile Catalog" numColumns={2} numRows={2} />);
    expect(
      screen.getByText('An error has occurred. Please make sure your catalog has content.')
    ).toBeTruthy();
  });

  it('TileCatalogNew with large page numbers', () => {
    render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(60, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );
    fireEvent.change(screen.getByLabelText('select page number'), {
      target: { value: 14 },
    });
    expect(screen.getByText('Tile 53')).toBeTruthy();
    expect(screen.getByText('Tile 54')).toBeTruthy();
    expect(screen.getByText('Tile 55')).toBeTruthy();
    expect(screen.getByText('Tile 56')).toBeTruthy();
  });

  it('TileCatalogNew with large page numbers and mid page number was selected', () => {
    render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(60, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );
    fireEvent.change(screen.getByLabelText('select page number'), {
      target: { value: 7 },
    });
    expect(screen.getByText('Tile 25')).toBeTruthy();
    expect(screen.getByText('Tile 26')).toBeTruthy();
    expect(screen.getByText('Tile 27')).toBeTruthy();
    expect(screen.getByText('Tile 28')).toBeTruthy();
  });

  it('i18n string tests', () => {
    const i18nTests = {
      error: 'error-message',
    };

    const i18nDefault = TileCatalogNew.defaultProps.i18n;

    render(<TileCatalogNew i18n={i18nTests} />);
    expect(screen.getByText(i18nTests.error)).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.error)).not.toBeInTheDocument();
  });
});
