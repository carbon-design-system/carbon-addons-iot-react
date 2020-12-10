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

let cardConfigWithPresets;

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
  });

  it('calls onChange & removes attribute when existig item is clicked in multiselect', () => {
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
    expect(onChange).toHaveBeenCalledWith([
      {
        dataSourceId: 'temp_last',
        label: '{high} temp',
        unit: '{unitVar}',
      },
    ]);
  });

  it('calls onChange & adds attribute when new item is clicked in multiselect', () => {
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
    userEvent.click(screen.getAllByRole('option')[1]);
    // Card config with the elevators hotspot removed
    expect(onChange).toHaveBeenCalledWith([
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
      {
        dataSourceId: 'other_metric',
        label: 'Other metric',
        unit: 'lbs',
      },
    ]);
  });

  it('calls uses `getValidDataItems` to get data items array', () => {
    const cardConfig = {
      ...cardConfigWithPresets,
      dataItems: [
        {
          dataSourceId: 'temp_last',
          label: 'high temp',
          unit: '{unitVar}',
        },
      ],
    };
    const onChange = jest.fn();
    render(
      <HotspotEditorDataSourceTab
        title="elevators"
        cardConfig={cardConfig}
        dataItems={dataItems}
        onChange={onChange}
        getValidDataItems={(config) => config.dataItems}
      />
    );
    userEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText(/temp_last/)).toBeInTheDocument();
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

  it('calls onChange with the new threshold for particular data item', () => {
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
      dataSourceId: 'temp_last',
      label: '{high} temp',
      unit: '{unitVar}',
      thresholds: [
        {
          color: '#da1e28',
          comparison: '>',
          dataSourceId: 'temp_last',
          icon: 'Warning alt',
          value: 0,
        },
      ],
    });
  });

  it('calls onChange with the new threshold that has a dataSourceId', () => {
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
    // increment value of threshold
    userEvent.click(screen.getByTitle('Increment number'));
    // save
    userEvent.click(screen.getAllByRole('button')[10]);
    // Card config with the elevators hotspot removed
    expect(onChange).toHaveBeenCalledWith({
      dataSourceId: 'temp_last',
      label: '{high} temp',
      unit: '{unitVar}',
      thresholds: [
        {
          color: '#da1e28',
          comparison: '>',
          dataSourceId: 'temp_last',
          icon: 'Warning alt',
          value: 1,
        },
      ],
    });
  });
});
