import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';

import PageTitle from './PageTitle';

describe('PageTitle', () => {
  it('should be selectable by testId', () => {
    render(<PageTitle title="title" testId="page_title" />);
    expect(screen.getByTestId('page_title')).toBeDefined();
  });

  it('renders', () => {
    let wrapper = mount(<PageTitle title="title" />);

    expect(wrapper.find('h1').text()).toEqual('title');
    expect(wrapper.find('h1 span').length).toEqual(0);

    wrapper = mount(<PageTitle title="title" section="section text" />);

    expect(wrapper.find('h1 span').text()).toEqual('section text /');
  });

  it('renders empty div if no title is given', () => {
    const wrapper = mount(<PageTitle />);

    expect(wrapper.find('h1')).toHaveLength(0);
  });
});
