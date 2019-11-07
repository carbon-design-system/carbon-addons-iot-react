import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import CustomCard from './CustomCard';

storiesOf('Watson IoT Experimental|CustomCard', module).add('basic', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <CustomCard
        // title={text('title', 'Image')}
        id="customCardSample"
        content={
          <div>
            <h3>custom title in card</h3>
            <br />
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus, distinctio neque
              unde error fugit qui possimus nobis voluptatem. Amet nulla doloremque placeat eveniet
              neque ut minus vel tempore dolorum qui voluptatum, mollitia veniam. Quaerat, neque
              omnis numquam a corporis expedita molestias inventore cum accusantium totam nulla
              corrupti, vel, perspiciatis consequatur sint aliquid explicabo architecto beatae magni
              quas officiis ullam! Suscipit esse dolore, architecto at voluptate vero mollitia.
              Minima tempora hic cum sit ea numquam, laboriosam obcaecati necessitatibus quidem ut
              eius quisquam laudantium ex atque explicabo voluptate id eaque magni illo doloribus
              adipisci fugit ab excepturi!
            </p>
          </div>
        }
        onClick={() => console.log('card clicked')}
        breakpoint="lg"
        size={size}
        onCardAction={action('onCardAction')}
        title=""
      />
    </div>
  );
});
