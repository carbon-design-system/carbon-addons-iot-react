import React from 'react';
import { action } from '@storybook/addon-actions';

import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';

import MapCard from './MapCard';

export const Experimental = () => <StoryNotice componentName="MapCard" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

export default {
  title: 'Watson IoT Experimental/☢️ MapCard',
  parameters: {
    component: MapCard,
  },
};







export const mapCard = () => (
  <MapCard />
);

mapCard.story = {
  name: 'new filter',
};

