import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../constants/Settings';
import { sampleHierarchy } from '../List.story';
import { DropLocation, EditingStyle, moveItemsInList } from '../../../utils/DragAndDropUtils';

import HierarchyListReorderModal from './HierarchyListReorderModal/HierarchyListReorderModal';

const { iotPrefix } = settings;

describe('HierarchyListReorderModal', () => {
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

  it('modal hides selected items', () => {
    const selectedIds = [items[0].id, items[2].id];

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onClose={jest.fn()}
      />
    );

    const itemSelectedText = screen.queryByText('Chicago White Sox');
    const itemSelectedTwoText = screen.queryByText('Houston Astros');

    const breadcrumbs = screen.getByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).getByText('All rows')).toBeDefined();

    expect(itemSelectedText).toBeNull();
    expect(itemSelectedTwoText).toBeNull();
  });

  it('clicking text updates breadcrumbs', () => {
    const selectedIds = [items[0].id];

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onClose={jest.fn()}
      />
    );

    // Clicks the top item in the radio button group
    userEvent.click(screen.getByRole('button', { name: 'New York Yankees' }));

    const breadcrumbs = screen.getByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).getByText('All rows')).toBeVisible();
    expect(within(breadcrumbs).getByText('New York Yankees')).toBeVisible();
  });

  it('clicking current breadcrumb does not update the view', () => {
    const selectedIds = [items[0].id];

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onClose={jest.fn()}
      />
    );

    // Clicks the top item in the radio button group
    userEvent.click(screen.getByRole('button', { name: 'New York Yankees' }));

    const breadcrumbs = screen.getByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).getByText('All rows')).toBeVisible();
    expect(within(breadcrumbs).getByText('New York Yankees')).toBeVisible();

    // Selects the current breadcrumb
    userEvent.click(screen.getByRole('button', { name: 'DJ LeMahieu' }));

    const updatedBreadCrumbs = screen.getByTestId('modal-breadcrumb');
    expect(within(updatedBreadCrumbs).getByText('All rows')).toBeVisible();
    expect(within(updatedBreadCrumbs).getByText('New York Yankees')).toBeVisible();
  });

  it('clicking parent breadcrumb updates the view', () => {
    const newList = moveItemsInList(items, [items[1].id], items[0].id, DropLocation.Nested);

    const selectedIds = [newList[1].id];

    render(
      <HierarchyListReorderModal
        items={newList}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onClose={jest.fn()}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'Chicago White Sox' }));
    userEvent.click(screen.getByRole('button', { name: 'New York Yankees' }));

    const breadcrumbs = screen.getByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).getByText('All rows')).toBeVisible();
    expect(within(breadcrumbs).getByText('Chicago White Sox')).toBeVisible();
    expect(within(breadcrumbs).getByText('New York Yankees')).toBeVisible();

    userEvent.click(within(breadcrumbs).getByRole('button', { name: 'Chicago White Sox' }));

    const updatedBreadCrumbs = screen.getByTestId('modal-breadcrumb');

    expect(within(updatedBreadCrumbs).getByText('All rows')).toBeVisible();
    expect(within(updatedBreadCrumbs).getByText('Chicago White Sox')).toBeVisible();
    expect(within(updatedBreadCrumbs).queryByText('New York Yankees')).toBeNull();
  });

  it('clicking all rows updates resets view', () => {
    const selectedIds = [items[0].id];

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onClose={jest.fn()}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'New York Yankees' }));

    const breadcrumbs = screen.getByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).getByText('All rows')).toBeVisible();
    expect(within(breadcrumbs).getByText('New York Yankees')).toBeVisible();

    userEvent.click(screen.getByRole('button', { name: 'All rows' }));

    const breadcrumbsRerender = screen.getByTestId('modal-breadcrumb');
    expect(within(breadcrumbsRerender).getByText('All rows')).toBeVisible();
    expect(within(breadcrumbsRerender).queryByText('New York Yankees')).toBeNull();
  });

  it('clicking radio button returns correct drop id', () => {
    const selectedIds = [items[0].id];
    let dropId = null;

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onSubmit={(id) => {
          dropId = id;
        }}
        onClose={jest.fn()}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });

    const radioButtons = screen.queryAllByRole('radio');

    userEvent.click(radioButtons[0]);

    userEvent.click(saveButton);

    expect(dropId).toEqual(items[1].id);
  });

  it('clicking row without child selects row instead', async () => {
    const selectedIds = [items[0].id];
    let dropId = null;

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onSubmit={(id) => {
          dropId = id;
        }}
        onClose={jest.fn()}
      />
    );

    // Clicks the top item in the radio button group
    userEvent.click(screen.getByRole('button', { name: 'New York Yankees' }));

    // Clicks the top item in the radio button group again
    const secondItemToSelect = screen.getByRole('button', { name: 'DJ LeMahieu' });

    userEvent.tab({ focusTrap: secondItemToSelect });
    await userEvent.type(secondItemToSelect, '{enter}');

    const breadcrumbs = screen.queryByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).queryByText('All rows')).toBeDefined();
    expect(within(breadcrumbs).queryByText('New York Yankees')).toBeDefined();
    expect(within(breadcrumbs).queryByText('Houston Astros')).toBeNull();

    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(dropId).toEqual(items[1].children[0].id);
  });

  it('should do nothing when clicking the current breadcrumb', () => {
    const selectedIds = [items[0].id, items[2].id];

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onClose={jest.fn()}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'All rows' }));

    const allRowsBreadcrumb = screen.getByRole('button', { name: 'All rows' });
    expect(allRowsBreadcrumb).toBeVisible();
    expect(allRowsBreadcrumb).toHaveClass(
      `${iotPrefix}--hierarchy-list-bulk-modal--breadcrumb-button`
    );
    userEvent.click(screen.getByRole('button', { name: 'All rows' }));

    const breadcrumbs = screen.getByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).getByText('All rows')).toBeVisible();
  });
});
