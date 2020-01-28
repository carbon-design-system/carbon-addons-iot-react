import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { sampleHierarchy } from '../List.story';

import ExpandableList, { searchForNestedValue } from './ExpandableList';

describe('ExpandableList', () => {
  const items = [
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
  ];
  test('searchForNestedValue should return found results', () => {
    const foundValue = searchForNestedValue(items, 'jd');
    expect(foundValue).toEqual([
      {
        children: [
          {
            content: {
              secondaryValue: 'LF',
              value: 'JD Davis',
            },
            id: 'New York Mets_JD Davis',
          },
        ],
        content: {
          value: 'New York Mets',
        },
        id: 'New York Mets',
        isCategory: true,
      },
    ]);
  });
  test('searchForNestedValue should not return found results', () => {
    const foundValue = searchForNestedValue(items, 'abcdefg');
    expect(foundValue).toEqual([]);
  });
  test('found search result categories should be expanded', () => {
    const { getByLabelText, getByTitle, queryByTitle } = render(
      <ExpandableList items={items} hasSearch title="Expandable List" pageSize="xl" />
    );
    fireEvent.change(getByLabelText('Search'), { target: { value: 'jd' } });
    // Category containing value should appear
    expect(getByTitle('New York Mets')).toBeTruthy();
    // Yankees are not worthy
    expect(queryByTitle('New York Yankees')).toBeFalsy();
    // Found item should appear
    expect(getByTitle('JD Davis')).toBeTruthy();
  });
});
