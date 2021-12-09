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
    cy.viewport(1680, 900);

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

    // 22 because that's what fits on screen at 1680x900
    cy.get('tr').should('have.length', 22);

    cy.get('tr').last().scrollIntoView({ duration: 500 });
    // header and 30 data rows
    cy.get('tr').should('have.length', 31);
    cy.scrollTo('bottom');

    // rinse and repeat for page 2
    cy.findByLabelText('Next page').click();
    cy.get('tr').last().scrollIntoView({ duration: 500 });
    // header and 30 data rows
    cy.get('tr').should('have.length', 31);

    // load final 10 from page 3
    cy.findByLabelText('Next page').click();
    // header and 10 data rows
    cy.get('tr').should('have.length', 11);
  });
});
