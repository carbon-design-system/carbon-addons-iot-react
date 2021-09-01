import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImageCardFormContent from './ImageCardFormContent';

describe('ImageCardFormContent', () => {
  const mockCardConfig = {
    content: {
      id: 'imageid',
      src: 'imagesrc',
    },
    values: {},
  };
  it('onChange', () => {
    const mockOnChange = jest.fn();

    render(
      <ImageCardFormContent
        onChange={mockOnChange}
        cardConfig={mockCardConfig}
        translateWithId={jest.fn()}
      />
    );
    // first button is the card tooltip
    userEvent.click(screen.getAllByRole('button')[1]);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({ content: {}, values: {} });
  });
  it('popup hotspot modal', () => {
    const mockOnChange = jest.fn();
    render(
      <ImageCardFormContent
        onChange={mockOnChange}
        cardConfig={mockCardConfig}
        translateWithId={jest.fn()}
      />
    );
    // Open up the hotspot modal
    userEvent.click(screen.getByText('Edit image'));
    expect(screen.getByText('Hotspots')).toBeInTheDocument();

    // Save hotspot modal
    userEvent.click(screen.getByText('Save'));
    expect(screen.queryByText('Hotspots')).toBeNull();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
  it('should set an empty array of hotspots if none given', () => {
    const mockOnChange = jest.fn();
    render(
      <ImageCardFormContent
        onChange={mockOnChange}
        cardConfig={{
          content: {
            id: 'imageid',
            src: 'imagesrc',
          },
        }}
        translateWithId={jest.fn()}
      />
    );
    // Open up the hotspot modal
    userEvent.click(screen.getByText('Edit image'));
    expect(screen.getByText('Hotspots')).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      content: {
        id: 'imageid',
        src: 'imagesrc',
      },
      values: {
        hotspots: [],
      },
    });
  });
});
