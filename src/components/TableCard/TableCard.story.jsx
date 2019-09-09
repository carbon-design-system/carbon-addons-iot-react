import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { tableColumns, tableData, actions1, actions2 } from '../../utils/sample';

import TableCard from './TableCard';

storiesOf('Table Card', module)
  .add('size - large', () => {
    const size = CARD_SIZES.LARGE;
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
            sort: 'DESC',
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('size - tall', () => {
    const size = CARD_SIZES.TALL;
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('size - xlarge', () => {
    const size = CARD_SIZES.XLARGE;
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('table with multiple actions', () => {
    const size = select(
      'size',
      [CARD_SIZES.LARGE, CARD_SIZES.XLARGE, CARD_SIZES.TALL],
      CARD_SIZES.LARGE
    );

    const tableDataWithActions = tableData.map(item => {
      return {
        ...item,
        actions: actions1,
      };
    });
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
          }}
          values={tableDataWithActions}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('table with single actions', () => {
    const size = select(
      'size',
      [CARD_SIZES.LARGE, CARD_SIZES.XLARGE, CARD_SIZES.TALL],
      CARD_SIZES.LARGE
    );

    const tableDataWithActions = tableData.map(item => {
      return {
        ...item,
        actions: actions2,
      };
    });
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
          }}
          values={tableDataWithActions}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('table with thresholds, precision and expanded rows', () => {
    const size = select(
      'size',
      [CARD_SIZES.LARGE, CARD_SIZES.XLARGE, CARD_SIZES.TALL],
      CARD_SIZES.XLARGE
    );

    const thresholds = [
      // this threshold is applied to the whole row, not a particular attribute
      {
        dataSourceId: 'count',
        comparison: '<',
        value: 5,
        severity: 3, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'count',
        comparison: '>=',
        value: 10,
        severity: 1, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 10,
        severity: 1,
        label: 'Pressure Sev',
      },
    ];

    const tableCustomColumns = tableColumns.map(item =>
      item.dataSourceId === 'count' ? { ...item, precision: 1 } : { ...item }
    );

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableCustomColumns,
            thresholds,
            expandedRows: [
              {
                id: 'long_description',
                label: 'Description',
              },
              {
                id: 'other_description',
                label: 'Other Description',
              },
              {
                id: 'pressure',
                label: 'Pressure',
              },
              {
                id: 'temperature',
                label: 'Temperature',
              },
            ],
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('table with thresholds', () => {
    const size = select(
      'size',
      [CARD_SIZES.LARGE, CARD_SIZES.XLARGE, CARD_SIZES.TALL],
      CARD_SIZES.XLARGE
    );

    const thresholds = [
      // this threshold is applied to the whole row, not a particular attribute
      {
        dataSourceId: 'count',
        comparison: '<',
        value: 5,
        severity: 3, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'count',
        comparison: '>=',
        value: 10,
        severity: 1, // High threshold, medium, or low used for sorting and defined filtration
        label: 'Count Sev',
      },
      {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 10,
        severity: 1,
        label: 'Pressure Sev',
      },
    ];

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
            thresholds
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('table with thresholds only with value', () => {
    const size = select(
      'size',
      [CARD_SIZES.LARGE, CARD_SIZES.XLARGE, CARD_SIZES.TALL],
      CARD_SIZES.XLARGE
    );

    const thresholds = [
      // this threshold is applied to the whole row, not a particular attribute
      {
        dataSourceId: 'count',
        comparison: '<',
        value: 5,
        severity: 3, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'count',
        comparison: '>=',
        value: 10,
        severity: 1, // High threshold, medium, or low used for sorting and defined filtration
        label: 'Count Sev',
      },
      {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 10,
        severity: 1,
        label: 'Pressure Sev',
        showOnContent: true,
      },
    ];

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
            thresholds,
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('table with fixed column size', () => {
    const size = select(
      'size',
      [CARD_SIZES.LARGE, CARD_SIZES.XLARGE, CARD_SIZES.TALL],
      CARD_SIZES.LARGE
    );

    const tableCustomColumns = tableColumns.map((item, index) =>
      index === 0 ? { ...item, width: '250px', name: 'Alert with long string name' } : item
    );

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableCustomColumns,
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('table with row expansion', () => {
    const size = select(
      'size',
      [CARD_SIZES.LARGE, CARD_SIZES.XLARGE, CARD_SIZES.TALL],
      CARD_SIZES.LARGE
    );

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
            expandedRows: [
              {
                id: 'long_description',
                label: 'Description',
              },
              {
                id: 'other_description',
                label: 'Other content to show',
              },
            ],
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('size - tall without header', () => {
    const size = CARD_SIZES.TALL;
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
            showHeader: boolean('showHeader', false),
          }}
          values={tableData}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('no row actions', () => {
    const size = CARD_SIZES.LARGE;

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
          }}
          values={tableData.map(i => ({ id: i.id, values: i.values }))}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('empty table', () => {
    const size = CARD_SIZES.LARGE;

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
          }}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('editable', () => {
    const size = CARD_SIZES.LARGE;

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
          }}
          isEditable
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('editable with expanded rows', () => {
    const size = CARD_SIZES.LARGE;

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
            expandedRows: [{}],
          }}
          isEditable
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  })
  .add('with matching thresholds', () => {
    const size = CARD_SIZES.LARGE;
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TableCard
          title={text('title', 'Open Alerts')}
          id="table-list"
          content={{
            columns: tableColumns,
            expandedRows: [{}],
            thresholds: [
              { dataSourceId: 'count', comparison: '>', value: 0, severity: 3 },
              { dataSourceId: 'count', comparison: '>', value: 2, severity: 1 },
            ],
          }}
          values={tableData.map(i => ({ id: i.id, values: i.values }))}
          onCardAction={(id, type, payload) => action('onCardAction', id, type, payload)}
          size={size}
        />
      </div>
    );
  });
