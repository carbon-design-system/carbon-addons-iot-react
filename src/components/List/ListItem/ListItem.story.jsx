import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../../constants/LayoutConstants';
import { getCardMinSize } from '../../../utils/componentUtilityFunctions';

import ListItem from './ListItem';

storiesOf('Watson IoT Experimental|ListItem', module)
  .add('basic', () => (
    <div style={{ width: 400 }}>
      <ListItem value="List Item" />
    </div>
  ))
  .add('with secondaryValue', () => (
    <div style={{ width: 400 }}>
      <ListItem value="List Item" secondaryValue="Secondary Value" />
    </div>
  ))
  .add('testing overflow', () => (
    <div style={{ width: 400 }}>
      <ListItem
        value="List Item this could be a really long value"
        secondaryValue="Secondary Value could also be a really, extraordinarily long value"
      />
    </div>
  ));
