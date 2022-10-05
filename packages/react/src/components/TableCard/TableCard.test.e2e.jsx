import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import { tableColumns, tableData } from '../../utils/sample';
import { CARD_SIZES } from '../../constants/LayoutConstants';

import TableCard from './TableCard';

describe('TableCard', () => {
  onlyOn('headless', () => {
    it('should render expanded when isExpanded:true', () => {
      mount(
        <TableCard
          id="table-test"
          title="Open Alerts"
          content={{
            columns: tableColumns,
            showHeader: true,
          }}
          values={tableData.slice(0, 1)}
          size={CARD_SIZES.LARGE}
          isExpanded
          testId="expanded-test"
        />
      );

      cy.findByTestId('expanded-test').compareSnapshot('TableCard_Expanded');
    });
  });
});
