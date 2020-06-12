import React from 'react';
import { mount, shallow } from 'enzyme';

import FlyoutMenu from './FlyoutMenu';

describe('FlyoutMenu', () => {
  it('Renders open', () => {
    const wrapper = shallow(<FlyoutMenu open triggerId="flyout-test" />);

    expect(wrapper.find('.iot-flyout-menu__cancel')).toHaveLength(1);
    expect(wrapper.find('.iot-flyout-menu__submit')).toHaveLength(1);
  });

  it('Renders closed', () => {
    const wrapper = mount(<FlyoutMenu open={false} triggerId="flyout-test" />);

    expect(wrapper.find('.iot-flyout-menu__cancel')).toHaveLength(0);
    expect(wrapper.find('.iot-flyout-menu__submit')).toHaveLength(0);
  });
});
