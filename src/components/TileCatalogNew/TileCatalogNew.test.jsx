import React from 'react';
import { render, fireEvent } from '@testing-library/react';

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

describe('TileCatalogNew tests', () => {
  it('TileCatalogNew gets rendered', () => {
    const { getByText } = render(
      <TileCatalogNew
        tiles={getTiles(2, 'Tile')}
        title="Test Tile Catalog"
        numRows={1}
        numColumns={2}
      />
    );
    expect(getByText('Tile 1')).toBeTruthy();
    expect(getByText('Tile 2')).toBeTruthy();
  });

  it('TileCatalogNew placeholder tile are rendered', () => {
    const { getByText } = render(
      <TileCatalogNew
        tiles={getTiles(6, 'Tile')}
        title="Test Tile Catalog"
        numRows={2}
        numColumns={2}
      />
    );
    expect(getByText('Tile 1')).toBeTruthy();
    expect(getByText('Tile 2')).toBeTruthy();
  });

  it('TileCatalogNew to have default call back function ', () => {
    expect(TileCatalogNew.defaultProps.onSearch).toBeDefined();
    expect(TileCatalogNew.defaultProps.onSort).toBeDefined();
    TileCatalogNew.defaultProps.onSearch();
    TileCatalogNew.defaultProps.onSort();
  });

  it('TileCatalogNew hasSearch set to true', () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <TileCatalogNew
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
        hasSearch="true"
        onSearch={onSearch}
      />
    );
    fireEvent.change(getByPlaceholderText('Enter a value'), { target: { value: '5' } });
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

    const { getByDisplayValue } = render(
      <TileCatalogNew
        tiles={getTiles(2, 'Tile')}
        hasSort="true"
        onSort={onSort}
        sortOptions={sortOptions}
        selectedSortOption={selectedSortOption}
        hasSearch="true"
      />
    );
    fireEvent.change(getByDisplayValue('Choose from options'), { target: { value: 'Z-A' } });
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it('TileCatalogNew pagination next button', () => {
    const { getByText, getAllByRole } = render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );

    const buttons = getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(getByText('Tile 5')).toBeTruthy();
    expect(getByText('Tile 6')).toBeTruthy();
    expect(getByText('Tile 7')).toBeTruthy();
    expect(getByText('Tile 8')).toBeTruthy();
  });

  it('TileCatalogNew pagination previous button', () => {
    const { getByText, getAllByRole } = render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );
    const buttons = getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    fireEvent.click(buttons[0]);
    expect(getByText('Tile 1')).toBeTruthy();
    expect(getByText('Tile 2')).toBeTruthy();
    expect(getByText('Tile 3')).toBeTruthy();
    expect(getByText('Tile 4')).toBeTruthy();
  });

  it('TileCatalogNew pagination number button', () => {
    const { getByText, getAllByRole } = render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(20, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );
    const buttons = getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 2]);
    fireEvent.click(buttons[0]);
    expect(getByText('Tile 13')).toBeTruthy();
    expect(getByText('Tile 14')).toBeTruthy();
    expect(getByText('Tile 15')).toBeTruthy();
    expect(getByText('Tile 16')).toBeTruthy();
  });

  it('TileCatalogNew with large page numbers', () => {
    const { getByText, getByLabelText } = render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(60, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );
    fireEvent.change(getByLabelText('select page number'), { target: { value: 14 } });
    expect(getByText('Tile 53')).toBeTruthy();
    expect(getByText('Tile 54')).toBeTruthy();
    expect(getByText('Tile 55')).toBeTruthy();
    expect(getByText('Tile 56')).toBeTruthy();
  });

  it('TileCatalogNew with large page numbers and mid page number was selected', () => {
    const { getByText, getByLabelText } = render(
      <TileCatalogNew
        title="Test Tile Catalog"
        tiles={getTiles(60, 'Tile')}
        numColumns={2}
        numRows={2}
      />
    );
    fireEvent.change(getByLabelText('select page number'), { target: { value: 7 } });
    expect(getByText('Tile 25')).toBeTruthy();
    expect(getByText('Tile 26')).toBeTruthy();
    expect(getByText('Tile 27')).toBeTruthy();
    expect(getByText('Tile 28')).toBeTruthy();
  });
});
