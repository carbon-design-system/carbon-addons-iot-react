import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../constants/Settings';
import * as dndUtils from '../../../utils/DragAndDropUtils';

import SimpleList from './SimpleList';
import { getListItemsWithActions } from './SimpleList.story';

const { EditingStyle } = dndUtils;

const { iotPrefix } = settings;

const getFatRowListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: `${idx + 1}`,
      content: {
        value: `Item ${idx + 1}`,
        secondaryValue: `This is a description or some secondary bit of data for Item ${idx + 100}`,
        rowActions: [],
      },
    }));

const getListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: `${idx + 1}`,
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

const getEmptyListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: `${idx + 1}`,
      content: {
        value: '',
      },
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
    fireEvent.keyPress(screen.getAllByRole('button')[0], {
      key: 'Enter',
      charCode: 13,
    });
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
    fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
      target: { value: '5' },
    });
    expect(screen.getByTitle('Item 5')).toBeTruthy();
    expect(screen.queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when hasSearch and item values are empty', () => {
    render(<SimpleList title="Simple list" hasSearch items={getEmptyListItems(5)} />);
    fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
      target: { value: '5' },
    });
    expect(screen.queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when hasSearch and pagination', () => {
    render(<SimpleList title="Simple list" hasSearch items={getListItems(5)} pageSize="sm" />);
    fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
      target: { value: '5' },
    });
    expect(screen.getByTitle('Item 5')).toBeTruthy();
    expect(screen.queryByTitle('Item 1')).toBeFalsy();
  });

  it('SimpleList when search large row', () => {
    render(<SimpleList title="Simple list" hasSearch items={getFatRowListItems(5)} />);
    fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
      target: { value: '5' },
    });
    expect(screen.getByTitle('Item 5')).toBeTruthy();
  });

  it('SimpleList when search term is empty should return all items', () => {
    render(<SimpleList title="Simple list" hasSearch items={getListItems(5)} />);
    fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
      target: { value: ' ' },
    });
    expect(screen.getByTitle('Item 1')).toBeTruthy();
    expect(screen.getByTitle('Item 2')).toBeTruthy();
    expect(screen.getByTitle('Item 3')).toBeTruthy();
    expect(screen.getByTitle('Item 4')).toBeTruthy();
    expect(screen.getByTitle('Item 5')).toBeTruthy();
  });

  it('SimpleList when search input is undefined should return all items', () => {
    render(<SimpleList title="Simple list" hasSearch items={getListItems(5)} />);
    fireEvent.change(screen.getByPlaceholderText('Enter a value'));
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

  it('SimpleList reorder', () => {
    let newData = null;
    const { rerender } = render(
      <SimpleList
        title="Simple list"
        items={getListItems(5)}
        editingStyle={EditingStyle.Multiple}
        onListUpdated={(newList) => {
          newData = newList;
        }}
      />
    );

    const listItems = screen.getAllByRole('listitem');
    const firstItem = within(listItems[0]).getByTitle('Item 1');

    expect(firstItem).toBeInTheDocument();
    expect(listItems.length).toEqual(5);

    fireEvent.dragStart(firstItem, {
      dataTransfer: {
        dropEffect: 'move',
      },
    });

    rerender(
      <SimpleList
        title="Simple list"
        items={getListItems(5)}
        editingStyle={EditingStyle.Multiple}
        onListUpdated={(newList) => {
          newData = newList;
        }}
      />
    );

    const targets = within(listItems[1]).getAllByTestId('list-target');
    expect(targets.length).toEqual(2);

    fireEvent.dragEnter(targets[1], {
      dataTransfer: {
        dropEffect: 'move',
      },
    });
    fireEvent.dragOver(targets[1], {
      dataTransfer: {
        dropEffect: 'move',
      },
    });
    fireEvent.drop(targets[1], {
      dataTransfer: {
        dropEffect: 'move',
      },
    });

    expect(within(screen.getAllByRole('listitem')[0]).queryByTitle('Item 2')).toBeDefined();
    expect(within(screen.getAllByRole('listitem')[1]).queryByTitle('Item 1')).toBeDefined();

    expect(newData[0].content.value).toEqual('Item 2');
    expect(newData[1].content.value).toEqual('Item 1');
  });

  it('calls handle edit mode select when editStyle is set', () => {
    jest.spyOn(dndUtils, 'handleEditModeSelect');
    render(
      <SimpleList
        title="Simple list"
        hasSearch
        items={getListItems(2)}
        pageSize="sm"
        editingStyle={EditingStyle.Multiple}
      />
    );
    userEvent.click(screen.getByTestId('1-checkbox'));
    expect(dndUtils.handleEditModeSelect).toBeCalledWith(
      [
        { content: { value: 'Item 1' }, id: '1', isSelectable: true },
        { content: { value: 'Item 2' }, id: '2', isSelectable: true },
      ],
      [],
      '1',
      null
    );
    jest.resetAllMocks();
  });

  it('should change the list when items are changed via props', () => {
    const { rerender } = render(
      <SimpleList title="Simple list" hasSearch items={getListItems(2)} />
    );
    expect(screen.getAllByTitle(/Item /)).toHaveLength(2);

    rerender(<SimpleList title="Simple list" hasSearch items={getListItems(3)} />);
    expect(screen.getAllByTitle(/Item /)).toHaveLength(3);
  });

  it('should change the list when items are changed via props and maintain search filters', () => {
    const { rerender } = render(
      <SimpleList title="Simple list" hasSearch items={getListItems(2)} />
    );
    expect(screen.getAllByTitle(/Item /)).toHaveLength(2);
    userEvent.type(screen.getByRole('searchbox'), '2');
    expect(screen.getAllByTitle(/Item /)).toHaveLength(1);

    rerender(<SimpleList title="Simple list" hasSearch items={getListItems(3)} />);
    expect(screen.getAllByTitle(/Item /)).toHaveLength(1);
  });

  it('should change the list when items are changed via props and maintain pagination', () => {
    const { rerender } = render(
      <SimpleList title="Simple list" hasSearch items={getListItems(10)} pageSize="sm" />
    );
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 5')).toBeVisible();
    expect(screen.getByText('Page 1')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Prev page' })).toHaveClass(
      `${iotPrefix}-addons-simple-pagination-button-disabled`
    );
    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 10')).toBeVisible();
    expect(screen.getByText('Page 2')).toBeVisible();

    rerender(<SimpleList title="Simple list" hasSearch items={getListItems(15)} pageSize="sm" />);
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 10')).toBeVisible();
    expect(screen.getByText('Page 2')).toBeVisible();

    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 15')).toBeVisible();
    expect(screen.getByText('Page 3')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveClass(
      `${iotPrefix}-addons-simple-pagination-button-disabled`
    );

    rerender(<SimpleList title="Simple list" hasSearch items={getListItems(5)} pageSize="sm" />);
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 5')).toBeVisible();
    expect(screen.getByText('Page 1')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Next page' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Prev page' })).toBeNull();
  });

  it('should change the list when items are changed via props and maintain both pagination and search', () => {
    const { rerender } = render(
      <SimpleList title="Simple list" hasSearch items={getListItems(15)} pageSize="sm" />
    );
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 5')).toBeVisible();
    expect(screen.getByText('Page 1')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 10')).toBeVisible();
    expect(screen.getByText('Page 2')).toBeVisible();

    userEvent.type(screen.getByRole('searchbox'), '5');

    rerender(<SimpleList title="Simple list" hasSearch items={getListItems(50)} pageSize="sm" />);
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 5')).toBeVisible();
    expect(screen.getByText('Item 15')).toBeVisible();
    expect(screen.getByText('Item 25')).toBeVisible();
    expect(screen.getByText('Item 35')).toBeVisible();
    expect(screen.getByText('Item 45')).toBeVisible();
    expect(screen.getByText('Page 1')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Item 50')).toBeVisible();
    expect(screen.getByText('Page 2')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveClass(
      `${iotPrefix}-addons-simple-pagination-button-disabled`
    );

    rerender(<SimpleList title="Simple list" hasSearch items={getListItems(5)} pageSize="sm" />);
    expect(screen.getAllByTitle(/Item /)).toHaveLength(1);
    expect(screen.getByText('Item 5')).toBeVisible();
    expect(screen.getByText('Page 1')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Next page' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Prev page' })).toBeNull();
  });

  it('should change the list when items are changed via props with icons', () => {
    const { rerender } = render(
      <SimpleList title="Simple list" hasSearch items={getListItemsWithActions(10)} pageSize="sm" />
    );
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 5')).toBeVisible();
    expect(screen.getByText('Page 1')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
    expect(screen.getByText('Item 10')).toBeVisible();
    expect(screen.getByText('Page 2')).toBeVisible();
    rerender(
      <SimpleList title="Simple list" hasSearch items={getListItemsWithActions(20)} pageSize="lg" />
    );
    expect(screen.getAllByTitle(/Item /)).toHaveLength(10);
    expect(screen.getByText('Item 10')).toBeVisible();
    expect(screen.getByText('Page 1')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getAllByTitle(/Item /)).toHaveLength(10);
    expect(screen.getByText('Item 20')).toBeVisible();
    expect(screen.getByText('Page 2')).toBeVisible();
  });

  it('should fallback to an empty string if the search event has no value', () => {
    render(<SimpleList title="Simple list" hasSearch items={getListItems(10)} pageSize="sm" />);

    fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
      target: { value: null },
    });
    expect(screen.getAllByTitle(/Item /)).toHaveLength(5);
  });

  it('should not render pagination when hasPagination:false even when pageSize given', () => {
    render(
      <SimpleList
        title="Simple list"
        hasSearch
        items={getListItems(10)}
        pageSize="sm"
        hasPagination={false}
      />
    );

    expect(screen.getAllByTitle(/Item /)).toHaveLength(10);
  });

  it('should call onselect when provided', () => {
    const onSelect = jest.fn();
    render(
      <SimpleList title="Simple list" hasSearch items={getListItems(10)} onSelect={onSelect} />
    );

    userEvent.click(screen.getByTitle('Item 1'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
