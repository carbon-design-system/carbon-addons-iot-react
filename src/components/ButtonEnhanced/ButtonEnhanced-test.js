import React from 'react';
import { mount } from 'enzyme';
import { Loading } from 'carbon-components-react';

import ButtonEnhanced from './ButtonEnhanced';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('ButtonEnhanced', () => {
  test('loading', () => {
    const wrapper = mount(
      <ButtonEnhanced loading {...commonProps}>
        Click Me
      </ButtonEnhanced>
    );
    expect(wrapper.find(Loading)).toHaveLength(1);
    const notLoadingWrapper = mount(<ButtonEnhanced {...commonProps}>Click Me</ButtonEnhanced>);
    expect(notLoadingWrapper.find(Loading)).toHaveLength(0);
  });
});
