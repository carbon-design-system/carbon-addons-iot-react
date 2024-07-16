import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import FlyoutMenu, { FlyoutMenuDirection } from './FlyoutMenu';

const { iotPrefix } = settings;

const generateBoundingClientRect =
  ({ x, y, height = 50, width = 50 }) =>
  () => ({
    x,
    y,
    height,
    width,
    top: y,
    bottom: y + height,
    left: x,
    right: x + width,
  });

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
    expect(screen.queryByTestId('flyout-menu')).toHaveClass(
      `${iotPrefix}--flyout-menu--body__bottom-start`
    );
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

    expect(screen.queryByTestId('flyout-menu')).toHaveClass(
      `${iotPrefix}--flyout-menu--body__bottom-end`
    );
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

    expect(screen.queryByTestId('flyout-menu')).toHaveClass(
      `${iotPrefix}--flyout-menu--body__top-start`
    );
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

    expect(screen.queryByTestId('flyout-menu')).toHaveClass(
      `${iotPrefix}--flyout-menu--body__top-end`
    );
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

    expect(screen.queryByTestId('flyout-menu')).toHaveClass(
      `${iotPrefix}--flyout-menu--body__left-start`
    );
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

    expect(screen.queryByTestId('flyout-menu')).toHaveClass(
      `${iotPrefix}--flyout-menu--body__left-end`
    );
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

    expect(screen.queryByTestId('flyout-menu')).toHaveClass(
      `${iotPrefix}--flyout-menu--body__right-start`
    );
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

    expect(screen.queryByTestId('flyout-menu')).toHaveClass(
      `${iotPrefix}--flyout-menu--body__right-end`
    );
  });

  it('should set tooltip visibility when hideTooltip:false', () => {
    render(
      <FlyoutMenu
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        hideTooltip={false}
      />
    );

    expect(screen.queryByTestId('flyout-menu-container')).toHaveStyle(
      '--tooltip-visibility:visible'
    );
  });

  it('should use custom menuOffset function to determine position if provided', () => {
    const menuOffset = jest.fn().mockImplementation(() => ({ top: 0, left: 0 }));
    render(
      <FlyoutMenu
        defaultOpen
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        hideTooltip={false}
        menuOffset={menuOffset}
      />
    );

    expect(menuOffset).toHaveBeenLastCalledWith(
      expect.any(HTMLElement),
      FlyoutMenuDirection.RightEnd,
      expect.any(HTMLElement),
      false
    );
  });

  it('should use menuOffset (even if only left is given) to determine position', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: 200,
        y: 200,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    const { rerender } = render(
      <FlyoutMenu
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        hideTooltip={false}
        defaultOpen
      />
    );

    expect(screen.getByTestId('flyout-menu')).toHaveStyle('top:-30px');
    expect(screen.getByTestId('flyout-menu')).toHaveStyle('left:276px');

    rerender(
      <FlyoutMenu
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        hideTooltip={false}
        defaultOpen
        menuOffset={{
          left: 100,
        }}
      />
    );

    expect(screen.getByTestId('flyout-menu')).toHaveStyle('top:-30px');
    expect(screen.getByTestId('flyout-menu')).toHaveStyle('left:376px');
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should calculate position in RTL correctly', () => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.dir = 'rtl';
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: 200,
        y: 200,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <FlyoutMenu
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        hideTooltip={false}
        defaultOpen
        menuOffset={{
          top: 15,
        }}
      />
    );

    expect(screen.getByTestId('flyout-menu')).toHaveStyle('top:-15px');
    expect(screen.getByTestId('flyout-menu')).toHaveStyle('left:554px');
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it("shouldn't use menuOffset at all if it's not a function or object", () => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.dir = 'rtl';
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: 200,
        y: 200,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <FlyoutMenu
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        hideTooltip={false}
        defaultOpen
        menuOffset={false}
      />
    );

    expect(screen.getByTestId('flyout-menu')).toHaveStyle('top:-30px');
    expect(screen.getByTestId('flyout-menu')).toHaveStyle('left:554px');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed prop type: Invalid prop `menuOffset` supplied to `FlyoutMenu`'
      )
    );
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    jest.resetAllMocks();
  });

  it('should call onClick when passed a function', () => {
    const onClick = jest.fn();
    render(
      <FlyoutMenu
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        hideTooltip={false}
        buttonProps={{
          onClick,
        }}
      />
    );

    userEvent.click(screen.getAllByRole('button', { name: 'Helpful description' })[0]);
    expect(onClick).toHaveBeenCalled();
  });

  it('should be in a controlled state when passed isOpen', () => {
    render(
      <FlyoutMenu
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        isOpen
      />
    );

    expect(screen.getByTestId('flyout-menu')).toHaveClass(`${iotPrefix}--flyout-menu--body__open`);
  });

  it('should render in a portal when renderInPortal:true', () => {
    render(
      <FlyoutMenu
        direction={FlyoutMenuDirection.RightEnd}
        iconDescription="Helpful description"
        isOpen
        renderInPortal
      />
    );

    // since it's in a portal, the tooltip will _not_ be a child of the flyout-menu-container
    expect(
      screen.getByTestId('flyout-menu-container').querySelectorAll(`#flyout-tooltip`)
    ).toHaveLength(0);
  });
});
