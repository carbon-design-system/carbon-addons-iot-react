import React from 'react';
import { mount } from '@cypress/react';

import { DragAndDrop, EditingStyle } from '../../../utils/DragAndDropUtils';

import ListContent from './ListContent';

describe('List', () => {
  it('should fallback to default drag and drop callbacks when none provided', () => {
    const itemWillMove = cy.spy(ListContent.defaultProps, 'itemWillMove');
    const onItemMoved = cy.spy(ListContent.defaultProps, 'onItemMoved');
    mount(
      <DragAndDrop>
        <ListContent
          editingStyle={EditingStyle.Single}
          items={[
            {
              id: 'one',
              content: {
                value: 'Item 1',
              },
            },
            {
              id: 'two',
              content: {
                value: 'Item 2',
              },
            },
            {
              id: 'three',
              content: {
                value: 'Item 3',
              },
            },
          ]}
        />
      </DragAndDrop>
    );

    cy.findAllByText('Item 1')
      .eq(1)
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .should(() => {
        expect(itemWillMove).to.be.calledWith('one', 'three', 'below');
        expect(onItemMoved).to.be.calledWith('one', 'three', 'below');
      });
  });
});
