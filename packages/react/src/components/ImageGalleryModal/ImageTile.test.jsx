import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ImageTile from './ImageTile';

describe('ImageTile', () => {
  const mockDelete = jest.fn();
  const mockToggle = jest.fn();

  it('should be selectable by testId', () => {
    render(
      <ImageTile
        id="my image"
        src=" src: 'path/to/image-a.jpg'"
        toggleImageSelection={mockToggle}
        onDelete={jest.fn()}
        testId="image_tile"
        title="a title"
      />
    );
    expect(screen.getByTestId('image_tile')).toBeDefined();
    expect(screen.getByTestId('image_tile-title')).toBeDefined();
    expect(screen.getByTestId('image_tile-delete-button')).toBeDefined();
    expect(screen.getByTestId('image_tile-image')).toBeDefined();
  });

  it('delete button', () => {
    render(
      <ImageTile
        id="my image"
        src=" src: 'path/to/image-a.jpg'"
        toggleImageSelection={mockToggle}
      />
    );
    expect(screen.queryByLabelText('Delete')).toBeNull();

    render(
      <ImageTile
        id="my image"
        src=" src: 'path/to/image-a.jpg'"
        onDelete={mockDelete}
        toggleImageSelection={mockToggle}
      />
    );
    expect(screen.queryByLabelText('Delete')).toBeDefined();
    expect(mockDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.queryByLabelText('Delete'));
    expect(mockDelete).toHaveBeenCalled();
  });
});
