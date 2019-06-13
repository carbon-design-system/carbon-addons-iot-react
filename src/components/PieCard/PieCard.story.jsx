import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { COLORS, CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import PieCard from './PieCard';

storiesOf('PieCard (Experimental)', module).add('basic', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <PieCard
        title={text('title', 'Alerts (last month)')}
        id="facility-temperature"
        isLoading={boolean('isLoading', false)}
        content={object('content', {
          title: 'Alerts',
          data: [
            { label: 'Sev 3', value: 6, color: COLORS.RED },
            { label: 'Sev 2', value: 9, color: COLORS.PURPLE },
            { label: 'Sev 1', value: 18, color: COLORS.BLUE },
          ],
        })}
        breakpoint="lg"
        size={size}
      />
    </div>
  );
});
