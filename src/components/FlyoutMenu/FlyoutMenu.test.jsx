import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';

import FlyoutMenu, { FlyoutMenuDirection } from './FlyoutMenu';

describe('FlyoutMenu', () => {
  it('Renders an open flyout menu with a default footer', () => {
    const { queryByText } = render(
      <FlyoutMenu defaultOpen iconDescription="Helpful description" triggerId="flyout-test" />
    );

    const applyButtonTest = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);
    const cancelButtonTest = queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    expect(applyButtonTest).toBeTruthy();
    expect(cancelButtonTest).toBeTruthy();
  });

  it('Renders an open passive menu', () => {
    const { queryByText } = render(
      <FlyoutMenu open passive iconDescription="Helpful description" triggerId="flyout-test" />
    );

    const applyButtonTest = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);
    const cancelButtonTest = queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    expect(applyButtonTest).toBeNull();
    expect(cancelButtonTest).toBeNull();
  });

  it('Renders an open menu with content', () => {
    const testText = 'this is a test';
    const { queryByText } = render(
      <FlyoutMenu open passive iconDescription="Helpful description" triggerId="flyout-test">
        <div>{testText}</div>
      </FlyoutMenu>
    );

    expect(queryByText(testText)).toBeTruthy();
  });

  it('Renders closed', () => {
    const testText = 'this is a test';

    const { queryByText } = render(
      <FlyoutMenu iconDescription="Helpful description" triggerId="flyout-test">
        {testText}
      </FlyoutMenu>
    );

    const applyButtonTest = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);
    const cancelButtonTest = queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    expect(applyButtonTest).toBeNull();
    expect(cancelButtonTest).toBeNull();
    expect(queryByText(testText)).toBeNull();
  });

  it('Cancel Action', () => {
    const cancelAction = jest.fn();

    const { queryByText } = render(
      <FlyoutMenu
        open
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        onCancel={cancelAction}
      />
    );

    const cancelButton = queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    fireEvent.click(cancelButton);

    expect(cancelAction).toHaveBeenCalled();
  });

  it('Apply Action', () => {
    const applyAction = jest.fn();

    const { queryByText } = render(
      <FlyoutMenu
        open
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        onApply={applyAction}
      />
    );

    const applyButton = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    fireEvent.click(applyButton);

    expect(applyAction).toHaveBeenCalled();
  });

  it('Flyout closes when cancel triggered', () => {
    const { queryByText } = render(
      <FlyoutMenu
        triggerId="flyout-test"
        defaultOpen
        iconDescription="Helpful description"
        transactional
      />
    );

    const cancelButton = queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    fireEvent.click(cancelButton);

    const applyButtonVisible = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    expect(applyButtonVisible).toBeNull();
  });

  it('Flyout closes when apply triggered', () => {
    const { queryByText } = render(
      <FlyoutMenu
        triggerId="flyout-test"
        defaultOpen
        iconDescription="Helpful description"
        transactional
      />
    );

    const applyButton = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    fireEvent.click(applyButton);

    const applyButtonVisible = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    expect(applyButtonVisible).toBeNull();
  });

  it('Click to open and close menu', () => {
    const iconDescription = 'Helpful description';
    const { queryAllByLabelText, queryByText } = render(
      <FlyoutMenu iconDescription={iconDescription} transactional triggerId="flyout-test" />
    );

    const button = queryAllByLabelText(iconDescription)[0];

    fireEvent.click(button);

    const applyButtonVisible = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    expect(applyButtonVisible).toBeTruthy();

    fireEvent.click(button);

    const applyButtonVisibleStill = queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    expect(applyButtonVisibleStill).toBeNull();
  });

  it('Flyout Anchor Points Rendered bottom for bottom start', () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        iconDescription="Helpful description"
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.BottomStart}
      />
    );

    expect(container.firstChild).toHaveClass('bottom');
  });

  it('Flyout Anchor Points Rendered bottom for bottom end', () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.BottomEnd}
      />
    );

    expect(container.firstChild).toHaveClass('bottom');
  });

  it('Flyout Anchor Points Rendered bottom for top start', () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.TopStart}
      />
    );

    expect(container.firstChild).toHaveClass('top');
  });

  it('Flyout Anchor Points Rendered bottom for top end', () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.TopEnd}
      />
    );

    expect(container.firstChild).toHaveClass('top');
  });

  it('Flyout Anchor Points Rendered bottom for left start', () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.LeftStart}
      />
    );

    expect(container.firstChild).toHaveClass('left');
  });

  it('Flyout Anchor Points Rendered bottom for left end', () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.LeftEnd}
      />
    );

    expect(container.firstChild).toHaveClass('left');
  });

  it('Flyout Anchor Points Rendered bottom for right start', () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.RightStart}
      />
    );

    expect(container.firstChild).toHaveClass('right');
  });

  it('Flyout Anchor Points Rendered bottom for right end', () => {
    const { container } = render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.RightEnd}
      />
    );

    expect(container.firstChild).toHaveClass('right');
  });
});
