import React from 'react';
import { mount } from 'enzyme';

import Header from './Header';

describe('Header testcases', () => {
  test('onClick', () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <Header
        title="My Title"
        onClick={onClick}
        user="j@test.com"
        tenant="acme"
        appName="platform"
      />
    );
    wrapper.simulate('click');
    expect(onClick.mock.calls).toHaveLength(1);
  });
});
