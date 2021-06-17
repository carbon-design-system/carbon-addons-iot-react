import React from 'react';
import { mount } from 'enzyme';
import { render, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { tableColumns, tableData, actions2 } from '../../utils/sample';

import TableCard from './TableCard';

describe('TableCard', () => {
  it('Row specific link variables populate correctly', () => {
    const tableLinkColumns = [
      ...tableColumns,
      {
        dataSourceId: 'deviceId',
        label: 'deviceId',
      },
      {
        dataSourceId: 'Link',
        label: 'Link',
        linkTemplate: {
          href: 'https://ibm.com/{deviceId}',
          target: '_blank',
        },
      },
    ];

    // introduce row specific deviceId data
    const deviceidRowData = [
      '73000',
      '73000',
      '73001',
      '73000',
      '73002',
      '73004',
      '73004',
      '73003',
      '73005',
      '73003',
      '73005',
    ];

    const tableLinkData = tableData.map((row, i) => {
      return {
        ...row,
        values: {
          ...row.values,
          deviceId: deviceidRowData[i],
          Link: 'Link',
        },
      };
    });

    const thresholds = [
      {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 1,
        severity: 1,
        label: 'Pressure',
        showSeverityLabel: true,
        severityLabel: 'Critical',
      },
    ];

    render(
      <TableCard
        title="{assetId} Open Alerts"
        id="table-list"
        tooltip="Here's a Tooltip"
        content={{
          columns: tableLinkColumns,
          thresholds,
        }}
        values={tableLinkData}
        size={CARD_SIZES.LARGE}
        cardVariables={{ assetId: 'the best asset' }}
      />
    );
    expect(screen.getAllByText('Link').length).toEqual(11);
    expect(document.querySelector('a').getAttribute('href')).toEqual('https://ibm.com/73003');
  });

  it('Clicked row actions', () => {
    const onCardAction = jest.fn();

    const tableDataWithActions = tableData.map((item) => {
      return {
        ...item,
        actions: actions2,
      };
    });

    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
        }}
        values={tableDataWithActions}
        onCardAction={onCardAction}
        size={CARD_SIZES.LARGE}
      />
    );

    wrapper.find('.iot--table-card--action-icon').first().simulate('click');
    expect(onCardAction.mock.calls).toHaveLength(1);
  });

  describe('Columns displayed', () => {
    it('XLarge', () => {
      const wrapper = mount(
        <TableCard
          title="Open Alerts"
          content={{
            columns: tableColumns,
          }}
          values={tableData}
          size={CARD_SIZES.LARGEWIDE}
        />
      );
      expect(wrapper.find('TableHeader').length).toBe(tableColumns.length);
    });

    it('Large', () => {
      const wrapper = mount(
        <TableCard
          title="Open Alerts"
          content={{
            columns: tableColumns,
          }}
          values={tableData}
          size={CARD_SIZES.LARGE}
        />
      );

      const totalColumns = tableColumns.filter(
        (item) => item.priority === 1 || item.priority === 2
      );
      expect(wrapper.find('TableHeader').length).toBe(totalColumns.length);
    });
    it('Large with actions', () => {
      const tableDataWithActions = tableData.map((item) => {
        return {
          ...item,
          actions: actions2,
        };
      });

      const wrapper = mount(
        <TableCard
          title="Open Alerts"
          content={{
            columns: tableColumns,
          }}
          values={tableDataWithActions}
          size={CARD_SIZES.LARGE}
        />
      );

      const totalColumns = tableColumns.filter(
        (item) => item.priority === 1 || item.priority === 2
      );
      expect(wrapper.find('TableHeader').length).toBe(totalColumns.length + 1); // +1 for action column
    });
  });

  it('Columns should use custom render fuction when present', () => {
    const mockRenderFunc = jest.fn(() => {
      return <p className="myCustomRenderedCell" />;
    });
    const columnWithRenderFunction = [
      {
        dataSourceId: 'alert',
        label: 'Alert',
        priority: 1,
        renderDataFunction: mockRenderFunc,
      },
    ];
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: columnWithRenderFunction,
        }}
        values={[tableData[0]]}
        size={CARD_SIZES.LARGE}
      />
    );
    expect(wrapper.find('TableCell .myCustomRenderedCell').length).toBe(1);
    expect(mockRenderFunc).toHaveBeenCalledWith({
      columnId: 'alert',
      row: {
        alert: 'AHI005 Asset failure',
        count: 1.2039201932,
        hour: 1563877570000,
        long_description: 'long description for a given event payload',
        pressure: 0,
      },
      rowId: 'row-1',
      value: 'AHI005 Asset failure',
    });

    const columnNormal = [
      {
        dataSourceId: 'alert',
        label: 'Alert 2',
        priority: 1,
      },
    ];
    const wrapper2 = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: columnNormal,
        }}
        values={[tableData[0]]}
        size={CARD_SIZES.LARGE}
      />
    );
    expect(wrapper2.find('TableCell .myCustomRenderedCell').length).toBe(0);
  });

  describe('thresholds', () => {
    it('threshold columns should render in correct column regardless of order', () => {
      // The pressure header comes after the count header, but the ordering should not matter when
      // it comes to rendering the threshold columns
      const customThresholds = [
        {
          dataSourceId: 'pressure',
          comparison: '>=',
          value: 10,
          severity: 1,
          icon: 'bee',
          color: 'black',
          label: 'Pressure Sev',
        },
        {
          dataSourceId: 'count',
          comparison: '<',
          value: 5,
          severity: 3,
        },
        {
          dataSourceId: 'count',
          comparison: '>=',
          value: 10,
          severity: 1,
        },
        {
          dataSourceId: 'count',
          comparison: '=',
          value: 7,
          severity: 2,
        },
      ];
      render(
        <TableCard
          id="table-list"
          title="Open Alerts"
          content={{
            columns: tableColumns,
            thresholds: customThresholds,
          }}
          values={tableData}
          size={CARD_SIZES.LARGEWIDE}
        />
      );

      // If the ordering was being affected, Count Severity would not appear. Instead, Pressure Severity would appear
      expect(screen.getByTitle('Count Severity')).toBeInTheDocument();
      expect(screen.queryByTitle('Pressure Severity')).not.toBeInTheDocument();
      expect(screen.getByTitle('Pressure Sev')).toBeInTheDocument();
    });

    it('threshold columns should render in correct column regardless of quantity', () => {
      // If there are more than 2 thresholds, they should still render to the left of the datasource column
      const customThresholds = [
        {
          dataSourceId: 'pressure',
          comparison: '>=',
          value: 10,
          severity: 1,
        },
        {
          dataSourceId: 'count',
          comparison: '<',
          value: 5,
          severity: 3,
        },
        {
          dataSourceId: 'count',
          comparison: '>=',
          value: 10,
          severity: 1,
        },
        {
          dataSourceId: 'count',
          comparison: '=',
          value: 7,
          severity: 2,
        },
        {
          dataSourceId: 'hour',
          comparison: '<',
          value: 1563877570000,
          severity: 1, // High threshold, medium, or low used for sorting and defined filtration
        },
      ];
      // First the component needs to be rendered. getByTitle doesn't need to be used
      // eslint-disable-next-line no-unused-vars
      const { getByTitle } = render(
        <TableCard
          id="table-list"
          title="Open Alerts"
          content={{
            columns: tableColumns,
            thresholds: customThresholds,
          }}
          values={tableData}
          size={CARD_SIZES.LARGEWIDE}
        />
      );

      // Then get all of the th elements. This is how the ordering will be determined
      const tableHeader = document.getElementsByTagName('th');
      // The within function comes in SUPER handy here
      const countSeverityIndex = 1;
      const { getByText } = within(tableHeader[countSeverityIndex]);
      expect(getByText('Count Severity')).toBeTruthy();

      const hourSeverityIndex = 3;
      within(tableHeader[hourSeverityIndex]);
      // expect(screen.getByTextHour('Hour Severity')).toBeTruthy();
      expect(screen.getByText('Hour Severity')).toBeTruthy();

      const pressureSeverityIndex = 5;
      within(tableHeader[pressureSeverityIndex]);
      // expect(screen.getByTextPressure('Pressure Severity')).toBeTruthy();
      expect(screen.getByText('Pressure Severity')).toBeTruthy();
    });

    it('threshold icon labels should not display when showSeverityLabel is false', () => {
      const customThresholds = [
        {
          dataSourceId: 'pressure',
          comparison: '>=',
          value: 10,
          severity: 1,
        },
        {
          dataSourceId: 'count',
          comparison: '<',
          value: 5,
          severity: 3,
          showSeverityLabel: false,
        },
        {
          dataSourceId: 'count',
          comparison: '=',
          value: 7,
          severity: 2,
          showSeverityLabel: false,
        },
      ];
      render(
        <TableCard
          id="table-list"
          title="Open Alerts"
          content={{
            columns: tableColumns,
            thresholds: customThresholds,
            expandedRows: [
              {
                id: 'pressure',
                label: 'Pressure',
              },
            ],
          }}
          values={tableData}
          size={CARD_SIZES.LARGEWIDE}
        />
      );

      // The Pressure threshold is the only threshold that has a 'Critical' severity
      // and doesn't have showSeverityLabel: false, so it should be the only severity text to appear
      expect(screen.queryAllByText(/Critical/g)).toHaveLength(3);
      expect(screen.queryByText(/Moderate/g)).not.toBeInTheDocument();
      expect(screen.queryByText(/Low/g)).not.toBeInTheDocument();
    });
    it('threshold icon label should not display default strings', () => {
      const customThresholds = [
        {
          dataSourceId: 'pressure',
          comparison: '>=',
          value: 10,
          severity: 1,
        },
        {
          dataSourceId: 'count',
          comparison: '<',
          value: 5,
          severity: 3,
          severityLabel: 'Lowest',
        },
        {
          dataSourceId: 'count',
          comparison: '=',
          value: 7,
          severity: 2,
          severityLabel: 'Medium',
        },
      ];
      render(
        <TableCard
          id="table-list"
          title="Open Alerts"
          content={{
            columns: tableColumns,
            thresholds: customThresholds,
          }}
          values={tableData}
          size={CARD_SIZES.LARGE}
        />
      );

      // Critical should exist as that is the only threshold that doesn't have custom label text
      expect(screen.queryAllByText(/^Critical$/g)).toHaveLength(3);
      // These are default labels, so they should not exist
      expect(screen.queryByText(/^Moderate$/g)).not.toBeInTheDocument();
      expect(screen.queryByText(/^Low$/g)).not.toBeInTheDocument();
      // These are the custom labels that should appear instead of the defaults above
      expect(screen.queryAllByText(/^Medium$/g)).toHaveLength(1);
      expect(screen.queryAllByText(/^Lowest$/g)).toHaveLength(5);
    });

    it('can be resized without crashing', () => {
      const { rerender } = render(
        <TableCard
          id="table-list"
          title="Testing resize"
          content={{
            columns: tableColumns,
          }}
          values={tableData}
          size={CARD_SIZES.LARGE}
        />
      );

      rerender(
        <TableCard
          id="table-list"
          title="Testing resize"
          content={{
            columns: tableColumns,
          }}
          values={tableData}
          size={CARD_SIZES.LARGEWIDE}
        />
      );

      rerender(
        <TableCard
          id="table-list"
          title="Testing resize"
          content={{
            columns: tableColumns,
          }}
          values={tableData}
          size={CARD_SIZES.LARGE}
        />
      );

      expect(screen.getByText('Testing resize')).toBeInTheDocument();
    });
  });

  it('last column is not dublicated when changeing sizes', () => {
    const { rerender } = render(
      <TableCard
        id="table-list"
        title="Testing resize"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGE}
      />
    );

    rerender(
      <TableCard
        id="table-list"
        title="Testing resize"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGEWIDE}
      />
    );

    rerender(
      <TableCard
        id="table-list"
        title="Testing resize"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGE}
      />
    );

    expect(screen.queryAllByText('Pressure')).toHaveLength(1);
  });

  it('can accept filter options', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        filters={[{ columnId: 'alert', value: 'failure' }]}
        size={CARD_SIZES.LARGE}
      />
    );

    const totalRows = tableData.filter((item) => item.values.alert.match(/failure/));
    expect(wrapper.find('tr').length).toBe(totalRows.length + 1); // +1 for action column
  });

  it('hides low priority columns for LARGE and LARGETHIN sizes', () => {
    const { rerender } = render(
      <TableCard
        id="table-list"
        title="Testing resize"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGE}
      />
    );

    // Column Count has priority 3 so it should be hidden
    expect(screen.queryAllByTitle('Count')).toHaveLength(0);

    rerender(
      <TableCard
        id="table-list"
        title="Testing resize"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGEWIDE}
      />
    );

    expect(screen.queryAllByTitle('Count')).toHaveLength(1);
  });

  it('shows toolbar expand button only when low priority columns are hidden', () => {
    const { rerender } = render(
      <TableCard
        id="table-list"
        title="Testing resize"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGE}
      />
    );
    expect(screen.getByTitle('Expand to fullscreen')).toBeVisible();

    rerender(
      <TableCard
        id="table-list"
        title="Testing resize"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGEWIDE}
      />
    );

    expect(screen.queryAllByTitle('Expand to fullscreen')).toHaveLength(0);
  });

  describe('i18n', () => {
    const content = {
      columns: tableColumns.map((item) =>
        item.dataSourceId === 'count' ? { ...item, precision: 3 } : { ...item }
      ),
      thresholds: [
        {
          dataSourceId: 'count',
          comparison: '<',
          value: 5,
          severity: 3,
        },
        {
          dataSourceId: 'count',
          comparison: '>=',
          value: 10,
          severity: 1,
        },
        {
          dataSourceId: 'count',
          comparison: '=',
          value: 7,
          severity: 2,
        },
        {
          dataSourceId: 'pressure',
          comparison: '>=',
          value: 10,
          severity: 1,
        },
      ],
      expandedRows: [
        {
          id: 'hour',
          label: 'Time',
          type: 'TIMESTAMP',
        },
      ],
    };

    const i18n = {
      criticalLabel: '__Critical__',
      moderateLabel: '__Moderate__',
      lowLabel: '__Low__',
      selectSeverityPlaceholder: '__Select a severity__',
      severityLabel: '__Severity__',
      searchLabel: '__Search__',
      searchPlaceholder: '__Search__',
      filterButtonAria: '__Filters__',
      defaultFilterStringPlaceholdText: '__Type and hit enter to apply__',
      pageBackwardAria: '__Previous page__',
      pageForwardAria: '__Next page__',
      pageNumberAria: '__Page Number__',
      itemsRange: (min, max) => `__${min}–${max} items__`,
      currentPage: (page) => `__page ${page}__`,
      itemsRangeWithTotal: (min, max, total) => `__${min}–${max} of ${total} items__`,
      pageRange: (current, total) => `__${current} of ${total} pages__`,
      clickToExpandAria: '__Click to expand content__',
      clickToCollapseAria: '__Click to collapse content__',
      clearAllFilters: '__Clear all filters__',
      clearFilterAria: '__Clear filter__',
      filterAria: '__Filter__',
      openMenuAria: '__Open menu__',
      closeMenuAria: '__Close menu__',
      clearSelectionAria: '__Clear selection__',
      emptyMessage: '__There is no data__',
      emptyMessageWithFilters: '__No results match the current filters__',
      emptyButtonLabel: '__Create some data__',
      emptyButtonLabelWithFilters: '__Clear all filters__',
      inProgressText: '__In Progress__',
      actionFailedText: '__Action Failed__',
      learnMoreText: '__Learn More__',
      dismissText: '__Dismiss__',
      downloadIconDescription: '__Download table content__',
    };

    it('manages i18n correctly', () => {
      render(
        <TableCard
          id="table-i18n"
          title="Testing i18n"
          content={content}
          size={CARD_SIZES.LARGEWIDE}
          values={tableData}
          i18n={i18n}
        />
      );

      expect(screen.queryAllByText('__Critical__')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('__Moderate__')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('__Low__')[0]).toBeInTheDocument();
      expect(screen.queryByTitle('Count __Severity__')).toBeInTheDocument();
      expect(screen.queryAllByLabelText('__Search__')[0]).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('__Search__')).toBeInTheDocument();
      expect(screen.queryByTitle('__Filters__')).toBeInTheDocument();
      expect(screen.queryByText('__Previous page__')).toBeInTheDocument();
      expect(screen.queryByText('__Next page__')).toBeInTheDocument();
      expect(screen.queryByText('__1–10 of 11 items__')).toBeInTheDocument();
      expect(screen.queryAllByLabelText('__Click to expand content__')[0]).toBeInTheDocument();
      expect(screen.queryByTitle('__Download table content__')).toBeInTheDocument();
    });

    it('translates filters', () => {
      const { rerender } = render(
        <TableCard
          id="table-i18n"
          title="Testing i18n"
          content={content}
          size={CARD_SIZES.LARGEWIDE}
          values={tableData}
          filters={[{ columnId: 'alert', value: 'failure' }]}
          i18n={i18n}
        />
      );

      // expect(screen.queryByText('__Click to collapse content__')).toBeInTheDocument();
      expect(screen.queryByText(/__Clear all filters__/gi)).toBeInTheDocument();
      expect(screen.queryByLabelText('__Filters__')).toBeInTheDocument();
      userEvent.click(screen.queryByLabelText('__Filters__'));
      expect(screen.queryByTitle('__Clear filter__')).toBeInTheDocument();
      expect(
        screen.queryAllByPlaceholderText('__Type and hit enter to apply__')[0]
      ).toBeInTheDocument();

      rerender(
        <TableCard
          id="table-i18n"
          title="Testing i18n"
          content={content}
          size={CARD_SIZES.LARGEWIDE}
          values={[]}
          filters={[{ columnId: 'alert', value: 'failure' }]}
          i18n={i18n}
        />
      );
      expect(screen.queryByText('__No results match the current filters__')).toBeInTheDocument();
    });

    it('translates no data', () => {
      render(
        <TableCard
          id="table-i18n"
          title="Testing i18n"
          content={content}
          size={CARD_SIZES.LARGEWIDE}
          values={[]}
          i18n={i18n}
        />
      );

      expect(screen.queryByText('__There is no data__')).toBeInTheDocument();
    });
  });
});
