import React from 'react';
import { mount } from '@cypress/react';

import StatefulTable from './StatefulTable';
import { tableColumns, tableData } from './Table.story';
import { getSelectData, getTableColumns, getTableData, getWords } from './Table.test.helpers';

describe('StatefulTable', () => {
  const words = getWords();
  const selectData = getSelectData();

  it('should search on keydown when hasFastSearch:true', () => {
    const onApplySearch = cy.stub();
    mount(
      <StatefulTable
        id="search-table"
        columns={tableColumns}
        data={tableData}
        options={{
          hasSearch: true,
          hasPagination: false,
        }}
        actions={{
          toolbar: {
            onApplySearch,
          },
        }}
      />
    );
    // 100 rows plus the header
    cy.get('tr').should('have.length', 101);
    cy.findByRole('searchbox')
      .type('Ia2eQMSi8i')
      .should(() => {
        expect(onApplySearch).to.have.been.callCount(10);
        expect(onApplySearch).to.have.been.calledWith('Ia2eQMSi8i');
      });

    cy.get('tr').should('have.length', 5);
  });

  it("should search on 'Enter' when hasFastSearch:false", () => {
    const onApplySearch = cy.stub();
    mount(
      <StatefulTable
        id="search-table"
        columns={tableColumns}
        data={tableData}
        options={{
          hasFastSearch: false,
          hasSearch: true,
          hasPagination: false,
        }}
        actions={{
          toolbar: {
            onApplySearch,
          },
        }}
      />
    );
    cy.get('tr').should('have.length', 101);
    cy.findByRole('searchbox')
      .type('Ia2eQMSi8i{enter}')
      .should(() => {
        expect(onApplySearch).to.have.been.callCount(1);
        expect(onApplySearch).to.have.been.calledWith('Ia2eQMSi8i');
      });

    cy.get('tr').should('have.length', 5);
    cy.findByRole('searchbox').type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}'
    );
    cy.get('tr').should('have.length', 5);
    cy.findByRole('searchbox').trigger('blur');
    cy.get('tr').should('have.length', 101);
  });

  it('should call apply search when clear is clicked hasFastSearch:true', () => {
    const onApplySearch = cy.stub();
    mount(
      <StatefulTable
        id="search-table"
        columns={tableColumns}
        data={tableData}
        options={{
          hasSearch: true,
          hasPagination: false,
          hasFastSearch: true,
        }}
        actions={{
          toolbar: {
            onApplySearch,
          },
        }}
      />
    );
    // 100 rows plus the header
    cy.get('tr').should('have.length', 101);
    cy.findByRole('searchbox')
      .type('Ia2eQMSi8i')
      .should(() => {
        expect(onApplySearch).to.have.been.callCount(10);
        expect(onApplySearch).to.have.been.calledWith('Ia2eQMSi8i');
      });

    cy.get('tr').should('have.length', 5);
    cy.findByRole('button', { name: 'Clear search input' })
      .click()
      .should(() => {
        expect(onApplySearch).to.have.been.called;
      });
    cy.get('tr').should('have.length', 101);
  });

  it('should call apply search when clear is clicked hasFastSearch:false', () => {
    const onApplySearch = cy.stub();
    mount(
      <StatefulTable
        id="search-table"
        columns={tableColumns}
        data={tableData}
        options={{
          hasSearch: true,
          hasPagination: false,
          hasFastSearch: false,
        }}
        actions={{
          toolbar: {
            onApplySearch,
          },
        }}
      />
    );
    // 100 rows plus the header
    cy.get('tr').should('have.length', 101);
    cy.findByRole('searchbox')
      .type('Ia2eQMSi8i{enter}')
      .should(() => {
        expect(onApplySearch).to.have.been.callCount(1);
        expect(onApplySearch).to.have.been.calledWith('Ia2eQMSi8i');
      });

    cy.get('tr').should('have.length', 5);
    cy.findByRole('button', { name: 'Clear search input' })
      .click()
      .should(() => {
        expect(onApplySearch).to.have.been.called;
      });
    cy.get('tr').should('have.length', 101);
  });

  it('shouldLazyRender rows on scroll with pagination shouldLazyRender:true', () => {
    // hack to get cypress to re-draw the screen and correctly render the table
    cy.viewport(1680, 400);

    mount(
      <StatefulTable
        columns={getTableColumns(selectData)}
        data={getTableData(70, words, selectData)}
        options={{
          shouldLazyRender: true,
          hasPagination: true,
        }}
        view={{
          pagination: {
            pageSize: 30,
            pageSizes: [30, 60, 90],
          },
        }}
      />
    );

    // all the rows
    cy.get('tr').should('have.length', 31);
    // 22 loading, 8 visible
    cy.findAllByTestId(/lazy-row/i).should('have.length', 22);
    // we need to scroll slowly so the observer triggers correctly in cypress
    cy.scrollTo('bottom', { duration: 1000 });
    // at bottom so none should be loading now
    cy.findAllByTestId(/lazy-row/i).should('have.length', 0);

    // rinse and repeat for page 2
    cy.findByLabelText('Next page').click();
    // all rows
    cy.get('tr').should('have.length', 31);
    // 22 loading, 8 visible
    cy.findAllByTestId(/lazy-row/i).should('have.length', 22);
    // we're at the bottom from our scroll on the last page, so we scroll to the top
    cy.scrollTo('top', { duration: 1000 });
    // no rows loading
    cy.findAllByTestId(/lazy-row/i).should('have.length', 0);

    // page 3
    cy.findByLabelText('Next page').click();
    cy.get('tr').should('have.length', 11);
    // only two rows not visible
    cy.findAllByTestId(/lazy-row/i).should('have.length', 2);
    cy.scrollTo('top', { duration: 1000 });
    cy.findAllByTestId(/lazy-row/i).should('have.length', 0);

    cy.viewport(1680, 900);
  });
});
