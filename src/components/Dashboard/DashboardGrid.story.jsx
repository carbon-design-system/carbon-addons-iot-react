import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import Card from '../Card/Card';
import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';

import DashboardGrid from './DashboardGrid';

const Cards = [
  <Card
    title="Facility Metrics"
    key="facility"
    id="facility"
    size={CARD_SIZES.SMALL}
    type={CARD_TYPES.VALUE}
    availableActions={{
      delete: true,
    }}
    content="My Facility Metrics"
  />,
  <Card
    title="Humidity"
    key="humidity"
    id="humidity"
    size={CARD_SIZES.XSMALL}
    type={CARD_TYPES.VALUE}
    availableActions={{
      delete: true,
    }}
    content="My Humidity Values"
  />,
  <Card
    title="Utilization"
    id="utilization"
    key="utilization"
    size={CARD_SIZES.XSMALL}
    type={CARD_TYPES.VALUE}
    availableActions={{
      delete: true,
    }}
    content="My utilization chart"
  />,
];

const commonGridProps = {
  onBreakpointChange: action('onBreakpointChange'),
  onLayoutChange: action('onLayoutChange'),
};

storiesOf('Watson IoT/Dashboard Grid', module)
  .add(
    'dashboard, default layouts',
    () => {
      return (
        <Fragment>
          Resize your window to see the callback handlers get triggered in the Actions tab.
          <FullWidthWrapper>
            <DashboardGrid {...commonGridProps}>{Cards}</DashboardGrid>
          </FullWidthWrapper>
        </Fragment>
      );
    },
    {
      info: {
        text: `
      This is the simplest way to use the dashboard grid, just pass it a set of cards and let it figure out it's own layout to use.
      # Component Overview
      `,
      },
    }
  )
  .add(
    'dashboard, is Edtiable',
    () => {
      return (
        <Fragment>
          You can drag and drop the cards around. Watch the handler get triggered on the Actions
          tab.
          <FullWidthWrapper>
            <DashboardGrid {...commonGridProps} isEditable={boolean('isEditable', true)}>
              {Cards}
            </DashboardGrid>
          </FullWidthWrapper>
        </Fragment>
      );
    },
    {
      info: {
        text: `
        The onLayoutChange handler is triggered as you drag and drop the cards around
        # Component Overview
        `,
      },
    }
  )
  .add(
    'dashboard, custom layout',
    () => {
      return (
        <Fragment>
          Passes a custom layout to the dashboard grid. Only the lg and md breakpoint have a custom
          layout defined. Resize the screen to see the cards reposition and resize themselves at
          different layouts.
          <FullWidthWrapper>
            <DashboardGrid
              {...commonGridProps}
              layouts={{
                lg: [
                  { i: 'facility', x: 4, y: 4, w: 1, h: 1 },
                  { i: 'humidity', x: 0, y: 0, w: 1, h: 1 },
                  { i: 'utilization', x: 3, y: 0, w: 1, h: 1 },
                ],
                md: [
                  { i: 'facility', x: 0, y: 0, w: 1, h: 1 },
                  { i: 'humidity', x: 0, y: 1, w: 1, h: 1 },
                  { i: 'utilization', x: 0, y: 2, w: 1, h: 1 },
                ],
              }}
            >
              {Cards}
            </DashboardGrid>
          </FullWidthWrapper>
        </Fragment>
      );
    },
    {
      info: {
        text: `
        The breakpoint property tells the dashboard which
        layout to use. You should listen to the onBreakpointChange event to keep 
        track of which breakpoint is currently being used in your local components state, and pass back in the breakpoint accordingly.
        # Component Overview
        `,
      },
    }
  );
