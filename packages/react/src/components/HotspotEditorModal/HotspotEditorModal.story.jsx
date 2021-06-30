import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { gray50, red50, green50, blue50 } from '@carbon/colors';
import { InformationSquareFilled24, InformationFilled24 } from '@carbon/icons-react';
import { withReadme } from 'storybook-readme';

import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';
import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';

import landscape from './landscape.jpg';
import HotspotEditorModal from './HotspotEditorModal';
import HotspotEditorModalREADME from './README.md';

export const Experimental = () => <StoryNotice componentName="ColorDropdown" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

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

const cardConfig = {
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
    hotspots: [],
  },
};

const dataItems = [
  {
    dataItemId: 'temp_last',
    dataSourceId: 'temp_last',
    label: '{high} temp',
    unit: '{unitVar}',
  },
  {
    dataItemId: 'temperature',
    dataSourceId: 'temperature',
    label: 'Temperature',
    unit: '°',
  },
  {
    dataItemId: 'pressure',
    dataSourceId: 'pressure',
    label: 'Pressure',
    unit: 'psi',
  },
];

const getDemoHotspots = (reqObj) => {
  action('onFetchDynamicDemoHotspots')(reqObj);
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            x: 10,
            y: 30,
          },
          {
            x: 90,
            y: 60,
          },
        ]),
      1000
    )
  );
};

export default {
  title: '2 - Watson IoT Experimental/☢️ HotSpotEditorModal',
  decorators: [withKnobs],
  parameters: {
    component: HotspotEditorModal,
    docs: {
      inlineStories: false,
    },
  },
};

export const Empty = withReadme(HotspotEditorModalREADME, () => {
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
      label={landscape}
      onClose={action('onClose')}
      onFetchDynamicDemoHotspots={getDemoHotspots}
      onSave={action('onSave')}
    />
  );
});

export const EmptyWithGetValidDataItemsCallback = withReadme(HotspotEditorModalREADME, () => {
  return (
    <HotspotEditorModal
      backgroundColors={selectableColors}
      borderColors={selectableColors}
      cardConfig={cardConfig}
      dataItems={dataItems}
      getValidDataItems={(cardConf) => {
        action('getValidDataItems')(cardConf);
        return dataItems;
      }}
      defaultHotspotType="fixed"
      fontColors={selectableColors}
      hotspotIconFillColors={selectableColors}
      hotspotIcons={selectableIcons}
      label={landscape}
      onClose={action('onClose')}
      onFetchDynamicDemoHotspots={getDemoHotspots}
      onSave={action('onSave')}
    />
  );
});
EmptyWithGetValidDataItemsCallback.story = {
  name: 'Empty with getValidDataItems callback',
};

export const WithExistingHotspots = withReadme(HotspotEditorModalREADME, () => {
  const myCardConfig = {
    ...cardConfig,
    values: {
      ...cardConfig.values,
      hotspots: [
        {
          x: 75,
          y: 10,
          type: 'text',
          content: { title: 'Storage' },
          backgroundColor: gray50,
          backgroundOpacity: 50,
          fontSize: 12,
          fontColor: gray50,
          borderColor: gray50,
          borderWidth: 1,
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
                label: 'Custom label temp',
                unit: '°',
                thresholds: [
                  {
                    comparison: '>',
                    value: 30.5,
                    icon: 'Warning',
                    color: '#da1e28',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };

  return (
    <HotspotEditorModal
      availableDimensions={{
        manufacturer: ['Rentech', 'GHI Industries'],
        deviceid: ['73000', '73001', '73002'],
      }}
      backgroundColors={selectableColors}
      borderColors={selectableColors}
      cardConfig={myCardConfig}
      dataItems={dataItems}
      defaultHotspotType="fixed"
      fontColors={selectableColors}
      hotspotIconFillColors={selectableColors}
      hotspotIcons={selectableIcons}
      label={landscape}
      onClose={action('onClose')}
      onFetchDynamicDemoHotspots={getDemoHotspots}
      onSave={action('onSave')}
    />
  );
});

export const WithExistingDynamicHotspots = withReadme(HotspotEditorModalREADME, () => {
  const myCardConfig = {
    ...cardConfig,
    values: {
      ...cardConfig.values,
      hotspots: [
        {
          x: 'temp_last',
          y: 'temperature',
          type: 'dynamic',
          content: { title: 'dynamic hotspot title' },
          icon: 'InformationFilled24',
          color: red50,
        },
      ],
    },
  };

  return (
    <HotspotEditorModal
      backgroundColors={selectableColors}
      borderColors={selectableColors}
      cardConfig={myCardConfig}
      dataItems={dataItems}
      defaultHotspotType="fixed"
      fontColors={selectableColors}
      hotspotIconFillColors={selectableColors}
      hotspotIcons={selectableIcons}
      maxHotspots={2}
      label={landscape}
      onClose={action('onClose')}
      onFetchDynamicDemoHotspots={getDemoHotspots}
      onSave={action('onSave')}
      showTooManyHotspotsInfo={boolean('showTooManyHotspotsInfo', true)}
    />
  );
});
