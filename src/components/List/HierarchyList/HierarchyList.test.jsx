import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import debounce from 'lodash/debounce';

import { sampleHierarchy } from '../List.story';
import { EditingStyle } from '../../../utils/DragAndDropUtils';

import HierarchyList, { searchForNestedItemValues, searchForNestedItemIds } from './HierarchyList';

// https://github.com/facebook/jest/issues/3465#issuecomment-449007170
jest.mock('lodash/debounce', () => fn => fn);

describe('HierarchyList', () => {
  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

  beforeEach(() => {
    // Mock the scroll function as its not implemented in jsdom
    // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  afterAll(() => {
    // this is likely unecessary, but should help ensure that everything from this file is garbage collected after completion
    debounce.mockRestore();
  });

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
  ];

  it('searchForNestedItemValues should return results for single nested list', () => {
    const foundValue = searchForNestedItemValues(items, 'jd');
    expect(foundValue).toEqual([
      {
        children: [
          {
            content: {
              secondaryValue: 'LF',
              value: 'JD Davis',
            },
            id: 'New York Mets_JD Davis',
            isSelectable: true,
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

  it('searchForNestedItemValues should not return results for single nested list', () => {
    const foundValue = searchForNestedItemValues(items, 'abcdefg');
    expect(foundValue).toEqual([]);
  });

  it('searchForNestedItemIds should return results for single nested list', () => {
    const foundValue = searchForNestedItemIds(items, 'New York Mets_JD Davis');
    expect(foundValue).toEqual([
      {
        children: [
          {
            content: {
              secondaryValue: 'LF',
              value: 'JD Davis',
            },
            id: 'New York Mets_JD Davis',
            isSelectable: true,
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

  it('searchNestedItems should not return results for single nested list', () => {
    const foundValue = searchForNestedItemIds(items, 'abcdefg');
    expect(foundValue).toEqual([]);
  });

  it('clicking expansion caret should expand item', () => {
    render(<HierarchyList items={items} title="Hierarchy List" pageSize="xl" />);
    fireEvent.click(screen.getAllByTestId('expand-icon')[0]);
    // Category item should be expanded
    expect(screen.getByTitle('Chicago White Sox')).toBeInTheDocument();
    // Nested item should be visible
    expect(screen.getByTitle('Leury Garcia')).toBeInTheDocument();
    // All other categories should be visible still
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
    expect(screen.getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(screen.getByTitle('Houston Astros')).toBeInTheDocument();
    expect(screen.getByTitle('Washington Nationals')).toBeInTheDocument();
  });

  it('clicking expansion caret should collapse expanded item', () => {
    render(<HierarchyList items={items} title="Hierarchy List" pageSize="xl" />);
    // Expand
    fireEvent.click(screen.getAllByTestId('expand-icon')[0]);
    // Category item should be expanded
    expect(screen.getByTitle('Chicago White Sox')).toBeInTheDocument();
    // Nested item should be visible
    expect(screen.getByTitle('Leury Garcia')).toBeInTheDocument();
    // All other categories should be visible still
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
    expect(screen.getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(screen.getByTitle('Houston Astros')).toBeInTheDocument();
    expect(screen.getByTitle('Washington Nationals')).toBeInTheDocument();
    // Collapse
    fireEvent.click(screen.getAllByTestId('expand-icon')[0]);
    // Category item should be expanded
    expect(screen.getByTitle('Chicago White Sox')).toBeInTheDocument();
    // Nested item should be visible
    expect(screen.queryByTitle('Leury Garcia')).not.toBeInTheDocument();
    // All other categories should be visible still
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
    expect(screen.getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(screen.getByTitle('Houston Astros')).toBeInTheDocument();
    expect(screen.getByTitle('Washington Nationals')).toBeInTheDocument();
  });

  it('clicking nextpage should display the second page', () => {
    render(<HierarchyList items={items} title="Hierarchy List" pageSize="sm" />);
    // Only 5 categories should be showing by default
    expect(screen.getByTitle('Chicago White Sox')).toBeInTheDocument();
    // All other categories should be visible still
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
    expect(screen.getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(screen.getByTitle('Houston Astros')).toBeInTheDocument();
    // 1 category should be hidden as its on page 2
    expect(screen.queryByTitle('Washington Nationals')).not.toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    // Only 1 categories should be showing by default
    expect(screen.getByTitle('Washington Nationals')).toBeInTheDocument();
    // The other 5 categories should be hidden as they're on page 1
    expect(screen.queryByTitle('Chicago White Sox')).not.toBeInTheDocument();
    expect(screen.queryByTitle('New York Mets')).not.toBeInTheDocument();
    // Yankees are once again unworthy
    expect(screen.queryByTitle('New York Yankees')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Atlanta Braves')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Houston Astros')).not.toBeInTheDocument();
  });

  it('found search result categories should be expanded', () => {
    render(<HierarchyList items={items} hasSearch title="Hierarchy List" pageSize="lg" />);
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0], { target: { value: 'jd' } });

    // Category containing value should appear
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are not worthy
    expect(screen.queryByTitle('New York Yankees')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Atlanta Braves')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Chicago White Sox')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Houston Astros')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Washington Nationals')).not.toBeInTheDocument();
    // Found item should appear
    expect(screen.getByTitle('JD Davis')).toBeInTheDocument();
  });

  it('all items should return if search value is empty string', () => {
    render(<HierarchyList items={items} hasSearch title="Hierarchy List" />);
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0], {
      target: { value: 'jd davis' },
    });

    // Category containing value should appear
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are not worthy
    expect(screen.queryByTitle('New York Yankees')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Atlanta Braves')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Chicago White Sox')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Houston Astros')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Washington Nationals')).not.toBeInTheDocument();
    // Found item should appear
    expect(screen.getByTitle('JD Davis')).toBeInTheDocument();

    // Change search to empty string
    fireEvent.change(screen.getAllByLabelText('Enter a value')[0], { target: { value: '' } });

    // All categories should appear
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    expect(screen.getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(screen.queryByTitle('Chicago White Sox')).toBeInTheDocument();
    expect(screen.queryByTitle('Houston Astros')).toBeInTheDocument();
    expect(screen.queryByTitle('Washington Nationals')).toBeInTheDocument();
    // Yankees are ... unfortunately worthy as well
    expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
  });

  it('parent items of defaultSelectedId should be expanded', () => {
    const { rerender } = render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        defaultSelectedId="New York Mets_JD Davis"
        hasPagination={false}
      />
    );

    // Nested item should be visible
    const selectedItem = screen.getByTitle('JD Davis');
    expect(selectedItem).toBeInTheDocument();

    // Should be marked selected
    expect(selectedItem?.parentElement?.parentElement?.parentElement?.className).toContain(
      '__selected'
    );
    // All other categories should be visible still
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
    expect(screen.getByTitle('Chicago White Sox')).toBeInTheDocument();
    expect(screen.getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(screen.getByTitle('Houston Astros')).toBeInTheDocument();
    expect(screen.getByTitle('Washington Nationals')).toBeInTheDocument();
    // But no Yankees players should be visible
    expect(screen.queryByTitle('Gary Sanchez')).not.toBeInTheDocument();

    // Change the defaultSelectedId property
    rerender(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        defaultSelectedId="New York Yankees_Gary Sanchez"
        hasPagination={false}
      />
    );

    expect(screen.queryByTitle('JD Davis')).toBeInTheDocument();

    const selectedYankee = screen.getByTitle('Gary Sanchez');
    expect(selectedYankee).toBeInTheDocument();

    expect(selectedYankee?.parentElement?.parentElement?.parentElement?.className).toContain(
      '__selected'
    );
  });

  it('clicking item should fire onSelect', () => {
    const onSelect = jest.fn();
    render(
      <HierarchyList items={items} title="Hierarchy List" pageSize="xl" onSelect={onSelect} />
    );
    // Expand the category
    fireEvent.click(screen.getAllByTestId('expand-icon')[0]);
    // Select the item
    fireEvent.click(screen.getAllByTitle('Leury Garcia')[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('shows custom header when item is selected', () => {
    render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        editingStyle={EditingStyle.MultipleNesting}
      />
    );

    const expandIcons = screen.queryAllByTestId('expand-icon');

    fireEvent.click(expandIcons[1]);

    const checkbox = screen.queryByTestId('New York Yankees_Gary Sanchez-checkbox');

    fireEvent.click(checkbox);

    const itemSelectedText = screen.queryByText('1 item selected');
    const moveText = screen.queryByText('Move');

    expect(itemSelectedText).toBeInTheDOM();
    expect(moveText).toBeInTheDOM();

    fireEvent.click(checkbox);

    const itemSelectedTextMissing = screen.queryByText('1 item selected');
    const moveTextMissing = screen.queryByText('Move');

    expect(itemSelectedTextMissing).toBeNull();
    expect(moveTextMissing).toBeNull();
  });

  it('shows modal when move selected', () => {
    render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        editingStyle={EditingStyle.MultipleNesting}
      />
    );

    const expandIcons = screen.queryAllByTestId('expand-icon');

    fireEvent.click(expandIcons[1]);

    const checkbox = screen.queryByTestId('New York Yankees_Gary Sanchez-checkbox');
    const checkbox2 = screen.queryByTestId('New York Yankees_Luke Voit-checkbox');

    fireEvent.click(checkbox);
    fireEvent.click(checkbox2);

    const itemSelectedText = screen.queryByText('2 items selected');
    const moveText = screen.queryByText('Move');

    expect(itemSelectedText).toBeInTheDOM();
    expect(moveText).toBeInTheDOM();

    fireEvent.click(moveText);

    const radioButtons = screen.queryAllByRole('radio');

    fireEvent.click(radioButtons[0]);

    const saveButton = screen.queryByText('Save');

    fireEvent.click(saveButton);

    fireEvent.click(expandIcons[0]);

    const listItems = screen.queryAllByRole('listitem');

    expect(within(listItems[2]).queryAllByText('Luke Voit').length).toBeGreaterThanOrEqual(1);
    expect(within(listItems[3]).queryAllByText('Gary Sanchez').length).toBeGreaterThanOrEqual(1);
  });
});
