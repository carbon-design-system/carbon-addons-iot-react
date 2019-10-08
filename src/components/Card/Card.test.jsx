import { mount } from 'enzyme';
import React from 'react';
import 'jest-styled-components';
/* eslint-disable*/
import { ToolbarItem, Tooltip } from 'carbon-components-react';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import Card, { SkeletonWrapper } from './Card';

const tooltipElement = <div>This is some other text</div>;

const cardProps = {
  title: 'My Title',
};

describe('Card testcases', () => {
  test('xsmall', () => {
    const wrapper = mount(<Card {...cardProps} size={CARD_SIZES.SMALL} />);

    // small should have full header
    expect(wrapper.find('.card--header')).toHaveLength(1);
  });

  test('render icons', () => {
    let wrapper = mount(
      <Card {...cardProps} size={CARD_SIZES.SMALL} availableActions={{ range: true }} />
    );
    // should render icons
    expect(wrapper.find(ToolbarItem)).toHaveLength(1);

    wrapper = mount(
      <Card
        {...cardProps}
        size={CARD_SIZES.XSMALL}
        availableActions={{ range: true, expand: true }}
      />
    );
    // range icon should not render if isEditable prop is true
    expect(wrapper.find(ToolbarItem)).toHaveLength(2);

    wrapper = mount(
      <Card {...cardProps} size={CARD_SIZES.XSMALL} isEditable availableActions={{ range: true }} />
    );
    // range icon should not render if isEditable prop is true
    expect(wrapper.find(ToolbarItem)).toHaveLength(0);
  });

  test('prop based styles', () => {
    //isEXpanded should set the height to 100%
    let wrapper = mount(
      <Card {...cardProps} isExpanded size={CARD_SIZES.LARGE} tooltip={tooltipElement} />
    );
    expect(wrapper).toHaveStyleRule('height', '100%');
    // tooltip prop will render a tooltip in the header
    expect(wrapper.find(Tooltip)).toHaveLength(1);
    // without the isLoading prop SkeletonWrapper should not be rendered
    expect(wrapper.find(SkeletonWrapper)).toHaveLength(0);
    // with the isLoading prop SkeletonWrapper should  be rendered
    wrapper = mount(
      <Card {...cardProps} isLoading size={CARD_SIZES.XSMALLWIDE} tooltip={tooltipElement} />
    );
    expect(wrapper.find(SkeletonWrapper)).toHaveLength(1);
  });
});
