import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import TileCatalogNew from './TileCatalogNew';
import SampleTile from './SampleTile';

const getTiles = num => {
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

  it('TileCatalogNew to have default call back function ', () => {
    expect(TileCatalogNew.defaultProps.onSearch).toBeDefined();
    expect(TileCatalogNew.defaultProps.onSort).toBeDefined();
    TileCatalogNew.defaultProps.onSearch();
    TileCatalogNew.defaultProps.onSort();
  });

  it('TileCatalogNew hasSearch set to true', () => {
    const onSearch = jest.fn();
    render(
      <TileCatalogNew
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
        hasSearch="true"
        onSearch={onSearch}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Enter a value'), { target: { value: '5' } });
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('TileCatalogNew hasSort set to true', () => {
    const sortOptions = [
      { text: 'Choose from options', id: 'Choose from options' },
      { text: 'A-Z', id: 'A-Z' },
      { text: 'Z-A', id: 'Z-A' },
    ];
    const selectedSortOption = 'Choose from options';
    const onSort = jest.fn();

    render(
      <TileCatalogNew
        tiles={getTiles(2, 'Tile')}
        hasSort="true"
        onSort={onSort}
        sortOptions={sortOptions}
        selectedSortOption={selectedSortOption}
        hasSearch="true"
      />
    );
    fireEvent.change(screen.getByDisplayValue('Choose from options'), { target: { value: 'Z-A' } });
    expect(onSort).toHaveBeenCalledTimes(1);
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

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(screen.getByText('Tile 6')).toBeTruthy();
    expect(screen.getByText('Tile 5')).toBeTruthy();
    expect(screen.getByText('Tile 7')).toBeTruthy();
    expect(screen.getByText('Tile 8')).toBeTruthy();
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
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    fireEvent.click(buttons[0]);
    expect(screen.getByText('Tile 1')).toBeTruthy();
    expect(screen.getByText('Tile 2')).toBeTruthy();
    expect(screen.getByText('Tile 3')).toBeTruthy();
    expect(screen.getByText('Tile 4')).toBeTruthy();
  });

  it('TileCatalogNew pagination number button', () => {
    render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(20, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 2]);
    fireEvent.click(buttons[0]);
    expect(screen.getByText('Tile 13')).toBeTruthy();
    expect(screen.getByText('Tile 14')).toBeTruthy();
    expect(screen.getByText('Tile 15')).toBeTruthy();
    expect(screen.getByText('Tile 16')).toBeTruthy();
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

  it('TileCatalogNew renders loading state', () => {
    render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(4, 'Tile')}
        numColumns={2}
        numRows={2}
        isLoading
      />
    );
    expect(screen.queryByText('Tile 1')).toBeNull();
    expect(screen.queryByText('Tile 2')).toBeNull();
    expect(screen.queryByText('Tile 3')).toBeNull();
    expect(screen.queryByText('Tile 4')).toBeNull();
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
    fireEvent.change(screen.getByLabelText('select page number'), { target: { value: 14 } });
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
    fireEvent.change(screen.getByLabelText('select page number'), { target: { value: 7 } });
    expect(screen.getByText('Tile 25')).toBeTruthy();
    expect(screen.getByText('Tile 26')).toBeTruthy();
    expect(screen.getByText('Tile 27')).toBeTruthy();
    expect(screen.getByText('Tile 28')).toBeTruthy();
  });
});
