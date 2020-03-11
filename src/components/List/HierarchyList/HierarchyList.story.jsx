import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';
import { Add16 } from '@carbon/icons-react';

import { Button } from '../../..';
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
      />
    </div>
  ));
