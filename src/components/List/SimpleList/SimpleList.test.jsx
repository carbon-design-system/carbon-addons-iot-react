import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
    const { getByTitle } = render(
      <SimpleList title="Simple list" items={getListItems(5)} pageSize="sm" />
    );
    expect(getByTitle('Item 1')).toBeTruthy();
    expect(getByTitle('Item 2')).toBeTruthy();
    expect(getByTitle('Item 3')).toBeTruthy();
    expect(getByTitle('Item 4')).toBeTruthy();
    expect(getByTitle('Item 5')).toBeTruthy();
  });

  it('Simple List when pageSize is set to lg', () => {
    const { getByTitle } = render(
      <SimpleList title="Simple list" items={getListItems(5)} pageSize="lg" />
    );
    expect(getByTitle('Item 1')).toBeTruthy();
    expect(getByTitle('Item 2')).toBeTruthy();
    expect(getByTitle('Item 3')).toBeTruthy();
    expect(getByTitle('Item 4')).toBeTruthy();
    expect(getByTitle('Item 5')).toBeTruthy();
  });

  it('Simple List when pageSize is set to xl', () => {
    const { getByTitle } = render(
      <SimpleList title="Simple list" items={getListItems(5)} pageSize="xl" />
    );
    expect(getByTitle('Item 1')).toBeTruthy();
    expect(getByTitle('Item 2')).toBeTruthy();
    expect(getByTitle('Item 3')).toBeTruthy();
    expect(getByTitle('Item 4')).toBeTruthy();
    expect(getByTitle('Item 5')).toBeTruthy();
  });

  it('the first item is selectable via keyboard', () => {
    const { getAllByRole } = render(<SimpleList title="Simple list" items={getListItems(1)} />);
    fireEvent.keyPress(getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
    expect(getAllByRole('button')[0]).toBeInTheDocument();
    expect(getAllByRole('button')[0]).toBeVisible();
    expect(
      getAllByRole('button')[0].className.includes(`${iotPrefix}--list-item__selected`)
    ).toEqual(true);
  });

  // this is a failing test, opened defect at https://github.com/IBM/carbon-addons-iot-react/issues/1149
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('the first item is properly unselected via keyboard', () => {
  //   const { getAllByRole } = render(<SimpleList title="Simple list" items={getListItems(1)} />);
  //   fireEvent.keyPress(getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
  //   fireEvent.keyPress(getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
  //   expect(getAllByRole('button')[0]).toBeInTheDocument();
  //   expect(getAllByRole('button')[0]).toBeVisible();
  //   expect(
  //     getAllByRole('button')[0].className.includes(`.${iotPrefix}--list-item__selected`)
  //   ).toEqual(false);
  // });

  it('SimpleList when click on next page', () => {
    const { getAllByRole, getByTitle } = render(
      <SimpleList items={getListItems(10)} title="Simple List" pageSize="sm" />
    );

    const buttons = getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(getByTitle('Item 6')).toBeTruthy();
    expect(getByTitle('Item 7')).toBeTruthy();
    expect(getByTitle('Item 8')).toBeTruthy();
    expect(getByTitle('Item 9')).toBeTruthy();
    expect(getByTitle('Item 10')).toBeTruthy();
  });

  it('SimpleList when hasSearch', () => {
    const { getAllByLabelText, getByTitle, queryByTitle } = render(
      <SimpleList title="Simple list" hasSearch items={getListItems(5)} />
    );
    fireEvent.change(getAllByLabelText('Enter a value')[0], { target: { value: '5' } });
    expect(getByTitle('Item 5')).toBeTruthy();
    expect(queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when hasSearch and item values are empty', () => {
    const { getAllByLabelText, queryByTitle } = render(
      <SimpleList title="Simple list" hasSearch items={getEmptyListItems(5)} />
    );
    fireEvent.change(getAllByLabelText('Enter a value')[0], { target: { value: '5' } });
    expect(queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when hasSearch and pagination', () => {
    const { getAllByLabelText, getByTitle, queryByTitle } = render(
      <SimpleList title="Simple list" hasSearch items={getListItems(5)} pageSize="sm" />
    );
    fireEvent.change(getAllByLabelText('Enter a value')[0], { target: { value: '5' } });
    expect(getByTitle('Item 5')).toBeTruthy();
    expect(queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when search large row', () => {
    const { getAllByLabelText, getByTitle } = render(
      <SimpleList title="Simple list" hasSearch items={getFatRowListItems(5)} />
    );
    fireEvent.change(getAllByLabelText('Enter a value')[0], { target: { value: '5' } });
    expect(getByTitle('Item 5')).toBeTruthy();
  });

  it('SimpleList when search term is empty should return all items', () => {
    const { getAllByLabelText, getByTitle } = render(
      <SimpleList title="Simple list" hasSearch items={getListItems(5)} />
    );
    fireEvent.change(getAllByLabelText('Enter a value')[0], { target: { value: ' ' } });
    expect(getByTitle('Item 1')).toBeTruthy();
    expect(getByTitle('Item 2')).toBeTruthy();
    expect(getByTitle('Item 3')).toBeTruthy();
    expect(getByTitle('Item 4')).toBeTruthy();
    expect(getByTitle('Item 5')).toBeTruthy();
  });

  it('SimpleList when search input is undefined should return all items', () => {
    const { getAllByLabelText, getByTitle } = render(
      <SimpleList title="Simple list" hasSearch items={getListItems(5)} />
    );
    fireEvent.change(getAllByLabelText('Enter a value')[0]);
    expect(getByTitle('Item 1')).toBeTruthy();
    expect(getByTitle('Item 2')).toBeTruthy();
    expect(getByTitle('Item 3')).toBeTruthy();
    expect(getByTitle('Item 4')).toBeTruthy();
    expect(getByTitle('Item 5')).toBeTruthy();
  });
});
