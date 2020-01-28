import React from 'react';
import { Add16, Close16, Edit16 } from '@carbon/icons-react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Button, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import { withReadme } from 'storybook-readme';

import SimpleList from './SimpleList';
import SimpleListREADME from './README.md';

const getListItems = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: idx + 1,
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

const listItemsWithEmptyRow = getListItems(5).concat({ id: 6, content: { value: '' } });

const rowActions = [
  <Edit16 onClick={action('edit')} />,
  <Add16 onClick={action('add')} />,
  <Close16 onClick={action('close')} />,
];

const rowActionsOverFlowMenu = [
  <OverflowMenu flipped>
    <OverflowMenuItem itemText="Edit" />
    <OverflowMenuItem itemText="Add" />
    <OverflowMenuItem itemText="Delete" />
    <OverflowMenuItem itemText="Danger option" hasDivider isDelete />
  </OverflowMenu>,
];

const getListItemsWithActions = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: idx + 1,
      content: {
        value: `Item ${idx + 1}`,
        rowActions,
      },
    }));

const getListItemsWithOverflowMenu = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: idx + 1,
      content: {
        value: `Item ${idx + 1}`,
        rowActions: rowActionsOverFlowMenu,
      },
    }));

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

const getFatRowListItemsWithActions = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: idx + 1,
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
      id: idx + 1,
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

storiesOf('Watson IoT Experimental|SimpleList', module)
  .add(
    'basic',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getListItems(30)}
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
      <div style={{ width: 500, height: 500, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          isFullHeight
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getListItems(3)}
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
      <div style={{ width: 500, height: 500, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getListItems(3)}
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
      <div style={{ width: 500, height: 500, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getListItems(20)}
          pageSize="xl"
        />
      </div>
    )),
    { info: { text: `` } }
  )

  .add(
    'list with pageSize',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 500, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getListItems(20)}
          pageSize="sm"
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with empty row',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 500, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={listItemsWithEmptyRow}
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with large row',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getFatRowListItems(20)}
          pageSize="sm"
          isLargeRow
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with multiple actions',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getListItemsWithActions(5)}
          pageSize="sm"
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'list with overflow menu',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getListItemsWithOverflowMenu(5)}
          pageSize="sm"
        />
      </div>
    )),
    { info: { text: `` } }
  )

  .add(
    'large row list with multiple actions',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getFatRowListItemsWithActions(5)}
          pageSize="sm"
          isLargeRow
        />
      </div>
    )),
    { info: { text: `` } }
  )
  .add(
    'large row list with overflow menu',
    withReadme(SimpleListREADME, () => (
      <div style={{ width: 500, height: 600, background: '#fee', padding: 10 }}>
        <SimpleList
          title={text('Text', 'Simple List')}
          hasSearch
          i18n={{
            searchPlaceHolderText: 'Enter a search',
          }}
          buttons={buttonsToRender}
          items={getFatRowListItemsWithOverflowMenu(5)}
          pageSize="sm"
          isLargeRow
        />
      </div>
    )),
    { info: { text: `` } }
  );
