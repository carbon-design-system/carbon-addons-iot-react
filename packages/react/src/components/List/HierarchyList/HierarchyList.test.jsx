import React from 'react';
import { render, fireEvent, screen, within, waitFor } from '@testing-library/react';
import debounce from 'lodash/debounce';
import userEvent from '@testing-library/user-event';

import { sampleHierarchy } from '../List.story';
import { EditingStyle } from '../../../utils/DragAndDropUtils';
import { settings } from '../../../constants/Settings';
import { InlineLoading } from '../../InlineLoading';

import HierarchyList, { searchForNestedItemValues, searchForNestedItemIds } from './HierarchyList';

const { iotPrefix } = settings;

// https://github.com/facebook/jest/issues/3465#issuecomment-449007170
jest.mock('lodash/debounce', () => (fn) => fn);

const getListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

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
  ];

  describe('searchForNestedItemValues', () => {
    it('should return results for single nested list', () => {
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

    it('should not return results for single nested list', () => {
      const foundValue = searchForNestedItemValues(items, 'abcdefg');
      expect(foundValue).toEqual([]);
    });
  });

  describe('searchForNestedItemIds', () => {
    it('should return results for single nested list', () => {
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

    it('should not return results for single nested list', () => {
      const foundValue = searchForNestedItemIds(items, 'abcdefg');
      expect(foundValue).toEqual([]);
    });
  });

  describe('expansion', () => {
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

  describe('search', () => {
    it('found search result categories should be expanded', () => {
      render(<HierarchyList items={items} hasSearch title="Hierarchy List" pageSize="lg" />);
      fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
        target: { value: 'jd' },
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
    });

    it('search should include categories', () => {
      render(<HierarchyList items={items} hasSearch title="Hierarchy List" pageSize="lg" />);
      fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
        target: { value: 'Chicago White Sox' },
      });

      // Matched Category should appear
      expect(screen.getByTitle('Chicago White Sox')).toBeInTheDocument();
      // All items in Category should appear
      expect(screen.getByTitle('Leury Garcia')).toBeInTheDocument();
      expect(screen.getByTitle('Dylan Covey')).toBeInTheDocument();

      expect(screen.queryByTitle('New York Mets')).not.toBeInTheDocument();
      expect(screen.queryByTitle('New York Yankees')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Atlanta Braves')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Houston Astros')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Washington Nationals')).not.toBeInTheDocument();

      fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
        target: { value: 'Ch' },
      });

      // Matched Category should appear
      expect(screen.getByTitle('Chicago White Sox')).toBeInTheDocument();
      // All child items in Category should appear, including items that do not match
      expect(screen.getByTitle('Leury Garcia')).toBeInTheDocument();
      expect(screen.getByTitle('Dylan Covey')).toBeInTheDocument();

      expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
      expect(screen.getByTitle('Gary Sanchez')).toBeInTheDocument();

      // // Category with matching child items should appear
      expect(screen.getByTitle('Houston Astros')).toBeInTheDocument();
      expect(screen.getByTitle('Michael Brantley')).toBeInTheDocument();
      expect(screen.getByTitle('Robinson Chirinos')).toBeInTheDocument();

      expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
      expect(screen.getByTitle(/Michael Conforto/i)).toBeInTheDocument();

      expect(screen.getByTitle('Washington Nationals')).toBeInTheDocument();
      expect(screen.getByTitle('Max Scherzer')).toBeInTheDocument();

      expect(screen.queryByTitle('Atlanta Braves')).not.toBeInTheDocument();
    });

    it('all items should return if search value is empty string', () => {
      render(<HierarchyList items={items} hasSearch title="Hierarchy List" />);
      fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
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
      fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
        target: { value: '' },
      });

      // All categories should appear
      expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
      expect(screen.getByTitle('Atlanta Braves')).toBeInTheDocument();
      expect(screen.queryByTitle('Chicago White Sox')).toBeInTheDocument();
      expect(screen.queryByTitle('Houston Astros')).toBeInTheDocument();
      expect(screen.queryByTitle('Washington Nationals')).toBeInTheDocument();
      // Yankees are ... unfortunately worthy as well
      expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
    });

    it('should still return results when secondaryValue is a custom node', () => {
      const itemsWithCustomSecondaryValues = [
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
      ];

      render(
        <HierarchyList items={itemsWithCustomSecondaryValues} hasSearch title="Hierarchy List" />
      );
      fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
        target: { value: 'my reports' },
      });

      // Found item should appear
      expect(screen.getByTitle('My Reports')).toBeInTheDocument();

      // Change search to check for a nested value
      fireEvent.change(screen.getByPlaceholderText('Enter a value'), {
        target: { value: 'task 1' },
      });

      // Found item should appear
      expect(screen.getByTitle('Task 1')).toBeInTheDocument();
    });
  });

  describe('defaultSelectedId', () => {
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

    it('defaultSelectedItem should not fire onSelect', () => {
      const mockOnSelect = jest.fn();
      render(
        <HierarchyList
          items={items}
          title="Hierarchy List"
          pageSize="xl"
          defaultSelectedId="New York Mets_JD Davis"
          hasPagination={false}
          onSelect={mockOnSelect}
        />
      );

      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });

  it('defaultExpandedIds should be expanded', () => {
    render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        defaultExpandedIds={['New York Mets', 'New York Yankees']}
        hasPagination={false}
      />
    );
    // Yankees and Mets expanded by default. Players should be in document.
    const expandedMetsPlayer = screen.getByTitle('JD Davis');
    expect(expandedMetsPlayer).toBeInTheDocument();
    const expandedYankeesPlayer = screen.getByTitle('Gary Sanchez');
    expect(expandedYankeesPlayer).toBeInTheDocument();

    // White Sox, Astros, Braves, and Nationals not expanded.
    expect(screen.queryByTitle('Tim Anderson')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Jose Altuve')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Freddie Freeman')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Adam Eaton')).not.toBeInTheDocument();

    // All other categories should be visible still
    expect(screen.getByTitle('New York Mets')).toBeInTheDocument();
    expect(screen.getByTitle('New York Yankees')).toBeInTheDocument();
    expect(screen.getByTitle('Chicago White Sox')).toBeInTheDocument();
    expect(screen.getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(screen.getByTitle('Houston Astros')).toBeInTheDocument();
    expect(screen.getByTitle('Washington Nationals')).toBeInTheDocument();
  });

  it('supports i18n strings', async () => {
    render(
      <HierarchyList
        hasSearch
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        editingStyle={EditingStyle.MultipleNesting}
        i18n={{
          searchPlaceHolderText: 'test-enter-value',
          expand: 'test-expand',
          close: 'test-close',
          itemsSelected: '%d test-items-selected',
          move: 'test-move',
          cancel: 'test-cancel',
          itemSelected: '1 test-item-selected',
          allRows: 'test-all-rows',
          itemTitle: 'test-move 1 item',
          itemsTitle: 'test-move %d items',
          modalDescription: 'test-select-a-destination',
        }}
      />
    );
    expect(screen.getByText('test-enter-value')).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'test-expand' })).toHaveLength(6);

    // Expand the 5th category New York Mets
    userEvent.click(screen.queryAllByRole('button', { name: 'test-expand' })[4]);
    userEvent.click(screen.queryByTestId('New York Mets_Pete Alonso-checkbox'));

    expect(screen.getByText('test-all-rows')).toBeVisible();
    expect(screen.getByText('1 test-item-selected')).toBeVisible();
    expect(screen.queryByText('2 test-items-selected')).not.toBeInTheDocument();

    userEvent.click(screen.queryByTestId('New York Mets_Amed Rosario-checkbox'));
    expect(screen.getByText('2 test-items-selected')).toBeVisible();

    // Open the dialog
    userEvent.click(screen.getByRole('button', { name: 'test-move' }));
    await waitFor(() => expect(screen.getByText('test-move 2 items')).toBeVisible());
    expect(screen.getByRole('button', { name: 'test-close' })).toBeVisible();
    expect(screen.getByText('test-select-a-destination')).toBeVisible();
    expect(screen.getByText('test-all-rows')).toBeVisible();
  });

  it('has default i18n strings', async () => {
    const i18nDefaults = HierarchyList.defaultProps.i18n;
    render(
      <HierarchyList
        hasSearch
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        editingStyle={EditingStyle.MultipleNesting}
      />
    );
    expect(screen.getByText(i18nDefaults.searchPlaceHolderText)).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: i18nDefaults.expand })).toHaveLength(6);

    // Expand the 5th category New York Mets
    userEvent.click(screen.queryAllByRole('button', { name: i18nDefaults.expand })[4]);
    userEvent.click(screen.queryByTestId('New York Mets_Pete Alonso-checkbox'));

    expect(screen.getByText(i18nDefaults.itemSelected)).toBeVisible();
    expect(screen.queryByText('2 items selected')).not.toBeInTheDocument();

    userEvent.click(screen.queryByTestId('New York Mets_Amed Rosario-checkbox'));
    expect(screen.getByText('2 items selected')).toBeVisible();

    // Open the dialog
    userEvent.click(screen.getByRole('button', { name: i18nDefaults.move }));
    await waitFor(() => expect(screen.getByText('Move 2 items underneath')).toBeVisible());

    const modal = screen.getByRole('dialog');
    expect(within(modal).getByRole('button', { name: i18nDefaults.close })).toBeVisible();
    expect(screen.getByText(i18nDefaults.modalDescription)).toBeVisible();
    expect(screen.getByText(i18nDefaults.allRows)).toBeVisible();
  });

  it('supports i18n functions where needed', async () => {
    const i18nDefaults = HierarchyList.defaultProps.i18n;
    render(
      <HierarchyList
        hasSearch
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        editingStyle={EditingStyle.MultipleNesting}
        i18n={{
          itemsSelected: (i) => `${i} test-items-selected`,
          itemsTitle: (i) => `test-move ${i} items`,
        }}
      />
    );

    // // Expand the 5th category New York Mets
    userEvent.click(screen.queryAllByRole('button', { name: i18nDefaults.expand })[4]);
    userEvent.click(screen.queryByTestId('New York Mets_Pete Alonso-checkbox'));
    userEvent.click(screen.queryByTestId('New York Mets_Amed Rosario-checkbox'));
    expect(screen.getByText('2 test-items-selected')).toBeVisible();

    // Open the dialog
    userEvent.click(screen.getByRole('button', { name: i18nDefaults.move }));
    await waitFor(() => expect(screen.getByText('test-move 2 items')).toBeVisible());
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

  it('clicking a selected item with hasDeselection deselects it', () => {
    const onSelect = jest.fn();
    render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        onSelect={onSelect}
        hasDeselection
      />
    );
    // Expand the category
    fireEvent.click(screen.getAllByTestId('expand-icon')[0]);
    // Select the item once to initially select it
    fireEvent.click(screen.getAllByTitle('Leury Garcia')[0]);
    expect(onSelect).toHaveBeenCalledWith('Chicago White Sox_Leury Garcia');
    // click it again
    fireEvent.click(screen.getAllByTitle('Leury Garcia')[0]);
    expect(onSelect).toHaveBeenCalledWith('Chicago White Sox_Leury Garcia');
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('should be able to select multiple items with hasMultiSelect', () => {
    const onSelect = jest.fn();
    render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        onSelect={onSelect}
        hasMultiSelect
        editingStyle={null}
      />
    );
    // Expand the category
    fireEvent.click(screen.getAllByTestId('expand-icon')[0]);
    // Select the item once to initially select it
    fireEvent.click(screen.getAllByTitle('Leury Garcia')[0]);
    expect(onSelect).toHaveBeenCalledWith('Chicago White Sox_Leury Garcia');
    // click it again
    fireEvent.click(screen.getAllByTitle('Yoan Moncada')[0]);
    expect(onSelect).toHaveBeenCalledWith('Chicago White Sox_Yoan Moncada');
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId('list-item__selected')).toHaveLength(2);
  });

  it('clicking a selected item should not fire onSelect', () => {
    const onSelect = jest.fn();
    render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        onSelect={onSelect}
        hasDeselection={false}
      />
    );
    // Expand the category
    fireEvent.click(screen.getAllByTestId('expand-icon')[0]);
    // Select the item once to initially select it
    fireEvent.click(screen.getAllByTitle('Leury Garcia')[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    // click it again
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

    expect(itemSelectedText).toBeDefined();
    expect(moveText).toBeDefined();

    fireEvent.click(checkbox);

    const itemSelectedTextMissing = screen.queryByText('1 item selected');
    const moveTextMissing = screen.queryByText('Move');

    expect(itemSelectedTextMissing).toBeNull();
    expect(moveTextMissing).toBeNull();
  });

  it('should close the bulk modal when clicking submit with nothing selected', () => {
    const onSelect = jest.fn();
    const onListUpdated = jest.fn();
    render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        editingStyle={EditingStyle.MultipleNesting}
        onSelect={onSelect}
        onListUpdated={onListUpdated}
      />
    );

    const expandIcons = screen.queryAllByTestId('expand-icon');

    fireEvent.click(expandIcons[1]);

    userEvent.click(screen.queryByText('Save'));
    expect(onSelect).not.toHaveBeenCalled();
    expect(onListUpdated).not.toHaveBeenCalled();
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

    expect(itemSelectedText).toBeDefined();
    expect(moveText).toBeDefined();

    fireEvent.click(moveText);

    const radioButtons = screen.queryAllByRole('radio');

    fireEvent.click(radioButtons[0]);

    const saveButton = screen.queryByText('Save');

    fireEvent.click(saveButton);

    fireEvent.click(moveText);

    const cancelText = screen.queryAllByText('Cancel');

    fireEvent.click(cancelText[0]);

    fireEvent.click(expandIcons[0]);

    const listItems = screen.queryAllByRole('listitem');

    expect(within(listItems[2]).queryAllByText('Luke Voit').length).toBeGreaterThanOrEqual(1);
    expect(within(listItems[3]).queryAllByText('Gary Sanchez').length).toBeGreaterThanOrEqual(1);
  });

  it('should clear selected ids in bulk mode when cancelled.', () => {
    const onSelect = jest.fn();
    const { container } = render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        editingStyle={EditingStyle.MultipleNesting}
        defaultExpandedIds={['New York Mets']}
        onSelect={onSelect}
      />
    );

    userEvent.click(screen.getByTestId('New York Mets_Pete Alonso-checkbox'));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByText('1 item selected')).toBeVisible();
    userEvent.click(within(screen.getByTestId('list')).getByText('Cancel'));
    expect(screen.queryByText('1 item selected')).toBeNull();
    expect(container.querySelectorAll('input[checked]').length).toBe(0);
  });

  it('should show lock icons and prevent rows from being dragged for ids in lockedIds', () => {
    render(
      <HierarchyList
        title="Hierarchy List"
        items={getListItems(2)}
        editingStyle={EditingStyle.SingleNesting}
        lockedIds={['1']}
      />
    );

    expect(
      within(screen.getByTestId('list'))
        .getByText('Item 1')
        .closest(`.${iotPrefix}--list-item-parent > *`)
    ).not.toHaveAttribute('draggable');

    expect(
      within(screen.getByTestId('list')).getByText('Item 1').closest(`.${iotPrefix}--list-item`)
        .firstChild
    ).toHaveClass(`${iotPrefix}--list-item--lock`);

    expect(
      within(screen.getByTestId('list'))
        .getAllByText('Item 2')[0]
        .closest(`.${iotPrefix}--list-item-parent > *`)
    ).toHaveAttribute('draggable');
  });

  it('should uncheck children when the parent is unchecked.', () => {
    const onSelect = jest.fn();
    const { container } = render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        editingStyle={EditingStyle.MultipleNesting}
        onSelect={onSelect}
      />
    );

    userEvent.click(screen.getByTestId('Atlanta Braves-checkbox'));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByText('10 items selected')).toBeVisible();
    userEvent.click(screen.getByTestId('Atlanta Braves-checkbox'));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByText('10 items selected')).toBeNull();
    expect(container.querySelectorAll('input[checked]').length).toBe(0);
  });

  it('should not selected a locked row when parent selected', () => {
    const onSelect = jest.fn();
    render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        editingStyle={EditingStyle.MultipleNesting}
        lockedIds={['Atlanta Braves_Dansby Swanson']}
        defaultExpandedIds={['Atlanta Braves']}
        onSelect={onSelect}
      />
    );

    userEvent.click(screen.getByTestId('Atlanta Braves-checkbox'));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByText('9 items selected')).toBeVisible();
    userEvent.click(screen.getByTestId('Atlanta Braves-checkbox'));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByText('9 items selected')).toBeNull();
    expect(screen.getByTestId('Atlanta Braves_Dansby Swanson-checkbox')).not.toBeChecked();
  });

  it('should force ids to be expanded when expandedIds is passed', () => {
    const expectTeamToBeExpanded = (id) => {
      expect(
        within(screen.getByTitle(id).closest(`.${iotPrefix}--list-item`)).getByLabelText('Close')
      ).toBeVisible();
    };

    const expectTeamNotToBeExpanded = (id) => {
      expect(
        within(screen.getByTitle(id).closest(`.${iotPrefix}--list-item`)).queryByLabelText('Close')
      ).toBeNull();
    };

    const { rerender } = render(
      <HierarchyList items={items} title="Force expanded ids" expandedIds={['Chicago White Sox']} />
    );

    expectTeamToBeExpanded('Chicago White Sox');

    rerender(
      <HierarchyList
        items={items}
        title="Force expanded ids"
        expandedIds={['Chicago White Sox', 'New York Yankees']}
      />
    );

    expectTeamToBeExpanded('Chicago White Sox');
    expectTeamToBeExpanded('New York Yankees');

    rerender(
      <HierarchyList items={items} title="Force expanded ids" expandedIds={['Houston Astros']} />
    );

    expectTeamToBeExpanded('Houston Astros');
    expectTeamNotToBeExpanded('Chicago White Sox');
    expectTeamNotToBeExpanded('New York Yankees');

    rerender(<HierarchyList items={items} title="Force expanded ids" expandedIds={[]} />);

    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  describe('isVirtualList', () => {
    beforeEach(() => {
      jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
        height: 800,
      }));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should maintain the current page when page size changes', () => {
      const listItems = getListItems(20);
      const { rerender } = render(
        <HierarchyList title="Test List" items={listItems} pageSize="lg" isVirtualList />
      );

      expect(screen.getByText('Item 9')).toBeVisible();
      userEvent.click(screen.getByRole('button', { name: 'Next page' }));
      expect(screen.getByText('Item 19')).toBeVisible();

      rerender(<HierarchyList title="Test List" items={listItems} pageSize="sm" isVirtualList />);

      expect(screen.getByText('Page 2')).toBeVisible();
      expect(screen.getByText('Item 9')).toBeVisible();
    });

    it('should uncheck children when the parent is unchecked.', () => {
      const onSelect = jest.fn();
      const { container } = render(
        <HierarchyList
          items={items}
          title="Hierarchy List"
          editingStyle={EditingStyle.MultipleNesting}
          onSelect={onSelect}
          isVirtualList
        />
      );

      userEvent.click(screen.getByTestId('Atlanta Braves-checkbox'));
      expect(onSelect).toHaveBeenCalled();
      expect(screen.getByText('10 items selected')).toBeVisible();
      userEvent.click(screen.getByTestId('Atlanta Braves-checkbox'));
      expect(onSelect).toHaveBeenCalled();
      expect(screen.queryByText('10 items selected')).toBeNull();
      expect(container.querySelectorAll('input[checked]').length).toBe(0);
    });

    it('should not selected a locked row when parent selected', () => {
      const onSelect = jest.fn();
      render(
        <HierarchyList
          items={items}
          title="Hierarchy List"
          editingStyle={EditingStyle.MultipleNesting}
          lockedIds={['Atlanta Braves_Dansby Swanson']}
          defaultExpandedIds={['Atlanta Braves']}
          onSelect={onSelect}
          isVirtualList
        />
      );

      userEvent.click(screen.getByTestId('Atlanta Braves-checkbox'));
      expect(onSelect).toHaveBeenCalled();
      expect(screen.getByText('9 items selected')).toBeVisible();
      userEvent.click(screen.getByTestId('Atlanta Braves-checkbox'));
      expect(onSelect).toHaveBeenCalled();
      expect(screen.queryByText('9 items selected')).toBeNull();
      expect(screen.getByTestId('Atlanta Braves_Dansby Swanson-checkbox')).not.toBeChecked();
    });

    it('should force ids to be expanded when expandedIds is passed', () => {
      const expectTeamToBeExpanded = (id) => {
        expect(
          within(screen.getByTitle(id).closest(`.${iotPrefix}--list-item`)).getByLabelText('Close')
        ).toBeVisible();
      };

      const expectTeamNotToBeExpanded = (id) => {
        expect(
          within(screen.getByTitle(id).closest(`.${iotPrefix}--list-item`)).queryByLabelText(
            'Close'
          )
        ).toBeNull();
      };

      const { rerender } = render(
        <HierarchyList
          items={items}
          title="Force expanded ids"
          expandedIds={['Chicago White Sox']}
          isVirtualList
        />
      );

      expectTeamToBeExpanded('Chicago White Sox');

      rerender(
        <HierarchyList
          items={items}
          title="Force expanded ids"
          expandedIds={['Chicago White Sox', 'New York Yankees']}
          isVirtualList
        />
      );

      expectTeamToBeExpanded('Chicago White Sox');
      expectTeamToBeExpanded('New York Yankees');

      rerender(
        <HierarchyList
          items={items}
          title="Force expanded ids"
          expandedIds={['Houston Astros']}
          isVirtualList
        />
      );

      expectTeamToBeExpanded('Houston Astros');
      expectTeamNotToBeExpanded('Chicago White Sox');
      expectTeamNotToBeExpanded('New York Yankees');

      rerender(
        <HierarchyList items={items} title="Force expanded ids" expandedIds={[]} isVirtualList />
      );

      expect(screen.queryByLabelText('Close')).toBeNull();
    });
  });

  it('should show custom empty state when given', () => {
    const { rerender } = render(
      <HierarchyList items={[]} title="Empty List" emptyState="__custom-empty-state__" />
    );

    expect(screen.getByText('__custom-empty-state__')).toBeVisible();

    rerender(
      <HierarchyList items={[]} title="Empty List" emptyState={<div>A CUSTOM EMPTY NODE</div>} />
    );

    expect(screen.getByText('A CUSTOM EMPTY NODE')).toBeVisible();
  });

  it('should reset pagination and search when data changes', () => {
    const { rerender } = render(
      <HierarchyList items={getListItems(100)} hasSearch title="Changing List" pageSize="sm" />
    );

    userEvent.type(screen.getByPlaceholderText('Enter a value'), '5');
    expect(screen.getByTitle('Item 5')).toBeVisible();
    expect(screen.getByTitle('Item 15')).toBeVisible();
    expect(screen.getByTitle('Item 25')).toBeVisible();
    expect(screen.getByTitle('Item 35')).toBeVisible();
    expect(screen.getByTitle('Item 45')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Page 2')).toBeVisible();
    expect(screen.getByTitle('Item 50')).toBeVisible();
    expect(screen.getByTitle('Item 51')).toBeVisible();
    expect(screen.getByTitle('Item 52')).toBeVisible();
    expect(screen.getByTitle('Item 53')).toBeVisible();
    expect(screen.getByTitle('Item 54')).toBeVisible();
    rerender(<HierarchyList items={getListItems(50)} title="Changing List" pageSize="sm" />);
    expect(screen.getByText('Page 1')).toBeVisible();
    expect(screen.getByTitle('Item 1')).toBeVisible();
    expect(screen.getByTitle('Item 2')).toBeVisible();
    expect(screen.getByTitle('Item 3')).toBeVisible();
    expect(screen.getByTitle('Item 4')).toBeVisible();
    expect(screen.getByTitle('Item 5')).toBeVisible();
  });
});
