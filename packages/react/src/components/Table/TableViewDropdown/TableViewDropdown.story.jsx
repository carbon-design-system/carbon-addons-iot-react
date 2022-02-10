import React, { useState, createElement } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, select, object } from '@storybook/addon-knobs';

import TableViewDropdownREADME from './TableViewDropdown.mdx';
import TableViewDropdown from './TableViewDropdown';

export default {
  title: '1 - Watson IoT/Table/User view management/TableViewDropdown',
  parameters: {
    component: TableViewDropdown,
    docs: {
      page: TableViewDropdownREADME,
    },
  },
};

export const Playground = () => {
  const myViews = object('Views in the list (views)', [
    {
      id: 'view-1',
      text: 'My saved 1',
    },
    {
      id: 'view-2',
      text: 'My saved 2',
    },
    {
      id: 'view-3',
      text: 'My saved 3',
    },
  ]);

  const addCustomAction = boolean('Demo custom action (views[i].customAction)', true);
  const viewsAndActions = addCustomAction
    ? [
        ...myViews,
        {
          id: 'custom-action-1',
          text: 'My custom action',
          customAction: action('onCustomAction'),
        },
      ]
    : myViews;

  return (
    <TableViewDropdown
      selectedViewId={select('Selected view (selectedViewId)', ['view-1', 'view-2'], 'view-3')}
      selectedViewEdited={boolean('selectedViewEdited', true)}
      views={viewsAndActions}
      actions={{
        onSaveAsNewView: action('onSaveAsNewView'),
        onSaveChanges: action('onSaveChanges'),
        onManageViews: action('onManageViews'),
        onChangeView: action('onChangeView'),
      }}
    />
  );
};

Playground.storyName = 'Playground';
Playground.decorators = [createElement];

export const WithState = () => {
  const myViews = [
    {
      id: 'view-1',
      text: 'My saved 1',
    },
    {
      id: 'view-2',
      text: 'My saved 2',
    },
    {
      id: 'view-3',
      text: 'My saved 3 with a very long name that will get truncated',
    },
  ];

  // This is a simple example state that should be replaced by the
  // consuming Application's data store
  const [selectedViewId, setSelectedViewId] = useState('view-all');

  return (
    <div
      style={{
        width: select('wrapper width', ['300px', '100px'], '300px'),
      }}
    >
      <TableViewDropdown
        selectedViewId={selectedViewId}
        selectedViewEdited={boolean('selectedViewEdited', false)}
        views={myViews}
        actions={{
          onSaveAsNewView: action('onSaveAsNewView'),
          onSaveChanges: action('onSaveChanges'),
          onManageViews: action('onManageViews'),
          onChangeView: (viewItem) => {
            setSelectedViewId(viewItem.id);
            action('onChangeView')(viewItem);
          },
        }}
      />
    </div>
  );
};

WithState.storyName = 'With state';
WithState.decorators = [createElement];

export const WithStateEdited = () => {
  const myViews = [
    {
      id: 'view-1',
      text: 'My saved 1',
    },
    {
      id: 'view-2',
      text: 'My saved 2',
    },
    {
      id: 'view-3',
      text: 'My saved 3 with a very long name that will get truncated',
    },
  ];

  // This is a simple example state that should be replaced by the
  // consuming Application's data store
  const [selectedViewId, setSelectedViewId] = useState('view-all');

  return (
    <div
      style={{
        width: select('wrapper width', ['300px', '100px'], '300px'),
      }}
    >
      <TableViewDropdown
        selectedViewId={selectedViewId}
        selectedViewEdited={boolean('selectedViewEdited', true)}
        views={myViews}
        actions={{
          onSaveAsNewView: action('onSaveAsNewView'),
          onSaveChanges: action('onSaveChanges'),
          onManageViews: action('onManageViews'),
          onChangeView: (viewItem) => {
            setSelectedViewId(viewItem.id);
            action('onChangeView')(viewItem);
          },
        }}
      />
    </div>
  );
};

WithStateEdited.storyName = 'With state - edited';
WithStateEdited.decorators = [createElement];

export const WithStateAndCustomViewSelected = () => {
  const myViews = [
    {
      id: 'view-1',
      text: 'My saved 1',
    },
    {
      id: 'view-2',
      text: 'My saved 2',
    },
    {
      id: 'view-3',
      text: 'My saved 3 with a very long name that will get truncated',
    },
  ];

  // This is a simple example state that should be replaced by the
  // consuming Application's data store
  const [selectedViewId, setSelectedViewId] = useState('view-1');

  return (
    <div
      style={{
        width: select('wrapper width', ['300px', '100px'], '300px'),
      }}
    >
      <TableViewDropdown
        selectedViewId={selectedViewId}
        selectedViewEdited={boolean('selectedViewEdited', false)}
        views={myViews}
        actions={{
          onSaveAsNewView: action('onSaveAsNewView'),
          onSaveChanges: action('onSaveChanges'),
          onManageViews: action('onManageViews'),
          onChangeView: (viewItem) => {
            setSelectedViewId(viewItem.id);
            action('onChangeView')(viewItem);
          },
        }}
      />
    </div>
  );
};

WithStateAndCustomViewSelected.storyName = 'With state and custom view selected';
WithStateAndCustomViewSelected.decorators = [createElement];
