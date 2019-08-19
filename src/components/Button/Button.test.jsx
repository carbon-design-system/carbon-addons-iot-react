import React from 'react';
import { mount } from 'enzyme';
import { Loading } from 'carbon-components-react';

import Button from './Button';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('Button', () => {
  test('loading', () => {
    const wrapper = mount(
      <Button loading {...commonProps}>
        Click Me
      </Button>
    );
    expect(wrapper.find(Loading)).toHaveLength(1);
    const notLoadingWrapper = mount(<Button {...commonProps}>Click Me</Button>);
    expect(notLoadingWrapper.find(Loading)).toHaveLength(0);
  });
});
