import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import CodeEditor from './CodeEditor';

const { iotPrefix } = settings;

describe('CardEditor', () => {
  it('is selectable by testId', async () => {
    const handleOnCopy = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <CodeEditor
        onCopy={handleOnCopy}
        initialValue="/* write your code here */"
        onClose={() => {}}
        hasUpload
        testId="code-editor-testId"
      />
    );
    expect(screen.getByTestId('code-editor-testId')).toBeTruthy();

    expect(screen.getByTestId('code-editor-testId-copy-button')).toBeTruthy();
    expect(screen.getByTestId('code-editor-testId-upload-button')).toBeTruthy();
  });

  it('should upload when upload icon is clicked', async () => {
    const file = new File(['.classNew'], 'test.scss', { type: 'css' });
    const handleOnCopy = jest.fn();
    const { container } = render(
      <CodeEditor
        onCopy={handleOnCopy}
        initialValue="/* write your code here */"
        onClose={() => {}}
        hasUpload
        i18n={{
          copyBtnDescription: 'Copy content',
          copyBtnFeedBack: 'Copied',
          uploadBtnDescription: 'Upload your file',
        }}
      />
    );

    const upload = screen.getByTestId('code-editor-upload-button');
    userEvent.click(upload);

    const uploadInput = container.querySelector(`input[name="upload"]`);

    // simulate upload event and wait until finish
    await waitFor(() =>
      fireEvent.change(uploadInput, {
        target: { files: [file] },
      })
    );

    // get the same uploader from the dom
    const uploadInputAfter = container.querySelector(`input[name="upload"]`);

    // check if the file is there
    expect(uploadInputAfter.files[0].name).toBe('test.scss');
    expect(uploadInputAfter.files.length).toBe(1);
  });

  it('should copy editor value when copy icon is clicked', async () => {
    const handleOnCopy = jest.fn();
    const { container } = render(
      <CodeEditor
        onCopy={handleOnCopy}
        initialValue="/* write your code here */"
        onClose={() => {}}
      />
    );
    const copy = container.querySelector(`.${iotPrefix}--code-editor-copy`);
    userEvent.click(copy);
    expect(handleOnCopy).toHaveBeenCalledWith('/* write your code here */');
  });
});
