import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ErrorTable from '../ErrorTable';

const commonTableProps = {
  id: 'tableid',
  totalColumns: 3,
  isFiltered: false,
  error: 'error occured',
  i18n: {
    tableErrorStateTitle: 'Unable to load the page',
    buttonLabelOnTableError: 'Refresh the page',
  },
};

describe('ErrorTable', () => {
  it('should be selectable by testID or testId', () => {
    const { rerender } = render(
      <ErrorTable
        {...commonTableProps}
        errorState={<span>my custom element</span>}
        testID="ERROR"
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(screen.getByTestId('ERROR')).toBeDefined();
    rerender(
      <ErrorTable
        {...commonTableProps}
        errorState={<span>my custom element</span>}
        testId="error"
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(screen.getByTestId('error')).toBeDefined();
  });
  it('custom error state', () => {
    render(<ErrorTable {...commonTableProps} errorState={<span>my custom element</span>} />, {
      container: document.body.appendChild(document.createElement('table')),
    });
    expect(screen.queryAllByText('my custom element')).toHaveLength(1);
  });
  it('error state action with no error button', () => {
    render(<ErrorTable {...commonTableProps} />, {
      container: document.body.appendChild(document.createElement('table')),
    });
    expect(screen.queryAllByText('Unable to load the page')).toHaveLength(1);
    expect(screen.queryAllByText('error occured')).toHaveLength(1);
    expect(screen.queryAllByText('Refresh the page')).toHaveLength(0);
  });
  it('error state action with error button', () => {
    const onErrorStateAction = jest.fn();
    render(<ErrorTable {...commonTableProps} onErrorStateAction={onErrorStateAction} />, {
      container: document.body.appendChild(document.createElement('table')),
    });
    expect(screen.queryAllByText('Unable to load the page')).toHaveLength(1);
    expect(screen.queryAllByText('error occured')).toHaveLength(1);
    fireEvent.click(screen.getByText('Refresh the page'));
    expect(onErrorStateAction).toHaveBeenCalled();
  });
  it('renders without error prop', () => {
    const onErrorStateAction = jest.fn();
    render(
      <ErrorTable
        {...commonTableProps}
        error={undefined}
        onErrorStateAction={onErrorStateAction}
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(screen.queryAllByText('Unable to load the page')).toHaveLength(1);
    expect(screen.queryByText('error occured')).not.toBeInTheDocument();
  });
});
