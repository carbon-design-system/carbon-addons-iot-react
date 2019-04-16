import React from 'react';
import { mount } from 'enzyme';

import PageWorkArea from './PageWorkArea';

describe('PageWorkArea', () => {
  test('isOpen', () => {
    const wrapper = mount(<PageWorkArea isOpen={false}>Hi</PageWorkArea>);
    expect(wrapper.find('div')).toHaveLength(0);
    const wrapper2 = mount(<PageWorkArea isOpen>Hi</PageWorkArea>);
    expect(wrapper2.find('div')).toHaveLength(1);
  });
});
