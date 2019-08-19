import { mount } from 'enzyme';
import React from 'react';

import StatefulTileCatalog from './StatefulTileCatalog';

const mockOnSelection = jest.fn();
const id = 'tileCatalog';
const commonTileProps = {
  id,
  tiles: [
    { id: 'test1', values: 'Test Tile' },
    { id: 'test2', values: 'Test Tile2' },
    { id: 'test3', values: 'Test Tile 3' },
    { id: 'test4', values: 'Test Tile4' },
    { id: 'test5', values: 'Test Tile 5' },
    { id: 'test6', values: 'Test Tile 6' },
    { id: 'test7', values: 'Test Tile 7' },
  ],
  onSelection: mockOnSelection,
};

describe('StatefulTileCatalog', () => {
  test('handles Search', () => {
    const mockSearch = jest.fn();
    const value = 'My Search String';
    const wrapper = mount(
      <StatefulTileCatalog
        {...commonTileProps}
        search={{ placeHolderText: 'My search', onSearch: mockSearch }}
      />
    );
    const searchInput = wrapper.find('input[type="text"]');
    searchInput.simulate('change', { target: { value } });
    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledWith(value);
  });
  test('handles Clicking on option', () => {
    const wrapper = mount(<StatefulTileCatalog {...commonTileProps} />);
    // Need to use at to get a new ReactWrapper
    const tileInput = wrapper.find('input[type="radio"]').at(0);
    mockOnSelection.mockClear();
    tileInput.simulate('change');
    expect(mockOnSelection).toHaveBeenCalledTimes(1);
    expect(mockOnSelection).toHaveBeenCalledWith('test1');
  });
  test('handles onPage', () => {
    const wrapper = mount(
      <StatefulTileCatalog {...commonTileProps} pagination={{ pageSize: 5 }} />
    );
    // Should be 5 tile choices on the first page
    expect(wrapper.find('input[type="radio"]')).toHaveLength(5);
    const nextButton = wrapper.find('div[tabIndex=0]');
    nextButton.simulate('click');
    // Should be 2 tile choices on the last page
    expect(wrapper.find('input[type="radio"]')).toHaveLength(2);
  });
  test('selectedTileId', () => {
    const wrapper = mount(<StatefulTileCatalog {...commonTileProps} selectedTileId="test2" />);
    wrapper.update();
    const selectedTile = wrapper.find('input[checked=true]');
    expect(selectedTile).toHaveLength(1);
    expect(selectedTile.prop('id')).toEqual('test2');
  });
  test('selectedTileId should change page', () => {
    const wrapper = mount(
      <StatefulTileCatalog
        {...commonTileProps}
        pagination={{ pageSize: 6, page: 1 }}
        selectedTileId="test7"
      />
    );
    console.log(wrapper.filter('span'));
    // On page 2 because of the selectedTileId
    expect(
      wrapper
        .find('span')
        .at(0)
        .text()
    ).toContain('Page 2');
  });

  test('tiles prop change resets page', () => {
    const wrapper = mount(
      <StatefulTileCatalog {...commonTileProps} pagination={{ pageSize: 5 }} />
    );
    // On page 1
    expect(
      wrapper
        .find('span')
        .at(0)
        .text()
    ).toContain('Page 1');
    const nextButton = wrapper.find('div[tabIndex=0]');
    nextButton.simulate('click');
    // on Page 2
    expect(
      wrapper
        .find('span')
        .at(0)
        .text()
    ).toContain('Page 2');

    const newTiles = commonTileProps.tiles.slice(1, 5);
    // Back to Page 1
    mockOnSelection.mockClear();
    wrapper.setProps({ tiles: newTiles });
    wrapper.update();
    expect(
      wrapper
        .find('span')
        .at(0)
        .text()
    ).toContain('Page 1');

    // Needs to have called the selection callback for the newly default selected row
    expect(mockOnSelection).toHaveBeenCalledTimes(1);

    // The new first tile should be selected
    expect(
      wrapper
        .find('RadioTile')
        .at(0)
        .prop('checked')
    ).toEqual(true);
  });
});
