import React from 'react';
import classnames from 'classnames';
import { Tooltip } from 'carbon-components-react';
import { ErrorFilled24, WarningFilled24 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import { ValueCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import {
  CARD_SIZES,
  CARD_CONTENT_PADDING,
  VALUE_CARD_DATA_STATE,
} from '../../constants/LayoutConstants';

const { iotPrefix } = settings;
const dsPrefix = `${iotPrefix}--data-state`;

// Testing the tooltip content outside carbon proved difficult.
// So this is exposed for testing purpose.
export const TooltipContent = ({ tooltipContent }) => {
  const { label, description, extraTooltipText, learnMoreElement } = tooltipContent;

  return (
    <span className={`${dsPrefix}-tooltip`}>
      <p className={`${dsPrefix}-tooltip__label`}>{label}</p>
      <p>{description}</p>
      {extraTooltipText && <p>{extraTooltipText}</p>}
      {learnMoreElement}
    </span>
  );
};
TooltipContent.propTypes = { tooltipContent: ValueCardPropTypes.dataState.isRequired };

const DataStateIcon = ({ dataState }) => {
  const { type } = dataState;
  let { icon } = dataState;
  if (!icon) {
    if (type === VALUE_CARD_DATA_STATE.ERROR) {
      icon = <ErrorFilled24 className={`${dsPrefix}-default-error-icon`} />;
    } else if (type === VALUE_CARD_DATA_STATE.NO_DATA) {
      icon = <WarningFilled24 className={`${dsPrefix}-default-warning-icon`} />;
    }
  }
  return icon;
};

const DataStateRenderer = ({ dataState, size, id }) => {
  const { label, description } = dataState;

  const withTooltip = element => {
    return (
      <Tooltip
        showIcon={false}
        triggerText={element}
        triggerId={`${dsPrefix}-tooltip-trigger-${id}`}
        tooltipId={`${dsPrefix}-tooltip-${id}`}
      >
        <TooltipContent tooltipContent={dataState} />
      </Tooltip>
    );
  };

  const renderDataStateGridItems = () => {
    return (
      <React.Fragment>
        {withTooltip(<DataStateIcon dataState={dataState} />)}
        {withTooltip(<span className={`${dsPrefix}-grid__label`}>{label}</span>)}
        {withTooltip(<p className={`${dsPrefix}-grid__description`}>{description}</p>)}
      </React.Fragment>
    );
  };

  const renderDataStateGridItemsXSmall = () => {
    return withTooltip(<DataStateIcon dataState={dataState} />);
  };

  return (
    <div
      className={`${dsPrefix}-container`}
      style={{ '--container-padding': `${CARD_CONTENT_PADDING}px` }}
    >
      <p className={classnames(`${dsPrefix}-dashes`)}>--</p>
      <div className={`${dsPrefix}-grid`}>
        {size === CARD_SIZES.XSMALL ? renderDataStateGridItemsXSmall() : renderDataStateGridItems()}
      </div>
    </div>
  );
};

DataStateRenderer.propTypes = {
  size: CardPropTypes.size,
  id: CardPropTypes.id,
  dataState: ValueCardPropTypes.dataState.isRequired,
};
DataStateRenderer.defaultProps = {
  size: CARD_SIZES.MEDIUM,
  id: 'data-state-renderer',
};

export default DataStateRenderer;
