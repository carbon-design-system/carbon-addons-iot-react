/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import { BreadcrumbSkeleton, BreadcrumbItem } from 'carbon-components-react';

import Breadcrumb from './Breadcrumb';

const props = () => ({
  className: 'some-class',
  noTrailingSlash: boolean('No trailing slash (noTrailingSlash)', false),
  onClick: action('onClick'),
});

const PolyfillWarning = () => (
  <p style={{ marginTop: '5rem' }}>
    Note: This prop utilizes a{' '}
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">ResizeObserver</a> to
    detect changes to the container width. A{' '}
    <a href="https://www.npmjs.com/package/resize-observer-polyfill">polyfill</a> will likely need
    to be added to your application due to{' '}
    <a href="https://caniuse.com/#feat=resizeobserver">current browser support</a>.
  </p>
);

storiesOf('Watson IoT | Breadcrumb', module)
  .addDecorator(withKnobs)
  .add(
    'default',
    () => {
      return (
        <Breadcrumb {...props()}>
          <BreadcrumbItem href="#">Breadcrumb 1</BreadcrumbItem>
          <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
          <BreadcrumbItem href="#">{text('Breadcrumb 3 text', 'Breadcrumb 3')}</BreadcrumbItem>
        </Breadcrumb>
      );
    },
    {
      info: {
        text: `
          Breadcrumb enables users to quickly see their location within a path of navigation and move up to a parent level if desired.
        `,
      },
    }
  )

  .add('skeleton', () => <BreadcrumbSkeleton />, {
    info: {
      text: `
          Placeholder skeleton state to use when content is loading.
          `,
    },
  })

  .add(
    'current page with aria-current',
    () => (
      <Breadcrumb {...props()}>
        <BreadcrumbItem>
          <a href="/#">Breadcrumb 1</a>
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
        <BreadcrumbItem href="#" aria-current="page">
          Breadcrumb 3
        </BreadcrumbItem>
      </Breadcrumb>
    ),
    {
      info: {
        text:
          'You can specify a BreadcrumbItem component as the current page with the `aria-current` prop by specifying `aria-current="page"`',
      },
    }
  )
  .add(
    'with useResizeObserver',
    () => {
      // const containerWidth = number('container width', 584);
      return (
        <>
          <div style={{ width: '50vw', border: '1px solid', padding: '1rem' }}>
            <Breadcrumb hasOverflow {...props()}>
              <BreadcrumbItem href="#" title="1 Homexxxxxxxxxxxxxxxxxxxxxx">
                1 Homexxxxxxxxxxxxxxxxxxxxxx
              </BreadcrumbItem>
              <BreadcrumbItem
                href="#"
                onClick={e => {
                  e.preventDefault();
                  console.log('clicked');
                }}
                title="2 Devices"
              >
                2 Devices
              </BreadcrumbItem>
              <BreadcrumbItem href="#" title="3 A really long page name">
                3 A really long page name
              </BreadcrumbItem>
              <BreadcrumbItem href="#" title={text('Breadcrumb 4 text', '4 Another page')}>
                {text('Breadcrumb 4 text', '4 Another page')}
              </BreadcrumbItem>
              <BreadcrumbItem
                href="#"
                isCurrentPage
                title={text('Breadcrumb 5 text', '5th level page')}
              >
                {text('Breadcrumb 5 text', '5th level page')}
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <PolyfillWarning />
        </>
      );
    },
    {
      info: {
        text: `
          Breadcrumbs can be automatically collapsed into an overflow menu by toggling 'useResizeObserver'. Note, this requires the containing application to provide a polyfill for ResizeObserver!
        `,
      },
    }
  );
