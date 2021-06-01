import React, { useState } from 'react';
import { Add16, Close16, Edit16 } from '@carbon/icons-react';
import { boolean, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { spacing03 } from '@carbon/layout';
import { Button, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import { withReadme } from 'storybook-readme';

import { EditingStyle } from '../../../utils/DragAndDropUtils';

import SimpleList from './SimpleList';
import SimpleListREADME from './README.md';

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
  <Edit16 key="simple-list-header-edit" />,
  <Button
    key="simple-list-header-close"
    renderIcon={Close16}
    hasIconOnly
    kind="secondary"
    size="small"
    onClick={() => {}}
    iconDescription="Close"
  />,
  <Button
    key="simple-list-header-add"
    renderIcon={Add16}
    hasIconOnly
    size="small"
    iconDescription="Add"
  />,
];

export default {
  title: '1 - Watson IoT/SimpleList',

  parameters: {
    component: SimpleList,
  },

  excludeStories: ['getListItems'],
};

export const Basic = withReadme(SimpleListREADME, () => (
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
));

Basic.story = {
  name: 'basic',
};

export const TallListIsFullHeightTrue = withReadme(SimpleListREADME, () => (
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
));

TallListIsFullHeightTrue.story = {
  name: 'tall list (isFullHeight = true)',
};

export const TallListIsFullHeightFalse = withReadme(SimpleListREADME, () => (
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
));

TallListIsFullHeightFalse.story = {
  name: 'tall list (isFullHeight = false)',
};

export const ListWithOverflowGrow = withReadme(SimpleListREADME, () => (
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
));

ListWithOverflowGrow.story = {
  name: 'list with overflow grow',
};

export const ListWithPageSize = withReadme(SimpleListREADME, () => (
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
));

ListWithPageSize.story = {
  name: 'list with pageSize',
};

export const ListWithEmptyRow = withReadme(SimpleListREADME, () => (
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
));

ListWithEmptyRow.story = {
  name: 'list with empty row',
};

export const ListWithLargeRow = withReadme(SimpleListREADME, () => (
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
));

ListWithLargeRow.story = {
  name: 'list with large row',
};

export const ListWithMultipleActions = withReadme(SimpleListREADME, () => (
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
));

ListWithMultipleActions.story = {
  name: 'list with multiple actions',
};

export const ListWithOverflowMenu = withReadme(SimpleListREADME, () => (
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
));

ListWithOverflowMenu.story = {
  name: 'list with overflow menu',
};

export const LargeRowListWithMultipleActions = withReadme(SimpleListREADME, () => (
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
));

LargeRowListWithMultipleActions.story = {
  name: 'large row list with multiple actions',
};

export const LargeRowListWithOverflowMenu = withReadme(SimpleListREADME, () => (
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
));

LargeRowListWithOverflowMenu.story = {
  name: 'large row list with overflow menu',
};

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

ListWithReorder.story = {
  name: 'list with reorder',
};

export const HiddenPagination = withReadme(SimpleListREADME, () => (
  <div style={{ width: 500 }}>
    <SimpleList
      title={text('Text', 'Simple List')}
      hasSearch
      i18n={{
        searchPlaceHolderText: 'Enter a search',
      }}
      buttons={buttonsToRender}
      items={getListItems(5)}
      isLoading={boolean('isLoading', false)}
      hasPagination={false}
    />
  </div>
));

HiddenPagination.story = {
  name: 'hidden pagination',

  parameters: {
    info: {
      text: `Optionally hide the pagination by passing 'hasPagination: false'`,
    },
  },
};
