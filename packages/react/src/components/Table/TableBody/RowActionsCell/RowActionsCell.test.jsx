import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Add32, Edit16 } from '@carbon/icons-react';

import { settings } from '../../../../constants/Settings';

import RowActionsCell from './RowActionsCell';
import RowActionsError from './RowActionsError';

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
      {
        id: 'addAction',
        renderIcon: () => <svg title="my svg" />,
        iconDescription: 'See more',
      },
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
    const originalBounding = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => {
      return {
        bottom: 328,
        height: 280,
        left: 215,
        right: 375,
        top: 48,
        width: 160,
        x: 215,
        y: 48,
      };
    };
    const tableRow = document.createElement('tr');
    const actions = [{ id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' }];
    const { container } = render(<RowActionsCell {...commonRowActionsProps} actions={actions} />, {
      container: document.body.appendChild(tableRow),
    });

    let actionContainer = container.querySelectorAll(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(actionContainer).toHaveLength(0);

    const overflowMenu = screen.getByRole('button', {
      name: RowActionsCell.defaultProps.overflowMenuAria,
    });

    userEvent.click(overflowMenu);

    actionContainer = container.querySelectorAll(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(actionContainer).toHaveLength(1);

    // Close by clicking the menu
    userEvent.click(overflowMenu);
    actionContainer = container.querySelectorAll(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(actionContainer).toHaveLength(0);

    HTMLElement.prototype.getBoundingClientRect = originalBounding;
  });

  it('autoselects the first enabled alternative when the overflow menu is opened', () => {
    const originalBounding = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => {
      return {
        bottom: 328,
        height: 280,
        left: 215,
        right: 375,
        top: 48,
        width: 160,
        x: 215,
        y: 48,
      };
    };
    const tableRow = document.createElement('tr');
    const actions = [
      { disabled: true, id: 'add', isOverflow: true, labelText: 'Add' },
      {
        disabled: false,
        id: 'edit',
        renderIcon: Edit16,
        isOverflow: true,
        labelText: 'Edit',
      },
    ];

    const { container } = render(<RowActionsCell {...commonRowActionsProps} actions={actions} />, {
      container: document.body.appendChild(tableRow),
    });
    const actionContainer = container.querySelectorAll(
      `.${iotPrefix}--row-actions-container .${iotPrefix}--row-actions-container__background--overflow-menu-open`
    );
    expect(actionContainer).toHaveLength(0);

    const overflowMenu = screen.getByRole('button', {
      name: RowActionsCell.defaultProps.overflowMenuAria,
    });

    userEvent.click(overflowMenu);

    expect(screen.getByTitle('Add').closest('button')).toBeDisabled();
    expect(screen.getByTitle('Edit').closest('button')).not.toBeDisabled();
    expect(screen.getByTitle('Edit').closest('button')).toHaveClass(
      `${iotPrefix}--action-overflow-item--initialFocus`
    );

    HTMLElement.prototype.getBoundingClientRect = originalBounding;
  });
  describe('RowActionsError', () => {
    it('should show errors and be dismissable when onClearError is given', () => {
      const tableRow = document.createElement('tr');
      const actions = [{ id: 'addAction', renderIcon: Add32, iconDescription: 'See more' }];
      const onClearError = jest.fn();
      render(
        <RowActionsCell
          id="test"
          tableId="test-table"
          actionFailedText="action-failed"
          learnMoreText="learn-more"
          dismissText="dismiss"
          rowActionsError={{
            title: 'an-error',
            message: 'it-did-occur',
            learnMoreURL: 'https://example.com',
          }}
          onApplyRowAction={jest.fn()}
          onClearError={onClearError}
          actions={actions}
        />,
        {
          container: document.body.appendChild(tableRow),
        }
      );

      expect(screen.getByText('action-failed')).toBeVisible();
      userEvent.click(
        within(screen.getByTestId('row-action-container-background')).getByRole('button')
      );
      const clearButton = screen.getByText('dismiss');
      expect(clearButton).toBeVisible();
      userEvent.click(clearButton);
      expect(onClearError).toHaveBeenCalledTimes(1);
    });

    it('should return null if no errors given', () => {
      const tableRow = document.createElement('tr');
      render(
        <RowActionsError
          actionFailedText="action-failed"
          learnMoreText="learn-more"
          dismissText="dismiss"
          rowActionsError={null}
        />,
        {
          container: document.body.appendChild(tableRow),
        }
      );

      expect(screen.queryByText('action-failed')).toBeNull();
      expect(screen.queryByTestId('row-action-container-background')).toBeNull();
    });
  });
});
