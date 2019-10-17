import { mount } from 'enzyme';
import React from 'react';
import { Add32, Edit16 } from '@carbon/icons-react';

import RowActionsCell from './RowActionsCell';

const mockApplyRowAction = jest.fn();
const commonRowActionsProps = {
  id: 'rowId',
  tableId: 'tableId',
  onApplyRowAction: mockApplyRowAction,
};

describe('RowActionsCell', () => {
  beforeEach(() => {
    mockApplyRowAction.mockClear();
  });
  test('click handler', () => {
    const actions = [{ id: 'addAction', renderIcon: Add32, iconDescription: 'See more' }];
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

  test('overflow menu trigger has ID', () => {
    const actions = [
      { id: 'add', renderIcon: Add32, iconDescription: 'See more' },
      { id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' },
    ];
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />);
    const button = wrapper.find('OverflowMenu #tableId-rowId-row-actions-cell-overflow');
    // Only one id should be present
    expect(button).toHaveLength(1);
  });
});
