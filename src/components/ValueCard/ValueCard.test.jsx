import React from 'react';
import { mount } from 'enzyme';

import { CARD_LAYOUTS, VALUE_CARD_DATA_STATE, CARD_SIZES } from '../../constants/LayoutConstants';

import Attribute from './Attribute';
import ValueCard from './ValueCard';
import { settings } from '../../constants/Settings';

const { iotPrefix, prefix: carbonPrefix } = settings;

function getDataStateProp() {
  return {
    type: VALUE_CARD_DATA_STATE.NO_DATA,
    label: 'No data available for this score at this time',
    description:
      'The last successful score was 68 at 13:21 - 10/21/2019 but wait, there is more, according to the latest test results this line is too long.',
    extraTooltipText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    learnMoreURL: 'http://www.ibm.com',
    learnMoreText: 'Learn more',
  };
}

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

  test('temp', () => {
    const myDataState = getDataStateProp();
    const wrapperWithoutDataState = mount(
      <ValueCard
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
      />
    );
    expect(wrapperWithoutDataState.find(`.${iotPrefix}--data-state-container`)).toHaveLength(0);

    const wrapperWithDataState = mount(
      <ValueCard
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        dataState={myDataState}
      />
    );

    expect(wrapperWithDataState.find(`.${iotPrefix}--data-state-container`)).toHaveLength(1);
  });
});
