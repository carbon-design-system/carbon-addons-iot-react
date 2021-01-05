import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { gray50, red50, green50, blue50 } from '@carbon/colors';
import {
  InformationSquareFilled24,
  InformationFilled24,
} from '@carbon/icons-react';
import sizeMe from 'react-sizeme';
import userEvent from '@testing-library/user-event';

import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';

import landscape from './landscape.jpg';
import HotspotEditorModal from './HotspotEditorModal';
import { hotspotTypes } from './hooks/hotspotStateHook';

sizeMe.noPlaceholders = true;
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
const mockGetBoundingClientRect = jest.fn();
const getHotspots = () => [
  {
    x: 75,
    y: 10,
    type: 'text',
    content: { title: 'Storage' },
    backgroundColor: gray50,
    backgroundOpacity: 50,
  },
  {
    x: 35,
    y: 65,
    icon: 'InformationFilled24',
    color: green50,
    content: {
      title: 'My Device',
      description: 'Description',
      attributes: [
        {
          dataSourceId: 'temperature',
          label: 'Temp',
          precision: 2,
        },
      ],
    },
  },
  {
    x: 'temp_last',
    y: 'temperature',
    type: 'dynamic',
    content: { title: 'dynamic test title' },
    icon: 'InformationFilled24',
    color: red50,
  },
];

const getCardConfig = () => ({
  content: {
    alt: 'Floor Map',
    image: 'firstfloor',
    src: landscape,
  },
  id: 'floor map picture',
  size: CARD_SIZES.MEDIUM,
  title: 'Floor Map',
  type: CARD_TYPES.IMAGE,
  values: {
    hotspots: getHotspots(),
  },
});

const getSelectableColors = () => [
  { carbonColor: gray50, name: 'gray' },
  { carbonColor: red50, name: 'red' },
  { carbonColor: green50, name: 'green' },
  { carbonColor: blue50, name: 'blue' },
];

const getSelectableIcons = () => [
  {
    id: 'InformationSquareFilled24',
    icon: InformationSquareFilled24,
    text: 'Information square filled',
  },
  {
    id: 'InformationFilled24',
    icon: InformationFilled24,
    text: 'Information filled',
  },
];

const getDataItems = () => [
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
];

const getDemoDynamicHotspots = () => [
  {
    x: 10,
    y: 30,
  },
  {
    x: 90,
    y: 60,
  },
];

const loading = HotspotEditorModal.defaultProps.loadingDynamicHotspotsText;

describe('HotspotEditorModal', () => {
  beforeAll(() => {
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect.mockImplementation(
      () => {
        return {
          width: 1000,
          height: 1000,
        };
      }
    );
  });
  afterAll(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('renders initial hotspots', async () => {
    render(
      <HotspotEditorModal
        backgroundColors={getSelectableColors()}
        borderColors={getSelectableColors()}
        cardConfig={getCardConfig()}
        dataItems={getDataItems()}
        defaultHotspotType="fixed"
        fontColors={getSelectableColors()}
        hotspotIconFillColors={getSelectableColors()}
        hotspotIcons={getSelectableIcons()}
        modalHeaderLabelText={landscape}
        onClose={jest.fn()}
        onFetchDynamicDemoHotspots={() => {
          return new Promise((resolve) => resolve(getDemoDynamicHotspots()));
        }}
        onSave={jest.fn()}
      />
    );

    // Let the callback onFetchDynamicDemoHotspots finish
    await waitFor(() => expect(screen.queryByText(loading)).toBeFalsy());

    const textHotspot = screen.getByText('Storage');
    expect(textHotspot).toBeVisible();

    const fixedHotspot = screen.getByTestId('hotspot-35-65');
    expect(fixedHotspot).toBeVisible();

    const dynamicHotspot1 = screen.getByTestId('hotspot-10-30');
    const dynamicHotspot2 = screen.getByTestId('hotspot-90-60');
    expect(dynamicHotspot1).toBeVisible();
    expect(dynamicHotspot2).toBeVisible();
  });

  it('exports cardConfig with initial settings', async () => {
    const onSave = jest.fn();
    const onFetchDynamicDemoHotspots = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => resolve(getDemoDynamicHotspots()));
    });

    render(
      <HotspotEditorModal
        backgroundColors={getSelectableColors()}
        borderColors={getSelectableColors()}
        cardConfig={getCardConfig()}
        dataItems={getDataItems()}
        defaultHotspotType="fixed"
        fontColors={getSelectableColors()}
        hotspotIconFillColors={getSelectableColors()}
        hotspotIcons={getSelectableIcons()}
        modalHeaderLabelText={landscape}
        onClose={jest.fn()}
        onFetchDynamicDemoHotspots={onFetchDynamicDemoHotspots}
        onSave={onSave}
      />
    );

    // Let the callback onFetchDynamicDemoHotspots finish
    await waitFor(() => expect(screen.queryByText(loading)).toBeFalsy());

    expect(onFetchDynamicDemoHotspots).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith(getCardConfig());
  });

  it('exports cardConfig with modified dynamic hotspot settings', async () => {
    const onSave = jest.fn();
    const onFetchDynamicDemoHotspots = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => resolve(getDemoDynamicHotspots()));
    });
    const [sourceTempLast, sourceTemperature, sourcePressure] = getDataItems();

    render(
      <HotspotEditorModal
        backgroundColors={getSelectableColors()}
        borderColors={getSelectableColors()}
        cardConfig={getCardConfig()}
        dataItems={getDataItems()}
        defaultHotspotType="fixed"
        fontColors={getSelectableColors()}
        hotspotIconFillColors={getSelectableColors()}
        hotspotIcons={getSelectableIcons()}
        modalHeaderLabelText={landscape}
        onClose={jest.fn()}
        onFetchDynamicDemoHotspots={onFetchDynamicDemoHotspots}
        onSave={onSave}
      />
    );

    // Let the callback onFetchDynamicDemoHotspots finish
    await waitFor(() => expect(screen.queryByText(loading)).toBeFalsy());

    // Select one of the dynamic demo hotspots
    userEvent.click(
      within(screen.getByTestId('hotspot-10-30')).getByRole('button')
    );
    // The initial dynamic hotspot title is showing
    const titleInputElement = screen.getByDisplayValue('dynamic test title');

    // Click anywhere to remove focus the selected hotspot
    fireEvent.click(screen.getAllByRole('link', { name: /tooltip/i })[0]);

    // Modify the title and verify the result
    userEvent.type(titleInputElement, ' - modified');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          hotspots: expect.arrayContaining([
            expect.objectContaining({
              content: { title: 'dynamic test title - modified' },
            }),
          ]),
        }),
      })
    );

    // Selecting a new data source for x/y will clear existing dynamic
    // hotspot content
    // open source x dropdown
    fireEvent.click(screen.getByText(sourceTempLast.label));
    // select pressure alternative
    fireEvent.click(screen.getAllByText(sourcePressure.label)[0]);
    await waitFor(() => expect(screen.queryByText(loading)).toBeFalsy());
    // open source y dropdown
    fireEvent.click(screen.getByText(sourceTemperature.label));
    // select pressure alternative
    fireEvent.click(screen.getAllByText(sourcePressure.label)[1]);
    await waitFor(() => expect(screen.queryByText(loading)).toBeFalsy());

    // Select one of the dynamic demo hotspots
    userEvent.click(
      within(screen.getByTestId('hotspot-10-30')).getByRole('button')
    );

    // Click anywhere to remove focus the selected hotspot
    fireEvent.click(screen.getAllByRole('link', { name: /tooltip/i })[0]);

    const emptyTitleInputElement = screen.getByTitle(
      'Enter title for the tooltip'
    );
    userEvent.type(emptyTitleInputElement, 'new test title');

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          hotspots: expect.arrayContaining([
            {
              content: { title: 'new test title' },
              type: 'dynamic',
              x: sourcePressure.dataSourceId,
              y: sourcePressure.dataSourceId,
            },
          ]),
        }),
      })
    );
  });

  it('exports cardConfig with modified static hotspot settings', async () => {
    const onSave = jest.fn();
    const myCardConfig = {
      ...getCardConfig(),
      values: {
        hotspots: getHotspots().filter(
          (hotspot) => hotspot.type !== hotspotTypes.DYNAMIC
        ),
      },
    };

    render(
      <HotspotEditorModal
        backgroundColors={getSelectableColors()}
        borderColors={getSelectableColors()}
        cardConfig={myCardConfig}
        dataItems={[]}
        getValidDataItems={getDataItems}
        defaultHotspotType="fixed"
        fontColors={getSelectableColors()}
        hotspotIconFillColors={getSelectableColors()}
        hotspotIcons={getSelectableIcons()}
        modalHeaderLabelText={landscape}
        onClose={jest.fn()}
        onFetchDynamicDemoHotspots={jest.fn()}
        onSave={onSave}
      />
    );

    await waitFor(() =>
      expect(screen.getByTestId('hotspot-35-65')).toBeTruthy()
    );

    // Select one of the fixed demo hotspots
    userEvent.click(
      within(screen.getByTestId('hotspot-35-65')).getByRole('button')
    );
    // The initial fixed hotspot title is showing
    const titleInputElement = screen.getByDisplayValue('My Device');

    // Click anywhere to remove focus the selected hotspot
    fireEvent.click(screen.getAllByRole('link', { name: /tooltip/i })[0]);

    // Modify the title and verify the result
    userEvent.type(titleInputElement, ' - modified');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          hotspots: expect.arrayContaining([
            expect.objectContaining({
              content: expect.objectContaining({
                title: 'My Device - modified',
              }),
            }),
          ]),
        }),
      })
    );

    // Change to the data source tab
    fireEvent.click(screen.getByText('Data source'));

    // Add the data item alternative 'pressure'
    fireEvent.click(screen.getByText('Select data items'));
    fireEvent.click(screen.getByText('pressure'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Add threshold' }));
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          hotspots: expect.arrayContaining([
            expect.objectContaining({
              content: expect.objectContaining({
                attributes: expect.arrayContaining([
                  { dataSourceId: 'temperature', label: 'Temp', precision: 2 },
                  {
                    dataSourceId: 'pressure',
                    label: 'Pressure',
                    unit: 'psi',
                    thresholds: [
                      {
                        color: '#da1e28',
                        comparison: '>',
                        dataSourceId: 'pressure',
                        icon: 'Warning alt',
                        value: 0,
                      },
                    ],
                  },
                ]),
              }),
            }),
          ]),
        }),
      })
    );
  });

  it('exports cardConfig with modified text hotspot settings', async () => {
    const onSave = jest.fn();
    const myCardConfig = {
      ...getCardConfig(),
      values: {
        hotspots: getHotspots().filter(
          (hotspot) => hotspot.type !== hotspotTypes.DYNAMIC
        ),
      },
    };

    render(
      <HotspotEditorModal
        backgroundColors={getSelectableColors()}
        borderColors={getSelectableColors()}
        cardConfig={myCardConfig}
        dataItems={[]}
        getValidDataItems={getDataItems}
        defaultHotspotType="fixed"
        fontColors={getSelectableColors()}
        hotspotIconFillColors={getSelectableColors()}
        hotspotIcons={getSelectableIcons()}
        modalHeaderLabelText={landscape}
        onClose={jest.fn()}
        onFetchDynamicDemoHotspots={jest.fn()}
        onSave={onSave}
        showTooManyHotspotsInfo
      />
    );

    await waitFor(() =>
      expect(screen.getByTestId('hotspot-75-10')).toBeTruthy()
    );

    fireEvent.click(screen.getByRole('tab', { name: /Labels/i }));
    userEvent.click(screen.getByText('Storage'));
    userEvent.click(screen.getByTestId('hotspot-bold'));

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          hotspots: expect.arrayContaining([
            expect.objectContaining({
              type: hotspotTypes.TEXT,
              bold: true,
            }),
          ]),
        }),
      })
    );
  });

  it('exports thresholds in cardConfig.thresholds if prop is present', async () => {
    const onSave = jest.fn();
    const myCardConfig = {
      ...getCardConfig(),
      values: {
        hotspots: getHotspots().filter(
          (hotspot) => hotspot.type !== hotspotTypes.DYNAMIC
        ),
      },
      thresholds: [
        {
          color: '#da1e28',
          comparison: '>',
          dataSourceId: 'temperature',
          icon: 'Warning alt',
          value: 0,
        },
      ],
    };

    render(
      <HotspotEditorModal
        backgroundColors={getSelectableColors()}
        borderColors={getSelectableColors()}
        cardConfig={myCardConfig}
        dataItems={[]}
        getValidDataItems={getDataItems}
        defaultHotspotType="fixed"
        fontColors={getSelectableColors()}
        hotspotIconFillColors={getSelectableColors()}
        hotspotIcons={getSelectableIcons()}
        modalHeaderLabelText={landscape}
        onClose={jest.fn()}
        onFetchDynamicDemoHotspots={jest.fn()}
        onSave={onSave}
      />
    );

    await waitFor(() =>
      expect(screen.getByTestId('hotspot-35-65')).toBeTruthy()
    );

    // Select one of the fixed demo hotspots
    userEvent.click(
      within(screen.getByTestId('hotspot-35-65')).getByRole('button')
    );

    // Click anywhere to remove focus the selected hotspot
    fireEvent.click(screen.getAllByRole('link', { name: /tooltip/i })[0]);

    // Change to the data source tab
    fireEvent.click(screen.getByText('Data source'));

    // Add the data item alternative 'pressure'
    fireEvent.click(screen.getByText('Select data items'));
    fireEvent.click(screen.getByText('pressure'));

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Add threshold' }));
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({
          hotspots: expect.arrayContaining([
            expect.objectContaining({
              content: expect.objectContaining({
                attributes: expect.arrayContaining([
                  { dataSourceId: 'temperature', label: 'Temp', precision: 2 },
                  {
                    dataSourceId: 'pressure',
                    label: 'Pressure',
                    unit: 'psi',
                  },
                ]),
              }),
            }),
          ]),
        }),
        thresholds: [
          {
            color: '#da1e28',
            comparison: '>',
            dataSourceId: 'temperature',
            icon: 'Warning alt',
            value: 0,
          },
          {
            color: '#da1e28',
            comparison: '>',
            dataSourceId: 'pressure',
            icon: 'Warning alt',
            value: 0,
          },
        ],
      })
    );
  });
});
