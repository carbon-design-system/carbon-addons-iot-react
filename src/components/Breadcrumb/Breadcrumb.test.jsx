import React from 'react';
import { BreadcrumbItem } from 'carbon-components-react';
import { render } from '@testing-library/react';

import Breadcrumb from './Breadcrumb';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('Breadcrumb', () => {
  test('overflows when container is smaller than breadcrumbs', () => {
    const { container } = render(
      <Breadcrumb {...commonProps} hasOverflow>
        <BreadcrumbItem href="#">Breadcrumb 1</BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
      </Breadcrumb>
    );
    expect(container.querySelector('.breadcrumb--overflow')).toBeFalsy();
  });
});

describe('Breadcrumb with overflow', () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientWidth'
  );
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth');

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
  });

  afterAll(() => {
    delete HTMLElement.prototype.clientWidth;
    delete HTMLElement.prototype.scrollWidth;
  });

  test('overflows when container is smaller than breadcrumbs', () => {
    const { container } = render(
      <Breadcrumb {...commonProps} hasOverflow>
        <BreadcrumbItem href="#">Breadcrumb 1</BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
      </Breadcrumb>
    );
    expect(container.querySelector('.breadcrumb--overflow')).toBeTruthy();
  });

  describe('has dev console warning(s)', () => {
    const originalDev = window.__DEV__;
    const originalResizeObserver = window.ResizeObserver;

    beforeAll(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(() => {
      window.__DEV__ = true;
      window.ResizeObserver = undefined;
    });

    afterEach(() => {
      console.error.mockClear();
      window.__DEV__ = originalDev;
      window.ResizeObserver = originalResizeObserver;
    });

    afterAll(() => {
      console.error.mockRestore();
    });

    test('when ResizeObserver is not supported in the current environment', () => {
      render(
        <Breadcrumb {...commonProps} hasOverflow>
          <BreadcrumbItem href="#">Breadcrumb 1</BreadcrumbItem>
          <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
          <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
