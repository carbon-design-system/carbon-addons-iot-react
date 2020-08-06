import * as baseTableActions from '../tableActionCreators';

/**
 * mock async reducer acts as a reducer substitute in test files
 */

export default class MockAsyncReducer {
  initialState = {
    columns: [
      {
        id: 'firstName',
        name: 'First Name',
        filter: {
          placeholderText: 'enter first name',
        },
        isSortable: true,
      },
      {
        id: 'lastName',
        name: 'Last Name',
        filter: {
          placeholderText: 'enter last name',
        },
        isSortable: true,
      },
    ],
    data: [],
    expandedData: [],
  };

  constructor(actionType) {
    this.actionType = actionType;
  }

  static useReducer() {
    switch (this.actionType) {
      case baseTableActions.TABLE_REGISTER:
        return {};
      default:
        return {};
    }
  }
}
