import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { gray50, red50, green50, blue50 } from '@carbon/colors';
import {
  InformationSquareFilled24,
  InformationFilled24,
} from '@carbon/icons-react';

import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';

import landscape from './landscape.jpg';
import HotspotEditorModal from './HotspotEditorModal';

const selectableIcons = [
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

const selectableColors = [
  { carbonColor: gray50, name: 'gray' },
  { carbonColor: red50, name: 'red' },
  { carbonColor: green50, name: 'green' },
  { carbonColor: blue50, name: 'blue' },
];

const demoDynamicHotspots = [
  {
    x: 10,
    y: 30,
  },
  {
    x: 90,
    y: 60,
  },
];

const cardConfig = {
  content: {
    alt: 'Floor Map',
    image: 'firstfloor',
    src: landscape,
  },
  id: 'floor map picture',
  size: CARD_SIZES.MEDIUM,
  thresholds: [],
  title: 'Floor Map',
  type: CARD_TYPES.IMAGE,
  values: {
    hotspots: [
      {
        x: 'temp_last',
        y: 'temperature',
        type: 'dynamic',
        content: { title: 'dynamic hotspot title' },
        icon: 'InformationFilled24',
        color: red50,
      },
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
          values: {
            deviceid: '73000',
            temperature: 35.05,
          },
          attributes: [
            {
              dataSourceId: 'temperature',
              label: 'Temp',
              precision: 2,
            },
          ],
        },
      },
    ],
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
];

export default {
  title: 'Watson IoT Experimental/HotSpotEditorModal',
  decorators: [withKnobs],
  parameters: {
    component: HotspotEditorModal,
  },
};

export const WrappedInComponent = () => {
  return (
    <HotspotEditorModal
      backgroundColors={selectableColors}
      borderColors={selectableColors}
      cardConfig={cardConfig}
      dataItems={dataItems}
      defaultHotspotType="fixed"
      fontColors={selectableColors}
      hotspotIconFillColors={selectableColors}
      hotspotIcons={selectableIcons}
      modalHeaderLabelText={landscape}
      onClose={action('onClose')}
      onFetchDynamicDemoHotspots={() => {
        return new Promise((resolve) =>
          setTimeout(() => resolve(demoDynamicHotspots), 1000)
        );
      }}
      onSave={action('onSave')}
    />
  );
};
