import React from 'react';
import { mount } from '@cypress/react';

import HierarchyList from './HierarchyList';

const sampleHierarchy = {
  MLB: {
    'American League': {
      'Chicago White Sox': {
        'Leury Garcia': 'CF',
        'Yoan Moncada': '3B',
        'Jose Abreu': '1B',
      },
    },
    'National League': {
      'New York Mets': {
        'Amed Rosario': 'SS',
        'Michael Conforto is a super duper long name that will get cut off': 'RF',
        'Pete Alonso': '1B',
      },
    },
  },
};

const getInitialItems = () => [
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
      },
      isSelectable: true,
    })),
  })),
];

describe('HierarchyList', () => {
  it('handles drag and drop above and below with no selections', () => {
    const onSelect = cy.stub();
    const onListUpdated = cy.stub();
    mount(
      <div style={{ width: 400, height: 600 }}>
        <HierarchyList
          title="MLB Expanded List"
          items={getInitialItems()}
          editingStyle="single-nesting"
          pageSize="lg"
          isLoading={false}
          isLargeRow={false}
          onListUpdated={onListUpdated}
          hasSearch
          hasDeselection
          onSelect={onSelect}
          defaultExpandedIds={['New York Mets']}
        />
      </div>
    );

    // expect Pete in position 5 and Amed in position 3 (zero-based-index)
    cy.get('.iot--list-item').eq(4).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(2).find('[title]').should('have.text', 'Amed Rosario');

    // Select Pete and drag above to Amed (one-based-index)
    cy.findByTitle('Pete Alonso')
      .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // expect Pete in position 3 and Amed in position 4 (zero-based-index)
    cy.get('.iot--list-item').eq(2).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(3).find('[title]').should('have.text', 'Amed Rosario');

    // drag michael to the bottom of the list.
    cy.findByTitle('Michael Conforto is a super duper long name that will get cut off')
      .drag(':nth-child(5) > [draggable="true"]', { position: 'bottom' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // expect Michael to be in position 5
    cy.get('.iot--list-item')
      .eq(4)
      .find('[title]')
      .should('have.text', 'Michael Conforto is a super duper long name that will get cut off');
  });

  it('handles drag and drop with a selection', () => {
    const onSelect = cy.stub();
    const onListUpdated = cy.stub();
    mount(
      <div style={{ width: 400, height: 600 }}>
        <HierarchyList
          title="MLB Expanded List"
          items={getInitialItems()}
          defaultSelectedId="New York Mets_Pete Alonso"
          editingStyle="single-nesting"
          pageSize="lg"
          isLoading={false}
          isLargeRow={false}
          onListUpdated={onListUpdated}
          hasSearch
          hasDeselection
          onSelect={onSelect}
        />
      </div>
    );

    // expect Pete in position 5 and Amed in position 3 (zero-based-index)
    cy.get('.iot--list-item').eq(4).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(2).find('[title]').should('have.text', 'Amed Rosario');

    // Select Pete and drag above to Amed (one-based-index)
    cy.findByTitle('Pete Alonso')
      .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // expect Pete in position 3 and Amed in position 4 (zero-based-index)
    cy.get('.iot--list-item').eq(2).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(3).find('[title]').should('have.text', 'Amed Rosario');
  });

  it('handles drag and drop on-top to create a new category with single-nesting', () => {
    const onSelect = cy.stub();
    const onListUpdated = cy.stub();
    mount(
      <div style={{ width: 400, height: 600 }}>
        <HierarchyList
          title="MLB Expanded List"
          items={getInitialItems()}
          defaultSelectedId="New York Mets_Pete Alonso"
          editingStyle="single-nesting"
          pageSize="lg"
          isLoading={false}
          isLargeRow={false}
          onListUpdated={onListUpdated}
          hasSearch
          hasDeselection
          onSelect={onSelect}
        />
      </div>
    );

    // expect Pete in position 5 and Amed in position 3 (zero-based-index)
    cy.get('.iot--list-item').eq(4).find('[title]').should('have.text', 'Pete Alonso');

    // Select Pete and drag him to Amed (one-based-index)
    cy.findByTitle('Pete Alonso')
      .drag(':nth-child(4) > [draggable="true"]', { position: 'left' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // open the newly created nesting
    cy.findAllByTestId('expand-icon').eq(2).click();

    // expect Pete in position 4 and Amed in position 5 (zero-based-index)
    cy.get('.iot--list-item').eq(4).find('[title]').should('have.text', 'Pete Alonso');
  });

  it('handles drag and drop into a category with multiple-nesting', () => {
    const onSelect = cy.stub();
    const onListUpdated = cy.stub();
    mount(
      <div style={{ width: 400, height: 600 }}>
        <HierarchyList
          title="MLB Expanded List"
          items={getInitialItems()}
          defaultSelectedId="New York Mets_Pete Alonso"
          editingStyle="multiple-nesting"
          pageSize="lg"
          isLoading={false}
          isLargeRow={false}
          onListUpdated={onListUpdated}
          hasSearch
          hasDeselection
          onSelect={onSelect}
        />
      </div>
    );

    // expect Pete in position 5 and Amed in position 3 (zero-based-index)
    cy.get('.iot--list-item').eq(4).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(2).find('[title]').should('have.text', 'Amed Rosario');

    // select Amed to move him, too.
    cy.findByTestId('New York Mets_Amed Rosario-checkbox').click({ force: true });

    // Select Pete and drag him to the Chicago White Sox (one-based-index)
    cy.findByTitle('Pete Alonso')
      .drag(':nth-child(1) > [draggable="true"]', { position: 'left' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    cy.findAllByTestId('expand-icon').eq(0).click();

    // expect Pete in position 3 and Amed in position 2 (zero-based-index)
    cy.get('.iot--list-item').eq(1).find('[title]').should('have.text', 'Amed Rosario');
    cy.get('.iot--list-item').eq(2).find('[title]').should('have.text', 'Pete Alonso');
  });
});
