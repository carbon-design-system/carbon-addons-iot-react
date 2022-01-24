import React from 'react';
import { render, screen } from '@testing-library/react';
import sizeMe from 'react-sizeme';

import Pagination from './Pagination';

sizeMe.noPlaceholders = true;

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

const mockGetBoundingClientRect = jest.fn();

describe('Pagination', () => {
  beforeAll(() => {
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
  });
  afterAll(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });
  it('Pagination display hides', () => {
    // Need to mock getBoundingClientRect for react-sizeme
    mockGetBoundingClientRect.mockImplementation(() => {
      return {
        width: 400,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
    });

    const { rerender } = render(<Pagination pageSizes={[10, 20, 30]} />);
    // Need to force it to render twice to call the sizing callback
    rerender(<Pagination pageSizes={[10, 20, 30]} />);
    expect(screen.queryByText('Items per page')).toBeNull();
  });
  it('Pagination page display shows', () => {
    // at wider widths it should show
    mockGetBoundingClientRect.mockImplementation(() => {
      return {
        width: 600,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
    });
    const { rerender } = render(<Pagination pageSizes={[10, 20, 30]} />);
    rerender(<Pagination pageSizes={[10, 20, 30]} />);

    expect(screen.queryByText('Items per page')).toBeDefined();
  });
});
