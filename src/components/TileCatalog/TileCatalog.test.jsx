import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TileCatalog from './TileCatalog';
import SampleTile from './SampleTile';

const getTiles = (num, title) => {
  var tiles = [];
  Array(num)
    .fill(0)
    .map(
      (i, idx) =>
        (tiles[idx] = (
          <SampleTile title={`${title} ${idx + 1}`} description="This is a sample product tile" />
        ))
    );
  return tiles;
};

describe('TileCatalog tests', () => {
  test('TileCatalog gets rendered', () => {
    const { getByText } = render(
      <TileCatalog
        tiles={getTiles(2, 'Tile')}
        title="Test Tile Catalog"
        numRows={1}
        numColumns={2}
      />
    );
    expect(getByText('Tile 1')).toBeTruthy();
    expect(getByText('Tile 2')).toBeTruthy();
  });

  test('TileCatalog to have default ', () => {
    expect(TileCatalog.defaultProps.onSearch).toBeDefined();
    expect(TileCatalog.defaultProps.onSort).toBeDefined();
    TileCatalog.defaultProps.onSearch();
    TileCatalog.defaultProps.onSort();
  });

  test('TileCatalog hasSearch set to true', () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <TileCatalog
        tiles={getTiles(8, 'Tile')}
        numColumns={2}
        numRows={2}
        hasSearch="true"
        onSearch={onSearch}
      />
    );
    fireEvent.change(getByPlaceholderText('Enter a value'), { target: { value: '5' } });
    expect(onSearch).toBeCalledTimes(1);
  });

  test('TileCatalog hasSort set to true', () => {
    const sortOptions = [
      { text: 'Choose from options', id: 'Choose from options' },
      { text: 'A-Z', id: 'A-Z' },
      { text: 'Z-A', id: 'Z-A' },
    ];
    const selectedSortOption = 'Choose from options';
    const onSort = jest.fn();

    const { getByDisplayValue } = render(
      <TileCatalog
        tiles={getTiles(2, 'Tile')}
        hasSort="true"
        onSort={onSort}
        sortOptions={sortOptions}
        selectedSortOption={selectedSortOption}
        hasSearch="true"
      />
    );
    fireEvent.change(getByDisplayValue('Choose from options'), { target: { value: 'Z-A' } });
    expect(onSort).toBeCalledTimes(1);
  });

  test('TileCatalog pagination', () => {
    const { getByText, getAllByRole } = render(
      <TileCatalog
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
});
