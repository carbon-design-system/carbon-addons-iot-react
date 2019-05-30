import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ValueCard from './ValueCard';

storiesOf('ValueCard (Experimental)', module)
  .add('small / single', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={object('content', [{ title: 'Comfort Level', value: 89, unit: '%' }])}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('small / multiple', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={object('content', [
            { title: 'Comfort Level', value: 89, unit: '%' },
            { title: 'Average Temperature', value: 76.7, unit: '˚F' },
            { title: 'Utilization', value: 76, unit: '%' },
            { title: 'Number of Alerts', value: 17 },
          ])}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('medium / multiple', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={object('content', [
            { title: 'Comfort Level', value: 89, unit: '%' },
            { title: 'Utilization', value: 76, unit: '%' },
            { title: 'Number of Alerts', value: 17 },
          ])}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('with boolean', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={[{ title: 'Uncomfortable?', value: boolean('value', false) }]}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  });
