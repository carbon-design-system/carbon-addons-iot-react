import React from 'react';
import { mount } from 'enzyme';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';

import Attribute from './Attribute';
import ValueCard from './ValueCard';

describe('ValueCard', () => {
  test('fail over to vertical layouts when not enough space', () => {
    const wrapper = mount(
      <ValueCard
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        values={{ v: 'value' }}
      />
    );
    expect(wrapper.find(Attribute).prop('layout')).toEqual(CARD_LAYOUTS.HORIZONTAL);

    const wrapper2 = mount(
      <ValueCard
        title="Something"
        content={{
          attributes: [
            { label: 'title', dataSourceId: 'v' },
            { label: 'title2', dataSourceId: 'v' },
            { label: 'title3', dataSourceId: 'v' },
            { label: 'title4', dataSourceId: 'v' },
          ],
        }}
        values={{ v: 'value' }}
      />
    );
    expect(
      wrapper2
        .find(Attribute)
        .first()
        .prop('layout')
    ).toEqual(CARD_LAYOUTS.VERTICAL);
  });
});
