import React from 'react';
import { mount } from 'enzyme';

import ProgressIndicator from './ProgressIndicator';

const mockItems = [{ id: 'myid', label: 'my label' }, { id: 'myid2', label: 'my label2' }];

describe('ProgressIndicator', () => {
  test('handleChange', () => {
    const mockOnClickItem = jest.fn();
    const wrapper = mount(<ProgressIndicator items={mockItems} onClickItem={mockOnClickItem} />);
    // click the next step
    wrapper.find('[tabIndex=0]').simulate('click');
    expect(mockOnClickItem).toHaveBeenCalledWith('myid2');
  });
  test('if click item is not set it still works', () => {
    const wrapper = mount(<ProgressIndicator items={mockItems} />);
    // click the next step
    wrapper.find('[tabIndex=0]').simulate('click');
    expect(wrapper).toBeDefined();
  });
});
