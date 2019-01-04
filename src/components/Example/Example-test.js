import React from 'react';
import { shallow } from 'enzyme';

import Example from './Example';

describe('Example', () => {
  describe('Renders as expected', () => {
    const wrapper = shallow(
      <Example className="extra-class">
        <div className="child">Test</div>
      </Example>
    );

    it('renders children as expected', () => {
      expect(wrapper.find('.child').length).toBe(1);
    });
  });
});
