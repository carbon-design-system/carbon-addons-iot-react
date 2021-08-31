import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { Add16, Edit16, Star16 } from '@carbon/icons-react';
import cloneDeep from 'lodash/cloneDeep';
import someDeep from 'deepdash/someDeep';

import { Button, OverflowMenu, OverflowMenuItem, Checkbox } from '../..';
import { Tag } from '../Tag';

import List from './List';
import ListREADME from './List.mdx';

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
        'Robinson Cano': '2B',
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
        'Michael Conforto is a super duper long name that will get cut off': 'RF',
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
  return Object.keys(obj).map((key) => ({
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

export default {
  title: '1 - Watson IoT/List',

  parameters: {
    component: List,
    docs: {
      page: ListREADME,
    },
  },

  excludeStories: ['sampleHierarchy'],
};

export const BasicSingleColumn = () => (
  <div style={{ width: 400 }}>
    <List
      title={text('title', 'NY Yankees')}
      items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
        ([key]) => ({
          id: key,
          content: { value: key },
        })
      )}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

BasicSingleColumn.storyName = 'basic (single column)';

export const BasicSingleColumnWithSearch = () => {
  const ListWithSearch = () => {
    const [searchValue, setSearchValue] = useState(null);
    return (
      <div style={{ width: 400 }}>
        <List
          title={text('title', 'NY Yankees')}
          items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees'])
            .map(([key]) => ({
              id: key,
              content: { value: key },
            }))
            .filter(
              ({ id }) =>
                searchValue === null || id.toLowerCase().includes(searchValue?.toLowerCase())
            )}
          isLoading={boolean('isLoading', false)}
          search={{
            onChange: (evt) => setSearchValue(evt.target.value),
          }}
        />
      </div>
    );
  };

  return <ListWithSearch />;
};

BasicSingleColumnWithSearch.storyName = 'basic (single column) with search';

export const SelectableItems = () => {
  const ListWithSelectableItems = () => {
    const [selected, setSelected] = useState();
    return (
      <div style={{ width: 400 }}>
        <List
          title={text('title', 'NY Yankees')}
          items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
            ([key]) => ({
              id: key,
              content: { value: key },
              isSelectable: true,
            })
          )}
          isLoading={boolean('isLoading', false)}
          handleSelect={(id) => setSelected(id)}
          selectedIds={[selected]}
        />
      </div>
    );
  };
  return <ListWithSelectableItems />;
};

SelectableItems.storyName = 'with selectable items';

export const WithSecondaryValue = () => (
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
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithSecondaryValue.storyName = 'with secondaryValue';

export const WithIsLargeRowAndIcon = () => (
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
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithIsLargeRowAndIcon.storyName = 'with isLargeRow and icon';

export const WithRowActionsSingle = () => (
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
                key={`${key}-list-item-button-${value}`}
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
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithRowActionsSingle.storyName = 'with row actions (single)';

export const WithRowActionsMultiple = () => (
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
              <OverflowMenu flipped key={`${key}-list-item-button-${value}`}>
                <OverflowMenuItem itemText="Edit" />
                <OverflowMenuItem itemText="Add" />
                <OverflowMenuItem itemText="Delete" hasDivider isDelete />
              </OverflowMenu>,
            ],
          },
        })
      )}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithRowActionsMultiple.storyName = 'with row actions (multiple)';

export const WithHierarchy = () => (
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
                  key={`${key}-list-item-button-${level}`}
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
                <OverflowMenu flipped key={`${key}-list-item-button-${level}`}>
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
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithHierarchy.storyName = 'with hierarchy';

export const WithCategoriesFixedHeight = () => (
  <div style={{ width: 400, height: 600 }}>
    <List
      title="Major League Baseball"
      buttons={[headerButton]}
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
          })),
        })),
      ]}
      expandedIds={['New York Yankees', 'Atlanta Braves']}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithCategoriesFixedHeight.storyName = 'with categories, fixed height';

export const WithEmptyState = () => (
  <div style={{ width: 400, height: 600 }}>
    <List
      title="Major League Baseball"
      buttons={[headerButton]}
      items={[]}
      isLoading={boolean('isLoading', false)}
      isFullHeight={boolean('isFullHeight', true)}
      emptyState={text('hasEmptyState', 'No list items to show')}
    />
  </div>
);

WithEmptyState.storyName = 'with empty state';

export const WithCheckboxMultiSelection = () => {
  const MultiSelectList = () => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);

    const searchNestedItems = (items, value, parentMatch) => {
      let filteredItems = [];
      cloneDeep(items).forEach((item) => {
        if (item.id === value) {
          filteredItems.push(item.id);
          if (item.children) {
            const children = searchNestedItems(item.children, item.id, true);
            filteredItems = filteredItems.concat(children);
          }
        } else if (parentMatch) {
          filteredItems.push(item.id);
        }
      });
      return filteredItems;
    };

    const handleCheckboxChange = (event, items, id) => {
      // If checked, add to selectedIds
      if (event.target.checked) {
        // find item and children being changed
        const nestedIds = searchNestedItems(items, id);
        let tempSelectedIds = [...selectedIds];
        if (nestedIds.length > 0) {
          tempSelectedIds = tempSelectedIds.concat(nestedIds);
        } else {
          tempSelectedIds.push(id);
        }
        setSelectedIds(tempSelectedIds);
      } // If unchecked, remove from selectedIds
      else {
        // find children
        const deselectedNestedIds = searchNestedItems(items, id);
        let tempSelectedIds = [...selectedIds];
        if (deselectedNestedIds.length === 0) {
          deselectedNestedIds.push(id);
        }
        deselectedNestedIds.forEach((deselectedId) => {
          tempSelectedIds = tempSelectedIds.filter((id) => id !== deselectedId);
        });
        setSelectedIds(tempSelectedIds);
      }
    };

    const checkSelectedChildren = (items, parent) =>
      someDeep(items, (value, key) => selectedIds.some((id) => `${parent}-${key}` === id));

    const nestedItems = [
      ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
        id: team,
        isCategory: true,
        isSelectable: true,
        content: {
          value: team,
          icon: (
            <Checkbox
              id={`${team}-checkbox`}
              name={team}
              labelText={team}
              hideLabel
              onClick={(e) => handleCheckboxChange(e, nestedItems, team)}
              checked={selectedIds.some((id) => team === id)}
              indeterminate={
                selectedIds.some((id) => team === id)
                  ? false
                  : checkSelectedChildren(sampleHierarchy.MLB['American League'][team], team)
              }
            />
          ),
        },
        children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
          id: `${team}-${player}`,
          isSelectable: true,
          content: {
            value: player,
            secondaryValue: sampleHierarchy.MLB['American League'][team][player],
            icon: (
              <Checkbox
                id={`${team}-${player}-checkbox`}
                name={player}
                labelText={team}
                hideLabel
                onClick={(e) => {
                  handleCheckboxChange(e, nestedItems, `${team}-${player}`);
                }}
                checked={selectedIds.some((id) => `${team}-${player}` === id)}
              />
            ),
          },
        })),
      })),
      ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
        id: team,
        isCategory: true,
        isSelectable: true,
        content: {
          value: team,
          icon: (
            <Checkbox
              id={`${team}-checkbox`}
              name={team}
              labelText={team}
              hideLabel
              onClick={(e) => handleCheckboxChange(e, nestedItems, team)}
              checked={selectedIds.some((id) => team === id)}
              indeterminate={
                selectedIds.some((id) => team === id)
                  ? false
                  : checkSelectedChildren(sampleHierarchy.MLB['National League'][team], team)
              }
            />
          ),
        },
        children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
          id: `${team}-${player}`,
          isSelectable: true,
          content: {
            value: player,
            secondaryValue: sampleHierarchy.MLB['National League'][team][player],
            icon: (
              <Checkbox
                id={`${team}-${player}-checkbox`}
                name={player}
                labelText={team}
                hideLabel
                onClick={(e) => {
                  handleCheckboxChange(e, nestedItems, `${team}-${player}`);
                }}
                checked={selectedIds.some((id) => `${team}-${player}` === id)}
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
          toggleExpansion={(id) => {
            if (expandedIds.filter((rowId) => rowId === id).length > 0) {
              // remove id from array
              setExpandedIds(expandedIds.filter((rowId) => rowId !== id));
            } else {
              setExpandedIds(expandedIds.concat([id]));
            }
          }}
          isLoading={boolean('isLoading', false)}
        />
      </div>
    );
  };
  return <MultiSelectList />;
};

WithCheckboxMultiSelection.storyName = 'with checkbox multi-selection';

export const WithTags = () => (
  <div style={{ width: 400 }}>
    <List
      title={text('title', 'NY Yankees')}
      items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
        ([key]) => ({
          id: key,
          content: {
            value: key,
            tags: [
              <Tag type="blue" title="descriptor" key="tag1">
                default
              </Tag>,
            ],
          },
        })
      )}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithTags.storyName = 'with tags';

export const WithPagination = () => (
  <div style={{ height: 300, overflow: 'auto', width: 400 }}>
    <List
      title={text('title', 'NY Yankees')}
      items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
        ([key]) => ({
          id: key,
          content: { value: key },
        })
      )}
      isLoading={boolean('isLoading', false)}
      pagination={{
        page: 1,
        onPage() {},
        maxPage: 10,
        pageOfPagesText: (page) => `Page ${page}`,
      }}
      isFullHeight
    />
  </div>
);

WithPagination.storyName = 'with pagination';

export const WithLoadMore = () => {
  const ListWithExpandIds = () => {
    const [expandedIds, setExpandedIds] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    return (
      <div style={{ width: 400 }}>
        <List
          title="Sports Teams"
          iconPosition="left"
          items={[
            {
              id: 'org',
              content: { value: 'Organization' },
              children: [
                { id: 'site-01', content: { value: 'Site 1' } },
                {
                  id: 'site-02',
                  content: { value: 'Site 2' },
                  children: [
                    { id: 'system-01', content: { value: 'System 1' } },
                    { id: 'system-02', content: { value: 'System 2' } },
                  ],
                  hasLoadMore: true,
                },
              ],
            },
          ]}
          expandedIds={expandedIds}
          toggleExpansion={(id) => setExpandedIds((prev) => [...prev, id])}
          isLoading={boolean('isLoading', false)}
          handleLoadMore={() => {
            action('handleLoadMore:');
            setIsLoadingMore(true);
          }}
          isLoadingMore={isLoadingMore}
        />
      </div>
    );
  };
  return <ListWithExpandIds />;
};

WithLoadMore.storyName = 'with load more';
