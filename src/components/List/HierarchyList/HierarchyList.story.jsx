import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, boolean } from '@storybook/addon-knobs';
import { Add16 } from '@carbon/icons-react';
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

import { Button } from '../../..';
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
    onClick={() => action('header button clicked')}
  />
);

storiesOf('Watson IoT Experimental/HierarchyList', module)
  .add('Stateful list with nested searching', () => (
    <div style={{ width: 400, height: 400 }}>
      <HierarchyList
        title={text('Title', 'MLB Expanded List')}
        buttons={[addButton]}
        isFullHeight
        items={[
          ...Object.keys(sampleHierarchy.MLB['American League']).map(team => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['American League'][team]).map(player => ({
              id: `${team}_${player}`,
              content: {
                value: player,
                secondaryValue: sampleHierarchy.MLB['American League'][team][player],
              },
              isSelectable: true,
            })),
          })),
          ...Object.keys(sampleHierarchy.MLB['National League']).map(team => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['National League'][team]).map(player => ({
              id: `${team}_${player}`,
              content: {
                value: player,
                secondaryValue: sampleHierarchy.MLB['National League'][team][player],
              },
              isSelectable: true,
            })),
          })),
        ]}
        hasSearch
        pageSize={select('Page Size', ['sm', 'lg', 'xl'], 'sm')}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  ))
  .add('With defaultSelectedId', () => (
    <div style={{ width: 400, height: 400 }}>
      <HierarchyList
        title={text('Title', 'MLB Expanded List')}
        defaultSelectedId={text('Default Selected Id', 'New York Mets_Pete Alonso')}
        items={[
          ...Object.keys(sampleHierarchy.MLB['American League']).map(team => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['American League'][team]).map(player => ({
              id: `${team}_${player}`,
              content: {
                value: player,
              },
              isSelectable: true,
            })),
          })),
          ...Object.keys(sampleHierarchy.MLB['National League']).map(team => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['National League'][team]).map(player => ({
              id: `${team}_${player}`,
              content: {
                value: player,
              },
              isSelectable: true,
            })),
          })),
        ]}
        hasSearch
        pageSize={select('Page Size', ['sm', 'lg', 'xl'], 'lg')}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  ))
  .add('With OverflowMenu', () => (
    <div style={{ width: 400, height: 400 }}>
      <HierarchyList
        title={text('Title', 'MLB Expanded List')}
        items={[
          ...Object.keys(sampleHierarchy.MLB['American League']).map(team => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['American League'][team]).map(player => ({
              id: `${team}_${player}`,
              content: {
                value: player,
                rowActions: [
                  <OverflowMenu title="data-item-menu" flipped>
                    <OverflowMenuItem
                      itemText="Configure"
                      onClick={() => console.log('Configure')}
                    />
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
          ...Object.keys(sampleHierarchy.MLB['National League']).map(team => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['National League'][team]).map(player => ({
              id: `${team}_${player}`,
              content: {
                value: player,
                rowActions: [
                  <OverflowMenu title="data-item-menu" flipped>
                    <OverflowMenuItem
                      itemText="Configure"
                      onClick={() => console.log('Configure')}
                    />
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
        hasSearch
        pageSize={select('Page Size', ['sm', 'lg', 'xl'], 'lg')}
        isLoading={boolean('isLoading', false)}
      />
    </div>
  ))
  .add('With Nested Reorder', () => {
    const HierarchyListWithReorder = () => {
      const [items, setItems] = useState([
        ...Object.keys(sampleHierarchy.MLB['American League']).map(team => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map(player => ({
            id: `${team}_${player}`,
            content: {
              value: player,
            },
            isSelectable: true,
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map(team => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map(player => ({
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
            pageSize={select('Page Size', ['sm', 'lg', 'xl'], 'lg')}
            isLoading={boolean('isLoading', false)}
            onListUpdated={updatedItems => {
              setItems(updatedItems);
            }}
            itemWillMove={() => {
              return allowsEdit;
            }}
          />
        </div>
      );
    };

    return <HierarchyListWithReorder />;
  });
