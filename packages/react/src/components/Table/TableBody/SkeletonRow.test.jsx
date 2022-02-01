import React from 'react';
import { render } from '@testing-library/react';

import { settings } from '../../../constants/Settings';

import SkeletonRow from './SkeletonRow';

const { prefix } = settings;

const skeletonRowProps = () => ({
  id: 'skeletonRow01',
  testId: 'skeleton-row-test',
  rowVisibilityRef: null,
  hasRowActions: false,
  hasRowExpansion: false,
  hasRowNesting: false,
  hasRowSelection: false,
  showExpanderColumn: false,
  columns: [
    {
      id: 'string',
      name: 'String',
      isSortable: true,
    },
    {
      id: 'select',
      name: 'Select',
      isSortable: true,
    },
    {
      id: 'number',
      name: 'Number',
      isSortable: true,
    },
  ],
});

describe('SkeletonRow', () => {
  it('creates standard data skeleton row', () => {
    const { container } = render(<SkeletonRow {...skeletonRowProps()} />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });
    expect(container).toBeDefined();
    expect(container.rows[0].cells.length).toBe(3);
    expect(container.getElementsByClassName(`${prefix}--skeleton__text`).length).toBe(3);
  });

  it('creates data skeleton row with row actions', () => {
    const { container } = render(<SkeletonRow {...skeletonRowProps()} hasRowActions />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });
    expect(container).toBeDefined();
    expect(container.rows[0].cells.length).toBe(4);
    expect(container.getElementsByClassName(`${prefix}--skeleton__text`).length).toBe(3);
  });

  it('creates data skeleton row with row selection', () => {
    const { container } = render(<SkeletonRow {...skeletonRowProps()} hasRowSelection="multi" />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });
    expect(container).toBeDefined();
    expect(container.rows[0].cells.length).toBe(4);
    expect(container.getElementsByClassName(`${prefix}--skeleton__text`).length).toBe(3);
  });

  it('creates data skeleton row with row expansion', () => {
    const { container } = render(<SkeletonRow {...skeletonRowProps()} hasRowExpansion />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });
    expect(container).toBeDefined();
    expect(container.rows[0].cells.length).toBe(4);
    expect(container.getElementsByClassName(`${prefix}--skeleton__text`).length).toBe(3);
  });

  it('creates data skeleton row with expander column', () => {
    const { container } = render(<SkeletonRow {...skeletonRowProps()} showExpanderColumn />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });
    expect(container).toBeDefined();
    expect(container.rows[0].cells.length).toBe(4);
    expect(container.getElementsByClassName(`${prefix}--skeleton__text`).length).toBe(3);
  });

  it('creates data skeleton row with row selection, row nesting, expander column and row actions', () => {
    const { container } = render(
      <SkeletonRow
        {...skeletonRowProps()}
        hasRowSelection="multi"
        hasRowNesting
        hasRowActions
        showExpanderColumn
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(container).toBeDefined();
    expect(container.rows[0].cells.length).toBe(7);
    expect(container.getElementsByClassName(`${prefix}--skeleton__text`).length).toBe(3);
  });
});
