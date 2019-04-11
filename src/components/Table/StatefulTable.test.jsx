import { mount } from 'enzyme';
import React from 'react';
import merge from 'lodash/merge';
import pick from 'lodash/pick';

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
  test('stateful table verify page change', () => {
    const statefulTable = mount(
      <StatefulTable
        {...merge(
          {},
          { ...pick(initialState, 'data', 'options', 'columns') },
          {
            view: {
              pagination: { page: 9 },
            },
          }
        )}
        actions={mockActions}
      />
    );
    statefulTable.find('.bx--pagination__button--forward').simulate('click');
    expect(statefulTable.text()).toContain('100 of 100');
  });
});
