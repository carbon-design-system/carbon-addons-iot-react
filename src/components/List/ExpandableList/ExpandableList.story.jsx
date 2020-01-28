import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';
import { Add16 } from '@carbon/icons-react';

import { Button } from '../../..';
import { sampleHierarchy } from '../List.story';

import ExpandableList from './ExpandableList';

const addButton = (
  <Button
    renderIcon={Add16}
    hasIconOnly
    size="small"
    iconDescription="Add"
    key="expandable-list-button-add"
    onClick={() => action('header button clicked')}
  />
);

storiesOf('Watson IoT Experimental|Expandable List', module).add(
  'Stateful list with dynamic expansion, nested searching, and categories',
  () => (
    <div style={{ width: 400 }}>
      <ExpandableList
        title="Expandable List"
        buttons={[addButton]}
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
            })),
          })),
        ]}
        hasSearch
        pageSize="xl"
      />
    </div>
  )
);
