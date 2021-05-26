import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { CARD_ACTIONS } from '../../constants/LayoutConstants';
import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';

import data from './data.json';
import options from './storyFiles/mapOptions';
import MapBoxExample from './MapBoxExample';
import OpenLayersExample from './OpenLayersExample';

export const Experimental = () => <StoryNotice componentName="MapCard" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

export default {
  title: 'Watson IoT Experimental/☢️ MapCard',
  decorators: [withKnobs, React.createElement],
  parameters: {
    component: MapBoxStory,
  },
};

export const MapBoxStory = () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleOnCardAction = (id, actionType) => {
    action('onCardAction')(actionType);
    if (actionType === CARD_ACTIONS.CLOSE_EXPANDED_CARD) {
      setIsExpanded(false);
    } else if (actionType === CARD_ACTIONS.OPEN_EXPANDED_CARD) {
      setIsExpanded(true);
    } else if (actionType === CARD_ACTIONS.ON_SETTINGS_CLICK) {
      setSettingsOpen((oldSettingsState) => !oldSettingsState);
    }
  };
  return (
    <MapBoxExample
      data={data}
      options={options}
      isLegendFullWidth={boolean('isLegendFullWidth', false)}
      onCardAction={handleOnCardAction}
      availableActions={{ expand: true, settings: true }}
      isSettingPanelOpen={settingsOpen}
      isExpanded={isExpanded}
    />
  );
};

MapBoxStory.story = {
  name: 'Using MapBox',
};

export const OpenlayersStory = () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleOnCardAction = (id, actionType) => {
    action('onCardAction')(actionType);
    if (actionType === CARD_ACTIONS.CLOSE_EXPANDED_CARD) {
      setIsExpanded(false);
    } else if (actionType === CARD_ACTIONS.OPEN_EXPANDED_CARD) {
      setIsExpanded(true);
    } else if (actionType === CARD_ACTIONS.ON_SETTINGS_CLICK) {
      setSettingsOpen((oldSettingsState) => !oldSettingsState);
    }
  };
  return (
    <OpenLayersExample
      data={data}
      options={options}
      isLegendFullWidth={boolean('isLegendFullWidth', false)}
      onCardAction={handleOnCardAction}
      availableActions={{ expand: true, settings: true }}
      isSettingPanelOpen={settingsOpen}
      isExpanded={isExpanded}
    />
  );
};

OpenlayersStory.story = {
  name: 'Using Open layers',
};
