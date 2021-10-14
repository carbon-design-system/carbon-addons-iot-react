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
  });
});
