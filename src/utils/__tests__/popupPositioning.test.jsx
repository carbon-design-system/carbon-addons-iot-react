import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { stripUnit } from 'polished';

import menuOffset from '../PopupPositioning';
import FlyoutMenu, { FlyoutMenuDirection } from '../../components/FlyoutMenu/FlyoutMenu';
import { Tooltip } from '../../components/Tooltip';
import { OverflowMenu } from '../../components/OverflowMenu';
import { settings } from '../../constants/Settings';

const { iotPrefix, prefix } = settings;
describe('PopupPositioning', () => {
  const flyoutDescriptions = [];

  for (let i = 0; i < 8; i += 1) {
    flyoutDescriptions.push(`flyout${i}`);
  }

  const flyouts = [
    <FlyoutMenu
      key={0}
      testId={flyoutDescriptions[0]}
      iconDescription={flyoutDescriptions[0]}
      direction={FlyoutMenuDirection.TopEnd}
      menuOffset={menuOffset}
    />,
    <FlyoutMenu
      key={1}
      testId={flyoutDescriptions[1]}
      iconDescription={flyoutDescriptions[1]}
      direction={FlyoutMenuDirection.TopStart}
      menuOffset={menuOffset}
    />,
    <FlyoutMenu
      key={2}
      testId={flyoutDescriptions[2]}
      iconDescription={flyoutDescriptions[2]}
      direction={FlyoutMenuDirection.BottomEnd}
      menuOffset={menuOffset}
    />,
    <FlyoutMenu
      key={3}
      testId={flyoutDescriptions[3]}
      iconDescription={flyoutDescriptions[3]}
      direction={FlyoutMenuDirection.BottomStart}
      menuOffset={menuOffset}
    />,
    <FlyoutMenu
      key={4}
      testId={flyoutDescriptions[4]}
      iconDescription={flyoutDescriptions[4]}
      direction={FlyoutMenuDirection.LeftEnd}
      menuOffset={menuOffset}
    />,
    <FlyoutMenu
      key={5}
      testId={flyoutDescriptions[5]}
      iconDescription={flyoutDescriptions[5]}
      direction={FlyoutMenuDirection.LeftStart}
      menuOffset={menuOffset}
    />,
    <FlyoutMenu
      key={6}
      testId={flyoutDescriptions[6]}
      iconDescription={flyoutDescriptions[6]}
      direction={FlyoutMenuDirection.RightEnd}
      menuOffset={menuOffset}
    />,
    <FlyoutMenu
      key={7}
      testId={flyoutDescriptions[7]}
      iconDescription={flyoutDescriptions[7]}
      direction={FlyoutMenuDirection.RightStart}
      menuOffset={menuOffset}
    />,
  ];
  const flyoutBodyBounds = { left: 0, top: 0, right: 600, bottom: 300, width: 600, height: 300 };

  it('Flyout top left flows bottom right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => flyoutBodyBounds);
    render(<div>{flyouts}</div>);
    for (let i = 0; i < 8; i += 1) {
      const flyoutButton = screen.getAllByLabelText(flyoutDescriptions[i])[0];
      flyoutButton.parentElement.getBoundingClientRect = () => {
        return { left: 20, top: 20, right: 70, bottom: 70, width: 50, height: 50 };
      };
      fireEvent.click(flyoutButton);
      const menuBody = screen.getByTestId(flyoutDescriptions[i]);
      expect(
        menuBody.classList.contains(
          `${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.BottomStart}`
        )
      ).toBeTruthy();
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout top right flows bottom left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => flyoutBodyBounds);
    render(<div>{flyouts}</div>);
    for (let i = 0; i < 8; i += 1) {
      const flyoutButton = screen.getAllByLabelText(flyoutDescriptions[i])[0];
      flyoutButton.parentElement.getBoundingClientRect = () => {
        return { left: 900, top: 20, right: 950, bottom: 70, width: 50, height: 50 };
      };
      fireEvent.click(flyoutButton);
      const menuBody = screen.getByTestId(flyoutDescriptions[i]);
      expect(
        menuBody.classList.contains(
          `${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.BottomEnd}`
        )
      ).toBeTruthy();
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout bottom left flows top right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => flyoutBodyBounds);
    render(<div>{flyouts}</div>);
    for (let i = 0; i < 8; i += 1) {
      const flyoutButton = screen.getAllByLabelText(flyoutDescriptions[i])[0];
      flyoutButton.parentElement.getBoundingClientRect = () => {
        return { left: 20, top: 600, right: 70, bottom: 650, width: 50, height: 50 };
      };
      fireEvent.click(flyoutButton);
      const menuBody = screen.getByTestId(flyoutDescriptions[i]);
      expect(
        menuBody.classList.contains(
          `${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.TopStart}`
        )
      ).toBeTruthy();
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout bottom right flows top left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => flyoutBodyBounds);
    render(<div>{flyouts}</div>);
    for (let i = 0; i < 8; i += 1) {
      const flyoutButton = screen.getAllByLabelText(flyoutDescriptions[i])[0];
      flyoutButton.parentElement.getBoundingClientRect = () => {
        return { left: 900, top: 600, right: 950, bottom: 650, width: 50, height: 50 };
      };
      fireEvent.click(flyoutButton);
      const menuBody = screen.getByTestId(flyoutDescriptions[i]);
      expect(
        menuBody.classList.contains(
          `${iotPrefix}--flyout-menu--body__${FlyoutMenuDirection.TopEnd}`
        )
      ).toBeTruthy();
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout offscreen top left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => flyoutBodyBounds);
    render(<div>{flyouts}</div>);
    for (let i = 0; i < 8; i += 1) {
      const flyoutButton = screen.getAllByLabelText(flyoutDescriptions[i])[0];
      flyoutButton.parentElement.getBoundingClientRect = () => {
        return { left: 450, top: 20, right: 500, bottom: 70, width: 50, height: 50 };
      };
      fireEvent.click(flyoutButton);
      const menuBody = screen.getByTestId(flyoutDescriptions[i]).children[1];
      expect(menuBody.style.getPropertyValue('--after-offset')).not.toEqual('-1rem');
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout offscreen top right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => flyoutBodyBounds);
    render(<div>{flyouts}</div>);
    for (let i = 0; i < 8; i += 1) {
      const flyoutButton = screen.getAllByLabelText(flyoutDescriptions[i])[0];
      flyoutButton.parentElement.getBoundingClientRect = () => {
        return { left: 550, top: 20, right: 600, bottom: 70, width: 50, height: 50 };
      };
      fireEvent.click(flyoutButton);
      const menuBody = screen.getByTestId(flyoutDescriptions[i]).children[1];
      expect(menuBody.style.getPropertyValue('--after-offset')).not.toEqual('-1rem');
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout offscreen bottom left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => flyoutBodyBounds);
    render(<div>{flyouts}</div>);
    for (let i = 0; i < 8; i += 1) {
      const flyoutButton = screen.getAllByLabelText(flyoutDescriptions[i])[0];
      flyoutButton.parentElement.getBoundingClientRect = () => {
        return { left: 450, top: 600, right: 500, bottom: 650, width: 50, height: 50 };
      };
      fireEvent.click(flyoutButton);
      const menuBody = screen.getByTestId(flyoutDescriptions[i]).children[1];
      expect(menuBody.style.getPropertyValue('--after-offset')).not.toEqual('-1rem');
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Flyout offscreen bottom right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => flyoutBodyBounds);
    render(<div>{flyouts}</div>);
    for (let i = 0; i < 8; i += 1) {
      const flyoutButton = screen.getAllByLabelText(flyoutDescriptions[i])[0];
      flyoutButton.parentElement.getBoundingClientRect = () => {
        return { left: 450, top: 600, right: 500, bottom: 650, width: 50, height: 50 };
      };
      fireEvent.click(flyoutButton);
      const menuBody = screen.getByTestId(flyoutDescriptions[i]).children[1];
      expect(menuBody.style.getPropertyValue('--after-offset')).not.toEqual('-1rem');
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  const tooltips = [
    <Tooltip key={0} direction="bottom" menuOffset={menuOffset} />,
    <Tooltip key={1} direction="top" menuOffset={menuOffset} />,
    <Tooltip key={2} direction="left" menuOffset={menuOffset} />,
    <Tooltip key={3} direction="right" menuOffset={menuOffset} />,
  ];
  const tooltipBodyBounds = { left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200 };
  it('Tooltip offscreen left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => tooltipBodyBounds);
    render(<div>{tooltips}</div>);
    for (let i = 0; i < 4; i += 1) {
      const trigger = screen.getAllByRole('button')[i];
      trigger.children[0].getBoundingClientRect = () => {
        return { left: 20, top: 300, right: 70, bottom: 350, width: 50, height: 50 };
      };
      fireEvent.click(trigger);
      const menuBody = screen.getByRole('tooltip');
      expect(stripUnit(menuBody.style.getPropertyValue('left'))).toBeGreaterThanOrEqual(0);
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Tooltip offscreen right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => tooltipBodyBounds);
    render(<div>{tooltips}</div>);
    for (let i = 0; i < 4; i += 1) {
      const trigger = screen.getAllByRole('button')[i];
      trigger.children[0].getBoundingClientRect = () => {
        return { left: 950, top: 300, right: 1000, bottom: 350, width: 50, height: 50 };
      };
      fireEvent.click(trigger);
      const menuBody = screen.getByRole('tooltip');
      expect(
        stripUnit(menuBody.style.getPropertyValue('left')) + tooltipBodyBounds.width
      ).toBeLessThanOrEqual(1024);
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Tooltip offscreen top', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => tooltipBodyBounds);
    render(<div>{tooltips}</div>);
    for (let i = 0; i < 4; i += 1) {
      const trigger = screen.getAllByRole('button')[i];
      trigger.children[0].getBoundingClientRect = () => {
        return { left: 500, top: 20, right: 550, bottom: 70, width: 50, height: 50 };
      };
      fireEvent.click(trigger);
      const menuBody = screen.getByRole('tooltip');
      expect(stripUnit(menuBody.style.getPropertyValue('top'))).toBeGreaterThanOrEqual(0);
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  const overflowMenus = [
    <OverflowMenu key={0} menuOffset={menuOffset} menuOffsetFlip={menuOffset} />,
    <OverflowMenu key={1} flipped menuOffset={menuOffset} menuOffsetFlip={menuOffset} />,
  ];
  const overflowBodyBounds = { left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200 };

  it('Overflow offscreen left', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => overflowBodyBounds);
    render(<div>{overflowMenus}</div>);
    for (let i = 0; i < 2; i += 1) {
      const trigger = screen.getAllByRole('button')[i];
      trigger.children[0].getBoundingClientRect = () => {
        return { left: 20, top: 20, right: 70, bottom: 70, width: 50, height: 50 };
      };
      fireEvent.click(trigger);
      expect(
        screen.getByRole('menu').classList.contains(`${prefix}--overflow-menu--flip`)
      ).toBeFalsy();
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('Overflow offscreen right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    mockGetBoundingClientRect.mockImplementation(() => overflowBodyBounds);
    render(<div>{overflowMenus}</div>);
    for (let i = 0; i < 2; i += 1) {
      const trigger = screen.getAllByRole('button')[i];
      trigger.getBoundingClientRect = () => {
        return { left: 950, top: 20, right: 1000, bottom: 70, width: 50, height: 50 };
      };
      fireEvent.click(trigger);
      expect(
        screen.getByRole('menu').classList.contains(`${prefix}--overflow-menu--flip`)
      ).toBeTruthy();
    }
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });
});
