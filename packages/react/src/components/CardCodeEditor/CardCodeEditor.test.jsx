import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import CardCodeEditor from './CardCodeEditor';
import { isValidCallback } from './CardCodeEditor.story';

const { iotPrefix, prefix } = settings;

describe('CardEditor', () => {
  it('is selectable by testID or testId', async () => {
    const handleOnCopy = jest.fn();
    const { rerender } = render(
      <CardCodeEditor
        onSubmit={isValidCallback}
        onCopy={handleOnCopy}
        initialValue="/* write your code here */"
        onClose={() => {}}
        testID="CARD_CODE_EDITOR"
      />
    );
    expect(screen.getByTestId('CARD_CODE_EDITOR')).toBeTruthy();

    rerender(
      <CardCodeEditor
        onSubmit={isValidCallback}
        onCopy={handleOnCopy}
        initialValue="/* write your code here */"
        onClose={() => {}}
        testId="card-code-editor"
        error="an error"
      />
    );
    expect(screen.getByTestId('card-code-editor')).toBeTruthy();
    expect(screen.getByTestId('ComposedModal')).toBeTruthy();
    expect(screen.getByTestId('card-code-editor-expand-button')).toBeTruthy();
    expect(screen.getByTestId('card-code-editor-copy-button')).toBeTruthy();
  });

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
    expect(screen.getByTestId('card-code-editor-notification')).toBeTruthy();
    await waitFor(() => expect(screen.queryByRole('alert')).toBeTruthy());
    userEvent.click(container.querySelector(`.${prefix}--inline-notification__close-button`));
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
    const expand = screen.queryByLabelText('Expand');
    userEvent.click(expand);
    await waitFor(() =>
      expect(container.querySelector(`.${iotPrefix}--editor__expanded`)).toBeInTheDocument()
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
    const copy = container.querySelector(`.${iotPrefix}--editor-copy`);
    userEvent.click(copy);
    expect(handleOnCopy).toHaveBeenCalledWith('/* write your code here */');
  });
});
