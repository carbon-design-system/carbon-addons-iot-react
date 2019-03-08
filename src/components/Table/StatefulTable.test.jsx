import { mount } from 'enzyme';
import React from 'react';

import StatefulTable from './StatefulTable';
import Table from './Table';
import { mockActions } from './Table.test';
import { initialState } from './Table.story';

// Need to mock the useReducer hook so the real reducer doesn't run
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useReducer: () => [{ view: { table: { filteredData: [] } } }, jest.fn()],
}));
describe('StatefulTable tests', () => {
  afterAll(() => {
    jest.resetModules();
  });
  test('check renders nested table', () => {
    const statefulTable = mount(<StatefulTable {...initialState} actions={mockActions} />);
    expect(statefulTable.find(Table)).toHaveLength(1);
  });
  test('check callbacks are propagated up!', () => {
    const statefulTable = mount(<StatefulTable {...initialState} actions={mockActions} />);
    const tableProps = statefulTable.find(Table).props();
    Object.keys(tableProps.actions).forEach(actionType =>
      Object.values(tableProps.actions[actionType]).forEach(
        // call each nested table action
        tableAction => typeof tableAction === 'function' && tableAction()
      )
    );
    // Every single one of the parent callbacks should have been called
    Object.keys(mockActions).forEach(actionType =>
      Object.values(mockActions[actionType]).forEach(mockAction =>
        expect(mockAction).toHaveBeenCalled()
      )
    );
  });
  afterAll(() => {
    jest.unmock('react');
  });
});
