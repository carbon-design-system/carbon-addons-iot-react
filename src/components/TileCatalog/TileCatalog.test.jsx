import { mount } from 'enzyme';
import React from 'react';

import TileCatalog from './TileCatalog';

const mockOnChange = jest.fn();
const id = 'tileCatalog';
const commonTileProps = {
  id,
  tiles: [
    { id: 'test1', content: 'Test Tile' },
    { id: 'test2', content: 'Test Tile2' },
    { id: 'test3', content: 'Test Tile 3' },
    { id: 'test4', content: 'Test Tile4' },
    { id: 'test5', content: 'Test Tile 5' },
    { id: 'test6', content: 'Test Tile 6' },
    { id: 'test7', content: 'Test Tile 7' },
  ],
  onChange: mockOnChange,
};

describe('TileCatalog', () => {
  test('handles Search', () => {
    const mockSearch = jest.fn();
    const value = 'My Search String';
    const wrapper = mount(
      <TileCatalog
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
    mockOnChange.mockClear();
    const wrapper = mount(<TileCatalog {...commonTileProps} />);
    // Need to use at to get a new ReactWrapper
    const tileInput = wrapper.find('input[type="radio"]').at(0);
    tileInput.simulate('change');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('test1', id, expect.any(Object));
  });
  test('handles onPage', () => {
    const wrapper = mount(<TileCatalog {...commonTileProps} pagination={{ pageSize: 5 }} />);
    // Should be 5 tile choices on the first page
    expect(wrapper.find('input[type="radio"]')).toHaveLength(5);
    const nextButton = wrapper.find('div[tabIndex=0]');
    nextButton.simulate('click');
    // Should be 2 tile choices on the last page
    expect(wrapper.find('input[type="radio"]')).toHaveLength(2);
  });
  test('tiles prop change resets page', () => {
    const wrapper = mount(<TileCatalog {...commonTileProps} pagination={{ pageSize: 5 }} />);
    // On page 1
    expect(wrapper.find('span').text()).toEqual('Page 1');
    const nextButton = wrapper.find('div[tabIndex=0]');
    nextButton.simulate('click');
    // on Page 2
    expect(wrapper.find('span').text()).toEqual('Page 2');
    // Back to Page 1
    wrapper.setProps({ tiles: [] });
    expect(wrapper.find('span').text()).toEqual('Page 1');
  });
});
