import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImageCardFormContent from './ImageCardFormContent';

describe('ImageCardFormContent', () => {
  it('onChange', () => {
    const mockOnChange = jest.fn();
    const mockCardConfig = {
      content: {
        id: 'imageid',
        src: 'imagesrc',
      },
    };
    render(
      <ImageCardFormContent
        onChange={mockOnChange}
        cardConfig={mockCardConfig}
      />
    );
    // first button is the card tooltip
    userEvent.click(screen.getAllByRole('button')[1]);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({ content: {} });
  });
});
