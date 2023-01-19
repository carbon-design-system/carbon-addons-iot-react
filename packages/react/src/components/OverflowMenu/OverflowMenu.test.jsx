import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import { OverflowMenu, OverflowMenuItem } from '.';

const { prefix } = settings;

describe('OverflowMenu', () => {
  it('should be selectable by testId', () => {
    render(
      <OverflowMenu testId="overflow_menu">
        <OverflowMenuItem itemText="Option 1" onClick={jest.fn()} />
      </OverflowMenu>
    );

    expect(screen.getByTestId('overflow_menu')).toBeDefined();
  });

  it('should call the default getMenuOffset from carbon when none given', () => {
    const onClick = jest.fn();
    render(
      <OverflowMenu testId="overflow_menu" menuOffset={null}>
        <OverflowMenuItem itemText="Option 1" onClick={onClick} />
      </OverflowMenu>
    );

    userEvent.click(
      screen.getByLabelText('open and close list of options', { selector: 'button' })
    );
    userEvent.click(screen.getByText('Option 1'));
    expect(onClick).toHaveBeenCalled();
  });
});

describe('IotOverflowMenu', () => {
  const testId = 'overflow_menu';

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should be selectable by testId', () => {
    render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" onClick={jest.fn()} />
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId)).toBeDefined();
  });

  it('should call the default getMenuOffset from carbon when none given', () => {
    const onClick = jest.fn();
    render(
      <OverflowMenu testId={testId} menuOffset={null} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" onClick={onClick} />
      </OverflowMenu>
    );

    userEvent.click(screen.getByTestId(testId));
    userEvent.click(screen.getByText('Option 1'));
    expect(onClick).toHaveBeenCalled();
  });

  /* START: duplicating tests from Carbon */
  it('should render an Icon', () => {
    render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByLabelText('open and close list of options')).toBeDefined();
    expect(screen.getByTestId(testId).querySelector('svg')).toBeDefined();
  });

  it('should add expected classes', () => {
    render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId)).toHaveClass(`${prefix}--overflow-menu`);
    expect(screen.getByTestId(testId)).not.toHaveClass(`${prefix}--overflow-menu--open`);
  });

  it('should not render a ul unless menu is open', () => {
    // Deriving elements from baseElement due to React.createPortal
    // reference https://github.com/testing-library/react-testing-library/issues/62
    const { baseElement } = render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const overflowMenu = baseElement.querySelector('ul');

    expect(overflowMenu).toBeNull();
  });

  it('should not render children unless the menu is open', () => {
    render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.queryByText('Option 1')).toBeNull();
  });

  it('should add extra classes that are passed via className', () => {
    render(
      <OverflowMenu className="extra-class" testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId)).toHaveClass('extra-class');
  });

  it('should set tabIndex if one is passed via props', () => {
    render(
      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
      <OverflowMenu tabIndex={2} testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId)).toHaveAttribute('tabIndex', '2');
  });

  it('should set ariaLabel if one is passed via props', () => {
    render(
      <OverflowMenu ariaLabel="test label" testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId).querySelector('svg')).toHaveAttribute(
      'aria-label',
      'test label'
    );
  });

  it('should set id if one is passed via props', () => {
    render(
      <OverflowMenu id="uniqueId" testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId)).toHaveAttribute('id', 'uniqueId');
  });

  it('should specify light version as expected', () => {
    render(
      <OverflowMenu light testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId)).toHaveClass(`${prefix}--overflow-menu--light`);
  });

  it('should add light modifier to overflow menu', () => {
    const { baseElement } = render(
      <OverflowMenu light testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    const overflowMenu = baseElement.querySelector('ul');
    expect(trigger).toHaveClass(`${prefix}--overflow-menu--light`);
    expect(overflowMenu).toHaveClass(`${prefix}--overflow-menu-options--light`);
  });

  it('should render a ul with the appropriate class', () => {
    const { baseElement } = render(
      <OverflowMenu menuOptionsClass="extra-menu-class" testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    const overflowMenu = baseElement.querySelector('ul');
    expect(overflowMenu).toHaveClass(`${prefix}--overflow-menu-options`);
    expect(overflowMenu).toHaveClass('extra-menu-class');
  });

  it('should render children as expected', () => {
    const { baseElement } = render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem className="test-child">one</OverflowMenuItem>
        <OverflowMenuItem className="test-child">two</OverflowMenuItem>
      </OverflowMenu>
    );

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    expect(baseElement.querySelectorAll('.test-child')).toHaveLength(2);
  });

  it('should set expected class when state is open', () => {
    const { baseElement } = render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    const overflowMenu = baseElement.querySelector('ul');
    expect(overflowMenu).toHaveClass(`${prefix}--overflow-menu-options--open`);
  });

  it('should be in an open state after icon is clicked', () => {
    const { baseElement } = render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    expect(baseElement.querySelector('ul')).toBeDefined();
  });

  it('should fire onClick only once per button click', () => {
    const mockOnClick = jest.fn();
    render(
      <OverflowMenu onClick={mockOnClick} testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not toggle state in response to Enter or Space when the menu is open', () => {
    const { baseElement } = render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    expect(baseElement.querySelector('ul')).toBeDefined();
    expect(screen.getByText('Option 1')).toBeDefined();

    userEvent.type(trigger, '{space}');
    expect(baseElement.querySelector('ul')).toBeDefined();
    expect(screen.getByText('Option 1')).toBeDefined();

    userEvent.type(trigger, '{enter}');
    expect(baseElement.querySelector('ul')).toBeDefined();
    expect(screen.getByText('Option 1')).toBeDefined();
  });

  it('should be in a closed state after handleOutsideClick() is invoked', () => {
    // Deriving elements from baseElement due to React.createPortal
    // reference https://github.com/testing-library/react-testing-library/issues/62
    const { baseElement } = render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(baseElement.querySelector('[role="menu"]')).toBeNull();

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    expect(baseElement.querySelector('[role="menu"]')).toBeDefined();

    userEvent.click(document.body);
    expect(baseElement.querySelector('[role="menu"]')).toBeNull();
  });

  it('should render custom icon', () => {
    render(
      <OverflowMenu
        renderIcon={() => <div data-testid="other">Other</div>}
        withCarbonTooltip
        testId={testId}
      >
        <OverflowMenuItem className="test-child">one</OverflowMenuItem>
        <OverflowMenuItem className="test-child">two</OverflowMenuItem>
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId)).toBeDefined();
    expect(screen.getByTestId('other')).toBeDefined();
  });

  it('should re-render component with new props', () => {
    const { rerender } = render(
      <OverflowMenu ariaLabel="test label" testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const firstTooltip = screen.getByText('test label');
    expect(firstTooltip).toBeDefined();

    rerender(
      <OverflowMenu ariaLabel="another label" testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByText('another label')).toBeDefined();
  });

  /* END: duplicating tests from Carbon */

  it('should render a carbon tooltip', () => {
    render(
      <OverflowMenu ariaLabel="test label" testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(screen.getByTestId(testId)).toHaveClass(`${prefix}--tooltip__trigger`);
    expect(screen.getByText('test label')).toBeDefined();
  });

  it('should invoke onClose callback when menu is closed', () => {
    const mockOnClose = jest.fn();
    render(
      <OverflowMenu onClose={mockOnClose} testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);
    userEvent.click(trigger);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should invoke onFocus callback when menu is focused', () => {
    const onFocus = jest.fn();
    render(
      <OverflowMenu onFocus={onFocus} testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    fireEvent.focus(screen.getByTestId(testId));

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('should be in a closed state after Escape is pressed', () => {
    const { baseElement } = render(
      <OverflowMenu testId={testId} withCarbonTooltip>
        <OverflowMenuItem itemText="Option 1" />
      </OverflowMenu>
    );

    expect(baseElement.querySelector('ul')).toBeNull();

    const trigger = screen.getByTestId(testId);
    userEvent.click(trigger);

    userEvent.type(baseElement, '{escape}');
    expect(baseElement.querySelector('ul')).toBeNull();
  });
});
