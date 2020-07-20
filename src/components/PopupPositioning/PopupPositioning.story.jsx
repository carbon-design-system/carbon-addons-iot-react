import React from 'react';
import { storiesOf } from '@storybook/react';
import { Tooltip, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

import PopupPositioning from './PopupPositioning';

const content = (
  <>
    <PopupPositioning>
      <Tooltip>
        <div>A much much much much much much much longer tooltip</div>
      </Tooltip>
    </PopupPositioning>
    <PopupPositioning>
      <OverflowMenu>
        <OverflowMenuItem itemText="Option 3" />
        <OverflowMenuItem itemText="Option 4" />
      </OverflowMenu>
    </PopupPositioning>
    <PopupPositioning>
      <OverflowMenu flipped>
        <OverflowMenuItem itemText="Option 3" />
        <OverflowMenuItem itemText="Option 4" />
      </OverflowMenu>
    </PopupPositioning>
  </>
);

storiesOf('Watson IoT/PopupPositioning', module).add('test', () => {
  return (
    <table style={{ width: '100%' }}>
      <tbody>
        <tr>
          <td style={{ width: '50%' }}>{content}</td>
          <td style={{ width: '50%' }}>{content}</td>
          <td>{content}</td>
        </tr>
      </tbody>
    </table>
  );
});
