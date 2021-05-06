import * as React from 'react';
import { OverflowMenu as CarbonOverflowMenu } from 'carbon-components-react';
import PropTypes from 'prop-types';
// no idea why import { getMenuOffset } won't work, but it causes an 'getMenuOffset' is not exported by node_modules/carbon-components-react/lib/components/OverflowMenu/OverflowMenu.js error
import * as OM from 'carbon-components-react/lib/components/OverflowMenu/OverflowMenu';

import { usePopoverPositioning } from '../../hooks/usePopoverPositioning';

export { OverflowMenuItem } from 'carbon-components-react';

const { getMenuOffset } = OM;

export const OverflowMenu = ({ direction, menuOffset, useAutoPositioning, flipped, ...props }) => {
  const [calculateMenuOffset, { adjustedDirection, adjustedFlipped }] = usePopoverPositioning({
    direction,
    flipped,
    menuOffset: menuOffset || getMenuOffset,
    isOverflowMenu: true,
    useAutoPositioning,
  });

  return (
    <CarbonOverflowMenu
      {...props}
      direction={adjustedDirection}
      flipped={adjustedFlipped}
      menuOffset={calculateMenuOffset}
      menuOffsetFlip={calculateMenuOffset}
    />
  );
};

OverflowMenu.propTypes = {
  ...CarbonOverflowMenu.propTypes,
  useAutoPositioning: PropTypes.bool,
};

OverflowMenu.defaultProps = {
  ...CarbonOverflowMenu.defaultProps,
  useAutoPositioning: false,
};

export default OverflowMenu;
