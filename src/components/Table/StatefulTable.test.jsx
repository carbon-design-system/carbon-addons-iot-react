import { mount } from 'enzyme';
import React from 'react';

import StatefulTable from './StatefulTable';
import EmptyTable from './EmptyTable/EmptyTable';
import Table from './Table';
import { mockActions } from './Table.test';
import { initialState } from './Table.story';

let mockDispatch;
// Need to mock the useReducer hook so the real reducer doesn't run
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useReducer: () => [{ view: { table: { filteredData: [] } } }, mockDispatch],
}));
describe('StatefulTable tests', () => {
  afterAll(() => {
    jest.resetModules();
  });
  beforeEach(() => {
    mockDispatch = jest.fn();
  });
  test('check renders nested table', () => {
    const statefulTable = mount(<StatefulTable {...initialState} actions={mockActions} />);
    expect(statefulTable.find(Table)).toHaveLength(1);
  });
  test('async data load', () => {
    // Need the real reducer to fire
    const statefulTable = mount(
      <StatefulTable {...initialState} data={[]} actions={mockActions} />
    );
    // First table is empty
    expect(statefulTable.find(EmptyTable)).toHaveLength(1);
    // First we're called by empty array
    expect(mockDispatch).toHaveBeenCalledWith({ payload: [], type: 'TABLE_REGISTER' });
    statefulTable.setProps({ data: initialState.data });
    // Then table dispatches another item with the real data
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: initialState.data,
      type: 'TABLE_REGISTER',
    });
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
