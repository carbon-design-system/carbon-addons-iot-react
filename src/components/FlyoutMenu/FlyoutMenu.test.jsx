import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor, waitForElement } from '@testing-library/react';

import FlyoutMenu, { FlyoutMenuDirection } from './FlyoutMenu';

const applyButtonText = 'Apply';
const cancelButtonText = 'Cancel';

describe('FlyoutMenu', () => {
  it('Renders an open transactional menu', async () => {
    const { queryByText } = render(
      <FlyoutMenu defaultOpen transactional triggerId="flyout-test" />
    );

    const applyButtonTest = await waitForElement(() => queryByText(applyButtonText));

    const cancelButtonTest = await waitForElement(() => queryByText(cancelButtonText));

    expect(applyButtonTest).toBeTruthy();
    expect(cancelButtonTest).toBeTruthy();
  });

  it('Renders an open menu', async () => {
    const { queryByText } = render(<FlyoutMenu defaultOpen triggerId="flyout-test" />);

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

    fireEvent.click(cancelButton);

    expect(cancelAction).toHaveBeenCalled();
  });

  it('Apply Action', async () => {
    const applyAction = jest.fn();

    const { queryByText } = render(
      <FlyoutMenu open triggerId="flyout-test" transactional onApply={applyAction} />
    );

    const applyButton = await waitForElement(() => queryByText(applyButtonText));

    fireEvent.click(applyButton);

    expect(applyAction).toHaveBeenCalled();
  });

  it('Flyout closes when cancel triggered', async () => {
    const { queryByText } = render(
      <FlyoutMenu
        triggerId="flyout-test"
        defaultOpen
        transactional
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const cancelButton = await waitForElement(() => queryByText(cancelButtonText));

    fireEvent.click(cancelButton);

    const applyButtonVisible = queryByText(applyButtonText);

    expect(applyButtonVisible).toBeNull();
  });

  it('Flyout closes when apply triggered', async () => {
    const { queryByText } = render(
      <FlyoutMenu
        triggerId="flyout-test"
        defaultOpen
        transactional
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const applyButton = await waitForElement(() => queryByText(applyButtonText));

    fireEvent.click(applyButton);

    const applyButtonVisible = queryByText(applyButtonText);

    expect(applyButtonVisible).toBeNull();
  });

  it('Click to open and close menu', async () => {
    const { container, queryByText } = render(<FlyoutMenu transactional triggerId="flyout-test" />);

    const button = await container.firstChild.firstChild;

    fireEvent.click(button);

    const applyButtonVisible = await waitForElement(() => queryByText(applyButtonText));

    expect(applyButtonVisible).toBeTruthy();

    fireEvent.click(button);

    const applyButtonVisibleStill = queryByText(applyButtonText);

    expect(applyButtonVisibleStill).toBeNull();
  });

  it('Flyout Anchor Points Rendered bottom for bottom start', async () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.BottomStart}
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(container.firstChild).toHaveClass('bottom');
  });

  it('Flyout Anchor Points Rendered bottom for bottom end', async () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.BottomEnd}
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(container.firstChild).toHaveClass('bottom');
  });

  it('Flyout Anchor Points Rendered bottom for top start', async () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.TopStart}
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(container.firstChild).toHaveClass('top');
  });

  it('Flyout Anchor Points Rendered bottom for top end', async () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.TopEnd}
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(container.firstChild).toHaveClass('top');
  });

  it('Flyout Anchor Points Rendered bottom for left start', async () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.LeftStart}
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(container.firstChild).toHaveClass('left');
  });

  it('Flyout Anchor Points Rendered bottom for left end', async () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.LeftEnd}
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(container.firstChild).toHaveClass('left');
  });

  it('Flyout Anchor Points Rendered bottom for right start', async () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.RightStart}
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(container.firstChild).toHaveClass('right');
  });

  it('Flyout Anchor Points Rendered bottom for right end', async () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.RightEnd}
        onApply={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(container.firstChild).toHaveClass('right');
  });
});
