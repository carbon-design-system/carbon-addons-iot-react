import React, { useState } from 'react';
import { Add16, Close16, Edit16 } from '@carbon/icons-react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { Button } from 'carbon-components-react';
import { withReadme } from 'storybook-readme';

import SimpleList from './SimpleList';

import SimpleListREADME from './README.md';

const getListItems = num =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: idx + 1,
      content: { value: `Item ${idx + 1}` },
    }));

const rowActions = [<Edit16 />, <Add16 />, <Close16 />];
const getFatRowListItems = num =>
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

const buttonsToRender = [
  <Edit16 />,
  <Button renderIcon={Close16} hasIconOnly kind="secondary" size="small" onClick={() => {}} />,
  <Button renderIcon={Add16} hasIconOnly size="small" />,
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
    'list with fat row',
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
        />
      </div>
    )),
    { info: { text: `` } }
  );
