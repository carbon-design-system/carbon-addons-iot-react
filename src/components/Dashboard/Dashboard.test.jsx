import { mount } from 'enzyme';
import React from 'react';

import { CARD_SIZES, CARD_TYPES, COLORS } from '../../constants/LayoutConstants';

import Dashboard from './Dashboard';

describe('Dashboard testcases', () => {
  test('verify dashboard still renders with bad layout', () => {
    const wrapper = mount(
      <Dashboard
        title="My Dashboard"
        layouts={{ lg: [{ id: 'bogus', x: 0, y: 0 }] }}
        cards={[
          {
            title: 'Alerts (Section 1)',
            id: 'facilitycard-donut',
            size: CARD_SIZES.SMALL,
            type: CARD_TYPES.VALUE,
            content: {
              title: 'Alerts',
              attributes: [
                { label: 'Sev 3', dataSourceId: 'data', color: COLORS.RED },
                { label: 'Sev 2', dataSourceId: 'data2', color: COLORS.YELLOW },
                { label: 'Sev 1', dataSourceId: 'data3', color: COLORS.BLUE },
              ],
            },
          },
        ]}
      />
    );
    // should still render even with incorrect layout
    expect(wrapper).toBeDefined();
  });
});
