import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImageCardFormSettings from './ImageCardFormSettings';

const cardConfig = {
  id: 'ImageCard',
  title: 'Test Title',
  size: 'MEDIUMWIDE',
  type: 'IMAGE',
  content: {
    hideMinimap: false,
    hideHotspots: false,
    hideZoomControls: true,
    id: 'image.png',
    displayOption: 'cover',
    background: '#f4f4f4',
  },
};

describe('ImageCardFormSettings', () => {
  const actions = {
    onChange: jest.fn(),
  };

  it('fires onChange when user interacts with image form inputs', () => {
    render(
      <ImageCardFormSettings
        cardConfig={cardConfig}
        onChange={actions.onChange}
      />
    );

    userEvent.click(screen.getByTestId('iot--card-edit-form--input-radio1'));

    expect(actions.onChange).toHaveBeenCalledWith({
      ...cardConfig,
      content: {
        background: '#f4f4f4',
        displayOption: 'contain',
        hideHotspots: false,
        hideMinimap: false,
        hideZoomControls: true,
        id: 'image.png',
      },
    });
    actions.onChange.mockReset();
    userEvent.click(screen.getByTestId('iot--card-edit-form--input-toggle1'));
    expect(actions.onChange).toHaveBeenCalledWith({
      ...cardConfig,
      content: {
        background: '#f4f4f4',
        displayOption: 'cover',
        hideHotspots: false,
        hideMinimap: true,
        hideZoomControls: true,
        id: 'image.png',
      },
    });
    actions.onChange.mockReset();

    userEvent.click(screen.getByTestId('iot--card-edit-form--input-toggle2'));
    expect(actions.onChange).toHaveBeenCalledWith({
      ...cardConfig,
      content: {
        background: '#f4f4f4',
        displayOption: 'cover',
        hideHotspots: false,
        hideMinimap: false,
        hideZoomControls: false,
        id: 'image.png',
      },
    });
    actions.onChange.mockReset();
  });


});
