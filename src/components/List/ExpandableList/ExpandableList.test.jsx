import React from 'react';
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  waitForElement,
} from '@testing-library/react';

import { sampleHierarchy } from '../List.story';

import ExpandableList, { searchNestedItems, searchItem } from './ExpandableList';

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

  test('searchItem should return true', () => {
    const item = {
      content: {
        secondaryValue: 'LF',
        value: 'Juan Soto',
      },
      id: 'Washington Nationals_Juan Soto',
    };
    expect(searchItem(item, 'soto')).toBeTruthy();
  });

  test('searchItem should return false', () => {
    const item = {
      content: {
        secondaryValue: 'LF',
        value: 'Juan Soto',
      },
      id: 'Washington Nationals_Juan Soto',
    };
    expect(searchItem(item, 'blob')).toBeFalsy();
  });

  test('searchNestedItems should return results for single nested list', () => {
    const foundValue = searchNestedItems(items, 'jd');
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

  test('searchNestedItems should not return results for single nested list', () => {
    const foundValue = searchNestedItems(items, 'abcdefg');
    expect(foundValue).toEqual([]);
  });

  test('clicking expansion caret should expand item', () => {
    const { getByTitle, getAllByRole } = render(
      <ExpandableList items={items} title="Expandable List" pageSize="xl" />
    );
    fireEvent.click(getAllByRole('button')[0]);
    // Category item should be expanded
    expect(getByTitle('Chicago White Sox')).toBeTruthy();
    // Nested item should be visible
    expect(getByTitle('Leury Garcia')).toBeTruthy();
    // All other categories should be visible still
    expect(getByTitle('New York Mets')).toBeTruthy();
    // Yankees are unfortunately worthy too...
    expect(getByTitle('New York Yankees')).toBeTruthy();
    expect(getByTitle('Atlanta Braves')).toBeTruthy();
    expect(getByTitle('Houston Astros')).toBeTruthy();
    expect(getByTitle('Washington Nationals')).toBeTruthy();
  });

  test('clicking nextpage should display the second page', () => {
    const { getByTitle, queryByTitle, getAllByRole } = render(
      <ExpandableList items={items} title="Expandable List" pageSize="sm" />
    );
    // Only 5 categories should be showing by default
    expect(getByTitle('Chicago White Sox')).toBeTruthy();
    // All other categories should be visible still
    expect(getByTitle('New York Mets')).toBeTruthy();
    // Yankees are unfortunately worthy too...
    expect(getByTitle('New York Yankees')).toBeTruthy();
    expect(getByTitle('Atlanta Braves')).toBeTruthy();
    expect(getByTitle('Houston Astros')).toBeTruthy();
    // 1 category should be hidden as its on page 2
    expect(queryByTitle('Washington Nationals')).toBeFalsy();

    const buttons = getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    // Only 1 categories should be showing by default
    expect(getByTitle('Washington Nationals')).toBeTruthy();
    // The other 5 categories should be hidden as they're on page 1
    expect(queryByTitle('Chicago White Sox')).toBeFalsy();
    expect(queryByTitle('New York Mets')).toBeFalsy();
    // Yankees are once again unworthy
    expect(queryByTitle('New York Yankees')).toBeFalsy();
    expect(queryByTitle('Atlanta Braves')).toBeFalsy();
    expect(queryByTitle('Houston Astros')).toBeFalsy();
  });

  test('found search result categories should be expanded', () => {
    const { getByLabelText, getByTitle, queryByTitle } = render(
      <ExpandableList items={items} hasSearch title="Expandable List" pageSize="xl" />
    );
    fireEvent.change(getByLabelText('Search'), { target: { value: 'jd' } });
    /** Need to wait for the element to be removed because the search function
        has a debouncing timeout */
    // eslint-disable-next-line
    waitForElementToBeRemoved(() => queryByTitle('New York Yankees')).then(() => {
      // Category containing value should appear
      expect(getByTitle('New York Mets')).toBeTruthy();
      // Yankees are not worthy
      expect(queryByTitle('New York Yankees')).toBeFalsy();
      expect(queryByTitle('Atlanta Braves')).toBeFalsy();
      expect(queryByTitle('Chicago White Sox')).toBeFalsy();
      expect(queryByTitle('Houston Astros')).toBeFalsy();
      expect(queryByTitle('Washington Nationals')).toBeFalsy();
      // Found item should appear
      expect(getByTitle('JD Davis')).toBeTruthy();
    });
  });

  test('all items should return if search value is empty string', async () => {
    const { getByLabelText, getByTitle, queryByTitle } = render(
      <ExpandableList items={items} hasSearch title="Expandable List" pageSize="xl" />
    );
    fireEvent.change(getByLabelText('Search'), { target: { value: 'jd davis' } });
    /** Need to wait for the element to be removed because the search function
        has a debouncing timeout */
    // eslint-disable-next-line
    waitForElementToBeRemoved(() => queryByTitle('New York Yankees')).then(async () => {
      // Category containing value should appear
      expect(getByTitle('New York Mets')).toBeTruthy();
      // Yankees are not worthy
      expect(queryByTitle('New York Yankees')).toBeFalsy();
      expect(queryByTitle('Atlanta Braves')).toBeFalsy();
      expect(queryByTitle('Chicago White Sox')).toBeFalsy();
      expect(queryByTitle('Houston Astros')).toBeFalsy();
      expect(queryByTitle('Washington Nationals')).toBeFalsy();
      // Found item should appear
      expect(getByTitle('JD Davis')).toBeTruthy();

      // Change search to empty string
      fireEvent.change(getByLabelText('Search'), { target: { value: '' } });
      /** Need to wait for an element to appear because the search function
      has a debouncing timeout */
      const braves = await waitForElement(() => getByTitle('Atlanta Braves'));
      // All categories should appear
      expect(getByTitle('New York Mets')).toBeTruthy();
      expect(braves).toBeTruthy();
      expect(queryByTitle('Chicago White Sox')).toBeTruthy();
      expect(queryByTitle('Houston Astros')).toBeTruthy();
      expect(queryByTitle('Washington Nationals')).toBeTruthy();
      // Yankees are ... unfortunately worthy as well
      expect(getByTitle('New York Yankees')).toBeTruthy();
    });
  });
});
