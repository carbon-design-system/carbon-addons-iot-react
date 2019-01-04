import React from 'react';
import Example from '../Example';
import { shallow, mount } from 'enzyme';

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
