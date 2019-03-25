import { mount } from 'enzyme';
import React from 'react';
import merge from 'lodash/merge';

import StatefulTable from './StatefulTable';
import TableSkeletonWithHeaders from './TableSkeletonWithHeaders/TableSkeletonWithHeaders';
import { mockActions } from './Table.test';
import { initialState } from './Table.story';

describe('stateful table with real reducer', () => {
  test('verify stateful table can support loading state', () => {
    const statefulTable = mount(
      <StatefulTable
        {...merge({}, initialState, { view: { table: { loadingState: { isLoading: true } } } })}
        actions={mockActions}
      />
    );
    expect(statefulTable.find(TableSkeletonWithHeaders)).toHaveLength(1);
  });
});
