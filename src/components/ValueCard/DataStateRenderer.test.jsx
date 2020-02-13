import React from 'react';
import { mount } from 'enzyme';
import { Bee16 } from '@carbon/icons-react';
import { act } from 'react-dom/test-utils';

import { VALUE_CARD_DATA_STATE, CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import DataStateRenderer from './DataStateRenderer';

const { iotPrefix, prefix: carbonPrefix } = settings;

function getDataStateProp() {
  return {
    type: VALUE_CARD_DATA_STATE.NO_DATA,
    label: 'No data available for this score at this time',
    description: 'My description text',
    extraTooltipText: 'Lorem ipsum dolor sit amet',
    learnMoreURL: 'http://www.ibm.com',
    learnMoreText: 'Learn more',
  };
}

describe('ValueCard', () => {
  test('should render custom icon', () => {
    const size = CARD_SIZES.SMALL;
    const myDataState = getDataStateProp();
    myDataState.icon = (
      <Bee16 style={{ fill: 'orange' }}>
        <title>App supplied icon</title>
      </Bee16>
    );
    const wrapper = mount(<DataStateRenderer dataState={myDataState} size={size} />);
    expect(wrapper.find('svg title').text()).toEqual('App supplied icon');
    expect(wrapper.find(`svg.${iotPrefix}--data-state-default-warning-icon`)).toHaveLength(0);
    expect(wrapper.find(`svg.${iotPrefix}--data-state-default-error-icon`)).toHaveLength(0);
  });

  test('should use default icons if no app icon is passed down', () => {
    const size = CARD_SIZES.SMALL;
    const myDataState = getDataStateProp();
    const wrapperNoData = mount(
      <DataStateRenderer
        dataState={{ ...myDataState, type: VALUE_CARD_DATA_STATE.NO_DATA }}
        size={size}
      />
    );
    expect(wrapperNoData.find(`svg.${iotPrefix}--data-state-default-warning-icon`)).toHaveLength(1);
    expect(wrapperNoData.find(`svg.${iotPrefix}--data-state-default-error-icon`)).toHaveLength(0);

    const wrapperError = mount(
      <DataStateRenderer
        dataState={{ ...myDataState, type: VALUE_CARD_DATA_STATE.ERROR }}
        size={size}
      />
    );
    expect(wrapperError.find(`svg.${iotPrefix}--data-state-default-error-icon`)).toHaveLength(1);
    expect(wrapperError.find(`svg.${iotPrefix}--data-state-default-warning-icon`)).toHaveLength(0);
  });

  test('should render icon, label, description for sizes not equal XSMALL', () => {
    const myDataState = getDataStateProp();
    function hasLabelDescription(jsx) {
      const wrapper = mount(jsx);
      expect(wrapper.find(`svg.${iotPrefix}--data-state-default-warning-icon`)).toHaveLength(1);
      expect(wrapper.find(`.${iotPrefix}--data-state-grid__label`).text()).toEqual(
        myDataState.label
      );
      expect(wrapper.find(`.${iotPrefix}--data-state-grid__description`).text()).toEqual(
        myDataState.description
      );
    }

    hasLabelDescription(<DataStateRenderer dataState={myDataState} size={CARD_SIZES.XSMALLWIDE} />);
    hasLabelDescription(<DataStateRenderer dataState={myDataState} size={CARD_SIZES.SMALL} />);
    hasLabelDescription(<DataStateRenderer dataState={myDataState} size={CARD_SIZES.MEDIUM} />);
    hasLabelDescription(<DataStateRenderer dataState={myDataState} size={CARD_SIZES.TALL} />);
    hasLabelDescription(<DataStateRenderer dataState={myDataState} size={CARD_SIZES.WIDE} />);
    hasLabelDescription(<DataStateRenderer dataState={myDataState} size={CARD_SIZES.LARGE} />);
  });

  test('should only render icon for size XSMALL', () => {
    const myDataState = getDataStateProp();
    const wrapper = mount(<DataStateRenderer dataState={myDataState} size={CARD_SIZES.XSMALL} />);

    expect(wrapper.find(`svg.${iotPrefix}--data-state-default-warning-icon`)).toHaveLength(1);
    expect(wrapper.find(`.${iotPrefix}--data-state-grid__label`)).toHaveLength(0);
    expect(wrapper.find(`.${iotPrefix}--data-state-grid__description`)).toHaveLength(0);
  });

  test('should contain tooltip', () => {
    const myDataState = getDataStateProp();
    const wrapper = mount(<DataStateRenderer dataState={myDataState} size={CARD_SIZES.XSMALL} />);
    const clickableIconWrapper = wrapper
      .find(`svg.${iotPrefix}--data-state-default-warning-icon`)
      .closest('[onClick]');

    act(() => {
      clickableIconWrapper.props().onClick();
    });

    // Haven't found a good way to test the activation and content of the tooltip
    // So for now we are just checking that the tooltip component is present
    expect(wrapper.find('Tooltip')).toHaveLength(1);
  });
});
