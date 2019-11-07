import React from 'react';
import { mount } from 'enzyme';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import CustomCard from './CustomCard';

describe('Custom Card', () => {
  // handle click function test
  test('onClick', () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <CustomCard
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
        onClick={onClick}
        size={CARD_SIZES.MEDIUM}
      />
    );
    wrapper
      .find('div[onClick]')
      .first()
      .simulate('click');
    expect(onClick.mock.calls).toHaveLength(1);
  });
});
