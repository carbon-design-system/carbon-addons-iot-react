import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { spacing04 } from '@carbon/layout';

import imageFile from '../../ImageCard/landscape.jpg';
import { CARD_SIZES, CARD_TYPES } from '../../../constants/LayoutConstants';
import {
  handleDataSeriesChange,
  handleDataItemEdit,
} from '../../DashboardEditor/editorUtils';

import HotspotEditorDataSourceTab from './HotspotEditorDataSourceTab';

export default {
  title:
    'Watson IoT Experimental/HotSpotEditorModal/HotspotEditorDataSourceTab',
  decorators: [withKnobs],
  parameters: {
    component: HotspotEditorDataSourceTab,
  },
};

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
const cardConfig = {
  title: 'Floor Map',
  id: 'floor map picture',
  size: CARD_SIZES.MEDIUM,
  type: CARD_TYPES.IMAGE,
  content: {
    hotspots: [
      {
        title: 'pressure',
        x: 45,
        y: 25,
        color: '#0f0',
        content: <span style={{ padding: spacing04 }}>Stairs</span>,
      },
    ],
  },
};
const cardConfigWithPresets = {
  title: 'Floor Map',
  id: 'floor map picture',
  size: CARD_SIZES.MEDIUM,
  type: CARD_TYPES.IMAGE,
  content: {
    alt: 'Floor Map',
    image: 'firstfloor',
    src: imageFile,
    hotspots: [
      {
        title: 'elevators',
        label: 'Elevators',
        x: 35,
        y: 65,
        icon: 'arrowDown',
        content: {
          title: 'sensor readings',
          attributes: [
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
          ],
        },
      },
      {
        title: 'pressure',
        x: 45,
        y: 25,
        color: '#0f0',
        content: <span style={{ padding: spacing04 }}>Stairs</span>,
      },
      {
        title: 'temperature',
        label: 'Temperature',
        x: 45,
        y: 50,
        color: '#00f',
        content: <span style={{ padding: spacing04 }}>Vent Fan</span>,
      },
    ],
  },
  thresholds: [
    {
      dataSourceId: 'temp_last',
      comparison: '>=',
      color: '#da1e28',
      icon: 'Checkmark',
      value: 98,
    },
    {
      dataSourceId: 'pressure',
      comparison: '>=',
      color: 'red60',
      icon: 'Warning alt',
      value: 137,
    },
  ],
};

export const WithStateInStory = () => {
  const WithState = () => {
    const [cardConfigState, setCardConfigState] = useState(cardConfig);
    return (
      <div>
        <HotspotEditorDataSourceTab
          title="pressure"
          cardConfig={cardConfigState}
          dataItems={dataItems}
          onChange={(newData) => {
            if (Array.isArray(newData)) {
              setCardConfigState({
                ...cardConfigState,
                ...handleDataSeriesChange(newData, cardConfigState, 'pressure'),
              });
            } else {
              setCardConfigState({
                ...cardConfigState,
                ...handleDataItemEdit(newData, cardConfigState, 'pressure'),
              });
            }
            action('onChange')(newData);
          }}
        />
      </div>
    );
  };

  return <WithState />;
};

WithStateInStory.story = {
  name: 'Example with no hotspots',
  parameters: {
    info: {
      text: `
      ~~~js
      const WithState = () => {
        const [cardConfigState, setCardConfigState] = useState(cardConfig);
        return (
          <div>
            <HotspotEditorDataSourceTab
              title='pressure'
              cardConfig={cardConfigState}
              dataItems={dataItems}
              onChange={(newCard) => {
                setCardConfigState({ ...cardConfigState, ...newCard });
                action('onChange')(newCard);
              }}
            />
          </div>
        );
      };
      ~~~
      `,
      propTables: [HotspotEditorDataSourceTab],
    },
  },
};

export const WithPresetValues = () => {
  const WithState = () => {
    const [cardConfigState, setCardConfigState] = useState(
      cardConfigWithPresets
    );
    return (
      <div>
        <HotspotEditorDataSourceTab
          title="elevators"
          cardConfig={cardConfigState}
          dataItems={dataItems}
          onChange={(newData) => {
            if (Array.isArray(newData)) {
              setCardConfigState({
                ...cardConfigState,
                ...handleDataSeriesChange(
                  newData,
                  cardConfigState,
                  'elevators'
                ),
              });
            } else {
              setCardConfigState({
                ...cardConfigState,
                ...handleDataItemEdit(newData, cardConfigState, 'elevators'),
              });
            }
            action('onChange')(newData);
          }}
        />
      </div>
    );
  };

  return <WithState />;
};

WithPresetValues.story = {
  name: 'With preset values',
  parameters: {
    info: {
      text: `
      ~~~js
      const WithState = () => {
        const [cardConfigState, setCardConfigState] = useState(cardConfig);
        return (
          <div>
            <HotspotEditorDataSourceTab
              title='pressure'
              cardConfig={cardConfigState}
              dataItems={dataItems}
              onChange={(newCard) => {
                setCardConfigState({ ...cardConfigState, ...newCard });
                action('onChange')(newCard);
              }}
            />
          </div>
        );
      };
      ~~~
      `,
      propTables: [HotspotEditorDataSourceTab],
    },
  },
};
