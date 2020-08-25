import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';

import { sampleHierarchy } from '../List.story';
import { DropLocation, EditingStyle, moveItemsInList } from '../../../utils/DragAndDropUtils';

import HierarchyListReorderModal from './HierarchyListReorderModal';

describe('HierarchyListReorderModal', () => {
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

  it('modal hides selected items', () => {
    const selectedIds = [items[0].id, items[2].id];

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
      />
    );

    const itemSelectedText = screen.queryByText(items[0].content.value);
    const itemSelectedTwoText = screen.queryByText(items[2].content.value);

    const breadcrumbs = screen.queryByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).queryByText('All rows')).toBeInTheDOM();

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
      />
    );

    // Clicks the top item in the radio button group
    const itemToSelect = screen.queryAllByRole('button')[2];
    fireEvent.click(itemToSelect);

    const breadcrumbs = screen.queryByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).queryByText('All rows')).toBeInTheDOM();
    expect(within(breadcrumbs).queryByText(items[1].content.value)).toBeInTheDOM();
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
      />
    );

    // Clicks the top item in the radio button group
    const itemToSelect = screen.queryAllByRole('button')[2];
    fireEvent.click(itemToSelect);

    const breadcrumbs = screen.queryByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).queryByText('All rows')).toBeInTheDOM();
    expect(within(breadcrumbs).queryByText(items[1].content.value)).toBeInTheDOM();

    // Selects the current breadcrumb
    const thirdBreadCrumb = screen.queryAllByRole('button')[3];
    fireEvent.click(thirdBreadCrumb);

    const updatedBreadCrumbs = screen.queryByTestId('modal-breadcrumb');
    expect(within(updatedBreadCrumbs).queryByText('All rows')).toBeInTheDOM();
    expect(within(updatedBreadCrumbs).queryByText(items[1].content.value)).toBeInTheDOM();
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
      />
    );

    // Clicks the top item in the radio button group
    const itemToSelect = screen.queryAllByRole('button')[2];
    fireEvent.click(itemToSelect);

    // Clicks the top item in the radio button group again
    const secondItemToSelect = screen.queryAllByRole('button')[3];
    fireEvent.click(secondItemToSelect);

    const breadcrumbs = screen.queryByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).queryByText('All rows')).toBeInTheDOM();
    expect(within(breadcrumbs).queryByText(newList[0].content.value)).toBeInTheDOM();
    expect(within(breadcrumbs).queryByText(newList[0].children[0].content.value)).toBeInTheDOM();

    fireEvent.click(within(breadcrumbs).queryAllByRole('button')[1]);

    const updatedBreadCrumbs = screen.queryByTestId('modal-breadcrumb');

    expect(within(updatedBreadCrumbs).queryByText('All rows')).toBeInTheDOM();
    expect(within(updatedBreadCrumbs).queryByText(newList[0].content.value)).toBeInTheDOM();
    expect(within(updatedBreadCrumbs).queryByText(newList[0].children[0].content.value)).toBeNull();
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
      />
    );

    // Clicks the top item in the radio button group
    const itemToSelect = screen.queryAllByRole('button')[2];
    fireEvent.click(itemToSelect);

    const breadcrumbs = screen.queryByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).queryByText('All rows')).toBeInTheDOM();
    expect(within(breadcrumbs).queryByText(items[1].content.value)).toBeInTheDOM();

    const allItemsButton = screen.queryAllByRole('button')[1];

    fireEvent.click(allItemsButton);

    const breadcrumbsRerender = screen.queryByTestId('modal-breadcrumb');
    expect(within(breadcrumbsRerender).queryByText('All rows')).toBeInTheDOM();
    expect(within(breadcrumbsRerender).queryByText(items[1].content.value)).toBeNull();
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
        onSubmit={id => {
          dropId = id;
        }}
      />
    );

    const saveButton = screen.queryAllByRole('button')[8];

    const radioButtons = screen.queryAllByRole('radio');

    fireEvent.click(radioButtons[0]);

    fireEvent.click(saveButton);

    expect(dropId).toEqual(items[1].id);
  });

  it('clicking row without child selects row instead', () => {
    const selectedIds = [items[0].id];
    let dropId = null;

    render(
      <HierarchyListReorderModal
        items={items}
        title="Hierarchy List Reorder Modal"
        editingStyle={EditingStyle.MultipleNesting}
        selectedIds={selectedIds}
        open
        onSubmit={id => {
          dropId = id;
        }}
      />
    );

    const saveButton = screen.queryAllByRole('button')[8];

    // Clicks the top item in the radio button group
    const itemToSelect = screen.queryAllByRole('button')[2];
    fireEvent.click(itemToSelect);

    // Clicks the top item in the radio button group again
    const secondItemToSelect = screen.queryAllByRole('button')[3];
    fireEvent.click(secondItemToSelect);

    const breadcrumbs = screen.queryByTestId('modal-breadcrumb');

    expect(within(breadcrumbs).queryByText('All rows')).toBeInTheDOM();
    expect(within(breadcrumbs).queryByText(items[1].content.value)).toBeInTheDOM();
    expect(within(breadcrumbs).queryByText(items[2].content.value)).toBeNull();

    fireEvent.click(saveButton);

    expect(dropId).toEqual(items[1].children[0].id);
  });
});
