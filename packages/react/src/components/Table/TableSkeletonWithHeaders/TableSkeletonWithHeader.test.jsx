import { render, screen } from '@testing-library/react';
import React from 'react';

import TableSkeletonWithHeaders from './TableSkeletonWithHeaders';

describe('TableSkeletonWithHeaders', () => {
  it('should be selectable with testID or testId', () => {
    const { rerender } = render(<TableSkeletonWithHeaders testId="table_skeleton" />, {
      container: document.body.appendChild(document.createElement('table')),
    });
    expect(screen.getByTestId('table_skeleton')).toBeDefined();

    rerender(<TableSkeletonWithHeaders testId="TABLE_SKELETON" />, {
      container: document.body.appendChild(document.createElement('table')),
    });
    expect(screen.getByTestId('TABLE_SKELETON')).toBeDefined();
  });

  it('should show expander column when showExpanderColumn is true', () => {
    render(<TableSkeletonWithHeaders testId="table_skeleton" showExpanderColumn />, {
      container: document.body.appendChild(document.createElement('table')),
    });
    expect(screen.getByTestId('table_skeleton-expander-column')).toBeDefined();
    expect(screen.getByTestId('table_skeleton-skeletonRow-0-expander-column')).toBeDefined();
  });

  it('should render the same number of rows given except for 0', () => {
    const { container, rerender } = render(
      <TableSkeletonWithHeaders testId="table_skeleton" showExpanderColumn rowCount={4} />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );

    expect(container.querySelectorAll('tr').length).toBe(4);

    rerender(<TableSkeletonWithHeaders testId="table_skeleton" showExpanderColumn rowCount={0} />, {
      container: document.body.appendChild(document.createElement('table')),
    });

    expect(container.querySelectorAll('tr').length).toBe(1);
  });
});
