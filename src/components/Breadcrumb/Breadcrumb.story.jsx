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
import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { BreadcrumbSkeleton } from 'carbon-components-react';

import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';

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
          <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
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
  .add(
    'no trailing slash',
    () => (
      <Breadcrumb {...props()} noTrailingSlash>
        <BreadcrumbItem>
          <a href="/#">Breadcrumb 1</a>
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
      </Breadcrumb>
    ),
    {
      info: {
        text: 'You can choose not to render a trailing slash with the `noTrailingSlash` prop',
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
    'current page',
    () => (
      <Breadcrumb {...props()}>
        <BreadcrumbItem>
          <a href="/#">Breadcrumb 1</a>
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
        <BreadcrumbItem href="#" isCurrentPage>
          Breadcrumb 3
        </BreadcrumbItem>
      </Breadcrumb>
    ),
    {
      info: {
        text:
          'You can specify a BreadcrumbItem component as the current page with the `isCurrentPage` prop',
      },
    }
  )
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
      return (
        <>
          <Breadcrumb useResizeObserver {...props()}>
            <BreadcrumbItem href="#">1 Homexxxxxxxxxxxxxxxxxxxxxx</BreadcrumbItem>
            <BreadcrumbItem href="#">2 Devices</BreadcrumbItem>
            <BreadcrumbItem href="#">3 A really long page name</BreadcrumbItem>
            <BreadcrumbItem href="#">4 Another page</BreadcrumbItem>
            <BreadcrumbItem href="#">5th level page</BreadcrumbItem>
            <BreadcrumbItem href="#">6</BreadcrumbItem>
            <BreadcrumbItem href="#">7 page</BreadcrumbItem>
            <BreadcrumbItem href="#">8 pages, current level</BreadcrumbItem>
          </Breadcrumb>
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
  )
  .add(
    'with useResizeObserver, 320px width',
    () => {
      const containerWidth = number('container width', 320);
      return (
        <>
          <div style={{ width: containerWidth }}>
            <Breadcrumb useResizeObserver {...props()}>
              <BreadcrumbItem>
                <a href="/#">Breadcrumb 1</a>
              </BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 4</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 5</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 6</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <PolyfillWarning />
        </>
      );
    },
    {
      info: {
        text: 'You can set container width, and the Breadcrumb will adjust its length dynamicly',
      },
    }
  )
  .add(
    'with useResizeObserver, 672px width',
    () => {
      const containerWidth = number('container width', 672);
      return (
        <>
          <div style={{ width: containerWidth }}>
            <Breadcrumb {...props()}>
              <BreadcrumbItem>
                <a href="/#">Breadcrumb 1</a>
              </BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 4</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 5</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 6</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <PolyfillWarning />
        </>
      );
    },
    {
      info: {
        text: 'You can set container width, and the Breadcrumb will adjust its length dynamicly',
      },
    }
  )
  .add(
    'with useResizeObserver, 1056px width',
    () => {
      const containerWidth = number('container width', 1056);
      return (
        <>
          <div style={{ width: containerWidth }}>
            <Breadcrumb {...props()}>
              <BreadcrumbItem>
                <a href="/#">Breadcrumb 1</a>
              </BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 4</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 5</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 6</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <PolyfillWarning />
        </>
      );
    },
    {
      info: {
        text: 'You can set container width, and the Breadcrumb will adjust its length dynamicly',
      },
    }
  );
