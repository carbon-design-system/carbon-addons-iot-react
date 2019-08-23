import React from 'react';
import { mount } from 'enzyme';
import { SkeletonText } from 'carbon-components-react';

import Button from '../Button';

import Hero from './Hero';
import { commonHeroProps, heroBreadcrumb } from './Hero.story';

describe('Hero', () => {
  test('Renders common props as expected', () => {
    const wrapper = mount(<Hero {...commonHeroProps} />);
    expect(wrapper.find('.hero-title--text h2')).toHaveLength(1);
    expect(wrapper.find('.hero-description')).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  test('Renders breadrumbs as expected', () => {
    const wrapper = mount(<Hero {...commonHeroProps} breadcrumb={heroBreadcrumb} />);
    expect(wrapper.find('.hero-breadcrumb')).toHaveLength(1);
  });

  test('Renders tooltip as expected', () => {
    const wrapper = mount(
      <Hero
        title={commonHeroProps.title}
        description={commonHeroProps.description}
        breadcrumb={heroBreadcrumb}
        collapsed
      />
    );
    expect(wrapper.find('.bx--tooltip__label')).toHaveLength(1);
    expect(wrapper.find('.hero-description')).toHaveLength(0);
  });

  describe('Renders editable title as expected', () => {
    const onEdit = jest.fn();
    const wrapper = mount(
      <Hero
        title={commonHeroProps.title}
        description={commonHeroProps.description}
        editable
        onEdit={onEdit}
      />
    );

    it('Renders edit icon button', () => {
      expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('Calls callback when edit is clicked', () => {
      wrapper.find(Button).simulate('click');
      expect(onEdit.mock.calls).toHaveLength(1);
    });
  });

  test('Renders loading state as expected', () => {
    const wrapper = mount(<Hero title={commonHeroProps.title} isLoading />);
    expect(wrapper.find(SkeletonText)).toHaveLength(1);
  });
});
