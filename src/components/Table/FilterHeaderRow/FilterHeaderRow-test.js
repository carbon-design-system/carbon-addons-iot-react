import { mount } from 'enzyme';
import React from 'react';

import FilterHeaderRow from './FilterHeaderRow';

describe('FilterHeaderRow', () => {
  const commonFilterProps = { onApplyFilter: jest.fn() };
  beforeEach(() => {
    console.error = jest.fn();
  });

  test('does state update', () => {
    const wrapper = mount(<FilterHeaderRow {...commonFilterProps} columns={[{ id: 'col1' }]} />);
    wrapper.find('input').simulate('change', { target: { value: 'mytext' } });
    // check state
    expect(wrapper.state()).toEqual({ col1: 'mytext' });

    // Select option state update check
    const wrapper2 = mount(
      <FilterHeaderRow
        {...commonFilterProps}
        columns={[{ id: 'col1', options: ['option1, option2'] }]}
      />
    );

    wrapper2.find('select').simulate('change', { target: { value: 'option1' } });

    expect(wrapper2.state()).toEqual({ col1: 'option1' });
  });
  test('does blur fire apply filter', () => {
    // const mockValidateStepFunction = jest.fn();
    const wrapper = mount(<FilterHeaderRow columns={[{ id: 'col1' }]} />);
    const state = { col1: 'option1' };
    wrapper.setState(state);
    wrapper.find('input').simulate('blur');
    // callback on states
    expect(commonFilterProps.onApplyFilter).toHaveBeenCalledWith(state);
  });
});
