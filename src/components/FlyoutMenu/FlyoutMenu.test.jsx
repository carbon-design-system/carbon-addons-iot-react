import React from 'react';
import '@testing-library/jest-dom';
import { waitForElement, render, waitFor } from '@testing-library/react';

import FlyoutMenu from './FlyoutMenu';

const applyButtonText = 'Apply';
const cancelButtonText = 'Cancel';

describe('FlyoutMenu', () => {
  it('Renders an open transactional menu', async () => {
    const { queryByText } = render(<FlyoutMenu open transactional triggerId="flyout-test" />);

    const applyButtonTest = await waitForElement(() => queryByText(applyButtonText));

    const cancelButtonTest = await waitForElement(() => queryByText(cancelButtonText));

    expect(applyButtonTest).toBeTruthy();
    expect(cancelButtonTest).toBeTruthy();
  });

  it('Renders an open menu', async () => {
    const { queryByText } = render(<FlyoutMenu open triggerId="flyout-test" />);

    const applyButtonTest = queryByText(applyButtonText);

    const cancelButtonTest = queryByText(cancelButtonText);

    expect(applyButtonTest).toBeNull();
    expect(cancelButtonTest).toBeNull();
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
      <FlyoutMenu open triggerId="flyout-test" transactional onCancel={cancelAction} />
    );

    const cancelButton = await waitForElement(() => queryByText(cancelButtonText));

    cancelButton.click();

    expect(cancelAction).toHaveBeenCalled();
  });

  it('Apply Action', async () => {
    const applyAction = jest.fn();

    const { queryByText } = render(
      <FlyoutMenu open triggerId="flyout-test" transactional onApply={applyAction} />
    );

    const applyButton = await waitForElement(() => queryByText(applyButtonText));

    applyButton.click();

    expect(applyAction).toHaveBeenCalled();
  });

  it('Controlled Flyout remains open when action triggered', async () => {
    const { queryByText } = render(
      <FlyoutMenu
        open
        triggerId="flyout-test"
        transactional
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const applyButton = await waitForElement(() => queryByText(applyButtonText));

    applyButton.click();

    const cancelButton = await waitForElement(() => queryByText(cancelButtonText));

    cancelButton.click();

    const applyButtonVisible = await waitForElement(() => queryByText(applyButtonText));

    expect(applyButtonVisible).toBeTruthy();
  });

  it('Uncontrolled Flyout closes when cancel triggered', async () => {
    const { queryByText } = render(
      <FlyoutMenu
        open
        triggerId="flyout-test"
        transactional
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const cancelButton = await waitForElement(() => queryByText(cancelButtonText));

    cancelButton.click();

    const applyButtonVisible = await waitForElement(() => queryByText(applyButtonText));

    expect(applyButtonVisible).toBeTruthy();
  });

  it('Uncontrolled Flyout closes when apply triggered', async () => {
    const { queryByText } = render(
      <FlyoutMenu
        open
        triggerId="flyout-test"
        transactional
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const applyButton = await waitForElement(() => queryByText(applyButtonText));

    applyButton.click();

    const applyButtonVisible = await waitForElement(() => queryByText(applyButtonText));

    expect(applyButtonVisible).toBeTruthy();
  });

  it('Click to open and close menu', async () => {
    const { container, queryByText } = render(<FlyoutMenu transactional triggerId="flyout-test" />);

    const button = await container.firstChild.firstChild;

    button.click();

    const applyButtonVisible = await waitForElement(() => queryByText(applyButtonText));

    expect(applyButtonVisible).toBeTruthy();

    button.click();

    const applyButtonVisibleStill = queryByText(applyButtonText);

    expect(applyButtonVisibleStill).toBeNull();
  });
});
