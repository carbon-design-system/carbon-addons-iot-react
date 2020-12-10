import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImageUploader from './ImageUploader';

// function mockFetch(status, data) {
//   return { status, json: () => Promise.resolve(data) };
// }

describe('ImageUploader', () => {
  it('will switch to URL upload screen', () => {
    render(<ImageUploader hasInsertFromUrl />);

    const insertFromURLBtn = screen.getByText(/Insert from URL/);
    userEvent.click(insertFromURLBtn);
    expect(screen.getAllByText(/OK/)).toHaveLength(1);
    userEvent.click(screen.getByText(/Cancel/));
    expect(screen.getAllByText(/Insert from URL/)).toHaveLength(1);
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // it('will upload and use an image from URL', async () => {
  //   const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
  //   const { container } = render(<ImageUploader />);

  //   userEvent.click(
  //     screen.getByText(/Drag and drop file here or click to select file/)
  //   );
  //   // await waitFor(() => expect(screen.getAllByText(/OK/)).toHaveLength(1));
  //   fireEvent.change(container.querySelector('input'), {
  //     target: { files: [file] },
  //   });
  //   // userEvent.click(screen.getByText(/OK/));
  //   screen.debug();
  //   expect(3).toEqual(3);
  //   // expect(screen.querySelectorAll('.iot--image-card-img')).toHaveLength(1);
  // });
});
