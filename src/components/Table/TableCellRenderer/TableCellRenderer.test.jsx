import React from 'react';
import { mount } from 'enzyme';

import { settings } from '../../../constants/Settings';

import TableCellRenderer from './TableCellRenderer';

const { iotPrefix, prefix } = settings;

const setOffsetWidth = width => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    writable: false,
    configurable: true,
    value: width,
  });
};

const setScrollWidth = width => {
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    writable: false,
    configurable: true,
    value: width,
  });
};

describe('TableCellRenderer', () => {
  const cellText = 'This text is not actually measured';

  test('truncates only for truncateCellText={true}', () => {
    const wrapper = mount(
      <TableCellRenderer wrapText="never" truncateCellText>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);

    const wrapper2 = mount(
      <TableCellRenderer wrapText="never" truncateCellText={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper2.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(0);
  });

  test('does not truncat when wrapText={always}', () => {
    const wrapper = mount(
      <TableCellRenderer wrapText="always" truncateCellText>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(0);
  });

  test('does not allow wrap when wrapText={never}', () => {
    const wrapper = mount(
      <TableCellRenderer wrapText="never" truncateCellText={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(1);
  });

  test('allows wrap when wrapText={always}', () => {
    const wrapper = mount(
      <TableCellRenderer wrapText="always" truncateCellText={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(0);
  });

  test('only truncates children that are strings, numbers or booleans', () => {
    const wrapper = mount(
      <table>
        <tbody>
          <tr>
            <td>
              <TableCellRenderer wrapText="never" truncateCellText>
                {'my string'}
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
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(3);
  });

  test('only shows tooltip if text is actually truncated', () => {
    setOffsetWidth(10);
    setScrollWidth(20);

    const wrapper = mount(
      <TableCellRenderer wrapText="never" truncateCellText>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper.find(`.${prefix}--tooltip__label`)).toHaveLength(1);
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(1);

    setOffsetWidth(20);
    setScrollWidth(10);
    const wrapper2 = mount(
      <TableCellRenderer wrapText="never" truncateCellText>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper2.find(`.${prefix}--tooltip__label`)).toHaveLength(0);
    expect(wrapper2.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);
    expect(wrapper2.find(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(1);

    setOffsetWidth(0);
    setScrollWidth(0);
  });

  test('does not show tooltip with allowTooltip={false}', () => {
    setOffsetWidth(10);
    setScrollWidth(20);

    const cellText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    const wrapper = mount(
      <TableCellRenderer wrapText="never" truncateCellText allowTooltip={false}>
        {cellText}
      </TableCellRenderer>
    );
    expect(wrapper.find(`.${prefix}--tooltip__label`)).toHaveLength(0);
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--truncate`)).toHaveLength(1);
    expect(wrapper.find(`.${iotPrefix}--table__cell-text--no-wrap`)).toHaveLength(1);

    setOffsetWidth(0);
    setScrollWidth(0);
  });

  test('locale formats numbers', () => {
    const wrapper = mount(<TableCellRenderer locale="fr">{35.6}</TableCellRenderer>);
    expect(wrapper.text()).toContain('35,6'); // french locale should have commas for decimals

    const wrapper2 = mount(<TableCellRenderer locale="en">{35.1234567}</TableCellRenderer>);
    expect(wrapper2.text()).toContain('35.1234567'); // no limit on the count of decimals
  });
});
