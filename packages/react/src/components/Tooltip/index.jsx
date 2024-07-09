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
  showIcon,
  ...other
}) => {
  return (
    <>
      {showIcon ? <ToggletipLabel>{triggerText}</ToggletipLabel> : null}
      <Toggletip align={direction} autoAlign={useAutoPositioning} {...other}>
        <ToggletipButton>
          {showIcon ? (
            IconCustomElement ? (
              <IconCustomElement />
            ) : (
              <Information />
            )
          ) : (
            <ToggletipLabel>{triggerText}</ToggletipLabel>
          )}
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
  showIcon: PropTypes.bool,
};

Tooltip.defaultProps = {
  ...Toggletip.defaultProps,
  direction: 'bottom',
  triggerText: '',
  useAutoPositioning: false,
  showIcon: true,
};

export default Tooltip;
