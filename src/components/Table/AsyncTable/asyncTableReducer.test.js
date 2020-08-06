// returns a state object
// import { initialState } from '../Table.story';
// import { tableRegister } from '../tableActionCreators';

/* should use the mockAsyncReducer eventually */
import asyncTableReducer from './asyncTableReducer';

describe('async table reducer', () => {
  it('nothing', () => {
    expect(asyncTableReducer(undefined, { type: 'BOGUS' })).toEqual({});
  });

  //   it('registers data', () => {
  //     const registeredAsyncTable = asyncTableReducer(
  //       initialState,
  //       tableRegister({ data: initialState.data, totalItems: initialState.totalItems })
  //     );
  //     expect(registeredAsyncTable.view.pagination.totalItems).toEqual(100);
  //   });
});
