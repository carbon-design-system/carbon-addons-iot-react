import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { BreadcrumbItem as CarbonBreadcrumbItem } from 'carbon-components-react';

import Breadcrumb from './Breadcrumb';

const BreadcrumbProps = {
  onClick: action('click'),
};

storiesOf('Watson IoT|Breadcrumb', module)
  .add('default', () => (
    <Breadcrumb {...BreadcrumbProps}>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item1</CarbonBreadcrumbItem>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item2</CarbonBreadcrumbItem>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item3</CarbonBreadcrumbItem>
    </Breadcrumb>
  ))
  .add('overview', () => (
    <Breadcrumb {...BreadcrumbProps}>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item1</CarbonBreadcrumbItem>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item2</CarbonBreadcrumbItem>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item3</CarbonBreadcrumbItem>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item4</CarbonBreadcrumbItem>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item5</CarbonBreadcrumbItem>
      <CarbonBreadcrumbItem href="/">Breadcrumb Item6</CarbonBreadcrumbItem>
    </Breadcrumb>
  ));
//   .add('not loading', () => <Breadcrumb {...BreadcrumbProps}>Test Breadcrumb</Breadcrumb>);
