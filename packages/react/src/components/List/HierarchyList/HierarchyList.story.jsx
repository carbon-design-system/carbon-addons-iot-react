import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, boolean, object } from '@storybook/addon-knobs';
import { Add16 } from '@carbon/icons-react';
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

import { Button, InlineLoading, DragAndDrop } from '../../..';
import { EditingStyle } from '../../../utils/DragAndDropUtils';
import { sampleHierarchy } from '../List.story';

import HierarchyList from './HierarchyList';

const addButton = (
  <Button
    renderIcon={Add16}
    hasIconOnly
    size="small"
    iconDescription="Add"
    key="hierarchy-list-button-add"
    onClick={() => action('header button onClick')}
  />
);

export default {
  title: '1 - Watson IoT/HierarchyList',

  parameters: {
    component: HierarchyList,
  },
};

export const StatefulListWithNestedSearching = () => (
  <div style={{ width: 400, height: 400 }}>
    <HierarchyList
      title={text('Title', 'MLB Expanded List')}
      buttons={[addButton]}
      isFullHeight={boolean('isFullHeight', true)}
      items={[
        ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
              secondaryValue: sampleHierarchy.MLB['American League'][team][player],
            },
            isSelectable: true,
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
              secondaryValue: sampleHierarchy.MLB['National League'][team][player],
            },
            isSelectable: true,
          })),
        })),
      ]}
      hasSearch={boolean('hasSearch', true)}
      pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], 'sm')}
      isLoading={boolean('isLoading', false)}
      isLargeRow={boolean('isLargeRow', false)}
      onSelect={action('onSelect')}
      hasDeselection={boolean('hasDeselection', true)}
      i18n={object('i18n', {
        searchPlaceHolderText: 'Search',
      })}
      hasMultiSelect={boolean('hasMultiSelect', false)}
      isVirtualList={boolean('hasVirtualList', false)}
    />
  </div>
);

StatefulListWithNestedSearching.storyName = 'Stateful list with nested searching';

export const WithDefaultSelectedId = () => (
  <div style={{ width: 400, height: 400 }}>
    <HierarchyList
      title={text('Title', 'MLB Expanded List')}
      defaultSelectedId={text('Default Selected Id', 'New York Mets_Pete Alonso')}
      items={[
        ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
            },
            isSelectable: true,
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
            },
            isSelectable: true,
          })),
        })),
      ]}
      hasSearch={boolean('hasSearch', true)}
      pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], 'lg')}
      isLoading={boolean('isLoading', false)}
      isLargeRow={boolean('isLargeRow', false)}
      onSelect={action('onSelect')}
      hasDeselection={boolean('hasDeselection', true)}
      hasMultiSelect={boolean('hasMultiSelect', false)}
      isVirtualList={boolean('hasVirtualList', false)}
    />
  </div>
);

WithDefaultSelectedId.storyName = 'With defaultSelectedId';

export const WithOverflowMenu = () => (
  <div style={{ width: 400, height: 400 }}>
    <HierarchyList
      title={text('Title', 'MLB Expanded List')}
      items={[
        ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
              rowActions: () => (
                <OverflowMenu title="data-item-menu" flipped>
                  <OverflowMenuItem itemText="Configure" onClick={() => console.log('Configure')} />
                  <OverflowMenuItem
                    itemText="Delete"
                    onClick={() => console.log('Delete')}
                    isDelete
                    hasDivider
                  />
                </OverflowMenu>
              ),
            },
            isSelectable: true,
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
              rowActions: [
                <OverflowMenu title="data-item-menu" flipped>
                  <OverflowMenuItem itemText="Configure" onClick={() => console.log('Configure')} />
                  <OverflowMenuItem
                    itemText="Delete"
                    onClick={() => console.log('Delete')}
                    isDelete
                    hasDivider
                  />
                </OverflowMenu>,
              ],
            },
            isSelectable: true,
          })),
        })),
      ]}
      hasSearch={boolean('hasSearch', true)}
      pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], 'lg')}
      isLoading={boolean('isLoading', false)}
      isLargeRow={boolean('isLargeRow', false)}
      onSelect={action('onSelect')}
      hasDeselection={boolean('hasDeselection', true)}
      hasMultiSelect={boolean('hasMultiSelect', false)}
      isVirtualList={boolean('hasVirtualList', false)}
    />
  </div>
);

WithOverflowMenu.storyName = 'With OverflowMenu';

export const WithNestedReorder = () => {
  const HierarchyListWithReorder = () => {
    const [items, setItems] = useState([
      ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
        id: team,
        isCategory: true,
        content: {
          value: team,
        },
        children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
          id: `${team}_${player}`,
          content: {
            value: player,
          },
          isSelectable: true,
        })),
      })),
      ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
        id: team,
        isCategory: true,
        content: {
          value: team,
        },
        children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
          id: `${team}_${player}`,
          content: {
            value: player,
          },
          isSelectable: true,
        })),
      })),
    ]);

    const allowsEdit = boolean('Allow Item Movement', true);

    return (
      <div style={{ width: 400, height: 400 }}>
        <HierarchyList
          title={text('Title', 'MLB Expanded List')}
          defaultSelectedId={text('Default Selected Id', 'New York Mets_Pete Alonso')}
          items={items}
          editingStyle={select(
            'Editing Style',
            [EditingStyle.SingleNesting, EditingStyle.MultipleNesting],
            EditingStyle.SingleNesting
          )}
          pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], 'lg')}
          isLoading={boolean('isLoading', false)}
          isLargeRow={boolean('isLargeRow', false)}
          onListUpdated={(updatedItems) => {
            setItems(updatedItems);
          }}
          itemWillMove={() => {
            return allowsEdit;
          }}
          hasSearch={boolean('hasSearch', true)}
          onSelect={action('onSelect')}
          hasDeselection={boolean('hasDeselection', true)}
          hasMultiSelect={boolean('hasMultiSelect', false)}
          isVirtualList={boolean('hasVirtualList', false)}
        />
      </div>
    );
  };

  return <HierarchyListWithReorder />;
};

WithNestedReorder.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithDefaultExpandedIds = () => (
  <div style={{ width: 400, height: 400 }}>
    <HierarchyList
      title={text('Title', 'MLB Expanded List')}
      items={[
        ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
            },
            isSelectable: true,
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
            },
            isSelectable: true,
          })),
        })),
      ]}
      hasSearch={boolean('hasSearch', true)}
      pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], 'xl')}
      isLoading={boolean('isLoading', false)}
      isLargeRow={boolean('isLargeRow', false)}
      defaultExpandedIds={['Chicago White Sox', 'New York Yankees']}
      onSelect={action('onSelect')}
      hasDeselection={boolean('hasDeselection', true)}
      hasMultiSelect={boolean('hasMultiSelect', false)}
      isVirtualList={boolean('hasVirtualList', false)}
    />
  </div>
);

WithDefaultExpandedIds.storyName = 'With defaultExpandedIds';

export const WithMixedHierarchies = () => (
  <div style={{ width: 400 }}>
    <HierarchyList
      title={text('Title', 'Items with mixed nested hierarchies')}
      items={[
        {
          id: 'Tasks',
          isCategory: true,
          content: {
            value: 'Tasks',
          },
          children: [
            {
              id: 'Task 1',
              content: {
                value: 'Task 1',
                secondaryValue: () => (
                  <InlineLoading description="Loading data.." status="active" />
                ),
              },
              isSelectable: true,
            },
          ],
        },
        {
          id: 'My Reports',
          content: {
            value: 'My Reports',
            secondaryValue: () => <InlineLoading description="Loading data.." status="active" />,
          },
          isSelectable: true,
        },
        {
          id: 'Requests',
          isCategory: true,
          content: {
            value: 'Requests',
          },
          children: [
            {
              id: 'Request 1',
              content: {
                value: 'Request 1',
              },
              isSelectable: true,
            },
            {
              id: 'Request 2',
              isCategory: true,
              content: {
                value: 'Request 2',
              },
              children: [
                {
                  id: 'Request 2 details',
                  content: {
                    value: 'Request 2 details',
                  },
                },
              ],
            },
            {
              id: 'Request 3',
              content: {
                value: 'Request 3',
              },
              isSelectable: true,
            },
          ],
        },
      ]}
      hasSearch={boolean('hasSearch', true)}
      pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], 'xl')}
      isLoading={boolean('isLoading', false)}
      isLargeRow={boolean('isLargeRow', false)}
      onSelect={action('onSelect')}
      hasDeselection={boolean('hasDeselection', true)}
      hasMultiSelect={boolean('hasMultiSelect', false)}
      isVirtualList={boolean('hasVirtualList', false)}
    />
  </div>
);

WithMixedHierarchies.storyName = 'with mixed hierarchies';

export const WithSelectableCategories = () => (
  <div style={{ width: 400, height: 400 }}>
    <HierarchyList
      title={text('Title', 'MLB Expanded List')}
      defaultSelectedId={text('Default Selected Id', 'Chicago White Sox_Jose Abreu')}
      items={[
        ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
          id: team,
          isCategory: true,
          isSelectable: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
            },
            isSelectable: true,
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
            },
            isSelectable: true,
          })),
        })),
      ]}
      hasSearch={boolean('hasSearch', true)}
      pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], 'lg')}
      isLoading={boolean('isLoading', false)}
      isLargeRow={boolean('isLargeRow', false)}
      onSelect={action('onSelect')}
      hasDeselection={boolean('hasDeselection', true)}
      hasMultiSelect={boolean('hasMultiSelect', false)}
      isVirtualList={boolean('hasVirtualList', false)}
    />
  </div>
);

WithSelectableCategories.storyName = 'With selectable categories';

export const WithLargeNumberOfItems = () => (
  <div style={{ width: 400, height: 400 }}>
    <HierarchyList
      title={text('Title', 'Big List')}
      isFullHeight={boolean('isFullHeight', false)}
      items={[...Array(1000)].map((_, i) => ({
        id: `item-${i}`,
        content: {
          value:
            i === 20
              ? `Item ${i} that has an extra long label that will definitely be truncated`
              : `Item ${i}`,
          secondaryValue:
            i === 10
              ? `Item ${i} that has an extra long label that will definitely be truncated`
              : `Item ${i} Subvalue`,
        },
      }))}
      editingStyle={EditingStyle.Single}
      hasSearch={boolean('hasSearch', true)}
      pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], undefined)}
      isLoading={boolean('isLoading', false)}
      isLargeRow={boolean('isLargeRow', false)}
      onSelect={action('onSelect')}
      onListUpdated={action('onListUpdated')}
      hasDeselection={boolean('hasDeselection', true)}
      i18n={object('i18n', {
        searchPlaceHolderText: 'Search',
      })}
      hasMultiSelect={boolean('hasMultiSelect', false)}
      isVirtualList={boolean('hasVirtualList', true)}
    />
  </div>
);

WithLargeNumberOfItems.storyName = 'with virtual list and large number of items';

export const WithEmptyState = () => (
  <div style={{ width: 400, height: 400 }}>
    <HierarchyList
      title={text('Title', 'Big List')}
      isFullHeight={boolean('isFullHeight', true)}
      items={[]}
      editingStyle={EditingStyle.Single}
      hasSearch={boolean('hasSearch', true)}
      pageSize={select('Page Size', ['sm', 'lg', 'xl', undefined], undefined)}
      isLoading={boolean('isLoading', false)}
      isLargeRow={boolean('isLargeRow', false)}
      onSelect={action('onSelect')}
      hasDeselection={boolean('hasDeselection', true)}
      i18n={object('i18n', {
        searchPlaceHolderText: 'Search',
      })}
      hasMultiSelect={boolean('hasMultiSelect', false)}
      emptyState={text('emptyState', '__a custom empty state__')}
    />
  </div>
);

WithEmptyState.storyName = 'with empty state';
