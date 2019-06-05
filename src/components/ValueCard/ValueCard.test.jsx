import React from 'react';
import { mount } from 'enzyme';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

import ValueCard from './ValueCard';

describe('ValueCard', () => {
  test('fail over to vertical layouts when not enough space', () => {
    const wrapper = mount(<ValueCard content={[{ title: 'title', value: 'value' }]} />);
    expect(wrapper.find(Card).prop('layout')).toEqual(CARD_LAYOUTS.HORIZONTAL);

    const wrapper2 = mount(
      <ValueCard
        title="Something"
        content={[
          { title: 'title', value: 'value' },
          { title: 'title2', value: 'value2' },
          { title: 'title3', value: 'value3' },
          { title: 'title4', value: 'value4' },
        ]}
      />
    );
    expect(wrapper2.find(Card).prop('layout')).toEqual(CARD_LAYOUTS.VERTICAL);
  });
});
