import React, { useState } from 'react';
import { merge } from 'lodash-es';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import { hotspotTypes, useHotspotEditorState } from '../hooks/hotspotStateHook';
import { selectableColors } from '../HotspotEditorModal';

import HotspotTextStyleTab from './HotspotTextStyleTab';
import HotspotTextStyleTabREADME from './HotspotTextStyleTabREADME.mdx';

const commonActions = {
  onEditDataItem: (cardConfig, dataItem) =>
    dataItem.hasStreamingMetricEnabled
      ? [
          { id: 'none', text: 'None' },
          { id: 'last', text: 'Last' },
        ]
      : [],
  dataSeriesFormActions: {
    hasAggregationsDropDown: (editDataItem) =>
      editDataItem?.dataItemType !== 'DIMENSION' && editDataItem?.type !== 'TIMESTAMP',
    onAddAggregations: action('onAddAggregations'),
  },
};

export default {
  title: '2 - Watson IoT Experimental/☢️ DashboardEditor/☢️ HotSpotEditorModal/HotspotTextStyleTab',
  decorators: [withKnobs],

  parameters: {
    component: HotspotTextStyleTab,
    docs: {
      page: HotspotTextStyleTabREADME,
    },
  },
};

export const Default = () => {
  const isLight = boolean('light', true);
  const WithState = () => {
    const [formValues, setFormValues] = useState({});

    return (
      <HotspotTextStyleTab
        minFontSize={1}
        maxFontSize={50}
        minOpacity={0}
        maxOpacity={100}
        minBorderWidth={0}
        maxBorderWidth={50}
        fontColors={selectableColors}
        backgroundColors={selectableColors}
        borderColors={selectableColors}
        formValues={formValues}
        onChange={(change) => {
          setFormValues(merge({}, formValues, change));
          action('onChange')(change);
        }}
        onDelete={(change) => {
          action('onDelete')(change);
        }}
        translateWithId={() => {}}
        light={isLight}
        actions={commonActions}
      />
    );
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <WithState />
    </div>
  );
};

Default.storyName = 'Example with externaly managed state';

export const UsingHotspotStateHook = () => {
  const WithState = () => {
    const { selectedHotspot, deleteSelectedHotspot, updateTextHotspotStyle } =
      useHotspotEditorState({
        initialState: { selectedHotspot: { type: hotspotTypes.TEXT } },
      });

    return (
      <HotspotTextStyleTab
        minFontSize={1}
        maxFontSize={50}
        minOpacity={0}
        maxOpacity={100}
        minBorderWidth={0}
        maxBorderWidth={50}
        fontColors={selectableColors}
        backgroundColors={selectableColors}
        borderColors={selectableColors}
        formValues={selectedHotspot}
        onChange={updateTextHotspotStyle}
        onDelete={deleteSelectedHotspot}
        translateWithId={() => {}}
        actions={commonActions}
      />
    );
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <WithState />
    </div>
  );
};

UsingHotspotStateHook.storyName = 'Using HotspotStateHook';
