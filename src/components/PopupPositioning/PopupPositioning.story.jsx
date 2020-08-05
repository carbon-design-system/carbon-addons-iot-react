import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select } from '@storybook/addon-knobs';
import { Tooltip, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

import FlyoutMenu, { FlyoutMenuDirection } from '../FlyoutMenu/FlyoutMenu';
import menuOffset from '../../utils/PopupPositioning';

const tooltipDirections = {
  Bottom: 'bottom',
  Top: 'top',
  Left: 'left',
  Right: 'right',
};

const props = () => {
  return {
    offsetFunction: boolean('Auto Positioning Active', true) ? menuOffset : undefined,
    flyoutDirection: select(
      'Flyout direction',
      FlyoutMenuDirection,
      FlyoutMenuDirection.BottomStart
    ),
    tooltipDirection: select('Tooltip direction', tooltipDirections, tooltipDirections.Bottom),
    flipped: boolean('Overflows flipped', false),
  };
};

const WrappedFlyout = ({ offsetFunction, flyoutDirection }) => {
  return (
    <div style={{ display: 'flex' }}>
      <FlyoutMenu
        iconDescription="description"
        buttonSize="default"
        menuOffset={offsetFunction}
        direction={flyoutDirection}
      >
        <div style={{ width: '900px', height: '300px', background: '#333333' }} />
      </FlyoutMenu>
    </div>
  );
};

const WrappedTooltip = ({ offsetFunction, tooltipDirection }) => {
  return (
    <Tooltip direction={tooltipDirection} triggerId="tooltip-id" menuOffset={offsetFunction}>
      <div style={{ width: '100px', height: '100px' }} />
    </Tooltip>
  );
};

const WrappedOverflow = ({ offsetFunction, flipped }) => {
  return (
    <OverflowMenu flipped={flipped} menuOffset={offsetFunction} menuOffsetFlip={offsetFunction}>
      <OverflowMenuItem itemText="Option 1" />
      <OverflowMenuItem itemText="Option 2" />
      <OverflowMenuItem itemText="Option 3" />
      <OverflowMenuItem itemText="Option 4" />
    </OverflowMenu>
  );
};

const AllPopups = ({ offsetFunction, flyoutDirection, tooltipDirection, flipped }) => {
  return (
    <>
      <div style={{ paddingBottom: '8px' }}>
        <WrappedFlyout offsetFunction={offsetFunction} flyoutDirection={flyoutDirection} />
      </div>
      <div style={{ paddingBottom: '8px', paddingLeft: '8px' }}>
        <WrappedTooltip offsetFunction={offsetFunction} tooltipDirection={tooltipDirection} />
      </div>
      <div style={{ paddingBottom: '8px', paddingLeft: '8px' }}>
        <WrappedOverflow offsetFunction={offsetFunction} flipped={flipped} />
      </div>
    </>
  );
};

storiesOf('Watson IoT Experimental/PopupPositioning', module).add('default', () => {
  const bottomBound = (window.innerHeight || document.documentElement.clientHeight) * 0.7;
  return (
    <div>
      <div style={{ position: 'absolute', top: '0%', left: '0%' }}>
        <AllPopups {...props()} />
      </div>
      <div style={{ position: 'absolute', top: '0%', left: '46%' }}>
        <AllPopups {...props()} />
      </div>
      <div style={{ position: 'absolute', top: '0%', left: '51%' }}>
        <WrappedFlyout
          offsetFunction={boolean('Auto Positioning Active', true) ? menuOffset : undefined}
          flyoutDirection={select(
            'Flyout direction',
            FlyoutMenuDirection,
            FlyoutMenuDirection.BottomStart
          )}
        />
      </div>
      <div style={{ position: 'absolute', top: '0%', left: '95%' }}>
        <AllPopups {...props()} />
      </div>
      <div style={{ position: 'absolute', top: `${bottomBound}px`, left: '0%' }}>
        <AllPopups {...props()} />
      </div>
      <div style={{ position: 'absolute', top: `${bottomBound}px`, left: '46%' }}>
        <AllPopups {...props()} />
      </div>
      <div style={{ position: 'absolute', top: `${bottomBound}px`, left: '51%' }}>
        <WrappedFlyout
          offsetFunction={boolean('Auto Positioning Active', true) ? menuOffset : undefined}
          flyoutDirection={select(
            'Flyout direction',
            FlyoutMenuDirection,
            FlyoutMenuDirection.BottomStart
          )}
        />
      </div>
      <div style={{ position: 'absolute', top: `${bottomBound}px`, left: '95%' }}>
        <AllPopups {...props()} />
      </div>
    </div>
  );
});
