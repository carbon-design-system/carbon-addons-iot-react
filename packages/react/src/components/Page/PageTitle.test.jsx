import React from 'react';
import { mount } from 'enzyme';

import PageTitle from './PageTitle';

describe('PageTitle', () => {
  it('renders', () => {
    let wrapper = mount(<PageTitle title="title" />);

    expect(wrapper.find('h1').text()).toEqual('title');
    expect(wrapper.find('h1 span').length).toEqual(0);

    wrapper = mount(<PageTitle title="title" section="section text" />);

    expect(wrapper.find('h1 span').text()).toEqual('section text /');
  });
});
