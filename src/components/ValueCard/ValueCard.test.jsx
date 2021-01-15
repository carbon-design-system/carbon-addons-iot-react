import React from 'react';
import { mount } from 'enzyme';
import { screen, render } from '@testing-library/react';

import { CARD_DATA_STATE, CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import ValueCard from './ValueCard';

const { iotPrefix } = settings;

describe('ValueCard', () => {
  it('DataState prop shows DataState elements instead of content', () => {
    const wrapperWithoutDataState = mount(
      <ValueCard
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 'value' }}
      />
    );
    expect(
      wrapperWithoutDataState.find(`.${iotPrefix}--data-state-container`)
    ).toHaveLength(0);

    const wrapperWithDataState = mount(
      <ValueCard
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        dataState={{
          type: CARD_DATA_STATE.NO_DATA,
          label: '-',
          description: '-',
        }}
        values={{ v: 'value' }}
      />
    );
    expect(
      wrapperWithDataState.find(`.${iotPrefix}--data-state-container`)
    ).toHaveLength(1);
  });

  it('Id is passed down to the card', () => {
    const wrapper = mount(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 'value' }}
      />
    );
    expect(wrapper.find('Card#myIdTest')).toHaveLength(1);
  });

  it('Custom formatter is used', () => {
    let originalValue = '';
    let defaultFormattedValue = '';
    const testValue = 'Test Value!';

    render(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 10000 }}
        customFormatter={(formatted, original) => {
          originalValue = original;
          defaultFormattedValue = formatted;

          return testValue;
        }}
      />
    );

    expect(originalValue).toBe(10000);
    expect(defaultFormattedValue).toBe('10K');
    expect(screen.queryByText(testValue)).toBeTruthy();
  });
});
