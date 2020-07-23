import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { settings } from '../../../constants/Settings';

import SimpleList from './SimpleList';

const { iotPrefix } = settings;

const getFatRowListItems = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: idx + 1,
      content: {
        value: `Item ${idx + 1}`,
        secondaryValue: `This is a description or some secondary bit of data for Item ${idx + 100}`,
        rowActions: [],
      },
    }));

const getListItems = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: idx + 1,
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

const getEmptyListItems = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: idx + 1,
      content: {},
      isSelectable: true,
    }));

describe('SimpleList', () => {
  it('Simple List when pageSize is set to sm', () => {
    render(<SimpleList title="Simple list" items={getListItems(5)} pageSize="sm" />);
    expect(screen.getByTitle('Item 1')).toBeTruthy();
    expect(screen.getByTitle('Item 2')).toBeTruthy();
    expect(screen.getByTitle('Item 3')).toBeTruthy();
    expect(screen.getByTitle('Item 4')).toBeTruthy();
    expect(screen.getByTitle('Item 5')).toBeTruthy();
  });

  it('Simple List when pageSize is set to lg', () => {
    render(<SimpleList title="Simple list" items={getListItems(5)} pageSize="lg" />);
    expect(screen.getByTitle('Item 1')).toBeTruthy();
    expect(screen.getByTitle('Item 2')).toBeTruthy();
    expect(screen.getByTitle('Item 3')).toBeTruthy();
    expect(screen.getByTitle('Item 4')).toBeTruthy();
    expect(screen.getByTitle('Item 5')).toBeTruthy();
  });

  it('Simple List when pageSize is set to xl', () => {
    render(<SimpleList title="Simple list" items={getListItems(5)} pageSize="xl" />);
    expect(screen.getByTitle('Item 1')).toBeTruthy();
    expect(screen.getByTitle('Item 2')).toBeTruthy();
    expect(screen.getByTitle('Item 3')).toBeTruthy();
    expect(screen.getByTitle('Item 4')).toBeTruthy();
    expect(screen.getByTitle('Item 5')).toBeTruthy();
  });

  it('the first item is selectable via keyboard', () => {
    render(<SimpleList title="Simple list" items={getListItems(1)} />);
    fireEvent.keyPress(screen.getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button')[0]).toBeVisible();
    expect(
      screen.getAllByRole('button')[0].className.includes(`${iotPrefix}--list-item__selected`)
    ).toEqual(true);
  });

  // this is a failing test, opened defect at https://github.com/IBM/carbon-addons-iot-react/issues/1149
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('the first item is properly unselected via keyboard', () => {
  //   const { getAllByRole } = render(<SimpleList title="Simple list" items={getListItems(1)} />);
  //   fireEvent.keyPress(screen.getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
  //   fireEvent.keyPress(screen.getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
  //   expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
  //   expect(screen.getAllByRole('button')[0]).toBeVisible();
  //   expect(
  //     getAllByRole('button')[0].className.includes(`.${iotPrefix}--list-item__selected`)
  //   ).toEqual(false);
  // });

  it('SimpleList when click on next page', () => {
    render(<SimpleList items={getListItems(10)} title="Simple List" pageSize="sm" />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(screen.getByTitle('Item 6')).toBeTruthy();
    expect(screen.getByTitle('Item 7')).toBeTruthy();
    expect(screen.getByTitle('Item 8')).toBeTruthy();
    expect(screen.getByTitle('Item 9')).toBeTruthy();
    expect(screen.getByTitle('Item 10')).toBeTruthy();
  });

  it('SimpleList when hasSearch', () => {
    render(<SimpleList title="Simple list" hasSearch items={getListItems(5)} />);
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0], { target: { value: '5' } });
    expect(screen.getByTitle('Item 5')).toBeTruthy();
    expect(screen.queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when hasSearch and item values are empty', () => {
    render(<SimpleList title="Simple list" hasSearch items={getEmptyListItems(5)} />);
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0], { target: { value: '5' } });
    expect(screen.queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when hasSearch and pagination', () => {
    render(<SimpleList title="Simple list" hasSearch items={getListItems(5)} pageSize="sm" />);
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0], { target: { value: '5' } });
    expect(screen.getByTitle('Item 5')).toBeTruthy();
    expect(screen.queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when search large row', () => {
    render(<SimpleList title="Simple list" hasSearch items={getFatRowListItems(5)} />);
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0], { target: { value: '5' } });
    expect(screen.getByTitle('Item 5')).toBeTruthy();
  });

  it('SimpleList when search term is empty should return all items', () => {
    render(<SimpleList title="Simple list" hasSearch items={getListItems(5)} />);
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0], { target: { value: ' ' } });
    expect(screen.getByTitle('Item 1')).toBeTruthy();
    expect(screen.getByTitle('Item 2')).toBeTruthy();
    expect(screen.getByTitle('Item 3')).toBeTruthy();
    expect(screen.getByTitle('Item 4')).toBeTruthy();
    expect(screen.getByTitle('Item 5')).toBeTruthy();
  });

  it('SimpleList when search input is undefined should return all items', () => {
    render(<SimpleList title="Simple list" hasSearch items={getListItems(5)} />);
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0]);
    expect(screen.getByTitle('Item 1')).toBeTruthy();
    expect(screen.getByTitle('Item 2')).toBeTruthy();
    expect(screen.getByTitle('Item 3')).toBeTruthy();
    expect(screen.getByTitle('Item 4')).toBeTruthy();
    expect(screen.getByTitle('Item 5')).toBeTruthy();
  });

  it('SimpleList items should be unselectable', () => {
    render(<SimpleList title="Simple list" items={getListItems(1)} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button')[0]).toBeVisible();
    expect(
      screen.getAllByRole('button')[0].className.includes(`${iotPrefix}--list-item__selected`)
    ).toEqual(true);

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(
      screen.getAllByRole('button')[0].className.includes(`${iotPrefix}--list-item__selected`)
    ).toEqual(false);
  });
});
