import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImageUploader from './ImageUploader';

describe('ImageUploader', () => {
  it('will switch to URL upload screen', () => {
    render(<ImageUploader />);

    const insertFromURLBtn = screen.getByText(/Insert from URL/);
    userEvent.click(insertFromURLBtn);
    expect(screen.getAllByText(/OK/)).toHaveLength(1);
  });

  it('will upload and use an image from URL', async () => {
    render(<ImageUploader />);

    const insertFromURLBtn = screen.getByText(/Insert from URL/);
    userEvent.click(insertFromURLBtn);
    await userEvent.type(
      screen.getAllByTitle('Type or insert URL'),
      'http://placekitten.com/200/300'
    );
    userEvent.click(insertFromURLBtn);
    expect(screen.querySelectorAll('.iot--image-card-img')).toHaveLength(1);
  });
});
