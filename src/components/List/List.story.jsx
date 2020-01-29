import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { Add16, Edit16, Star16 } from '@carbon/icons-react';

import { Button, OverflowMenu, OverflowMenuItem } from '../..';

import List from './List';

export const sampleHierarchy = {
  MLB: {
    'American League': {
      'Chicago White Sox': {
        'Leury Garcia': 'CF',
        'Yoan Moncada': '3B',
        'Jose Abreu': '1B',
        'Welington Castillo': 'C',
        'Eloy Jimenez': 'LF',
        'Charlie Tilson': 'RF',
        'Tim Anderson': 'SS',
        'Yolmer Sanchez': '2B',
        'Dylan Covey': 'P',
      },
      'New York Yankees': {
        'DJ LeMahieu': '2B',
        'Luke Voit': '1B',
        'Gary Sanchez': 'C',
        'Kendrys Morales': 'DH',
        'Gleyber Torres': 'SS',
        'Clint Frazier': 'RF',
        'Brett Gardner': 'LF',
        'Gio Urshela': '3B',
        'Cameron Maybin': 'RF',
      },
      'Houston Astros': {
        'George Springer': 'RF',
        'Jose Altuve': '2B',
        'Michael Brantley': 'LF',
        'Alex Bregman': '3B',
        'Yuli Gurriel': '1B',
        'Yordan Alvarez': 'DH',
        'Carlos Correa': 'SS',
        'Robinson Chirinos': 'C',
        'Josh Reddick': 'CF',
      },
    },
    'National League': {
      'Atlanta Braves': {
        'Ronald Acuna Jr.': 'CF',
        'Dansby Swanson': 'SS',
        'Freddie Freeman': '1B',
        'Josh Donaldson': '3B',
        'Nick Markakis': 'RF',
        'Austin Riley': 'LF',
        'Brian McCann': 'C',
        'Ozzie Albies': '2B',
        'Kevin Gausman': 'P',
      },
      'New York Mets': {
        'Jeff McNeil': '3B',
        'Amed Rosario': 'SS',
        'Michael Conforto': 'RF',
        'Pete Alonso': '1B',
        'Wilson Ramos': 'C',
        'Robinson Cano': '2B',
        'JD Davis': 'LF',
        'Brandon Nimmo': 'CF',
        'Jacob Degrom': 'P',
      },
      'Washington Nationals': {
        'Trea Turner': 'SS',
        'Adam Eaton': 'RF',
        'Anthony Rendon': '3B',
        'Juan Soto': 'LF',
        'Howie Kendrick': '2B',
        'Ryan Zimmerman': '1B',
        'Yian Gomes': 'C',
        'Victor Robles': 'CF',
        'Max Scherzer': 'P',
      },
    },
  },
};

const buildHierarchy = (obj, renderRowActions, renderIcon, prefix = '', level = 0) => {
  return Object.keys(obj).map(key => ({
    id: `${prefix}${key}`,
    content: {
      value: key,
      secondaryValue: typeof obj[key] === 'string' ? obj[key] : undefined,
      rowActions: renderRowActions(key, level, obj),
      icon: renderIcon(key, level, obj),
    },
    children:
      typeof obj[key] === 'object'
        ? buildHierarchy(obj[key], renderRowActions, renderIcon, `${prefix}${key}_`, level + 1)
        : null,
  }));
};

const headerButton = (
  <Button
    renderIcon={Add16}
    hasIconOnly
    size="small"
    iconDescription="Add"
    key="expandable-list-button-add"
    onClick={() => action('header button clicked')}
  />
);

storiesOf('Watson IoT Experimental|List', module)
  .add('basic (single column)', () => (
    <div style={{ width: 400 }}>
      <List
        title={text('title', 'NY Yankees')}
        items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
          ([key]) => ({
            id: key,
            content: { value: key },
          })
        )}
      />
    </div>
  ))
  .add('with secondaryValue', () => (
    <div style={{ width: 400 }}>
      <List
        title={text('title', 'NY Yankees')}
        items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
          ([key, value]) => ({
            id: key,
            content: {
              value: key,
              secondaryValue: value,
            },
          })
        )}
      />
    </div>
  ))
  .add('with isLargeRow and icon', () => (
    <div style={{ width: 400 }}>
      <List
        title={text('title', 'NY Yankees')}
        isLargeRow
        items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
          ([key, value]) => ({
            id: key,
            content: {
              value: key,
              secondaryValue: value,
              icon: <Star16 />,
            },
          })
        )}
      />
    </div>
  ))
  .add('with row actions (single)', () => (
    <div style={{ width: 400 }}>
      <List
        title={text('title', 'NY Yankees')}
        items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
          ([key, value]) => ({
            id: key,
            content: {
              value: key,
              secondaryValue: value,
              rowActions: [
                <Button
                  style={{ color: 'black' }}
                  renderIcon={Edit16}
                  hasIconOnly
                  kind="ghost"
                  size="small"
                  onClick={() => action('row action clicked')}
                  iconDescription="Edit"
                />,
              ],
            },
          })
        )}
      />
    </div>
  ))
  .add('with row actions (multiple)', () => (
    <div style={{ width: 400 }}>
      <List
        title={text('title', 'NY Yankees')}
        items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
          ([key, value]) => ({
            id: key,
            content: {
              value: key,
              secondaryValue: value,
              rowActions: [
                <OverflowMenu flipped>
                  <OverflowMenuItem itemText="Edit" />
                  <OverflowMenuItem itemText="Add" />
                  <OverflowMenuItem itemText="Delete" hasDivider isDelete />
                </OverflowMenu>,
              ],
            },
          })
        )}
      />
    </div>
  ))
  .add('with hierarchy', () => (
    <div style={{ width: 400 }}>
      <List
        title="Sports Teams"
        buttons={[headerButton]}
        iconPosition="left"
        items={buildHierarchy(
          sampleHierarchy,
          (key, level) =>
            level === 1
              ? [
                  <Button
                    style={{ color: 'black' }}
                    renderIcon={Edit16}
                    hasIconOnly
                    kind="ghost"
                    size="small"
                    onClick={() => action('row action clicked')}
                    iconDescription="Edit"
                  />,
                ]
              : level === 2
              ? [
                  <OverflowMenu flipped>
                    <OverflowMenuItem itemText="Edit" />
                    <OverflowMenuItem itemText="Add" />
                    <OverflowMenuItem itemText="Delete" hasDivider isDelete />
                  </OverflowMenu>,
                ]
              : [],
          (key, level) => (level === 3 ? <Star16 /> : null)
        )}
        expandedIds={[
          'MLB',
          'MLB_American League',
          'MLB_National League',
          'MLB_American League_New York Yankees',
        ]}
        toggleExpansion={action('toggleExpansion')}
      />
    </div>
  ))
  .add('with categories, fixed height', () => (
    <div style={{ width: 400, height: 600 }}>
      <List
        title="Major League Baseball"
        buttons={[headerButton]}
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
        expandedIds={['New York Yankees', 'Atlanta Braves']}
      />
    </div>
  ));
