import React from 'react';
import { render, screen } from '@testing-library/react';

import Pagination from './Pagination';

describe('Pagination', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Pagination display hides', () => {
    jest.spyOn(global, 'ResizeObserver').mockImplementation((callback) => {
      callback([{ contentRect: { width: 400, height: 400 } }]);

      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    const { rerender } = render(<Pagination pageSizes={[10, 20, 30]} />);
    // Need to force it to render twice to call the sizing callback
    rerender(<Pagination pageSizes={[10, 20, 30]} />);
    expect(screen.queryByText('Items per page')).toBeNull();
  });
  it('Pagination page display shows', () => {
    jest.spyOn(global, 'ResizeObserver').mockImplementation((callback) => {
      callback([{ contentRect: { width: 600, height: 600 } }]);

      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });
    const { rerender } = render(<Pagination pageSizes={[10, 20, 30]} />);
    rerender(<Pagination pageSizes={[10, 20, 30]} />);

    expect(screen.queryByText('Items per page')).toBeDefined();
  });
});
