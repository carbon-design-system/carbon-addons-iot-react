import React from 'react';
import { mount } from 'enzyme';

import AddCard from './AddCard';

describe('AddCard', () => {
  it('onClick', () => {
    const onClick = jest.fn();
    const wrapper = mount(<AddCard title="My Title" onClick={onClick} />);
    wrapper.childAt(0).simulate('click');
    expect(onClick.mock.calls).toHaveLength(1);
  });
});
