import React from 'react';
import '@testing-library/jest-dom';
import { waitForElement, render, waitFor } from '@testing-library/react';

import FlyoutMenu from './FlyoutMenu';

const applyButtonText = 'Apply';
const cancelButtonText = 'Cancel';

describe('FlyoutMenu', () => {
  it('Renders open', async () => {
    const { queryByText } = render(<FlyoutMenu open triggerId="flyout-test" />);

    const applyButtonTest = await waitForElement(() => queryByText(applyButtonText));

    const cancelButtonTest = await waitForElement(() => queryByText(cancelButtonText));

    expect(applyButtonTest).toBeTruthy();
    expect(cancelButtonTest).toBeTruthy();
  });

  it('Renders closed', async () => {
    const { queryByText } = render(<FlyoutMenu triggerId="flyout-test" />);

    const applyButtonTest = await waitFor(() => queryByText(applyButtonText));

    const cancelButtonTest = await waitFor(() => queryByText(cancelButtonText));

    expect(applyButtonTest).toBeNull();
    expect(cancelButtonTest).toBeNull();
  });

  it('Cancel Action', async () => {
    const cancelAction = jest.fn();

    const { queryByText } = render(
      <FlyoutMenu open triggerId="flyout-test" onCancel={cancelAction} />
    );

    const cancelButton = await waitForElement(() => queryByText(cancelButtonText));

    cancelButton.click();

    expect(cancelAction).toHaveBeenCalled();
  });

  it('Submit Action', async () => {
    const applyAction = jest.fn();

    const { queryByText } = render(
      <FlyoutMenu open triggerId="flyout-test" onApply={applyAction} />
    );

    const submitButton = await waitForElement(() => queryByText(applyButtonText));

    submitButton.click();

    expect(applyAction).toHaveBeenCalled();
  });
});
