import { render, screen } from '@testing-library/react';
import React from 'react';

import { settings } from '../../../constants/Settings';

import TableSkeletonWithHeaders from './TableSkeletonWithHeaders';

const { iotPrefix } = settings;

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

  it('should show column for rowExpansion when present', () => {
    const { container } = render(
      <TableSkeletonWithHeaders
        testId="table_skeleton"
        rowCount={2}
        columnCount={5}
        hasRowExpansion
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(
      container.querySelectorAll(`.${iotPrefix}--table-skeleton-with-headers--table-row--head td`)
    ).toHaveLength(6);
    expect(
      container.querySelectorAll(`.${iotPrefix}--table-skeleton-with-headers--table-row td`)
    ).toHaveLength(12);
  });

  it('should show column for rowNesting when present', () => {
    const { container } = render(
      <TableSkeletonWithHeaders
        testId="table_skeleton"
        rowCount={2}
        columnCount={5}
        hasRowNesting
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(
      container.querySelectorAll(`.${iotPrefix}--table-skeleton-with-headers--table-row--head td`)
    ).toHaveLength(6);
    expect(
      container.querySelectorAll(`.${iotPrefix}--table-skeleton-with-headers--table-row td`)
    ).toHaveLength(12);
  });

  it('should show all "additional" columns when present', () => {
    const { container } = render(
      <TableSkeletonWithHeaders
        testId="table_skeleton"
        columnCount={5}
        rowCount={2}
        hasRowNesting
        hasRowActions
        hasRowSelection="multi"
        showExpanderColumn
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(
      container.querySelectorAll(`.${iotPrefix}--table-skeleton-with-headers--table-row--head td`)
    ).toHaveLength(9);
    expect(
      container.querySelectorAll(`.${iotPrefix}--table-skeleton-with-headers--table-row td`)
    ).toHaveLength(18);
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
