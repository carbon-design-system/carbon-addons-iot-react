import React from 'react';
import { mount } from '@cypress/react';

import { EditingStyle } from '../../../utils/DragAndDropUtils';

import SimpleList from './SimpleList';

const getListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: `${idx + 1}`,
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

describe('SimpleList', () => {
  it('handles drag and drop above and below with no selections', () => {
    const onListUpdated = cy.stub();
    mount(
      <SimpleList
        title="Simple list"
        hasSearch
        items={getListItems(3)}
        pageSize="sm"
        editingStyle={EditingStyle.Multiple}
        onListUpdated={onListUpdated}
      />
    );

    cy.findByTestId('1-checkbox').click({ force: true });
    cy.findByTestId('2-checkbox').click({ force: true });
    cy.findAllByText('Item 1')
      .eq(1)
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .should(() => {
        expect(onListUpdated).to.be.calledWith([
          {
            id: '3',
            content: {
              value: 'Item 3',
            },
            isSelectable: true,
            children: [],
          },
          {
            id: '1',
            content: {
              value: 'Item 1',
            },
            isSelectable: true,
          },
          {
            id: '2',
            content: {
              value: 'Item 2',
            },
            isSelectable: true,
          },
        ]);
      });
  });

  it("handles calls the default onListUpdated when one isn't provided", () => {
    const onListUpdated = cy.spy(SimpleList.defaultProps, 'onListUpdated');
    mount(
      <SimpleList
        title="Simple list"
        hasSearch
        items={getListItems(3)}
        pageSize="sm"
        editingStyle={EditingStyle.Multiple}
      />
    );

    cy.findByTestId('1-checkbox').click({ force: true });
    cy.findByTestId('2-checkbox').click({ force: true });
    cy.findAllByText('Item 1')
      .eq(1)
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .should(() => {
        expect(onListUpdated).to.be.calledWith([
          {
            id: '3',
            content: {
              value: 'Item 3',
            },
            isSelectable: true,
            children: [],
          },
          {
            id: '1',
            content: {
              value: 'Item 1',
            },
            isSelectable: true,
          },
          {
            id: '2',
            content: {
              value: 'Item 2',
            },
            isSelectable: true,
          },
        ]);
      });
  });
});
