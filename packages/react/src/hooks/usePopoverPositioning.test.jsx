import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FlyoutMenu, { FlyoutMenuDirection } from '../components/FlyoutMenu/FlyoutMenu';
import { Tooltip } from '../components/Tooltip';
import { OverflowMenu } from '../components/OverflowMenu';
import { settings } from '../constants/Settings';

const { iotPrefix, prefix } = settings;

const generateBoundingClientRect = ({ x, y, height = 50, width = 50 }) => () => ({
  x,
  y,
  height,
  width,
  top: y,
  bottom: y + height,
  left: x,
  right: x + width,
});

describe('usePopoverPositioning', () => {
  it('Flyout top left flows bottom right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: -200,
        y: -200,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    render(
      <FlyoutMenu
        testId={testId}
        iconDescription={testId}
        direction={FlyoutMenuDirection.TopEnd}
        useAutoPositioning
        menuOffset={undefined}
      />
    );

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 20,
      y: 20,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.RightStart}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout top right flows bottom left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: 1200,
        y: -200,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    act(() => {
      render(
        <FlyoutMenu
          testId={testId}
          iconDescription={testId}
          direction={FlyoutMenuDirection.TopEnd}
          useAutoPositioning
        />
      );
    });

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 1000,
      y: 20,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.LeftStart}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout bottom left flows top right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: -200,
        y: 800,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    act(() => {
      render(
        <FlyoutMenu
          testId={testId}
          iconDescription={testId}
          direction={FlyoutMenuDirection.LeftEnd}
          useAutoPositioning
        />
      );
    });

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 20,
      y: 748,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.TopStart}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout bottom right flows top left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: 1200,
        y: 800,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    act(() => {
      render(
        <FlyoutMenu
          testId={testId}
          iconDescription={testId}
          direction={FlyoutMenuDirection.RightStart}
          useAutoPositioning
        />
      );
    });

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 1000,
      y: 748,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.TopEnd}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout offscreen top flows bottom', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: 300,
        y: -70,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    act(() => {
      render(
        <FlyoutMenu
          testId={testId}
          iconDescription={testId}
          direction={FlyoutMenuDirection.TopStart}
          useAutoPositioning
        />
      );
    });

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 500,
      y: 20,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.BottomStart}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout offscreen right flow left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: 1200,
        y: 300,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    act(() => {
      render(
        <FlyoutMenu
          testId={testId}
          iconDescription={testId}
          direction={FlyoutMenuDirection.RightStart}
          useAutoPositioning
        />
      );
    });

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 1000,
      y: 300,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.LeftStart}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout offscreen bottom flows top', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: 300,
        y: 1000,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    act(() => {
      render(
        <FlyoutMenu
          testId={testId}
          iconDescription={testId}
          direction={FlyoutMenuDirection.BottomStart}
          useAutoPositioning
        />
      );
    });

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 300,
      y: 700,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.TopStart}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout offscreen left flows right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: -200,
        y: 300,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    act(() => {
      render(
        <FlyoutMenu
          testId={testId}
          iconDescription={testId}
          direction={FlyoutMenuDirection.LeftEnd}
          useAutoPositioning
        />
      );
    });

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 20,
      y: 300,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.RightStart}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout renders normally with autopositioning off', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({
        x: -200,
        y: 300,
        height: 134,
        width: 278,
      })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const testId = 'flyout0';
    act(() => {
      render(
        <FlyoutMenu
          testId={testId}
          iconDescription={testId}
          direction={FlyoutMenuDirection.LeftEnd}
        />
      );
    });

    const [button] = screen.getAllByLabelText(testId);
    button.getBoundingClientRect = generateBoundingClientRect({
      x: 20,
      y: 300,
    });

    userEvent.click(button);
    const menu = screen.getByTestId(testId);

    expect(menu).toHaveClass(`${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.LeftEnd}`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Tooltip offscreen left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: -200, y: 300, height: 200, width: 200 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Tooltip key={0} direction="left" useAutoPositioning>
        <p>Hi!</p>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    trigger.children[0].getBoundingClientRect = generateBoundingClientRect({ x: 20, y: 300 });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog').parentNode).toHaveAttribute(
      'data-floating-menu-direction',
      'right'
    );
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Tooltip offscreen right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: 1200, y: 300, height: 200, width: 200 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Tooltip key={0} direction="right" useAutoPositioning>
        <p>Hi!</p>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    trigger.children[0].getBoundingClientRect = generateBoundingClientRect({ x: 1000, y: 300 });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog').parentNode).toHaveAttribute(
      'data-floating-menu-direction',
      'left'
    );
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Tooltip offscreen top', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: 300, y: -200, height: 200, width: 200 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Tooltip key={0} direction="top" useAutoPositioning>
        <p>Hi!</p>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    trigger.children[0].getBoundingClientRect = generateBoundingClientRect({ x: 300, y: 20 });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog').parentNode).toHaveAttribute(
      'data-floating-menu-direction',
      'bottom'
    );
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Tooltip offscreen bottom', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: 300, y: 1000, height: 200, width: 200 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Tooltip key={0} direction="bottom" useAutoPositioning>
        <p>Hi!</p>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    trigger.children[0].getBoundingClientRect = generateBoundingClientRect({ x: 300, y: 700 });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog').parentNode).toHaveAttribute(
      'data-floating-menu-direction',
      'top'
    );
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Tooltip renders normally with autopositioning off', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: 300, y: 1000, height: 200, width: 200 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Tooltip key={0} direction="bottom">
        <p>Hi!</p>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    trigger.children[0].getBoundingClientRect = generateBoundingClientRect({ x: 300, y: 700 });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog').parentNode).toHaveAttribute(
      'data-floating-menu-direction',
      'bottom'
    );
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Overflow offscreen left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: -200, y: 300, height: 200, width: 100 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    render(<OverflowMenu key={0} flipped useAutoPositioning direction="bottom" />);
    const trigger = screen.getByRole('button');
    trigger.children[0].getBoundingClientRect = generateBoundingClientRect({ x: 20, y: 300 });
    userEvent.click(trigger);
    expect(screen.getByRole('menu')).not.toHaveClass(`${prefix}--overflow-menu--flip`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Overflow offscreen right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: 1000, y: 300, height: 200, width: 100 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    render(<OverflowMenu key={1} useAutoPositioning direction="bottom" />);
    const trigger = screen.getByRole('button');
    trigger.getBoundingClientRect = () => {
      return { left: 950, top: 20, right: 1000, bottom: 70, width: 50, height: 50 };
    };
    userEvent.click(trigger);
    expect(screen.getByRole('menu')).toHaveClass(`${prefix}--overflow-menu--flip`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Overflow offscreen top', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ y: -200, x: 300, height: 200, width: 100 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    render(<OverflowMenu key={2} useAutoPositioning direction="top" />);
    const trigger = screen.getByRole('button');
    trigger.getBoundingClientRect = () => {
      return { left: 300, top: 20, right: 1000, bottom: 70, width: 50, height: 50 };
    };
    userEvent.click(trigger);
    expect(screen.getByRole('menu')).toHaveAttribute('data-floating-menu-direction', 'bottom');
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Overflow offscreen bottom', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: 300, y: 1000, height: 200, width: 100 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    render(<OverflowMenu key={3} useAutoPositioning direction="bottom" />);
    const trigger = screen.getByRole('button');
    trigger.getBoundingClientRect = () => {
      return { left: 300, top: 20, right: 1000, bottom: 70, width: 50, height: 50 };
    };
    userEvent.click(trigger);
    expect(screen.getByRole('menu')).toHaveClass(`${prefix}--overflow-menu--flip`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Overflow renders normally when autopositioning off', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn(
      generateBoundingClientRect({ x: 300, y: 1000, height: 200, width: 100 })
    );
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    render(<OverflowMenu key={3} direction="bottom" />);
    const trigger = screen.getByRole('button');
    trigger.getBoundingClientRect = () => {
      return { left: 300, top: 20, right: 1000, bottom: 70, width: 50, height: 50 };
    };
    userEvent.click(trigger);
    expect(screen.getByRole('menu')).not.toHaveClass(`${prefix}--overflow-menu--flip`);
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });
});
