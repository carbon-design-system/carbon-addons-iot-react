import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, object, text } from '@storybook/addon-knobs';

import { DragAndDrop } from '../../../utils/DragAndDropUtils';
import StoryNotice, { experimentalStoryTitle } from '../../../internal/StoryNotice';

import TableColumnCustomizationModal from './TableColumnCustomizationModal';

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
  title: '1 - Watson IoT/Table/☢️ TableColumnCustomizationModal',

  parameters: {
    component: TableColumnCustomizationModal,
  },
};

export const PlaygroundWithKnobs = () => {
  const hasVisibilityToggle = boolean('hasVisibilityToggle', false);
  const demoGroupMapping = boolean('demo column groups', false);

  return (
    <TableColumnCustomizationModal
      key={`table-column-customization-modal${hasVisibilityToggle}}`} // Make sure component reloaded
      groupMapping={demoGroupMapping ? object('groupMapping', getColumnGroupMapping()) : []}
      hasVisibilityToggle={hasVisibilityToggle}
      availableColumns={object('availableColumns', getColumns())}
      initialOrdering={object('initialOrdering', getOrdering())}
      onClose={action('onClose')}
      onChange={action('onChange')}
      onReset={action('onReset')}
      onSave={action('onSave')}
      open={boolean('open', true)}
      pinnedColumnId={text('pinnedColumnId', '')}
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

PlaygroundWithKnobs.storyName = 'playground with knobs';
PlaygroundWithKnobs.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithPinnedFirstColumn = () => {
  return (
    <TableColumnCustomizationModal
      pinnedColumnId={text('pinnedColumnId', 'string')}
      availableColumns={getColumns()}
      initialOrdering={object(
        'initialOrdering',
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

WithPinnedFirstColumn.storyName = 'with pinned first column';
WithPinnedFirstColumn.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithColumnGroups = () => {
  return (
    <TableColumnCustomizationModal
      groupMapping={object('groupMapping', getColumnGroupMapping())}
      availableColumns={object('availableColumns', getColumns())}
      initialOrdering={object('initialOrdering', getOrdering())}
      onClose={action('onClose')}
      onChange={action('onChange')}
      onReset={action('onReset')}
      onSave={action('onSave')}
      open
    />
  );
};

WithColumnGroups.storyName = 'with column groups';
WithColumnGroups.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithManyColumnsAndLoadMore = () => {
  const allAvailableColumns = new Array(1000)
    .fill(0)
    .map((col, index) => ({ id: `${index + 1}`, name: `Column ${index + 1}` }));
  const [loadedColumns, setLoadedColumns] = useState(allAvailableColumns.slice(0, 100));
  const [loadingMoreIds, setLoadingMoreIds] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);

  return (
    <TableColumnCustomizationModal
      hasLoadMore={canLoadMore}
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
    />
  );
};

WithManyColumnsAndLoadMore.storyName = 'with many columns and "Load more"';
WithManyColumnsAndLoadMore.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];
