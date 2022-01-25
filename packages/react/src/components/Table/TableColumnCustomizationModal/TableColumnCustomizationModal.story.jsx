import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, object, select, text } from '@storybook/addon-knobs';

import { DragAndDrop } from '../../../utils/DragAndDropUtils';
import StoryNotice, { experimentalStoryTitle } from '../../../internal/StoryNotice';

import TableColumnCustomizationModal from './TableColumnCustomizationModal';
import AsyncTableColumnCustomizationModal from './AsyncTableColumnCustomizationModal';
import TableColumnCustomizationModalREADME from './TableColumnCustomizationModal.mdx';

const getColumns = () => [
  {
    id: 'string',
    name: 'String',
  },
  {
    id: 'date',
    name: 'Date',
  },
  {
    id: 'select',
    name: 'Select',
  },
  {
    id: 'secretField',
    name: 'Secret Information',
  },
  {
    id: 'status',
    name: 'Status',
  },
  {
    id: 'number',
    name: 'Number',
  },
  {
    id: 'boolean',
    name: 'Boolean',
  },
  {
    id: 'node',
    name: 'React Node',
  },
  {
    id: 'object',
    name: 'Object Id',
    renderDataFunction: ({ value }) => {
      return value?.id;
    },
  },
];

const getOrdering = () => [
  { columnId: 'string' },
  { columnId: 'date' },
  { columnId: 'select' },
  { columnId: 'secretField', isHidden: true },
  { columnId: 'status' },
  { columnId: 'number' },
];

const getColumnGroupMapping = () => [
  { id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] },
  { id: 'groupB', name: 'Group B', columnIds: ['secretField', 'status', 'number', 'boolean'] },
];

export const Experimental = () => (
  <StoryNotice componentName="TableColumnCustomizationModal" experimental />
);
Experimental.storyName = experimentalStoryTitle;

export default {
  title: '1 - Watson IoT/Table/Column customization/☢️ TableColumnCustomizationModal',

  parameters: {
    component: TableColumnCustomizationModal,
    docs: {
      page: TableColumnCustomizationModalREADME,
    },
  },
};

export const Playground = () => {
  const hasVisibilityToggle = boolean(
    'Enable toggling column visibility (hasVisibilityToggle)',
    false
  );
  const demoGroupMapping = boolean('Demo column groups', false);
  const demoPinnedColumn = boolean('Demo pinned column (pinnedColumnId)', true);
  const primaryValue = select(
    'Column key used for primary value (primaryValue)',
    ['id', 'name'],
    'name'
  );
  const secondaryValue = select(
    'Column key used for secondary value (secondaryValue)',
    ['id', 'name', 'NONE'],
    'NONE'
  );

  return (
    <TableColumnCustomizationModal
      key={`table-column-customization-modal${hasVisibilityToggle}}`} // Make sure component reloaded
      groupMapping={
        demoGroupMapping
          ? object('The mapping of colums to groups (groupMapping)', getColumnGroupMapping())
          : []
      }
      hasVisibilityToggle={hasVisibilityToggle}
      availableColumns={object('All the available columns (availableColumns)', getColumns())}
      initialOrdering={object('Initial ordering (initialOrdering)', getOrdering())}
      onClose={action('onClose')}
      onChange={action('onChange')}
      onReset={action('onReset')}
      onSave={action('onSave')}
      open={boolean('Modal is open (open)', true)}
      primaryValue={primaryValue}
      secondaryValue={secondaryValue === 'NONE' ? undefined : secondaryValue}
      pinnedColumnId={demoPinnedColumn ? 'string' : undefined}
      i18n={{
        availableColumnsLabel: text('i18.availableColumnsLabel', 'Available columns'),
        cancelButtonLabel: text('i18.cancelButtonLabel', 'Cancel'),
        closeIconDescription: text('i18.closeIconDescription', 'Close'),
        collapseIconDescription: text('i18.collapseIconDescription', 'Collapse'),
        expandIconDescription: text('i18.expandIconDescription', 'Expand'),
        hideIconDescription: text('i18.hideIconDescription', 'Column is visible, click to hide.'),
        modalTitle: text('i18.modalTitle', 'Customize columns'),
        modalBody: text(
          'i18n.modalBody',
          'Select the available columns to be displayed on the table. Drag the selected columns to reorder them.'
        ),
        removeIconDescription: text('i18.removeIconDescription', 'Remove from list'),
        resetButtonLabel: text('i18.resetButtonLabel', 'Reset'),
        saveButtonLabel: text('i18.saveButtonLabel', 'Save'),
        selectedColumnsLabel: text('i18.selectedColumnsLabel', 'Selected columns'),
        showIconDescription: text('i18.showIconDescription', 'Column is hidden, click to show.'),
      }}
    />
  );
};

Playground.storyName = 'Playground';
Playground.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithPinnedFirstColumn = () => {
  return (
    <TableColumnCustomizationModal
      pinnedColumnId={text('Pinned column id (pinnedColumnId)', 'string')}
      availableColumns={getColumns()}
      initialOrdering={object(
        'Initial ordering (initialOrdering)',
        getOrdering().filter((col) => col.columnId === 'string')
      )}
      onClose={action('onClose')}
      onChange={action('onChange')}
      onReset={action('onReset')}
      onSave={action('onSave')}
      open
    />
  );
};

WithPinnedFirstColumn.storyName = 'With pinned first column';
WithPinnedFirstColumn.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithManyColumnsAndLoadMore = () => {
  const primaryValue = select(
    'Column key used for primary value (primaryValue)',
    ['id', 'name'],
    'name'
  );
  const secondaryValue = select(
    'Column key used for secondary value (secondaryValue)',
    ['id', 'name', 'NONE'],
    'NONE'
  );
  const hasVisibilityToggle = boolean(
    'Enable toggling column visibility (hasVisibilityToggle)',
    false
  );
  const demoGroupMapping = boolean('Demo column groups', false);
  const groupMapping = [
    {
      id: 'groupA',
      name: 'Group A',
      columnIds: new Array(10).fill(0).map((col, index) => `id-${index + 1}`),
    },
    {
      id: 'groupB',
      name: 'Group B',
      columnIds: new Array(10).fill(0).map((col, index) => `id-${index + 11}`),
    },
  ];

  const allAvailableColumns = new Array(5000)
    .fill(0)
    .map((col, index) => ({ id: `id-${index + 1}`, name: `Column ${index + 1}` }));
  const [loadedColumns, setLoadedColumns] = useState(allAvailableColumns.slice(0, 100));
  const [loadingMoreIds, setLoadingMoreIds] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);

  return (
    <TableColumnCustomizationModal
      groupMapping={demoGroupMapping ? groupMapping : []}
      hasLoadMore={canLoadMore}
      hasVisibilityToggle={hasVisibilityToggle}
      availableColumns={loadedColumns}
      initialOrdering={[]}
      loadingMoreIds={loadingMoreIds}
      onChange={action('onChange')}
      onClose={action('onClose')}
      onLoadMore={(id) => {
        setLoadingMoreIds([id]);
        setTimeout(() => {
          setLoadedColumns(allAvailableColumns);
          setLoadingMoreIds([]);
          setCanLoadMore(false);
        }, 2000);
        action('onLoadMore')(id);
      }}
      onReset={action('onReset')}
      onSave={action('onSave')}
      open
      primaryValue={primaryValue}
      secondaryValue={secondaryValue === 'NONE' ? undefined : secondaryValue}
    />
  );
};

WithManyColumnsAndLoadMore.storyName = 'With many columns and "Load more"';
WithManyColumnsAndLoadMore.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithColumnGroups = () => {
  return (
    <TableColumnCustomizationModal
      groupMapping={object(
        'The mapping of colums to groups (groupMapping)',
        getColumnGroupMapping()
      )}
      availableColumns={object('All the available columns (availableColumns)', getColumns())}
      initialOrdering={object('Initial ordering (initialOrdering)', getOrdering())}
      onClose={action('onClose')}
      onChange={action('onChange')}
      onReset={action('onReset')}
      onSave={action('onSave')}
      open
    />
  );
};

WithColumnGroups.storyName = 'With column groups';
WithColumnGroups.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithAsyncDataAndLoadingState = () => {
  const hasVisibilityToggle = boolean(
    'Enable toggling column visibility (hasVisibilityToggle)',
    false
  );
  const demoGroupMapping = boolean('Demo column groups', false);
  const demoPinnedColumn = boolean('Demo pinned column (pinnedColumnId)', true);
  const demoHasLoadMore = boolean('Demo load more example (hasLoadMore)', true);
  const demoLoadError = boolean('Demo load error', false);
  const errorText = text('Text in error', 'There was a problem loading the columns.');
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [storyColumns, setStoryColumns] = useState(
    new Promise((resolve, reject) => {
      setTimeout(
        () => (demoLoadError ? reject(new Error(errorText)) : resolve(getColumns().slice(0, 7))),
        3000
      );
    })
  );

  return (
    <AsyncTableColumnCustomizationModal
      groupMapping={demoGroupMapping ? object('groupMapping', getColumnGroupMapping()) : []}
      hasVisibilityToggle={hasVisibilityToggle}
      availableColumns={storyColumns}
      initialOrdering={getOrdering()}
      i18n={{
        modalBody:
          'This modal is the AsyncTableColumnCustomizationModal which accepts a Promise for the prop availableColumns. It also and manages the loading state and errors.',
      }}
      onClearError={action('onClearError')}
      onClose={action('onClose')}
      onChange={action('onChange')}
      onReset={action('onReset')}
      onSave={action('onSave')}
      open={boolean('Modal is open (open)', true)}
      pinnedColumnId={demoPinnedColumn ? 'string' : undefined}
      hasLoadMore={demoHasLoadMore && canLoadMore}
      onLoadMore={() => {
        setStoryColumns(
          new Promise((resolve) => {
            setTimeout(() => {
              console.info('reloaded');
              setCanLoadMore(false);
              resolve(getColumns());
            }, 2000);
          })
        );
      }}
    />
  );
};

WithAsyncDataAndLoadingState.storyName = 'With async data and loading state';
WithAsyncDataAndLoadingState.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];
