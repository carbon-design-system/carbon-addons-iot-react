import React from 'react';
import { mount } from '@cypress/react';

import { settings } from '../../../constants/Settings';
import { EditingStyle } from '../../../utils/DragAndDropUtils';

import HierarchyList from './HierarchyList';

const { iotPrefix } = settings;

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

const getListItems = (num) =>
  Array(num)
    .fill(0)
    .map((i, idx) => ({
      id: (idx + 1).toString(),
      content: { value: `Item ${idx + 1}` },
      isSelectable: true,
    }));

describe('HierarchyList', () => {
  it('handles drag and drop above and below with no selections', () => {
    const onSelect = cy.stub();
    const onListUpdated = cy.stub();
    mount(
      <div style={{ width: 400, height: 600 }}>
        <HierarchyList
          title="MLB Expanded List"
          items={getInitialItems()}
          editingStyle={EditingStyle.SingleNesting}
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
    cy.get(`.${iotPrefix}--list-item`).eq(4).find('[title]').should('have.text', 'Pete Alonso');
    cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Amed Rosario');

    // Select Pete and drag above to Amed (one-based-index)
    cy.findByTitle('Pete Alonso')
      .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // expect Pete in position 3 and Amed in position 4 (zero-based-index)
    cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Pete Alonso');
    cy.get(`.${iotPrefix}--list-item`).eq(3).find('[title]').should('have.text', 'Amed Rosario');

    // drag michael to the bottom of the list.
    cy.findByTitle('Michael Conforto is a super duper long name that will get cut off')
      .drag(':nth-child(5) > [draggable="true"]', { position: 'bottom' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // expect Michael to be in position 5
    cy.get(`.${iotPrefix}--list-item`)
      .eq(4)
      .find('[title]')
      .should('have.text', 'Michael Conforto is a super duper long name that will get cut off');
  });

  it('should restrict drop targets to item ids returned by getAllowedDropIds', () => {
    const onSelect = cy.stub();
    const onListUpdated = cy.stub();
    const getAllowedDropIds = cy.stub().returns(['New York Mets_Amed Rosario']);
    mount(
      <div style={{ width: 400, height: 600 }}>
        <HierarchyList
          title="MLB Expanded List"
          items={getInitialItems()}
          editingStyle={EditingStyle.SingleNesting}
          pageSize="lg"
          isLoading={false}
          isLargeRow={false}
          onListUpdated={onListUpdated}
          hasSearch
          hasDeselection
          onSelect={onSelect}
          defaultExpandedIds={['New York Mets']}
          getAllowedDropIds={getAllowedDropIds}
        />
      </div>
    );

    // expect Pete in position 5 and Amed in position 3 (zero-based-index)
    cy.get(`.${iotPrefix}--list-item`).eq(4).find('[title]').should('have.text', 'Pete Alonso');
    cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Amed Rosario');

    // Select Pete and drag above to Amed (one-based-index). 'New York Mets_Amed Rosario' is
    // an allowed drop target
    cy.findByTitle('Pete Alonso')
      .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
      .then(() => {
        expect(getAllowedDropIds).to.be.calledWith('New York Mets_Pete Alonso');
        expect(onListUpdated).to.be.called;
        onListUpdated.reset();
      });

    // expect Pete in position 3 and Amed in position 4 (zero-based-index)
    cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Pete Alonso');
    cy.get(`.${iotPrefix}--list-item`).eq(3).find('[title]').should('have.text', 'Amed Rosario');

    // try to drag and drop michael to the top of the list, it is not allowed since the only
    // drop target is 'New York Mets_Amed Rosario'
    cy.findByTitle('Michael Conforto is a super duper long name that will get cut off')
      .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
      .then(() => {
        expect(onListUpdated).not.to.be.called;
      });

    // expect Michael still to be in position 5 (zero-based-index)
    cy.get(`.${iotPrefix}--list-item`)
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
          editingStyle={EditingStyle.SingleNesting}
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
    cy.get(`.${iotPrefix}--list-item`).eq(4).find('[title]').should('have.text', 'Pete Alonso');
    cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Amed Rosario');

    // Select Pete and drag above to Amed (one-based-index)
    cy.findByTitle('Pete Alonso')
      .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // expect Pete in position 3 and Amed in position 4 (zero-based-index)
    cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Pete Alonso');
    cy.get(`.${iotPrefix}--list-item`).eq(3).find('[title]').should('have.text', 'Amed Rosario');
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
          editingStyle={EditingStyle.SingleNesting}
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
    cy.get(`.${iotPrefix}--list-item`)
      .should('be.visible')
      .then(($els) => {
        cy.wrap($els).eq(4).find('[title]').should('have.text', 'Pete Alonso');
      });

    // Select Pete and drag him to Amed (one-based-index)
    cy.findByTitle('Pete Alonso')
      .drag(':nth-child(4) > [draggable="true"]', { position: 'left' })
      .then(() => {
        expect(onListUpdated).to.be.called;
      });

    // open the newly created nesting
    cy.findAllByTestId('expand-icon').eq(2).click({ force: true });

    // expect Pete in position 4 and Amed in position 5 (zero-based-index)
    cy.get(`.${iotPrefix}--list-item`)
      .should('be.visible')
      .then(($els) => {
        cy.wrap($els).eq(4).find('[title]').should('have.text', 'Pete Alonso');
      });
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
          editingStyle={EditingStyle.MultipleNesting}
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
    cy.get(`.${iotPrefix}--list-item`)
      .should('be.visible')
      .then(($els) => {
        cy.wrap($els).eq(4).find('[title]').should('have.text', 'Pete Alonso');
        cy.wrap($els).eq(2).find('[title]').should('have.text', 'Amed Rosario');
      });

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
    cy.get(`.${iotPrefix}--list-item`)
      .should('be.visible')
      .then(($els) => {
        cy.wrap($els).eq(1).find('[title]').should('have.text', 'Amed Rosario');
        cy.wrap($els).eq(2).find('[title]').should('have.text', 'Pete Alonso');
      });
  });

  describe('isVirtualList', () => {
    it('maintains search state when drag-and-drop happens', () => {
      const onListUpdated = cy.stub();
      mount(
        <div style={{ width: 400, height: 600 }}>
          <HierarchyList
            title="Test List"
            items={getListItems(20)}
            pageSize="lg"
            onListUpdated={onListUpdated}
            editingStyle={EditingStyle.Single}
            hasSearch
            isVirtualList
          />
        </div>
      );

      cy.findByPlaceholderText('Enter a value').type('5');
      cy.findByTitle('Item 15')
        .drag(':nth-child(1) > [draggable="true"]', { position: 'top' })
        .then(() => {
          expect(onListUpdated).to.be.called;
        });
      cy.get(`.${iotPrefix}--list-item`).eq(0).find('[title]').should('have.text', 'Item 15');
      cy.get(`.${iotPrefix}--list-item`).eq(1).find('[title]').should('have.text', 'Item 5');
      cy.get(`.${iotPrefix}--list-item`).should('have.length', 2);
    });

    it('maintains page state when drag-and-drop happens', () => {
      const onListUpdated = cy.stub();
      mount(
        <div style={{ width: 400, height: 600 }}>
          <HierarchyList
            title="Test List"
            items={getListItems(10)}
            pageSize="sm"
            onListUpdated={onListUpdated}
            editingStyle={EditingStyle.Single}
            hasSearch
            isVirtualList
          />
        </div>
      );

      cy.findByRole('button', { name: 'Next page' }).click();
      cy.findByTitle('Item 9')
        .drag(':nth-child(1) > [draggable="true"]', { position: 'top' })
        .then(() => {
          expect(onListUpdated).to.be.called;
        });
      cy.get(`.${iotPrefix}--list-item`).eq(0).find('[title]').should('have.text', 'Item 9');
      cy.get(`.${iotPrefix}--list-item`).eq(1).find('[title]').should('have.text', 'Item 6');
      cy.get(`.${iotPrefix}--list-item`).should('have.length', 5);
      cy.findByText('Page 2').should('be.visible');
    });

    it('handles drag and drop above and below with no selections', () => {
      const onSelect = cy.stub();
      const onListUpdated = cy.stub();
      mount(
        <div style={{ width: 400, height: 600 }}>
          <HierarchyList
            title="MLB Expanded List"
            items={getInitialItems()}
            editingStyle={EditingStyle.SingleNesting}
            pageSize="lg"
            isLoading={false}
            isLargeRow={false}
            onListUpdated={onListUpdated}
            hasSearch
            hasDeselection
            onSelect={onSelect}
            defaultExpandedIds={['New York Mets']}
            isVirtualList
          />
        </div>
      );

      // expect Pete in position 5 and Amed in position 3 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`).eq(4).find('[title]').should('have.text', 'Pete Alonso');
      cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Amed Rosario');

      // Select Pete and drag above to Amed (one-based-index)
      cy.findByTitle('Pete Alonso')
        .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
        .then(() => {
          expect(onListUpdated).to.be.called;
        });

      // expect Pete in position 3 and Amed in position 4 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Pete Alonso');
      cy.get(`.${iotPrefix}--list-item`).eq(3).find('[title]').should('have.text', 'Amed Rosario');

      // drag michael to the bottom of the list.
      cy.findByTitle('Michael Conforto is a super duper long name that will get cut off')
        .drag(':nth-child(5) > [draggable="true"]', { position: 'bottom' })
        .then(() => {
          expect(onListUpdated).to.be.called;
        });

      // expect Michael to be in position 5
      cy.get(`.${iotPrefix}--list-item`)
        .eq(4)
        .find('[title]')
        .should('have.text', 'Michael Conforto is a super duper long name that will get cut off');
    });

    it('should restrict drop targets to item ids returned by getAllowedDropIds', () => {
      const onSelect = cy.stub();
      const onListUpdated = cy.stub();
      const getAllowedDropIds = cy.stub().returns(['New York Mets_Amed Rosario']);
      mount(
        <div style={{ width: 400, height: 600 }}>
          <HierarchyList
            title="MLB Expanded List"
            items={getInitialItems()}
            editingStyle={EditingStyle.SingleNesting}
            pageSize="lg"
            isLoading={false}
            isLargeRow={false}
            onListUpdated={onListUpdated}
            hasSearch
            hasDeselection
            onSelect={onSelect}
            defaultExpandedIds={['New York Mets']}
            getAllowedDropIds={getAllowedDropIds}
            isVirtualList
          />
        </div>
      );

      // expect Pete in position 5 and Amed in position 3 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`).eq(4).find('[title]').should('have.text', 'Pete Alonso');
      cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Amed Rosario');

      // Select Pete and drag above to Amed (one-based-index). 'New York Mets_Amed Rosario' is
      // an allowed drop target
      cy.findByTitle('Pete Alonso')
        .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
        .then(() => {
          expect(getAllowedDropIds).to.be.calledWith('New York Mets_Pete Alonso');
          expect(onListUpdated).to.be.called;
          onListUpdated.reset();
        });

      // expect Pete in position 3 and Amed in position 4 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Pete Alonso');
      cy.get(`.${iotPrefix}--list-item`).eq(3).find('[title]').should('have.text', 'Amed Rosario');

      // try to drag and drop michael to the top of the list, it is not allowed since the only
      // drop target is 'New York Mets_Amed Rosario'
      cy.findByTitle('Michael Conforto is a super duper long name that will get cut off')
        .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
        .then(() => {
          expect(onListUpdated).not.to.be.called;
        });

      // expect Michael still to be in position 5 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`)
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
            editingStyle={EditingStyle.SingleNesting}
            pageSize="lg"
            isLoading={false}
            isLargeRow={false}
            onListUpdated={onListUpdated}
            hasSearch
            hasDeselection
            onSelect={onSelect}
            isVirtualList
          />
        </div>
      );

      // expect Pete in position 5 and Amed in position 3 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`).eq(4).find('[title]').should('have.text', 'Pete Alonso');
      cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Amed Rosario');

      // Select Pete and drag above to Amed (one-based-index)
      cy.findByTitle('Pete Alonso')
        .drag(':nth-child(3) > [draggable="true"]', { position: 'top' })
        .then(() => {
          expect(onListUpdated).to.be.called;
        });

      // expect Pete in position 3 and Amed in position 4 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`).eq(2).find('[title]').should('have.text', 'Pete Alonso');
      cy.get(`.${iotPrefix}--list-item`).eq(3).find('[title]').should('have.text', 'Amed Rosario');
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
            editingStyle={EditingStyle.SingleNesting}
            pageSize="lg"
            isLoading={false}
            isLargeRow={false}
            onListUpdated={onListUpdated}
            hasSearch
            hasDeselection
            onSelect={onSelect}
            isVirtualList
          />
        </div>
      );

      // expect Pete in position 5 and Amed in position 3 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`)
        .should('be.visible')
        .then(($els) => {
          cy.wrap($els).eq(4).find('[title]').should('have.text', 'Pete Alonso');
        });

      // Select Pete and drag him to Amed (one-based-index)
      cy.findByTitle('Pete Alonso')
        .drag(':nth-child(4) > [draggable="true"]', { position: 'left' })
        .then(() => {
          expect(onListUpdated).to.be.called;
        });

      cy.findAllByTestId('expand-icon')
        .should('have.length', 3)
        .then(($els) => {
          // open the newly created nesting
          cy.wrap($els).eq(2).click({ force: true });
        });

      // expect Pete in position 4 and Amed in position 5 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`)
        .should('be.visible')
        .then(($els) => {
          cy.wrap($els).eq(4).find('[title]').should('have.text', 'Pete Alonso');
        });
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
            editingStyle={EditingStyle.MultipleNesting}
            pageSize="lg"
            isLoading={false}
            isLargeRow={false}
            onListUpdated={onListUpdated}
            hasSearch
            hasDeselection
            onSelect={onSelect}
            isVirtualList
          />
        </div>
      );

      // expect Pete in position 5 and Amed in position 3 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`)
        .should('be.visible')
        .then(($els) => {
          cy.wrap($els).eq(4).find('[title]').should('have.text', 'Pete Alonso');
          cy.wrap($els).eq(2).find('[title]').should('have.text', 'Amed Rosario');
        });

      // select Amed to move him, too.
      cy.findByTestId('New York Mets_Amed Rosario-checkbox').click({ force: true });

      // Select Pete and drag him to the Chicago White Sox (one-based-index)
      cy.findByTitle('Pete Alonso')
        .drag(':nth-child(1) > [draggable="true"]', { position: 'left' })
        .then(() => {
          expect(onListUpdated).to.be.called;
        });

      cy.findAllByTestId('expand-icon').eq(0).click({ force: true });
      // expect Pete in position 3 and Amed in position 2 (zero-based-index)
      cy.get(`.${iotPrefix}--list-item`)
        .should('be.visible')
        .then(($els) => {
          cy.wrap($els).eq(1).find('[title]').should('have.text', 'Amed Rosario');
          cy.wrap($els).eq(2).find('[title]').should('have.text', 'Pete Alonso');
        });
    });
  });
});
