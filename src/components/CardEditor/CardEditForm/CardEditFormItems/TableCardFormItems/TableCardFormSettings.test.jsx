import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  CARD_SIZES,
  CARD_TYPES,
} from '../../../../../constants/LayoutConstants';

import TableCardFormSettings from './TableCardFormSettings';

const commonCardConfig = {
  id: 'id',
  title: 'My Table Card',
  size: CARD_SIZES.LARGE,
  type: CARD_TYPES.TABLE,
  content: {},
};
const commonProps = {
  cardConfig: commonCardConfig,
  onChange: jest.fn(),
  availableDimensions: {
    manufacturer: ['Rentech', 'GHI'],
    deviceid: ['73000', '73001'],
  },
};
describe('TableCardFormSettings', () => {
  it('sort by drop down does not render with no columns', () => {
    render(<TableCardFormSettings {...commonProps} />);
    expect(screen.queryByLabelText('Sort by')).toBeNull();
  });
  it('sort by drop down renders with columns', () => {
    render(
      <TableCardFormSettings
        {...commonProps}
        cardConfig={{
          ...commonCardConfig,
          content: {
            columns: [
              {
                dataSourceId: 'timestamp',
                label: 'Timestamp',
                type: 'TIMESTAMP',
              },
            ],
          },
        }}
      />
    );
    expect(screen.queryAllByLabelText('Sort by')).toBeDefined();
  });
});
