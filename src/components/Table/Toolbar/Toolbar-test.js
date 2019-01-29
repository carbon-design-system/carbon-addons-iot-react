import { mount } from 'enzyme';
import React from 'react';

import Toolbar from './Toolbar';

describe('Toolbar', () => {
  const commonProps = { selectedItemCount: 0, onBatchDelete: jest.fn(), onBatchCancel: jest.fn() };

  beforeEach(() => {
    console.error = jest.fn();
  });

  test('handles batch delete', () => {
    const wrapper = mount(<Toolbar {...commonProps} />);
    console.log(wrapper.debug());
    wrapper.find('button.bx--action-list__delete').simulate('click');
    expect(commonProps.onBatchDelete).toHaveBeenCalled();
  });

  test('handles batch cancel', () => {
    const wrapper = mount(<Toolbar {...commonProps} />);
    wrapper.find('button.bx--batch-summary__cancel').simulate('click');
    expect(commonProps.onBatchCancel).toHaveBeenCalled();
  });
});
