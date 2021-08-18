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
        'Welington Castillo': 'C',
        'Eloy Jimenez': 'LF',
        'Charlie Tilson': 'RF',
        'Tim Anderson': 'SS',
        'Yolmer Sanchez': '2B',
        'Dylan Covey': 'P',
      },
    },
    'National League': {
      'New York Mets': {
        'Jeff McNeil': '3B',
        'Amed Rosario': 'SS',
        'Michael Conforto is a super duper long name that will get cut off': 'RF',
        'Pete Alonso': '1B',
        'Wilson Ramos': 'C',
        'Robinson Cano': '2B',
        'JD Davis': 'LF',
        'Brandon Nimmo': 'CF',
        'Jacob Degrom': 'P',
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
  it('handles drag and drop with no selections', () => {
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

    // expect Pete in position 6 and Amed in position 4 (zero-based-index)
    cy.get('.iot--list-item').eq(5).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(3).find('[title]').should('have.text', 'Amed Rosario');

    // Select Pete and drag him to Amed (one-based-index)
    cy.get(':nth-child(6) > [draggable="true"]')
      .drag(':nth-child(4) > [draggable="true"]')
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // expect Pete in position 4 and Amed in position 5 (zero-based-index)
    cy.get('.iot--list-item').eq(3).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(4).find('[title]').should('have.text', 'Amed Rosario');
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

    // expect Pete in position 6 and Amed in position 4 (zero-based-index)
    cy.get('.iot--list-item').eq(5).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(3).find('[title]').should('have.text', 'Amed Rosario');

    // Select Pete and drag him to Amed (one-based-index)
    cy.get(':nth-child(6) > [draggable="true"]')
      .drag(':nth-child(4) > [draggable="true"]')
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // expect Pete in position 4 and Amed in position 5 (zero-based-index)
    cy.get('.iot--list-item').eq(3).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(4).find('[title]').should('have.text', 'Amed Rosario');
  });
});
