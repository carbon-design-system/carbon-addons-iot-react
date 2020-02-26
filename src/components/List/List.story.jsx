import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { Add16, Edit16, Star16 } from '@carbon/icons-react';
import cloneDeep from 'lodash/cloneDeep';
import filterDeep from 'deepdash/filterDeep';

import { Button, OverflowMenu, OverflowMenuItem, Checkbox } from '../..';

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

storiesOf('Watson IoT Experimental/List', module)
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
  ))
  .add('with checkbox multi-selection', () => {
    const MultiSelectList = () => {
      const [selectedIds, setSelectedIds] = useState([]);
      const [expandedIds, setExpandedIds] = useState([]);

      const searchNestedItems = (items, value, parentMatch) => {
        let filteredItems = [];
        cloneDeep(items).forEach(item => {
          if (item.id === value) {
            filteredItems.push(item.id);
            if (item.children) {
              const children = searchNestedItems(item.children, value, true);
              filteredItems = filteredItems.concat(children);
            }
          } else if (parentMatch) {
            filteredItems.push(item.id);
          }
        });
        return filteredItems;
      };

      const handleCheckboxChange = (event, items) => {
        // If checked, add to selectedIds
        if (event.target.checked) {
          // find item and children being changed
          const nestedIds = searchNestedItems(items, event.target.name);
          let tempSelectedIds = [...selectedIds];
          if (nestedIds.length > 0) {
            tempSelectedIds = tempSelectedIds.concat(nestedIds);
          } else {
            tempSelectedIds.push(event.target.name);
          }
          setSelectedIds(tempSelectedIds);
        } // If unchecked, remove from selectedIds
        else {
          // find children
          const deselectedNestedIds = searchNestedItems(items, event.target.name);
          let tempSelectedIds = [...selectedIds];
          if (deselectedNestedIds.length === 0) {
            deselectedNestedIds.push(event.target.name);
          }
          deselectedNestedIds.forEach(deselectedId => {
            tempSelectedIds = tempSelectedIds.filter(id => id !== deselectedId);
          });
          setSelectedIds(tempSelectedIds);
        }
      };

      const checkSelectedChildren = items => {
        // eslint-disable-next-line consistent-return
        const selectedChildren = filterDeep(items, (value, key) => {
          if (selectedIds.some(id => key === id)) {
            return true;
          }
        });
        if (selectedChildren) {
          if (Object.keys(selectedChildren).length > 0) {
            return true;
          }
        }

        return false;
      };

      const nestedItems = [
        ...Object.keys(sampleHierarchy.MLB['American League']).map(team => ({
          id: team,
          isCategory: true,
          isSelectable: true,
          content: {
            value: team,
            icon: (
              <Checkbox
                id={`${team}-checkbox`}
                name={team}
                onClick={e => handleCheckboxChange(e, nestedItems)}
                checked={selectedIds.some(id => team === id)}
                indeterminate={
                  selectedIds.some(id => team === id)
                    ? false
                    : checkSelectedChildren(sampleHierarchy.MLB['American League'][team])
                }
              />
            ),
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map(player => ({
            id: player,
            isSelectable: true,
            content: {
              value: player,
              secondaryValue: sampleHierarchy.MLB['American League'][team][player],
              icon: (
                <Checkbox
                  id={`${player}-checkbox`}
                  name={player}
                  onClick={e => handleCheckboxChange(e, nestedItems)}
                  checked={selectedIds.some(id => player === id)}
                />
              ),
            },
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map(team => ({
          id: team,
          isCategory: true,
          isSelectable: true,
          content: {
            value: team,
            icon: (
              <Checkbox
                id={`${team}-checkbox`}
                name={team}
                onClick={e => handleCheckboxChange(e, nestedItems)}
                checked={selectedIds.some(id => team === id)}
                indeterminate={
                  selectedIds.some(id => team === id)
                    ? false
                    : checkSelectedChildren(sampleHierarchy.MLB['American League'][team])
                }
              />
            ),
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map(player => ({
            id: player,
            isSelectable: true,
            content: {
              value: player,
              secondaryValue: sampleHierarchy.MLB['National League'][team][player],
              icon: (
                <Checkbox
                  id={`${player}-checkbox`}
                  name={player}
                  onClick={e => handleCheckboxChange(e, nestedItems)}
                  checked={selectedIds.some(id => player === id)}
                />
              ),
            },
          })),
        })),
      ];

      return (
        <div style={{ width: 400 }}>
          <List
            title="Sports Teams"
            buttons={[headerButton]}
            iconPosition="left"
            items={nestedItems}
            selectedIds={selectedIds}
            expandedIds={expandedIds}
            toggleExpansion={id => {
              if (expandedIds.filter(rowId => rowId === id).length > 0) {
                // remove id from array
                setExpandedIds(expandedIds.filter(rowId => rowId !== id));
              } else {
                setExpandedIds(expandedIds.concat([id]));
              }
            }}
          />
        </div>
      );
    };
    return <MultiSelectList />;
  });
