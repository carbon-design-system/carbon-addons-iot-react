import update from 'immutability-helper';

import { baseTableReducer } from '../baseTableReducer';
import * as baseTableActions from '../tableActionCreators';

/**
 * Extends the baseTableReducer to perform some additional state management
 *
 */
export default (state, action) => {
  switch (action.type) {
    // Used to set the table's data (and totalItems)
    // once a data fetch completes
    case baseTableActions.TABLE_REGISTER:
      return update(baseTableReducer(state, action), {
        data: {
          $set: action.payload.data,
        },
        view: {
          pagination: {
            totalItems: { $set: action.totalItems },
          },
        },
      });

    // clear all loaded data (and reset totalItems) if filter or sort values change
    case baseTableActions.TABLE_COLUMN_SORT:
    case baseTableActions.TABLE_FILTER_CLEAR:
    case baseTableActions.TABLE_FILTER_APPLY:
      // baseTable reducer takes care of resetting the page back to 0 when filters change
      // NOTE: this is NOT the case when sorting changes (the page can stay as it was before
      // since sorting does not change the number of results, only their order).
      return update(baseTableReducer(state, action), {
        data: {
          $set: [],
        },
        view: {
          pagination: {
            totalItems: { $set: undefined },
          },
        },
      });

    // for all other actions, just defer immediately to baseTableReducer
    default:
      return baseTableReducer(state, action);
  }
};
