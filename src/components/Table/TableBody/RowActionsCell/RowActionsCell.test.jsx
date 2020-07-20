import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Add32, Edit16 } from '@carbon/icons-react';

import { settings } from '../../../../constants/Settings';

import RowActionsCell from './RowActionsCell';

const { iotPrefix } = settings;
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

  it('click handler', () => {
    const tableRow = document.createElement('tr');
    const actions = [{ id: 'addAction', renderIcon: Add32, iconDescription: 'See more' }];
    render(<RowActionsCell {...commonRowActionsProps} actions={actions} />, {
      container: document.body.appendChild(tableRow),
    });

    const btn = screen.queryByRole('button');
    // one button should render
    expect(btn).toBeTruthy();
    userEvent.click(btn);
    expect(mockApplyRowAction).toHaveBeenCalledTimes(1);
  });

  it('custom SVG in button', () => {
    const tableRow = document.createElement('tr');
    const actions = [
      { id: 'addAction', renderIcon: () => <svg title="my svg" />, iconDescription: 'See more' },
    ];
    render(<RowActionsCell {...commonRowActionsProps} actions={actions} />, {
      container: document.body.appendChild(tableRow),
    });
    const btn = screen.queryByRole('button');
    // one button should render
    expect(btn).toBeTruthy();
    userEvent.click(btn);
    expect(mockApplyRowAction).toHaveBeenCalledTimes(1);
  });

  it('overflow menu trigger has ID', () => {
    const tableRow = document.createElement('tr');
    const actions = [
      { id: 'add', renderIcon: Add32, iconDescription: 'See more' },
      { id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' },
    ];
    render(<RowActionsCell {...commonRowActionsProps} actions={actions} />, {
      container: document.body.appendChild(tableRow),
    });
    const btns = screen.queryAllByRole('button');
    // Only one id should be present
    expect(btns[0].id).not.toEqual('tableId-rowId-row-actions-cell-overflow');
    expect(btns[1].id).toEqual('tableId-rowId-row-actions-cell-overflow');
  });

  it('actions are wrapped in special gradient background container', () => {
    const tableRow = document.createElement('tr');
    const action = {
      id: 'addAction',
      renderIcon: Add32,
      iconDescription: 'See more',
      labelText: 'Drill in to find out more',
    };
    render(<RowActionsCell {...commonRowActionsProps} actions={[action]} />, {
      container: document.body.appendChild(tableRow),
    });

    //  Container background div is present
    expect(screen.queryByTestId('row-action-container-background')).toBeTruthy();
    // Action text matches the action.labelText prop value
    expect(screen.queryByText(action.labelText)).toBeTruthy();
  });

  it('action container background knows when overflow menu is open (in order to stay visible)', () => {
    const tableRow = document.createElement('tr');
    const actions = [{ id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' }];
    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />, {
      attachTo: tableRow,
    });

    let container = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(container).toHaveLength(0);

    const overflowMenu = wrapper.find('OverflowMenu');
    overflowMenu.simulate('click');
    overflowMenu.props().onOpen();
    wrapper.update();
    container = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(container).toHaveLength(1);

    overflowMenu.props().onClose();
    wrapper.update();
    container = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(container).toHaveLength(0);
  });

  it('autoselects the first enabled alternative when the overflow menu is opened', () => {
    const tableRow = document.createElement('tr');
    const actions = [
      { disabled: true, id: 'add', isOverflow: true, labelText: 'Add' },
      { disabled: false, id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' },
    ];

    const wrapper = mount(<RowActionsCell {...commonRowActionsProps} actions={actions} />, {
      attachTo: tableRow,
    });
    const container = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(container).toHaveLength(0);

    const overflowMenu = wrapper.find('OverflowMenu');
    overflowMenu.simulate('click');
    overflowMenu.props().onOpen();
    wrapper.update();
    const menuItems = wrapper.find(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--action-overflow-item`
    );
    const firstMenuOption = menuItems.first();
    const firstEnabledMenuOption = menuItems.at(2);

    expect(firstMenuOption.props().primaryFocus).toEqual(false);
    expect(firstEnabledMenuOption.props().primaryFocus).toEqual(true);
  });
});
