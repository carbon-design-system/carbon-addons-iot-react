import React from 'react';
import { mount } from '@cypress/react';

import { settings } from '../../constants/Settings';

import StatefulTable from './StatefulTable';
import {
  getAdvancedFilters,
  getInitialState,
  getTableColumns as getStoryTableColumns,
  getTableData as getStoryTableData,
} from './Table.story.helpers';
import { getSelectData, getTableColumns, getTableData, getWords } from './Table.test.helpers';

const { prefix } = settings;

describe('StatefulTable', () => {
  const words = getWords();
  const selectData = getSelectData();
  const tableColumns = getStoryTableColumns();
  const tableData = getStoryTableData();

  beforeEach(() => {
    cy.viewport(1680, 900);
  });

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
      .focus()
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
      .focus()
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
      .focus()
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

  it('should allow the search box to expand and contract naturally on focus when search.isExpanded is undefined', () => {
    const onApplySearch = cy.stub();
    mount(
      <StatefulTable
        columns={tableColumns}
        data={[tableData[0]]}
        actions={{
          toolbar: {
            onApplySearch,
          },
        }}
        options={{
          hasSearch: true,
          hasFastSearch: false,
        }}
        view={{
          toolbar: {
            search: {
              defaultValue: '',
              isExpanded: undefined,
            },
          },
        }}
      />
    );

    // isn't open by default.
    cy.findByRole('search').should('not.have.class', `${prefix}--toolbar-search-container-active`);

    cy.findByRole('searchbox').focus().type('testing{enter}');

    // is open now that we have a search value.
    cy.findByRole('search').should('have.class', `${prefix}--toolbar-search-container-active`);
    cy.get(document.body).click();
    // should still be open because we have a search value, even when losing focus
    cy.findByRole('search').should('have.class', `${prefix}--toolbar-search-container-active`);
    cy.findByPlaceholderText('Search').clear();
    cy.get(document.body).click();
    // not be open anymore without a search value or focus
    cy.findByRole('search').should('not.have.class', `${prefix}--toolbar-search-container-active`);
  });

  it('should force the search box to always be open when search.isExpanded:true', () => {
    const onApplySearch = cy.stub();
    mount(
      <StatefulTable
        columns={tableColumns}
        data={[tableData[0]]}
        actions={{
          toolbar: {
            onApplySearch,
          },
        }}
        options={{
          hasSearch: true,
          hasFastSearch: true,
        }}
        view={{
          toolbar: {
            search: {
              defaultValue: '',
              isExpanded: true,
            },
          },
        }}
      />
    );

    cy.findByRole('search').should('have.class', `${prefix}--toolbar-search-container-active`);

    cy.findByRole('searchbox')
      .focus()
      .type('testing{enter}')
      .should(() => {
        expect(onApplySearch).to.have.been.called;
        expect(onApplySearch).to.have.been.calledWith('testing');
      });

    cy.findByRole('search').should('have.class', `${prefix}--toolbar-search-container-active`);
    onApplySearch.reset();

    cy.findByPlaceholderText('Search')
      .type(
        '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}test{enter}'
      )
      .should(() => {
        expect(onApplySearch).to.have.been.called;
        expect(onApplySearch).to.have.been.calledWith('test');
      });

    cy.findByRole('search').should('have.class', `${prefix}--toolbar-search-container-active`);
    onApplySearch.reset();

    cy.findByPlaceholderText('Search').type('{backspace}{backspace}{backspace}{backspace}testing');

    cy.findByPlaceholderText('Search')
      .blur()
      .should(() => {
        expect(onApplySearch).to.have.been.called;
        expect(onApplySearch).to.have.been.calledWith('testing');
      });

    cy.findByRole('search').should('have.class', `${prefix}--toolbar-search-container-active`);
    onApplySearch.reset();

    cy.findByRole('button', { name: 'Clear search input' })
      .click()
      .should(() => {
        // once on blur, once on clicking clear
        expect(onApplySearch).to.have.been.called;
        expect(onApplySearch).to.have.been.calledWith('');
      });

    cy.findByRole('search').should('have.class', `${prefix}--toolbar-search-container-active`);
    onApplySearch.reset();
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

  it('should allow advanced filters and multi-sort at the same time', () => {
    mount(
      <StatefulTable
        id="search-table"
        columns={tableColumns.map((c) => ({
          ...c,
          isSortable: c.id === 'string' || c.id === 'select',
        }))}
        data={tableData}
        options={{
          hasAdvancedFilter: true,
          hasMultiSort: true,
        }}
        view={{
          advancedFilters: getAdvancedFilters(),
          table: {
            sort: [],
          },
        }}
      />
    );

    // 100 rows plus header
    cy.get('tr').should('have.length', 101);
    cy.findByTestId('advanced-filter-flyout-button').click();
    cy.findByRole('tab', { name: 'Advanced filters' }).click();
    cy.findByText('Select a filter').click();
    cy.findByText('select=Option c, boolean=false').click();
    cy.findByRole('button', { name: 'Apply filters' }).click();
    // 16 rows plus header
    cy.get('tr').should('have.length', 17);
    cy.get('tr').eq(1).find('td').eq(0).should('have.text', 'bottle toyota bottle 5');

    cy.findAllByLabelText('open and close list of options').eq(2).click();
    cy.findAllByText('Multi-sort').eq(0).click();
    cy.findByRole('button', { name: 'Add column' }).click();
    cy.findByRole('button', { name: 'Sort' }).click();
    cy.get('tr').eq(1).find('td').eq(0).should('have.text', 'as eat scott 23');

    cy.findAllByLabelText('Sort rows by this header in descending order').eq(0).click();
    cy.get('tr').eq(1).find('td').eq(0).should('have.text', 'scott pinocchio chocolate 89');
  });

  it('should auto-position tooltips in table toolbar', () => {
    const onDownloadCSV = cy.stub();
    mount(
      <StatefulTable
        columns={tableColumns}
        data={[tableData[0]]}
        actions={{
          toolbar: {
            onDownloadCSV,
          },
        }}
        options={{
          hasRowEdit: true,
          hasFilter: true,
        }}
      />
    );

    cy.findByTestId('download-button').should('have.class', `${prefix}--tooltip--align-center`);
    cy.findByTestId('filter-button').should('have.class', `${prefix}--tooltip--align-center`);
    cy.findByTestId('row-edit-button').should('have.class', `${prefix}--tooltip--align-end`);
  });

  it('should preserve current page during rowEdit mode', () => {
    const initialState = getInitialState();

    mount(<StatefulTable id="pagination-table" {...initialState} />);

    cy.findByTestId('pagination-table-table-pagination').findAllByRole('button').last().click();
    cy.findByText('2 of 2 pages').should('be.visible');

    cy.findByTestId('row-edit-button').click();
    cy.findByText('2 of 2 pages').should('be.visible');
  });
});
