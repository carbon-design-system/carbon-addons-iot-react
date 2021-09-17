import * as React from 'react';
import { OverflowMenu as CarbonOverflowMenu } from 'carbon-components-react';
import PropTypes from 'prop-types';
import { getMenuOffset } from 'carbon-components-react/es/components/OverflowMenu/OverflowMenu';

import { usePopoverPositioning } from '../../hooks/usePopoverPositioning';

export { OverflowMenuItem } from 'carbon-components-react';

export const OverflowMenu = ({
  direction,
  menuOffset,
  useAutoPositioning,
  flipped,
  testId,
  ...props
}) => {
  const [calculateMenuOffset, { adjustedDirection, adjustedFlipped }] = usePopoverPositioning({
    direction,
    flipped,
    menuOffset: menuOffset || getMenuOffset,
    isOverflowMenu: true,
    useAutoPositioning,
  });

  return (
    <CarbonOverflowMenu
      data-testid={testId}
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
  testId: PropTypes.string,
};

OverflowMenu.defaultProps = {
  ...CarbonOverflowMenu.defaultProps,
  useAutoPositioning: false,
  testId: 'overflow-menu',
};

export default OverflowMenu;
