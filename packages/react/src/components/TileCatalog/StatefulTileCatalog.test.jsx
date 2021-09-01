import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import StatefulTileCatalog from './StatefulTileCatalog';

const { prefix } = settings;

const mockOnSelection = jest.fn();
const id = 'tileCatalog';
const commonTileProps = {
  id,
  tiles: [
    { id: 'test1', values: { title: 'Test Tile' } },
    { id: 'test2', values: { title: 'Test Tile2' } },
    { id: 'test3', values: { title: 'Test Tile 3' } },
    { id: 'test4', values: { title: 'Test Tile4' } },
    { id: 'test5', values: { title: 'Test Tile 5' } },
    { id: 'test6', values: { title: 'Test Tile 6' } },
    { id: 'test7', values: { title: 'Test Tile 7' } },
  ],
  onSelection: mockOnSelection,
};

describe('StatefulTileCatalog', () => {
  it('handles Search', () => {
    const mockSearch = jest.fn();
    const value = 'My Search String';
    render(
      <StatefulTileCatalog
        {...commonTileProps}
        search={{ placeholder: 'My search', onSearch: mockSearch }}
      />
    );

    userEvent.type(screen.getByRole('searchbox'), value);

    expect(mockSearch).toHaveBeenCalled(); // https://github.com/carbon-design-system/carbon/issues/7595
    expect(mockSearch).toHaveBeenCalledWith(value);
  });
  it('handles Clicking on option', () => {
    const { container } = render(<StatefulTileCatalog {...commonTileProps} />);
    userEvent.click(container.querySelectorAll('input[type="radio"]')[0]);
    expect(mockOnSelection).toHaveBeenCalledTimes(2);
    expect(mockOnSelection).toHaveBeenCalledWith('test1');
  });
  it('handles onPage', () => {
    const { container } = render(
      <StatefulTileCatalog {...commonTileProps} pagination={{ pageSize: 5 }} />
    );
    // Should be 5 tile choices on the first page
    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(5);

    userEvent.click(screen.getByLabelText('Next page'));
    // Should be 2 tile choices on the last page
    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(2);
  });
  it('selectedTileId', () => {
    const { container } = render(
      <StatefulTileCatalog {...commonTileProps} selectedTileId="test2" />
    );

    const selectedTile = container.querySelectorAll('input[checked]');
    expect(selectedTile).toHaveLength(1);
    expect(selectedTile[0]).toHaveAttribute('value', 'test2');
  });
  it('selectedTileId should change page', () => {
    render(
      <StatefulTileCatalog
        {...commonTileProps}
        pagination={{ pageSize: 6, page: 1 }}
        selectedTileId="test7"
      />
    );
    // On page 2 because of the selectedTileId
    expect(screen.getByText('Page 2 of 2')).toBeVisible();
  });

  it('tiles prop change resets page', () => {
    const { container, rerender } = render(
      <StatefulTileCatalog {...commonTileProps} pagination={{ pageSize: 5 }} />
    );

    // The new first tile should be selected
    expect(container.querySelectorAll('input[type="radio"]')[0]).toBeChecked();

    // On page 1
    expect(screen.getByText('Page 1 of 2')).toBeVisible();
    userEvent.click(screen.getByLabelText('Next page'));
    // on Page 2
    expect(screen.getByText('Page 2 of 2')).toBeVisible();

    const newTiles = commonTileProps.tiles.slice(1, 5);
    // Back to Page 1
    mockOnSelection.mockClear();

    rerender(
      <StatefulTileCatalog {...commonTileProps} tiles={newTiles} pagination={{ pageSize: 5 }} />
    );

    expect(screen.getByText('Page 1 of 1')).toBeVisible();

    // Needs to have called the selection callback for the newly default selected row
    expect(mockOnSelection).toHaveBeenCalledTimes(1);

    // The new first tile should be selected
    expect(container.querySelectorAll('input[type="radio"]')[0]).toBeChecked();
  });

  it('tiles prop change should not select if isSelectedByDefault false', () => {
    const { container, rerender } = render(
      <StatefulTileCatalog
        {...commonTileProps}
        pagination={{ pageSize: 5 }}
        isSelectedByDefault={false}
      />
    );
    // The new first tile should not be selected
    expect(container.querySelectorAll('input[type="radio"]')[0]).not.toBeChecked();
    const newTiles = commonTileProps.tiles.slice(1, 5);
    // Back to Page 1
    mockOnSelection.mockClear();
    rerender(
      <StatefulTileCatalog
        {...commonTileProps}
        pagination={{ pageSize: 5 }}
        isSelectedByDefault={false}
        tiles={newTiles}
      />
    );
    // Needs to have called the selection callback for the newly default selected row
    expect(mockOnSelection).toHaveBeenCalledTimes(0);
  });

  it('should call onPage when changing pages', () => {
    const onPage = jest.fn();
    render(
      <StatefulTileCatalog
        {...commonTileProps}
        pagination={{
          pageSize: 5,
          onPage,
        }}
        isSelectedByDefault={false}
      />
    );

    userEvent.click(screen.getByLabelText('Next page'));
    expect(onPage).toHaveBeenCalledWith(2);
  });

  it("should filter tags on searching even when onSearch isn't given", () => {
    render(
      <StatefulTileCatalog
        {...commonTileProps}
        search={{
          placeholder: 'Search me...',
          value: 'Test Tile 5',
        }}
        isSelectedByDefault={false}
      />
    );

    userEvent.type(screen.getByRole('searchbox'), '{backspace}{backspace}');

    expect(screen.getByText('7 Items')).toBeVisible();
  });

  it('should still select tiles without onSelection supplied', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(
      <StatefulTileCatalog
        {...commonTileProps}
        isSelectedByDefault={false}
        onSelection={undefined}
      />
    );

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed prop type: The prop `onSelection` is marked as required in `StatefulTileCatalog`, but its value is `undefined`'
      )
    );
    const tile2 = container.querySelectorAll(`.${prefix}--tile`)[1];
    userEvent.click(tile2);
    expect(tile2).toHaveClass(`${prefix}--tile--is-selected`);
    jest.resetAllMocks();
  });

  it('should select tiles and call onSelection when supplied', () => {
    const onSelection = jest.fn();
    const { container } = render(
      <StatefulTileCatalog
        {...commonTileProps}
        isSelectedByDefault={false}
        onSelection={onSelection}
      />
    );

    const tile2 = container.querySelectorAll(`.${prefix}--tile`)[1];
    userEvent.click(tile2);
    expect(tile2).toHaveClass(`${prefix}--tile--is-selected`);
    expect(onSelection).toHaveBeenCalledWith('test2');
  });
});
