import React from 'react';
import { mount } from 'enzyme';
// import { Loading } from 'carbon-components-react';

import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('Breadcrumb', () => {
  test('basic', () => {
    const wrapper = mount(
      <Breadcrumb {...commonProps}>
        <BreadcrumbItem href="#">Breadcrumb 1</BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
      </Breadcrumb>
    );
    expect(wrapper.find('Breadcrumb 1')).toHaveLength(1);
    const notLoadingWrapper = mount(
      <Breadcrumb {...commonProps}>
        <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
      </Breadcrumb>
    );
    expect(notLoadingWrapper.find('Breadcrumb 2')).toHaveLength(0);
  });
});
