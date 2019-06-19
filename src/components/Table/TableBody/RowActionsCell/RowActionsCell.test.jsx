import { mount } from 'enzyme';
import React from 'react';
import Add from '@carbon/icons-react/lib/add/20';

import RowActionsCell from './RowActionsCell';

const mockApplyRowAction = jest.fn();
const commonRowActionsProps = {
  id: 'rowId',
  onApplyRowAction: mockApplyRowAction,
};

describe('RowActionsCell', () => {
  beforeEach(() => {
    mockApplyRowAction.mockClear();
  });
  test('click handler', () => {
    const actions = [{ id: 'addAction', renderIcon: Add, iconDescription: 'See more' }];
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />);
    const button = wrapper.find('.bx--btn');
    // one button should render
    expect(button).toHaveLength(1);
    button.at(0).simulate('click');
    expect(mockApplyRowAction).toHaveBeenCalledTimes(1);
  });
  test('custom SVG in button', () => {
    const actions = [
      { id: 'addAction', renderIcon: () => <svg title="my svg" />, iconDescription: 'See more' },
    ];
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />);
    const button = wrapper.find('.bx--btn');
    // one button should render
    expect(button).toHaveLength(1);
    button.at(0).simulate('click');
    expect(mockApplyRowAction).toHaveBeenCalledTimes(1);
  });
});
