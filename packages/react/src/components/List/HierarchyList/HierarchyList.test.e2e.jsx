import React, { useState } from 'react';
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
      'New York Yankees': {
        'DJ LeMahieu': '2B',
        'Luke Voit': '1B',
        'Gary Sanchez': 'C',
        'Kendrys Morales': 'DH',
        'Gleyber Torres': 'SS',
        'Clint Frazier': 'RF',
        'Brett Gardner': 'LF',
        'Gio Urshela': '3B',
        'Cameron Maybin': 'RF',
        'Robinson Cano': '2B',
      },
      'Houston Astros': {
        'George Springer': 'RF',
        'Jose Altuve': '2B',
        'Michael Brantley': 'LF',
        'Alex Bregman': '3B',
        'Yuli Gurriel': '1B',
        'Yordan Alvarez': 'DH',
        'Carlos Correa': 'SS',
        'Robinson Chirinos': 'C',
        'Josh Reddick': 'CF',
      },
    },
    'National League': {
      'Atlanta Braves': {
        'Ronald Acuna Jr.': 'CF',
        'Dansby Swanson': 'SS',
        'Freddie Freeman': '1B',
        'Josh Donaldson': '3B',
        'Nick Markakis': 'RF',
        'Austin Riley': 'LF',
        'Brian McCann': 'C',
        'Ozzie Albies': '2B',
        'Kevin Gausman': 'P',
      },
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
      'Washington Nationals': {
        'Trea Turner': 'SS',
        'Adam Eaton': 'RF',
        'Anthony Rendon': '3B',
        'Juan Soto': 'LF',
        'Howie Kendrick': '2B',
        'Ryan Zimmerman': '1B',
        'Yian Gomes': 'C',
        'Victor Robles': 'CF',
        'Max Scherzer': 'P',
      },
    },
  },
};

describe('HierarchyList', () => {
  it('handles drag and drop with no selections', () => {
    const onSelect = cy.stub();
    const HierarchyListWithReorder = () => {
      const [items, setItems] = useState([
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
      ]);

      return (
        <div style={{ width: 400, height: 600 }}>
          <HierarchyList
            title="MLB Expanded List"
            items={items}
            editingStyle="single-nesting"
            pageSize="lg"
            isLoading={false}
            isLargeRow={false}
            onListUpdated={(updatedItems) => {
              setItems(updatedItems);
            }}
            hasSearch
            hasDeselection
            onSelect={onSelect}
            defaultExpandedIds={['New York Mets']}
          />
        </div>
      );
    };

    mount(<HierarchyListWithReorder />);
    cy.get('.iot--list-item').eq(8).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(6).find('[title]').should('have.text', 'Amed Rosario');
    cy.get(':nth-child(9) > [draggable="true"]').drag(':nth-child(7) > [draggable="true"]');
    cy.get('.iot--list-item').eq(6).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(7).find('[title]').should('have.text', 'Amed Rosario');
  });

  it('handles drag and drop with a selection', () => {
    const onSelect = cy.stub();
    const HierarchyListWithReorder = () => {
      const [items, setItems] = useState([
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
      ]);

      return (
        <div style={{ width: 400, height: 600 }}>
          <HierarchyList
            title="MLB Expanded List"
            items={items}
            defaultSelectedId="New York Mets_Pete Alonso"
            editingStyle="single-nesting"
            pageSize="lg"
            isLoading={false}
            isLargeRow={false}
            onListUpdated={(updatedItems) => {
              setItems(updatedItems);
            }}
            hasSearch
            hasDeselection
            onSelect={onSelect}
          />
        </div>
      );
    };

    mount(<HierarchyListWithReorder />);
    cy.get('.iot--list-item').eq(8).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(6).find('[title]').should('have.text', 'Amed Rosario');
    cy.get(':nth-child(9) > [draggable="true"]').drag(':nth-child(7) > [draggable="true"]');
    cy.get('.iot--list-item').eq(6).find('[title]').should('have.text', 'Pete Alonso');
    cy.get('.iot--list-item').eq(7).find('[title]').should('have.text', 'Amed Rosario');
  });
});
