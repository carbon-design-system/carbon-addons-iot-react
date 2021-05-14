import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';


import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';
import data from './data.json';
import options from './storyFiles/mapOptions';

import MapBoxStory from './MapBoxExample';
import OpenLayersStory from './OpenLayersExample';
import { CARD_ACTIONS } from '../../constants/LayoutConstants';


export const Experimental = () => <StoryNotice componentName="MapCard" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

export default {
  title: 'Watson IoT Experimental/☢️ MapCard',
  decorators: [withKnobs, React.createElement],
  parameters: {
    component: MapBoxExample,
  },
};

export const MapBoxExample = () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleOnCardAction = (id, actionType) => {
    if (actionType === CARD_ACTIONS.CLOSE_EXPANDED_CARD) {
      setIsExpanded(false);
    } else if (actionType === CARD_ACTIONS.OPEN_EXPANDED_CARD) {
      setIsExpanded(true);
    } else if (actionType === CARD_ACTIONS.ON_SETTINGS_CLICK) {
      setSettingsOpen((oldSettingsState) => !oldSettingsState)
    }
  }
  return (
  <MapBoxStory data={data} options={options} isLegendFullWidth={boolean('isLegendFullWidth', false)} onCardAction={handleOnCardAction} availableActions={{ expand: true, settings: true }} isSettingPanelOpen={settingsOpen} isExpanded={isExpanded} />
  )
};

export const OpenlayersExample = () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  return (
  <OpenLayersStory data={data} options={options} isLegendFullWidth={boolean('isLegendFullWidth', false)} onCardAction={() => setSettingsOpen(last => !last)}availableActions={{ expand: true, settings: true }} isSettingPanelOpen={settingsOpen}/>
  )
};


MapBoxExample.story = {
  name: 'MapBox example',
};


