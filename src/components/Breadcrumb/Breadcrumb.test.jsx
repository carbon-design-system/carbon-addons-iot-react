import React from 'react';
import { BreadcrumbItem } from 'carbon-components-react';
import { render } from '@testing-library/react';

import Breadcrumb from './Breadcrumb';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('Breadcrumb', () => {
  test('basic', () => {
    const { getByTestId } = render(
      <div style={{ width: '300px', border: '1px solid', padding: '1rem' }}>
        <Breadcrumb {...commonProps} hasOverflow>
          <BreadcrumbItem href="#">Breadcrumb 1</BreadcrumbItem>
          <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
          <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
        </Breadcrumb>
      </div>
    );
    expect(getByTestId('overflow')).toBeTruthy();
  });
});
