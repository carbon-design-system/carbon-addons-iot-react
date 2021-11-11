import React from 'react';
import { mount } from '@cypress/react';

import { EditingStyle } from '../../utils/DragAndDropUtils';

import List from './List';

const getListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: `${idx + 1}`,
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

describe('List', () => {
  it('should not move items on a list if itemWillMove return false', () => {
    const itemWillMove = cy.stub().returns(false);
    const onItemMoved = cy.stub();
    mount(
      <List
        title="Simple list"
        hasSearch
        items={getListItems(3)}
        pageSize="sm"
        editingStyle={EditingStyle.Single}
        itemWillMove={itemWillMove}
      />
    );

    cy.findAllByText('Item 1')
      .eq(1)
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .should(() => {
        expect(itemWillMove).to.be.calledWith('1', '3', 'below');
        expect(onItemMoved).not.to.be.called;
      });
  });

  it('should move items on a list if itemWillMove returns true', () => {
    const onItemMoved = cy.stub();
    mount(
      <List
        title="Simple list"
        hasSearch
        items={getListItems(3)}
        pageSize="sm"
        editingStyle={EditingStyle.Single}
        onItemMoved={onItemMoved}
      />
    );

    cy.findAllByText('Item 1')
      .eq(1)
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .should(() => {
        expect(onItemMoved).to.be.calledWith('1', '3', 'below');
      });
  });

  it('should restrict drop targets to item ids returned by getAllowedDropIds', () => {
    const onItemMoved = cy.stub();
    const getAllowedDropIds = cy.stub().returns(['2']);

    mount(
      <List
        title="Simple list"
        hasSearch
        items={getListItems(3)}
        pageSize="sm"
        editingStyle={EditingStyle.Single}
        onItemMoved={onItemMoved}
        getAllowedDropIds={getAllowedDropIds}
      />
    );

    // Drop below item with id "2" is allowed according to getAllowedDropIds
    cy.findAllByText('Item 1')
      .eq(1)
      .drag(':nth-child(2) > [draggable="true"]', { position: 'bottom' })
      .should(() => {
        expect(getAllowedDropIds).to.be.calledWith('1');
        expect(onItemMoved).to.be.calledWith('1', '2', 'below');
      });

    // Drop below item with id "3" is NOT allowed according to getAllowedDropIds
    cy.findAllByText('Item 1')
      .eq(1)
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .should(() => {
        expect(onItemMoved).not.to.be.calledWith('1', '3', 'below');
      });
  });

  describe('isVirtualList', () => {
    it('should not move items on a list if itemWillMove return false', () => {
      const itemWillMove = cy.stub().returns(false);
      const onItemMoved = cy.stub();
      mount(
        <List
          title="Simple list"
          hasSearch
          items={getListItems(3)}
          pageSize="sm"
          editingStyle={EditingStyle.Single}
          itemWillMove={itemWillMove}
          onItemMoved={onItemMoved}
          isVirtualList
        />
      );

      cy.findAllByText('Item 1')
        .eq(1)
        .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
        .should(() => {
          expect(itemWillMove).to.be.calledWith('1', '3', 'below');
          expect(onItemMoved).not.to.be.called;
        });
    });

    it('should move items on a list if itemWillMove returns true', () => {
      cy.spy(List.defaultProps, 'onItemMoved');
      mount(
        <List
          title="Simple list"
          hasSearch
          items={getListItems(3)}
          pageSize="sm"
          editingStyle={EditingStyle.Single}
          isVirtualList
        />
      );

      cy.findAllByText('Item 1')
        .eq(1)
        .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
        .should(() => {
          expect(List.defaultProps.onItemMoved).to.be.calledWith('1', '3', 'below');
        });
    });

    it('should restrict drop targets to item ids returned by getAllowedDropIds', () => {
      const onItemMoved = cy.stub();
      const getAllowedDropIds = cy.stub().returns(['2']);
      mount(
        <List
          title="Simple list"
          hasSearch
          items={getListItems(3)}
          pageSize="sm"
          editingStyle={EditingStyle.Single}
          onItemMoved={onItemMoved}
          getAllowedDropIds={getAllowedDropIds}
          isVirtualList
        />
      );

      // Drop below item with id "2" is allowed according to getAllowedDropIds
      cy.findAllByText('Item 1')
        .eq(1)
        .drag(':nth-child(2) > [draggable="true"]', { position: 'bottom' })
        .should(() => {
          expect(getAllowedDropIds).to.be.calledWith('1');
          expect(onItemMoved).to.be.calledWith('1', '2', 'below');
        });

      // Drop below item with id "3" is NOT allowed according to getAllowedDropIds
      cy.findAllByText('Item 1')
        .eq(1)
        .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
        .should(() => {
          expect(onItemMoved).not.to.be.calledWith('1', '3', 'below');
        });
    });
  });
});
