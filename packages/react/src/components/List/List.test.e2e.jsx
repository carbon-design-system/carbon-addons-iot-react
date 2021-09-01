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
    const onListUpdated = cy.stub();
    const itemWillMove = cy.stub().returns(false);
    mount(
      <List
        title="Simple list"
        hasSearch
        items={getListItems(3)}
        pageSize="sm"
        editingStyle={EditingStyle.Single}
        onListUpdated={onListUpdated}
        itemWillMove={itemWillMove}
      />
    );

    cy.findAllByText('Item 1')
      .eq(1)
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .should(() => {
        expect(itemWillMove).to.be.calledWith('1', '3', 'below');
        expect(onListUpdated).not.to.be.called;
      });
  });
});
