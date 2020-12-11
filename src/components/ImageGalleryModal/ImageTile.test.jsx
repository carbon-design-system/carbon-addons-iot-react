import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ImageTile from './ImageTile';

describe('ImageTile', () => {
  it('delete button', () => {
    render(<ImageTile id="my image" src=" src: 'path/to/image-a.jpg'" />);
    expect(screen.queryByText('Delete')).toBeNull();

    const mockDelete = jest.fn();
    render(
      <ImageTile
        id="my image"
        src=" src: 'path/to/image-a.jpg'"
        onDelete={mockDelete}
      />
    );
    expect(screen.queryByText('Delete')).toBeDefined();
    expect(mockDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.queryByText('Delete'));
    expect(mockDelete).toHaveBeenCalled();
  });
});
