import React from 'react';
import { storiesOf } from '@storybook/react';
import { Tooltip, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

import { menuOffset } from '../../utils/PopupPositioning';

const TempWrapper = () => {
  return (
    <>
      <Tooltip direction="bottom" menuOffset={menuOffset}>
        <div>
          A much much much much much much much much much much much much much much much much much
          much much much much much much much much much much much much much much much much much much
          much much much much much much muchlonger tooltip
        </div>
      </Tooltip>
      <Tooltip direction="left" menuOffset={menuOffset}>
        <div>
          A much much much much much much much much much much much much much much much much much
          much much much much much much much much much much much much much much much much much much
          much much much much much much muchlonger tooltip
        </div>
      </Tooltip>
      <OverflowMenu menuOffset={menuOffset}>
        <OverflowMenuItem itemText="Option 3" />
        <OverflowMenuItem itemText="Option 4" />
      </OverflowMenu>
      <OverflowMenu flipped menuOffsetFlip={menuOffset}>
        <OverflowMenuItem itemText="Option 3" />
        <OverflowMenuItem itemText="Option 4" />
      </OverflowMenu>
    </>
  );
};
storiesOf('Watson IoT/PopupPositioning', module).add('test', () => {
  return (
    <table style={{ width: '100%' }}>
      <tbody>
        <tr>
          <td style={{ width: '50%' }}>
            <TempWrapper />
          </td>
          <td style={{ width: '50%' }}>
            <TempWrapper />
          </td>
          <td style={{ width: '50%' }}>
            <TempWrapper />
          </td>
        </tr>
      </tbody>
    </table>
  );
});
