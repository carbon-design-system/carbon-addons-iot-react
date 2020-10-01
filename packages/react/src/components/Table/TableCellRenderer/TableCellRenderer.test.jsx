import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { settings } from '../../../constants/Settings';

import TableCellRenderer from './TableCellRenderer';

const { iotPrefix, prefix } = settings;

describe('TableCellRenderer', () => {
  const cellText = 'This text is not actually measured';
  const textTruncateClassName = `${iotPrefix}--table__cell-text--truncate`;
  const textNoWrapClassName = `${iotPrefix}--table__cell-text--no-wrap`;

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

  it('truncates only for cellTextOverflow:"truncate"', () => {
    const { rerender } = render(
      <TableCellRenderer cellTextOverflow="truncate">{cellText}</TableCellRenderer>
    );
    expect(screen.getByText(cellText)).toHaveClass(textTruncateClassName);

    rerender(<TableCellRenderer>{cellText}</TableCellRenderer>);
    expect(screen.getByText(cellText)).not.toHaveClass(textTruncateClassName);
  });

  it('does not allow wrapping for cellTextOverflow:"grow"', () => {
    render(<TableCellRenderer cellTextOverflow="grow">{cellText}</TableCellRenderer>);
    expect(screen.getByText(cellText)).toHaveClass(textNoWrapClassName);
  });

  it('allows wrapping by default', () => {
    render(<TableCellRenderer>{cellText}</TableCellRenderer>);
    expect(screen.getByText(cellText)).not.toHaveClass(textNoWrapClassName);
    expect(screen.getByText(cellText)).not.toHaveClass(textTruncateClassName);
  });

  it('allows wrapping for cellTextOverflow:"wrap" ', () => {
    render(<TableCellRenderer cellTextOverflow="wrap">{cellText}</TableCellRenderer>);
    // Wrapping is Carbon default, so the the absense of these classes
    // indicates that the text is wrapping.
    expect(screen.getByText(cellText)).not.toHaveClass(textNoWrapClassName);
    expect(screen.getByText(cellText)).not.toHaveClass(textTruncateClassName);
  });

  it('only truncates children that are strings, numbers or booleans', () => {
    render(
      <table>
        <tbody>
          <tr>
            <td>
              <TableCellRenderer cellTextOverflow="truncate">my string</TableCellRenderer>
            </td>
            <td>
              <TableCellRenderer cellTextOverflow="truncate">{true}</TableCellRenderer>
            </td>
            <td>
              <TableCellRenderer cellTextOverflow="truncate">{127}</TableCellRenderer>
            </td>
            <td>
              <TableCellRenderer cellTextOverflow="truncate">
                <div>a div</div>
              </TableCellRenderer>
            </td>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText('my string')).toHaveClass(textTruncateClassName);
    expect(screen.getByText('true')).toHaveClass(textTruncateClassName);
    expect(screen.getByText('127')).toHaveClass(textTruncateClassName);
    expect(screen.getByText('a div').parentNode).not.toHaveClass(textTruncateClassName);
  });

  it('only shows tooltip if text is actually truncated', () => {
    setOffsetWidth(10);
    setScrollWidth(20);

    const wrapper = mount(
      <TableCellRenderer cellTextOverflow="truncate">{cellText}</TableCellRenderer>
    );
    expect(wrapper.find(`.${prefix}--tooltip__label`)).toHaveLength(1);
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);

    setOffsetWidth(20);
    setScrollWidth(10);
    const wrapper2 = mount(
      <TableCellRenderer cellTextOverflow="truncate">{cellText}</TableCellRenderer>
    );
    expect(wrapper2.find(`.${prefix}--tooltip__label`)).toHaveLength(0);
    expect(wrapper2.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);

    setOffsetWidth(0);
    setScrollWidth(0);
  });

  it('does not show tooltip with allowTooltip={false}', () => {
    setOffsetWidth(10);
    setScrollWidth(20);

    const cellText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    const wrapper = mount(
      <TableCellRenderer cellTextOverflow="truncate" allowTooltip={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper.find(`.${prefix}--tooltip__label`)).toHaveLength(0);
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);

    setOffsetWidth(0);
    setScrollWidth(0);
  });

  it('locale formats numbers', () => {
    const wrapper = mount(
      <TableCellRenderer locale="fr" truncateCellText wrapText="never">
        {35.6}
      </TableCellRenderer>
    );
    expect(wrapper.text()).toContain('35,6'); // french locale should have commas for decimals

    const wrapper2 = mount(
      <TableCellRenderer locale="en" truncateCellText wrapText="never">
        {35.1234567}
      </TableCellRenderer>
    );
    expect(wrapper2.text()).toContain('35.1234567'); // no limit on the count of decimals
  });
});
