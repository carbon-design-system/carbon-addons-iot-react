import { mount } from 'enzyme';
import React from 'react';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import Card, { CardHeader } from './Card';

const cardProps = {
  title: 'My Title',
};

describe('Card testcases', () => {
  test('xsmall', () => {
    const wrapper = mount(<Card {...cardProps} size={CARD_SIZES.XSMALL} />);
    // x-small shouldn't have full header
    expect(wrapper.find(CardHeader)).toHaveLength(0);

    const wrapper2 = mount(<Card {...cardProps} size={CARD_SIZES.SMALL} />);

    // small should have full header
    expect(wrapper2.find(CardHeader)).toHaveLength(1);
  });
});
