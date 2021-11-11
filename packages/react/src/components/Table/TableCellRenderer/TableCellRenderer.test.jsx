import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../constants/Settings';

import TableCellRenderer from './TableCellRenderer';

const { iotPrefix, prefix } = settings;

describe('TableCellRenderer', () => {
  const cellText = 'This text is not actually measured';

  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth');

  const setOffsetWidth = (width) => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      writable: false,
      configurable: true,
      value: width,
    });
  };

  const setScrollWidth = (width) => {
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      writable: false,
      configurable: true,
      value: width,
    });
  };

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth);
  });

  it('truncates only for truncateCellText={true}', () => {
    const { rerender, container } = render(
      <TableCellRenderer wrapText="never" truncateCellText>
        {cellText}
      </TableCellRenderer>
    );
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);

    rerender(
      <TableCellRenderer wrapText="never" truncateCellText={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(0);
  });

  it('does not truncat when wrapText={always}', () => {
    const { container } = render(
      <TableCellRenderer wrapText="always" truncateCellText>
        {cellText}
      </TableCellRenderer>
    );
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(0);
  });

  it('does not allow wrap when wrapText={never}', () => {
    const { container } = render(
      <TableCellRenderer wrapText="never" truncateCellText={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(1);
  });

  it('allows wrap when wrapText={always}', () => {
    const { container } = render(
      <TableCellRenderer wrapText="always" truncateCellText={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(0);
  });

  it('only truncates children that are strings, numbers or booleans', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <td>
              <TableCellRenderer wrapText="never" truncateCellText>
                my string
              </TableCellRenderer>
            </td>
            <td>
              <TableCellRenderer wrapText="never" truncateCellText>
                {true}
              </TableCellRenderer>
            </td>
            <td>
              <TableCellRenderer wrapText="never" truncateCellText>
                {127}
              </TableCellRenderer>
            </td>
            <td>
              <TableCellRenderer wrapText="never" truncateCellText>
                <div>a div</div>
              </TableCellRenderer>
            </td>
          </tr>
        </tbody>
      </table>
    );
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(3);
  });

  it('only shows tooltip if text is actually truncated', () => {
    setOffsetWidth(10);
    setScrollWidth(20);

    const { container, rerender } = render(
      <TableCellRenderer wrapText="never" truncateCellText>
        {cellText}
      </TableCellRenderer>
    );
    expect(container.querySelectorAll(`.${prefix}--tooltip__label`)).toHaveLength(1);
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(1);

    setOffsetWidth(20);
    setScrollWidth(10);
    rerender(
      <TableCellRenderer wrapText="never" truncateCellText>
        {cellText}
      </TableCellRenderer>
    );
    expect(container.querySelectorAll(`.${prefix}--tooltip__label`)).toHaveLength(0);
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(1);

    setOffsetWidth(0);
    setScrollWidth(0);
  });

  it('does not show tooltip with allowTooltip={false}', () => {
    setOffsetWidth(10);
    setScrollWidth(20);

    const cellText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    const { container } = render(
      <TableCellRenderer wrapText="never" truncateCellText allowTooltip={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(container.querySelectorAll(`.${prefix}--tooltip__label`)).toHaveLength(0);
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);
    expect(container.querySelectorAll(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(1);

    setOffsetWidth(0);
    setScrollWidth(0);
  });

  it('locale formats numbers', () => {
    const { rerender } = render(
      <TableCellRenderer locale="fr" truncateCellText wrapText="never">
        {35.6}
      </TableCellRenderer>
    );
    expect(screen.getByText('35,6')).toBeDefined(); // french locale should have commas for decimals

    rerender(
      <TableCellRenderer locale="en" truncateCellText wrapText="never">
        {35.1234567}
      </TableCellRenderer>
    );
    expect(screen.getByText('35.1234567')).toBeDefined(); // no limit on the count of decimals
  });

  it('should set preserve class when preserveCellWhiteSpace:true', () => {
    const { container } = render(
      <TableCellRenderer wrapText="never" truncateCellText columnId="string" preserveCellWhiteSpace>
        {'1  1   1    1     1'}
      </TableCellRenderer>
    );

    // have to select by querySelector, because selecting by title or text fails, because it
    // returns '1 1 1 1 1' instead of preserving spaces as expected, so this seems more clear
    // than using a text or title query that is the exact opposite of the output we're desiring
    // (that the whitespace be preserved)
    expect(container.querySelector('span')).toBeVisible();
    expect(container.querySelector('span')).toHaveClass(`${iotPrefix}--table__cell-text--preserve`);
  });

  it('should not set preserve class when preserveCellWhiteSpace:false', () => {
    render(
      <TableCellRenderer wrapText="never" truncateCellText columnId="string">
        {'1        1'}
      </TableCellRenderer>
    );

    expect(screen.getByText('1 1')).toBeVisible();
    expect(screen.getByText('1 1')).not.toHaveClass(`${iotPrefix}--table__cell-text--preserve`);
  });

  describe('warning should be thrown for objects as data without needed functions', () => {
    const { __DEV__ } = global;
    const { error } = console;
    let renderDataFunction;

    beforeEach(() => {
      renderDataFunction = jest.fn().mockImplementation(() => '124556');
      global.__DEV__ = true;
      console.error = jest.fn();
    });

    afterEach(() => {
      global.__DEV__ = __DEV__;
      console.error = error;
      jest.clearAllMocks();
    });

    it('should throw warnings if objects are passed as data without a renderer', () => {
      render(
        <TableCellRenderer wrapText="never" truncateCellText locale="en" columnId="object">
          {{ id: '124556' }}
        </TableCellRenderer>
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(
          `You must supply a 'renderDataFunction' when passing objects as column values.`
        )
      );
    });

    it('should throw warnings if objects are passed as data and are sortable without sortFunction', () => {
      render(
        <TableCellRenderer
          wrapText="never"
          truncateCellText
          locale="en"
          columnId="object"
          renderDataFunction={renderDataFunction}
          isSortable
        >
          {{ id: '124556' }}
        </TableCellRenderer>
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(
          `You must supply a 'sortFunction' when isSortable is true and you're passing objects as column values.`
        )
      );
    });

    it('should throw warnings if objects are passed as data and are filterable without filterFunction', () => {
      render(
        <TableCellRenderer
          wrapText="never"
          truncateCellText
          locale="en"
          columnId="object"
          renderDataFunction={renderDataFunction}
          isFilterable
        >
          {{ id: '124556' }}
        </TableCellRenderer>
      );

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(
          `You must supply a 'filterFunction' when passing objects as column values and want them filterable.`
        )
      );
    });

    it('should not throw errors when a render function is given', () => {
      render(
        <TableCellRenderer
          wrapText="never"
          truncateCellText
          locale="en"
          renderDataFunction={renderDataFunction}
          columnId="object"
        >
          {{ id: '124556' }}
        </TableCellRenderer>
      );

      expect(console.error).not.toHaveBeenCalled();
      expect(renderDataFunction).toHaveBeenCalled();
      expect(screen.getByText('124556')).toBeDefined();
    });

    it('should render a tooltip and display it on focus when one is given', () => {
      render(
        <TableCellRenderer
          wrapText="never"
          truncateCellText
          locale="en"
          tooltip="This is a test tooltip"
        >
          Select
        </TableCellRenderer>
      );

      expect(screen.getByText('Select')).toBeVisible();
      expect(screen.getByRole('tooltip')).toBeDefined();
      expect(screen.getByRole('button', { name: 'Select' })).not.toHaveClass(
        `${prefix}--tooltip--visible`
      );
      expect(document.body).toHaveFocus();
      userEvent.tab();
      expect(screen.getByRole('button', { name: 'Select' })).toHaveFocus();
      expect(screen.getByRole('button', { name: 'Select' })).toHaveClass(
        `${prefix}--tooltip--visible`
      );
    });

    it('should render a tooltip and display it on hover when one is given', () => {
      render(
        <TableCellRenderer
          wrapText="never"
          truncateCellText
          locale="en"
          tooltip="This is a test tooltip"
        >
          Select
        </TableCellRenderer>
      );

      expect(screen.getByText('Select')).toBeVisible();
      expect(screen.getByRole('tooltip')).toBeDefined();
      expect(screen.getByRole('button', { name: 'Select' })).not.toHaveClass(
        `${prefix}--tooltip--visible`
      );
      userEvent.hover(screen.getByText('Select'));
      expect(screen.getByRole('button', { name: 'Select' })).toHaveClass(
        `${prefix}--tooltip--visible`
      );
    });
  });
});
