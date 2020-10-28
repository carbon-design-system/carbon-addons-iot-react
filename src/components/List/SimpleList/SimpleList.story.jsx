import React, { useState } from 'react';
import { Add16, Close16, Edit16 } from '@carbon/icons-react';
import { boolean, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { spacing03 } from '@carbon/layout';
import { Button, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

import { EditingStyle } from '../../../utils/DragAndDropUtils';

import SimpleList from './SimpleList';

export const getListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

const listItemsWithEmptyRow = getListItems(5).concat({
  id: '6',
  content: { value: '' },
});

const rowActions = [
  <Edit16 onClick={action('edit')} key="simple-list-action-edit" />,
  <Add16 onClick={action('add')} key="simple-list-action-add" />,
  <Close16 onClick={action('close')} key="simple-list-action-close" />,
];

const rowActionsOverFlowMenu = [
  <OverflowMenu flipped key="simple-list-overflow-menu">
    <OverflowMenuItem itemText="Edit" />
    <OverflowMenuItem itemText="Add" />
    <OverflowMenuItem itemText="Delete" />
    <OverflowMenuItem itemText="Danger option" hasDivider isDelete />
  </OverflowMenu>,
];

const getListItemsWithActions = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: {
        value: `Item ${idx + 1}`,
        rowActions,
      },
    }));

const getListItemsWithOverflowMenu = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: {
        value: `Item ${idx + 1}`,
        rowActions: rowActionsOverFlowMenu,
      },
    }));

const getFatRowListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: {
        value: `Item ${idx + 1}`,
        secondaryValue: `This is a description or some secondary bit of data for Item ${idx + 100}`,
        rowActions: [],
      },
    }));

const getFatRowListItemsWithActions = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: {
        value: `Item ${idx + 1}`,
        secondaryValue: `This is a description or some secondary bit of data for Item ${idx + 100}`,
        rowActions,
      },
    }));

const getFatRowListItemsWithOverflowMenu = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: {
        value: `Item ${idx + 1}`,
        secondaryValue: `This is a description or some secondary bit of data for Item ${idx + 100}`,
        rowActions: rowActionsOverFlowMenu,
      },
    }));

const buttonsToRender = [
  <Edit16 key="basic-simplelist-edit" />,
  <Button
    key="basic-simplelist-close"
    renderIcon={Close16}
    hasIconOnly
    kind="secondary"
    size="small"
    onClick={() => {}}
    iconDescription="Close"
  />,
  <Button
    key="basic-simplelist-add"
    renderIcon={Add16}
    hasIconOnly
    size="small"
    iconDescription="Add"
  />,
];

export default {
  title: 'Watson IoT Experimental/SimpleList',
  excludeStories: ['getListItems'],
};

export const BasicSimpleList = () => (
  <div style={{ width: 500 }}>
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getListItems(30)}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

BasicSimpleList.storyName = 'basic - SimpleList';

export const TallListIsFullHeightTrue = () => (
  <div
    style={{
      width: 500,
      height: 500,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      isFullHeight
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getListItems(3)}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

TallListIsFullHeightTrue.storyName = 'tall list (isFullHeight = true)';

export const TallListIsFullHeightFalse = () => (
  <div
    style={{
      width: 500,
      height: 500,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getListItems(3)}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

TallListIsFullHeightFalse.storyName = 'tall list (isFullHeight = false)';

export const ListWithOverflowGrow = () => (
  <div
    style={{
      width: 500,
      height: 500,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getListItems(20)}
      pageSize="xl"
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

ListWithOverflowGrow.storyName = 'list with overflow grow';

export const ListWithPageSize = () => (
  <div
    style={{
      width: 500,
      height: 500,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getListItems(20)}
      pageSize="sm"
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

ListWithPageSize.storyName = 'list with pageSize';

export const ListWithEmptyRow = () => (
  <div
    style={{
      width: 500,
      height: 500,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={listItemsWithEmptyRow}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

ListWithEmptyRow.storyName = 'list with empty row';

export const ListWithLargeRow = () => (
  <div
    style={{
      width: 500,
      height: 600,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getFatRowListItems(20)}
      pageSize="sm"
      isLargeRow
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

ListWithLargeRow.storyName = 'list with large row';

export const ListWithMultipleActions = () => (
  <div
    style={{
      width: 500,
      height: 600,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getListItemsWithActions(5)}
      pageSize="sm"
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

ListWithMultipleActions.storyName = 'list with multiple actions';

export const ListWithOverflowMenu = () => (
  <div
    style={{
      width: 500,
      height: 600,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getListItemsWithOverflowMenu(5)}
      pageSize="sm"
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

ListWithOverflowMenu.storyName = 'list with overflow menu';

export const LargeRowListWithMultipleActions = () => (
  <div
    style={{
      width: 500,
      height: 600,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getFatRowListItemsWithActions(5)}
      pageSize="sm"
      isLargeRow
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

LargeRowListWithMultipleActions.storyName = 'large row list with multiple actions';

export const LargeRowListWithOverflowMenu = () => (
  <div
    style={{
      width: 500,
      height: 600,
      background: '#fee',
      padding: spacing03,
    }}
  >
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
        pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
      }}
      buttons={buttonsToRender}
      items={getFatRowListItemsWithOverflowMenu(5)}
      pageSize="sm"
      isLargeRow
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

LargeRowListWithOverflowMenu.storyName = 'large row list with overflow menu';

export const ListWithReorder = () => {
  const SimpleListWithReorder = () => {
    const [items, setItems] = useState(getListItems(15));

    return (
      <div style={{ width: 500 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
            items: '%d items',
          }}
          buttons={buttonsToRender}
          items={items}
          isLoading={boolean('isLoading', false)}
          editingStyle={select(
            'Editing Style',
            [EditingStyle.Single, EditingStyle.Multiple],
            EditingStyle.Single
          )}
          onListUpdated={(updatedItems) => {
            setItems(updatedItems);
          }}
        />
      </div>
    );
  };

  return <SimpleListWithReorder />;
};

ListWithReorder.storyName = 'list with reorder';
