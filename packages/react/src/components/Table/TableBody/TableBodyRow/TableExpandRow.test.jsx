import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableExpandRow from './TableExpandRow';

describe('TableExpandRow', () => {
  it('should be selectable with testId', () => {
    render(
      <TableExpandRow
        ariaLabel="Click to expand"
        isExpanded={false}
        onExpand={jest.fn()}
        rowId="id-1"
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    expect(screen.getByTestId('expand-row-id-1')).toBeDefined();
    expect(screen.getByTestId('expand-icon-button-id-1')).toBeDefined();
  });

  it('should fire callback when clicked on expand button', () => {
    const onExpandCallback = jest.fn();

    render(
      <TableExpandRow
        ariaLabel="Click to expand"
        isExpanded={false}
        onExpand={onExpandCallback}
        rowId="id-1"
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    userEvent.click(screen.getByTestId('expand-icon-button-id-1'));
    expect(onExpandCallback).toHaveBeenCalledTimes(1);

    userEvent.click(screen.getByTestId('expand-icon-button-id-1'));
    expect(onExpandCallback).toHaveBeenCalledTimes(2);
  });

  it('should display tooltip on hover', async () => {
    render(
      <TableExpandRow
        ariaLabel="Click to expand"
        expandIconDescription="Click to expand"
        isExpanded={false}
        onExpand={jest.fn()}
        rowId="id-1"
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    userEvent.hover(screen.getByTestId('expand-icon-button-id-1'));

    await waitFor(() => expect(screen.getByText('Click to expand')).toBeDefined());
    await waitFor(() => expect(screen.getByText('Click to expand')).toBeVisible());
  });
});
