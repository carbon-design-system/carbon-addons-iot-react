import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CardCodeEditor from './CardCodeEditor';
import { isValidCallback } from './CardCodeEditor.story';

describe('CardEditor', () => {
  it('should show error notification editor value is invalid', async () => {
    const handleOnCopy = jest.fn();
    const { container } = render(
      <CardCodeEditor
        onSubmit={isValidCallback}
        onCopy={handleOnCopy}
        initialValue="/* write your code here */"
        onClose={() => {}}
      />
    );
    const save = screen.queryByText('Save');
    userEvent.click(save);
    await waitFor(() => expect(screen.queryByRole('alert')).toBeTruthy());
    userEvent.click(
      container.querySelector('.bx--inline-notification__close-button')
    );
    await waitFor(() => expect(screen.queryByRole('alert')).toBeFalsy());
  });

  it('should expand when expand icon is clicked', async () => {
    const handleOnCopy = jest.fn();
    const { container } = render(
      <CardCodeEditor
        onSubmit={isValidCallback}
        onCopy={handleOnCopy}
        initialValue="/* write your code here */"
        onClose={() => {}}
      />
    );
    const expand = screen.queryByText('Expand');
    userEvent.click(expand);
    await waitFor(() =>
      expect(
        container.querySelector('.iot--editor__expanded')
      ).toBeInTheDocument()
    );
  });

  it('should copy editor value when copy icon is clicked', async () => {
    const handleOnCopy = jest.fn();
    const { container } = render(
      <CardCodeEditor
        onSubmit={isValidCallback}
        onCopy={handleOnCopy}
        initialValue="/* write your code here */"
        onClose={() => {}}
      />
    );
    const copy = container.querySelector('.iot--editor-copy');
    userEvent.click(copy);
    expect(handleOnCopy).toHaveBeenCalledWith('/* write your code here */');
  });
});
