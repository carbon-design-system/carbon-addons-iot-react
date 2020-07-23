import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import FlyoutMenu, { FlyoutMenuDirection } from './FlyoutMenu';

describe('FlyoutMenu', () => {
  it('Renders an open flyout menu with a default footer', () => {
    render(
      <FlyoutMenu defaultOpen iconDescription="Helpful description" triggerId="flyout-test" />
    );

    const applyButtonTest = screen.queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);
    const cancelButtonTest = screen.queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    expect(applyButtonTest).toBeTruthy();
    expect(cancelButtonTest).toBeTruthy();
  });

  it('Renders an open passive menu', () => {
    render(
      <FlyoutMenu
        openDefault
        passive
        iconDescription="Helpful description"
        triggerId="flyout-test"
      />
    );

    const applyButtonTest = screen.queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);
    const cancelButtonTest = screen.queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    expect(applyButtonTest).toBeNull();
    expect(cancelButtonTest).toBeNull();
  });

  it('Renders an open menu with content', () => {
    const testText = 'this is a test';
    render(
      <FlyoutMenu
        defaultOpen
        passive
        iconDescription="Helpful description"
        triggerId="flyout-test"
        customFooter={() => <div>This is it</div>}
      >
        <div>{testText}</div>
      </FlyoutMenu>
    );
    expect(screen.queryByText(testText)).toBeTruthy();
  });

  it('Renders closed', () => {
    const testText = 'this is a test';

    render(
      <FlyoutMenu iconDescription="Helpful description" triggerId="flyout-test">
        {testText}
      </FlyoutMenu>
    );

    const applyButtonTest = screen.queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);
    const cancelButtonTest = screen.queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    expect(applyButtonTest).toBeNull();
    expect(cancelButtonTest).toBeNull();
    expect(screen.queryByText(testText)).toBeNull();
  });

  it('Cancel Action', () => {
    const cancelAction = jest.fn();

    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        onCancel={cancelAction}
      />
    );

    const cancelButton = screen.queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    fireEvent.click(cancelButton);

    expect(cancelAction).toHaveBeenCalled();
  });

  it('Apply Action', () => {
    const applyAction = jest.fn();

    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        onApply={applyAction}
      />
    );

    const applyButton = screen.queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    fireEvent.click(applyButton);

    expect(applyAction).toHaveBeenCalled();
  });

  it('Flyout closes when cancel triggered', () => {
    render(
      <FlyoutMenu
        triggerId="flyout-test"
        defaultOpen
        iconDescription="Helpful description"
        transactional
      />
    );

    const cancelButton = screen.queryByText(FlyoutMenu.defaultProps.i18n.cancelButtonText);

    fireEvent.click(cancelButton);

    const applyButtonVisible = screen.queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    expect(applyButtonVisible).toBeNull();
  });

  it('Flyout closes when apply triggered', () => {
    render(
      <FlyoutMenu
        triggerId="flyout-test"
        defaultOpen
        iconDescription="Helpful description"
        transactional
      />
    );

    const applyButton = screen.queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    fireEvent.click(applyButton);

    const applyButtonVisible = screen.queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    expect(applyButtonVisible).toBeNull();
  });

  it('Click to open and close menu', () => {
    const iconDescription = 'Helpful description';
    render(<FlyoutMenu iconDescription={iconDescription} transactional triggerId="flyout-test" />);

    const button = screen.queryAllByLabelText(iconDescription)[0];

    fireEvent.click(button);

    const applyButtonVisible = screen.queryByText(FlyoutMenu.defaultProps.i18n.applyButtonText);

    expect(applyButtonVisible).toBeTruthy();

    fireEvent.click(button);

    const applyButtonVisibleStill = screen.queryByText(
      FlyoutMenu.defaultProps.i18n.applyButtonText
    );

    expect(applyButtonVisibleStill).toBeNull();
  });

  it('Flyout Anchor Points Rendered bottom for bottom start', () => {
    render(
      <FlyoutMenu
        defaultOpen
        iconDescription="Helpful description"
        triggerId="flyout-test"
        transactional
        direction={FlyoutMenuDirection.BottomStart}
      />
    );
    expect(screen.queryByTestId('flyout-menu')).toHaveClass('iot--flyout-menu--body__bottom-start');
  });

  it('Flyout Anchor Points Rendered bottom for bottom end', () => {
    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.BottomEnd}
      />
    );

    expect(screen.queryByTestId('flyout-menu')).toHaveClass('iot--flyout-menu--body__bottom-end');
  });

  it('Flyout Anchor Points Rendered bottom for top start', () => {
    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.TopStart}
      />
    );

    expect(screen.queryByTestId('flyout-menu')).toHaveClass('iot--flyout-menu--body__top-start');
  });

  it('Flyout Anchor Points Rendered bottom for top end', () => {
    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.TopEnd}
      />
    );

    expect(screen.queryByTestId('flyout-menu')).toHaveClass('iot--flyout-menu--body__top-end');
  });

  it('Flyout Anchor Points Rendered bottom for left start', () => {
    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.LeftStart}
      />
    );

    expect(screen.queryByTestId('flyout-menu')).toHaveClass('iot--flyout-menu--body__left-start');
  });

  it('Flyout Anchor Points Rendered bottom for left end', () => {
    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.LeftEnd}
      />
    );

    expect(screen.queryByTestId('flyout-menu')).toHaveClass('iot--flyout-menu--body__left-end');
  });

  it('Flyout Anchor Points Rendered bottom for right start', () => {
    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.RightStart}
      />
    );

    expect(screen.queryByTestId('flyout-menu')).toHaveClass('iot--flyout-menu--body__right-start');
  });

  it('Flyout Anchor Points Rendered bottom for right end', () => {
    render(
      <FlyoutMenu
        defaultOpen
        triggerId="flyout-test"
        transactional
        iconDescription="Helpful description"
        direction={FlyoutMenuDirection.RightEnd}
      />
    );

    expect(screen.queryByTestId('flyout-menu')).toHaveClass('iot--flyout-menu--body__right-end');
  });
});
