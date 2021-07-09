import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { CARD_SIZES, CARD_TYPES, COLORS } from '../../constants/LayoutConstants';
import { tableColumns, tableData } from '../../utils/sample';
import imageFile from '../ImageCard/landscape.jpg';

import Dashboard from './Dashboard';
import { loadCardData } from './CardRenderer';

const cardValues = [
  {
    title: 'Alerts (Section 1)',
    id: 'facilitycard-value',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.VALUE,
    isExpanded: true,
    content: {
      title: 'Alerts',
      attributes: [
        { label: 'Sev 3', dataSourceId: 'data', color: COLORS.RED },
        { label: 'Sev 2', dataSourceId: 'data2', color: COLORS.PURPLE },
        { label: 'Sev 1', dataSourceId: 'data3', color: COLORS.BLUE },
      ],
    },
  },
  {
    title: 'Alerts (Section 2)',
    tooltip: 'This view showcases the variety of alert severities present in your context.',
    id: 'facilitycard-pie',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.PIE,
    availableActions: {
      delete: true,
    },
    content: {
      title: 'Alerts',
      data: [
        { label: 'Sev 3', value: 2, color: COLORS.RED },
        { label: 'Sev 2', value: 7, color: COLORS.PURPLE },
        { label: 'Sev 1', value: 32, color: COLORS.BLUE },
      ],
    },
  },
  {
    title: 'Alerts',
    id: 'alert-table1',
    size: CARD_SIZES.LARGE,
    type: CARD_TYPES.TABLE,
    availableActions: {
      expand: true,
    },
    content: {
      data: tableData,
      columns: tableColumns,
    },
  },
  {
    title: 'Floor Map',
    id: 'floor map picture',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.IMAGE,
    onSetupCard() {
      return { ...cardValues[3] };
    },
    availableActions: {
      range: true,
    },
    content: {
      alt: 'Floor Map',
      image: 'firstfloor',
      src: imageFile,
    },
    values: {
      hotspots: [
        {
          x: 35,
          y: 65,
          icon: 'arrowDown',
          content: <span style={{ padding: '10px' }}>Elevators</span>,
        },
        {
          x: 45,
          y: 25,
          color: '#0f0',
          content: <span style={{ padding: '10px' }}>Stairs</span>,
        },
        {
          x: 45,
          y: 50,
          color: '#00f',
          content: <span style={{ padding: '10px' }}>Vent Fan</span>,
        },
        {
          x: 45,
          y: 75,
          icon: 'arrowUp',
          content: <span style={{ padding: '10px' }}>Humidity Sensor</span>,
        },
      ],
    },
  },
  {
    title: 'Alerts (Section 1)',
    id: 'facilitycard-donut',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.DONUT,
    availableActions: {
      delete: true,
    },
    content: {
      title: 'Alerts',
      data: [
        { label: 'Sev 3', value: 6, color: COLORS.RED },
        { label: 'Sev 2', value: 9, color: COLORS.PURPLE },
        { label: 'Sev 1', value: 18, color: COLORS.BLUE },
      ],
    },
  },
];

const onClick = jest.fn();

describe('CardRenderer', () => {
  it('load card data', async () => {
    let state = {
      dataSource: {},
      hasLoaded: false,
    };
    const setCard = (cardObj) => {
      state = {
        ...state,
        ...cardObj,
      };
    };

    const onFetchData = () => ({ hasLoaded: true });
    await loadCardData(state, setCard, onFetchData, 'month');
    expect(state.hasLoaded).toEqual(true);
  });

  it('expanded card rendered', async () => {
    render(
      <Dashboard
        title="My Dashboard"
        layouts={{ lg: [{ id: 'bogus', x: 0, y: 0, w: 12, h: 4 }] }}
        actions={[
          { id: 'edit', labelText: 'Edit', icon: 'edit' },
          { id: 'crash', labelText: 'Add', icon: 'info' },
          { id: 'maximize', labelText: 'Maximize', icon: 'help' },
        ]}
        cards={[
          {
            ...cardValues[3],
            content: {
              alt: 'Floor Map',
              image: 'firstfloor',
              src: null,
            },
            isLoading: true,
          },
        ]}
        onDashboardAction={onClick}
        hasLastUpdated={false}
      />
    );
    fireEvent.click(screen.getByTitle('Expand to fullscreen'));
    expect(screen.getByTitle('Close')).toBeTruthy();
    fireEvent.click(screen.getByTitle('Close'));
    expect(screen.getByTitle('Expand to fullscreen')).toBeTruthy();
  });
});
