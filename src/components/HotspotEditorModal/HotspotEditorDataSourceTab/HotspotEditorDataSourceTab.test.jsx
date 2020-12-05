import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CARD_TYPES } from '../../../constants/LayoutConstants';

import HotspotEditorDataSourceTab from './HotspotEditorDataSourceTab';

const dataItems = [
  {
    dataSourceId: 'temp_last',
    label: '{high} temp',
    unit: '{unitVar}',
  },
  {
    dataSourceId: 'temperature',
    label: 'Temperature',
    unit: '°',
  },
  {
    dataSourceId: 'pressure',
    label: 'Pressure',
    unit: 'psi',
  },
  {
    dataSourceId: 'elevators',
    label: 'Elevators',
    unit: 'floor',
  },
  {
    dataSourceId: 'other_metric',
    label: 'Other metric',
    unit: 'lbs',
  },
];

let cardConfigWithPresets = {
  // title: 'Floor Map',
  // id: 'floor map picture',
  // size: CARD_SIZES.MEDIUM,
  type: CARD_TYPES.IMAGE,
  content: {
    // alt: 'Floor Map',
    // image: 'firstfloor',
    // src: imageFile,
    hotspots: [
      {
        title: 'elevators',
        // label: 'Elevators',
        // x: 35,
        // y: 65,
        // icon: 'arrowDown',
        content: {
          // title: 'sensor readings',
          attributes: [
            {
              dataSourceId: 'temp_last',
              label: '{high} temp',
              unit: '{unitVar}',
            },
            // {
            //   dataSourceId: 'temperature',
            //   label: 'Temperature',
            //   unit: '°',
            // },
            // {
            //   dataSourceId: 'pressure',
            //   label: 'Pressure',
            //   unit: 'psi'
            // },
            {
              dataSourceId: 'elevators',
              label: 'Elevators',
              unit: 'floor',
            },
          ],
        },
      },
      // {
      //   title: 'pressure',
      //   x: 45,
      //   y: 25,
      //   color: '#0f0',
      //   content: <span style={{ padding: spacing04 }}>Stairs</span>,
      // },
      // {
      //   title: 'temperature',
      //   label: 'Temperature',
      //   x: 45,
      //   y: 50,
      //   color: '#00f',
      //   content: <span style={{ padding: spacing04 }}>Vent Fan</span>,
      // },
    ],
  },
  // thresholds: [
  //   {
  //     dataSourceId: 'temp_last',
  //     comparison: '>=',
  //     color: '#da1e28',
  //     icon: 'Checkmark',
  //     value: 98,
  //   },
  //   {
  //     dataSourceId: 'pressure',
  //     comparison: '>=',
  //     color: 'red60',
  //     icon: 'Warning alt',
  //     value: 137,
  //   },
  // ],
};

describe('HotspotEditorDataSourceTab', () => {
  beforeEach(() => {
    cardConfigWithPresets = {
      type: CARD_TYPES.IMAGE,
      content: {
        hotspots: [
          {
            title: 'elevators',
            content: {
              attributes: [
                {
                  dataSourceId: 'temp_last',
                  label: '{high} temp',
                  unit: '{unitVar}',
                },
                {
                  dataSourceId: 'elevators',
                  label: 'Elevators',
                  unit: 'floor',
                },
              ],
            },
          },
        ],
      },

    };
  })

  it('calls onChange when Delete hotspot button is clicked', () => {
    const onChange = jest.fn();
    render(
      <HotspotEditorDataSourceTab
        title="elevators"
        cardConfig={cardConfigWithPresets}
        dataItems={dataItems}
        onChange={onChange}
      />
    );
    userEvent.click(screen.getAllByRole('button')[0]);
    userEvent.click(screen.getAllByRole('option')[0]);
    // Card config with the elevators hotspot removed
    expect(onChange).toHaveBeenCalledWith({
      content: {
        hotspots: [
          {
            content: {
              attributes: [
                {
                  dataSourceId: 'temp_last',
                  label: '{high} temp',
                  unit: '{unitVar}',
                },
              ],
            },
            title: 'elevators',
          },
        ],
      },
      type: 'IMAGE',
    });
  });

  it('pops the data items modal', () => {
    const onChange = jest.fn();
    render(
      <HotspotEditorDataSourceTab
        title="elevators"
        cardConfig={cardConfigWithPresets}
        dataItems={dataItems}
        onChange={onChange}
      />
    );
    userEvent.click(screen.getAllByRole('button')[2]);
    // Card config with the elevators hotspot removed
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('saves a new threshold to cardConfig', () => {
    const onChange = jest.fn();
    render(
      <HotspotEditorDataSourceTab
        title="elevators"
        cardConfig={cardConfigWithPresets}
        dataItems={dataItems}
        onChange={onChange}
      />
    );
    // edit button
    userEvent.click(screen.getAllByRole('button')[2]);

    // add threshold
    userEvent.click(screen.getAllByRole('button')[2]);
    // save
    userEvent.click(screen.getAllByRole('button')[10]);

    // Card config with the elevators hotspot removed
    expect(onChange).toHaveBeenCalledWith({
      content: {
        hotspots: [
          {
            content: {
              attributes: [
                {
                  dataSourceId: 'temp_last',
                  label: '{high} temp',
                  unit: '{unitVar}',
                },
                {
                  dataSourceId: 'elevators',
                  label: 'Elevators',
                  unit: 'floor',
                },
              ],
            },
            title: 'elevators',
          },
        ],
      },
      thresholds: [
        {
          color: '#da1e28',
          comparison: '>',
          dataSourceId: 'temp_last',
          icon: 'Warning alt',
          value: 0,
        },
      ],
      type: 'IMAGE',
    });
  });
});
