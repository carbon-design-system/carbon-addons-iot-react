import React, { useState } from 'react';
import { Add16, Close16, Edit16 } from '@carbon/icons-react';
import { storiesOf } from '@storybook/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { spacing03 } from '@carbon/layout';
import { Button, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import { withReadme } from 'storybook-readme';

import { EditingStyle } from '../../../utils/DragAndDropUtils';

import SimpleList from './SimpleList';
import SimpleListREADME from './README.md';

export const getListItems = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

const listItemsWithEmptyRow = getListItems(5).concat({ id: '6', content: { value: '' } });

const rowActions = [
  <Edit16 onClick={action('edit')} key="simple-list-action-edit" />,
  <Add16 onClick={action('add')} key="simple-list-action-add" />,
  <Close16 onClick={action('close')} key="simple-list-action-close" />,
];

const rowActionsOverFlowMenu = [
  <OverflowMenu flipped key="simple-list-overflow-menu">
    <OverflowMenuItem itemText="Edit" primaryFocus />
    <OverflowMenuItem itemText="Add" />
    <OverflowMenuItem itemText="Delete" />
    <OverflowMenuItem itemText="Danger option" hasDivider isDelete />
  </OverflowMenu>,
];

const getListItemsWithActions = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: {
        value: `Item ${idx + 1}`,
        rowActions,
      },
    }));

const getListItemsWithOverflowMenu = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: {
        value: `Item ${idx + 1}`,
        rowActions: rowActionsOverFlowMenu,
      },
    }));

const getFatRowListItems = num =>
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

const getFatRowListItemsWithActions = num =>
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

const getFatRowListItemsWithOverflowMenu = num =>
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
  <Edit16 />,
  <Button
    renderIcon={Close16}
    hasIconOnly
    kind="secondary"
    size="small"
    onClick={() => {}}
    iconDescription="Close"
  />,
  <Button renderIcon={Add16} hasIconOnly size="small" iconDescription="Add" />,
];

storiesOf('Watson IoT Experimental/SimpleList', module)
  .add(
    'basic - SimpleList',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getListItems(30)}
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    {
      info: {
        text: ``,
      },
    }
  )
  .add(
    'tall list (isFullHeight = true)',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 500, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          isFullHeight
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getListItems(3)}
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    {
      info: { text: `` },
    }
  )
  .add(
    'tall list (isFullHeight = false)',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 500, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getListItems(3)}
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    {
      info: {
        text: `SimpleList is used when `,
      },
    }
  )
  .add(
    'list with overflow grow',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 500, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getListItems(20)}
          pageSize="xl"
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with pageSize',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 500, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getListItems(20)}
          pageSize="sm"
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with empty row',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 500, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={listItemsWithEmptyRow}
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with large row',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getFatRowListItems(20)}
          pageSize="sm"
          isLargeRow
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with multiple actions',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getListItemsWithActions(5)}
          pageSize="sm"
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with overflow menu',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getListItemsWithOverflowMenu(5)}
          pageSize="sm"
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    { info: { text: `` } }
  )

  .add(
    'large row list with multiple actions',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getFatRowListItemsWithActions(5)}
          pageSize="sm"
          isLargeRow
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'large row list with overflow menu',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: spacing03 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
            pageOfPagesText: pageNumber => `Page ${pageNumber}`,
          }}
          buttons={buttonsToRender}
          items={getFatRowListItemsWithOverflowMenu(5)}
          pageSize="sm"
          isLargeRow
          isLoading={boolean('isLoading', false)}
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add('basic - SimpleList with reorder', () => {
    const SimpleListWithReorder = () => {
      const [items, setItems] = useState(getListItems(5));

      return (
        <div style={{ width: 500 }}>
          <SimpleList
            title={text('Text', 'Simple List')}
            hasSearch
            i18n={{
              searchPlaceHolderText: 'Enter a search',
              pageOfPagesText: pageNumber => `Page ${pageNumber}`,
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
            onListUpdated={updatedItems => {
              setItems(updatedItems);
            }}
          />
        </div>
      );
    };

    return <SimpleListWithReorder />;
  });
