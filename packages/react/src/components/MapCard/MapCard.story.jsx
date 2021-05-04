import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';


import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';
import data from './data.json';
import options from './storyFiles/mapOptions';

import MapBoxStory from './MapBoxStory';
import OpenLayersStory from './OpenLayersStory';


export const Experimental = () => <StoryNotice componentName="MapCard" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

export default {
  title: 'Watson IoT Experimental/☢️ MapCard',
  decorators: [withKnobs],
  parameters: {
    component: MapBoxCard,
  },
};

export const MapBoxCard = () => (
  <MapBoxStory data={data} options={options} isLegendFullWidth={boolean('isLegendFullWidth', false)} onCardAction={() => action('card action clickety clacked')} availableActions={{ expand: true, settings: true }}/>
);

export const OpenlayersExample = () => (
  <OpenLayersStory data={data} options={options} isLegendFullWidth={boolean('isLegendFullWidth', false)} onCardAction={() => action('card action clickety clacked')} availableActions={{ expand: true, settings: true }}/>
);


MapBoxCard.story = {
  name: 'MapBox example',
  decorators: [React.createElement],
};


