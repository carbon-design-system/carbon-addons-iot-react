import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import {
  CARD_SIZES,
  CARD_TYPES,
} from '../../../../../constants/LayoutConstants';

import TableCardFormContent from './TableCardFormContent';

const commonCardConfig = {
  id: 'id',
  title: 'My Table Card',
  size: CARD_SIZES.LARGE,
  type: CARD_TYPES.TABLE,
  content: {},
};
const commonProps = {
  cardConfig: commonCardConfig,
  dataItems: [
    { dataSourceId: 'temperature', label: 'Temperature' },
    { dataSourceId: 'pressure', label: 'Pressure' },
  ],
  availableDimensions: {
    manufacturer: ['Rentech', 'GHI'],
    deviceid: ['73000', '73001'],
  },
  onChange: jest.fn(),
  setSelectedDataItems: jest.fn(),
};

describe('TableCardFormContent', () => {
  it('should render dataitems and dimensions', () => {
    render(<TableCardFormContent {...commonProps} />);
    // check for the temperature and pressure to be shown under data items
    fireEvent.click(screen.getByLabelText(/Select data/));
    expect(screen.queryByText('temperature')).toBeDefined();
    expect(screen.queryByText('pressure')).toBeDefined();
    expect(screen.queryByText('manufacturer')).toBeNull();

    // check for the dimensions to be shown
    fireEvent.click(screen.getByLabelText(/Select dim/));
    expect(screen.queryByText('manufacturer')).toBeDefined();
    expect(screen.queryByText('deviceid')).toBeDefined();
  });
  it('edit mode with dataitems and dimension columns show work correctly', () => {
    render(
      <TableCardFormContent
        {...commonProps}
        cardConfig={{
          ...commonCardConfig,
          content: {
            columns: [
              {
                label: 'Timestamp',
                dataSourceId: 'timestamp',
                type: 'TIMESTAMP',
              },
              {
                label: 'Manufacturer',
                dataSourceId: 'manufacturer',
                type: 'DIMENSION',
              },
              { label: 'Temperature', dataSourceId: 'temperature' },
            ],
          },
        }}
      />
    );
    // All of the existing columns should be rendered in the data section
    expect(screen.queryByText('Temperature')).toBeDefined();
    expect(screen.queryByText('Timestamp')).toBeDefined();
    expect(screen.queryByText('Manufacturer')).toBeDefined();
  });
});
