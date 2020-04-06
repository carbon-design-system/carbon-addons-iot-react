import React from 'react';
import classnames from 'classnames';
import { Tooltip } from 'carbon-components-react';
import { ErrorFilled24, WarningFilled24 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import { ValueCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
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

const DataStateRenderer = ({ dataState, size, id }) => {
  const { label, description } = dataState;

  const withTooltip = (element, triggerId) => {
    return (
      <Tooltip
        showIcon={false}
        triggerText={element}
        triggerId={triggerId}
        tooltipId={`${triggerId}-tooltip`}
      >
        <TooltipContent tooltipContent={dataState} />
      </Tooltip>
    );
  };

  const renderDataStateGridIcon = () => {
    const { type } = dataState;
    let { icon } = dataState;
    if (!icon) {
      if (type === VALUE_CARD_DATA_STATE.ERROR) {
        icon = <ErrorFilled24 className={`${dsPrefix}-default-error-icon`} />;
      } else if (type === VALUE_CARD_DATA_STATE.NO_DATA) {
        icon = <WarningFilled24 className={`${dsPrefix}-default-warning-icon`} />;
      }
    }

    return withTooltip(icon, `${dsPrefix}-grid__icon-${id}`);
  };

  const renderDataStateGridItems = () => {
    const labelClass = `${dsPrefix}-grid__label`;
    const descriptionClass = `${dsPrefix}-grid__description`;
    return (
      <React.Fragment>
        {renderDataStateGridIcon()}
        {withTooltip(<span className={labelClass}>{label}</span>, `${labelClass}-${id}`)}
        {withTooltip(
          <p className={descriptionClass}>{description}</p>,
          `${descriptionClass}-${id}`
        )}
      </React.Fragment>
    );
  };

  return (
    <div
      className={`${dsPrefix}-container`}
      style={{ '--container-padding': `${CARD_CONTENT_PADDING}px` }}
    >
      <p className={classnames(`${dsPrefix}-dashes`)}>--</p>
      <div className={`${dsPrefix}-grid`}>
        {size === CARD_SIZES.SMALL ||
        size === CARD_SIZES.SMALLWIDE ||
        size === CARD_SIZES.MEDIUMTHIN
          ? renderDataStateGridIcon()
          : renderDataStateGridItems()}
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
