import { tileCatalogReducer, TILE_ACTIONS, determineInitialState } from './tileCatalogReducer';

const longDescription = 'testDescription';
const tileRenderFunction = jest.fn();

const tiles = [
  {
    id: 'test1',
    values: {
      title: 'Test Tile with really long title that should wrap',
      description: longDescription,
    },
    renderContent: tileRenderFunction,
  },
  {
    id: 'test2',
    values: { title: 'Test Tile2', description: longDescription },
    renderContent: tileRenderFunction,
  },
  {
    id: 'test3',
    values: { title: 'Test Tile3', description: 'Tile contents' },
    renderContent: tileRenderFunction,
  },
  {
    id: 'test4',
    values: { title: 'Test Tile4', description: longDescription },
    renderContent: tileRenderFunction,
  },
  {
    id: 'test5',
    values: { title: 'Test Tile5', description: longDescription },
    renderContent: tileRenderFunction,
  },
  {
    id: 'test6',
    values: { title: 'Test Tile6', description: longDescription },
    renderContent: tileRenderFunction,
  },
  {
    id: 'test7',
    values: { title: 'Test Tile7', description: longDescription },
    renderContent: tileRenderFunction,
  },
];

describe('tileCatalogReducer', () => {
  test('pageChange', () => {
    const pageChangeAction = { type: TILE_ACTIONS.PAGE_CHANGE, payload: 2 };
    const existingState = {
      page: 1,
      pageSize: 5,
      searchState: '',
      selectedTileId: tiles[0].id,
      // original tile data
      tiles,
      // filtered tiles have any search applied
      filteredTiles: tiles,
      startingIndex: 0,
      endingIndex: 5,
    };

    const newState = tileCatalogReducer(existingState, pageChangeAction);
    expect(newState.page).toEqual(2);
    expect(newState.startingIndex).toEqual(5);
    expect(newState.endingIndex).toEqual(9);
  });
  test('search', () => {
    const searchAction = { type: TILE_ACTIONS.SEARCH, payload: 'Tile6' };
    const existingState = {
      page: 2,
      pageSize: 5,
      searchState: '',
      selectedTileId: tiles[5].id,
      // original tile data
      tiles,
      // filtered tiles have any search applied
      filteredTiles: tiles,
      startingIndex: 5,
      endingIndex: 6,
    };

    // After search, page selectedTileId and starting and ending index should be udpated
    const newState = tileCatalogReducer(existingState, searchAction);
    expect(newState.searchState).toEqual('Tile6');
    expect(newState.page).toEqual(1);
    expect(newState.startingIndex).toEqual(0);
    expect(newState.endingIndex).toEqual(4);
  });
  test('select', () => {
    const selectAction = { type: TILE_ACTIONS.SELECT, payload: 'test2' };
    const existingState = {
      page: 1,
      pageSize: 5,
      searchState: '',
      selectedTileId: tiles[0].id,
      // original tile data
      tiles,
      // filtered tiles have any search applied
      filteredTiles: tiles,
      startingIndex: 0,
      endingIndex: 5,
    };

    const newState = tileCatalogReducer(existingState, selectAction);
    expect(newState.selectedTileId).toEqual('test2');
    const selectAction2 = { type: TILE_ACTIONS.SELECT, payload: 'test6' };
    const newState2 = tileCatalogReducer(existingState, selectAction2);
    expect(newState2.selectedTileId).toEqual('test6');
    expect(newState2.page).toEqual(2);
    expect(newState2.startingIndex).toEqual(5);
    expect(newState2.endingIndex).toEqual(9);
  });
});
describe('determineInitialState', () => {
  test('defaults', () => {
    const initialState = determineInitialState({ tiles });
    expect(initialState.pageSize).toEqual(10);
    expect(initialState.page).toEqual(1);
    expect(initialState.startingIndex).toEqual(0);
    expect(initialState.endingIndex).toEqual(9);
    expect(initialState.selectedTileId).toEqual(tiles[0].id);
  });
  test('setting from pagination', () => {
    const initialState = determineInitialState({ tiles, pagination: { pageSize: 5, page: 2 } });
    expect(initialState.pageSize).toEqual(5);
    expect(initialState.page).toEqual(2);
    expect(initialState.startingIndex).toEqual(5);
    expect(initialState.endingIndex).toEqual(9);
    expect(initialState.selectedTileId).toEqual(tiles[5].id);
  });
  test('setting search', () => {
    const initialState = determineInitialState({ tiles, search: { value: 'Tile6' } });
    expect(initialState.filteredTiles).toHaveLength(1);
    expect(initialState.endingIndex).toEqual(9);
    expect(initialState.selectedTileId).toEqual(tiles[5].id);
  });
});
