import React from 'react';
import { mount } from 'enzyme';

import { CARD_LAYOUTS, VALUE_CARD_DATA_STATE, CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import Attribute from './Attribute';
import ValueCard from './ValueCard';

const { iotPrefix } = settings;

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
            { label: 'title', dataSourceId: 'v1' },
            { label: 'title2', dataSourceId: 'v2' },
            { label: 'title3', dataSourceId: 'v3' },
            { label: 'title4', dataSourceId: 'v4' },
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

  test('DataState prop shows DataState elements instead of content', () => {
    const wrapperWithoutDataState = mount(
      <ValueCard
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 'value' }}
      />
    );
    expect(wrapperWithoutDataState.find(`.${iotPrefix}--data-state-container`)).toHaveLength(0);

    const wrapperWithDataState = mount(
      <ValueCard
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        dataState={{
          type: VALUE_CARD_DATA_STATE.NO_DATA,
          label: '-',
          description: '-',
        }}
        values={{ v: 'value' }}
      />
    );
    expect(wrapperWithDataState.find(`.${iotPrefix}--data-state-container`)).toHaveLength(1);
  });
});
