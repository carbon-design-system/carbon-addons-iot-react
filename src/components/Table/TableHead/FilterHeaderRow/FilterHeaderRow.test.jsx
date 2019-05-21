import { mount } from 'enzyme';
import React from 'react';

import FilterHeaderRow from './FilterHeaderRow';

describe('FilterHeaderRow', () => {
  const commonFilterProps = { onApplyFilter: jest.fn() };
  beforeEach(() => {
    console.error = jest.fn();
  });

  test('text input change updates state', () => {
    const wrapper = mount(
      <FilterHeaderRow
        {...commonFilterProps}
        ordering={[{ columnId: 'col1' }]}
        columns={[{ id: 'col1', isFilterable: true }]}
      />
    );
    wrapper.find('input').simulate('change', { target: { value: 'mytext' } });
    expect(wrapper.state()).toEqual({ col1: 'mytext' });
  });

  test('each column is marked with data-column', () => {
    const wrapper = mount(
      <FilterHeaderRow
        {...commonFilterProps}
        ordering={[{ columnId: 'col1' }]}
        columns={[{ id: 'col1' }]}
      />
    );
    const columns = wrapper.find("th[data-column='col1']");
    expect(columns).toHaveLength(1);
  });

  test('input blur fires apply filter callback', () => {
    const wrapper = mount(
      <FilterHeaderRow
        {...commonFilterProps}
        ordering={[{ columnId: 'col1' }]}
        columns={[{ id: 'col1' }]}
      />
    );
    const desiredState = { col1: 'option1' };

    wrapper.setState(desiredState);
    wrapper.find('input').simulate('blur');

    expect(commonFilterProps.onApplyFilter).toHaveBeenCalledWith(desiredState);
  });

  test('text input clear button clears filter', () => {
    const wrapper = mount(
      <FilterHeaderRow
        {...commonFilterProps}
        ordering={[{ columnId: 'col1' }]}
        columns={[{ id: 'col1' }]}
      />
    );
    wrapper.find('input').simulate('change', { target: { value: 'mytext' } });
    wrapper.find('[title="Clear filter"]').simulate('click');
    expect(wrapper.state()).toEqual({ col1: '' });
  });

  test('filter input is hidden when isFilterable is false', () => {
    const wrapper = mount(
      <FilterHeaderRow
        {...commonFilterProps}
        ordering={[{ columnId: 'col1' }]}
        columns={[{ id: 'col1', isFilterable: false }]}
      />
    );
    expect(wrapper.find('input').exists()).toEqual(false);
  });
});
