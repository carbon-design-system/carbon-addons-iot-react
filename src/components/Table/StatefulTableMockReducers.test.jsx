import { mount } from 'enzyme';
import React from 'react';

import StatefulTable from './StatefulTable';
import EmptyTable from './EmptyTable/EmptyTable';
import Table from './Table';
import { mockActions } from './Table.test';
import { initialState } from './Table.story';

const mockDispatch = jest.fn();
// Need to mock the useReducer hook so the real reducer doesn't run
jest.mock('react', () => {
  const realReact = jest.requireActual('react');
  return {
    ...realReact,
    // if I have a mock dispatch set, fake it otherwise use the real one
    useReducer: () => [{ view: { table: { filteredData: [] } } }, mockDispatch],
  };
});
describe('StatefulTable tests with Mock reducer', () => {
  test('check renders nested table', () => {
    const statefulTable = mount(<StatefulTable {...initialState} actions={mockActions} />);
    expect(statefulTable.find(Table)).toHaveLength(1);
  });
  test('check renders nested table passthrough props', () => {
    const statefulTable = mount(
      <StatefulTable {...initialState} actions={mockActions} className="custom-class" />
    );
    expect(statefulTable.find(Table).prop('className')).toEqual('custom-class');
  });
  test('async data load', () => {
    // Need the real reducer to fire
    const statefulTable = mount(
      <StatefulTable {...initialState} data={[]} actions={mockActions} />
    );
    // First table is empty
    expect(statefulTable.find(EmptyTable)).toHaveLength(1);
    // First we're called by empty array
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { data: [], isLoading: undefined, view: expect.any(Object), totalItems: 0 },
      instanceId: null,
      type: 'TABLE_REGISTER',
    });
    statefulTable.setProps({ data: initialState.data });
    // Then table dispatches another item with the real data
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        data: initialState.data,
        isLoading: undefined,
        view: expect.any(Object),
        totalItems: initialState.data.length,
      },
      instanceId: null,
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
    jest.resetModules();
  });
});
