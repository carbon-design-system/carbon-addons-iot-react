import * as React from 'react';
import {
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  ToggletipActions,
} from '@carbon/react';
import PropTypes from 'prop-types';
import { Information } from '@carbon/icons-react';

// will remove this method later
export const getTooltipMenuOffset = () => {
  return {
    top: 0,
    left: 0,
  };
};

export const Tooltip = ({
  triggerText,
  direction,
  renderIcon: IconCustomElement,
  content,
  action,
  useAutoPositioning,
  ...other
}) => {
  return (
    <>
      <ToggletipLabel>{triggerText}</ToggletipLabel>
      <Toggletip align={direction} autoAlign={useAutoPositioning} {...other}>
        <ToggletipButton>
          {IconCustomElement ? <IconCustomElement /> : <Information />}
        </ToggletipButton>
        <ToggletipContent>
          {content}
          <ToggletipActions>{action}</ToggletipActions>
        </ToggletipContent>
      </Toggletip>
    </>
  );
};

Tooltip.propTypes = {
  ...Toggletip.propTypes,
  triggerText: PropTypes.string,
  direction: PropTypes.string,
  renderIcon: PropTypes.node,
  content: PropTypes.node,
  action: PropTypes.node,
  useAutoPositioning: PropTypes.bool,
};

Tooltip.defaultProps = {
  ...Toggletip.defaultProps,
  direction: 'bottom',
  triggerText: '',
  useAutoPositioning: false,
};

export default Tooltip;
