import React, { useState } from 'react';
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

const { iotPrefix, prefix: carbonPrefix } = settings;
const dsPrefix = `${iotPrefix}--data-state`;

const DataStateIcon = ({ dataState, onClick }) => {
  let icon;
  if (dataState.icon) {
    icon = dataState.icon;
  } else if (dataState.type === VALUE_CARD_DATA_STATE.ERROR) {
    icon = <ErrorFilled24 className={`${dsPrefix}-default-error-icon`} />;
  } else if (dataState.type === VALUE_CARD_DATA_STATE.NO_DATA) {
    icon = <WarningFilled24 className={`${dsPrefix}-default-warning-icon`} />;
  }

  const clickWrappedIcon = <span onClick={onClick}>{icon}</span>;
  return clickWrappedIcon;
};

const renderDataStateTooltipContent = dataState => {
  return (
    <span className={`${dsPrefix}-tooltip`}>
      <p className={`${dsPrefix}-tooltip__label`}>{dataState.label}</p>
      <p>{dataState.description}</p>
      <p>{dataState.extraTooltipText}</p>
      {dataState.learnMoreURL ? (
        <a
          className={`${carbonPrefix}--link`}
          href={dataState.learnMoreURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {dataState.learnMoreText}
        </a>
      ) : null}
    </span>
  );
};

const DataStateRenderer = ({ dataState, size }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltip = () => setTooltipOpen(open => !open);

  const renderElementWithTooltip = triggerElement => {
    return (
      <Tooltip open={tooltipOpen} showIcon={false} triggerText={triggerElement}>
        {tooltipOpen && renderDataStateTooltipContent(dataState)}
      </Tooltip>
    );
  };

  const renderDataStateGridItems = () => {
    const label = (
      <span className={`${dsPrefix}-grid__label`} onClick={toggleTooltip}>
        {dataState.label}
      </span>
    );
    return (
      <React.Fragment>
        <DataStateIcon dataState={dataState} onClick={toggleTooltip} />
        {renderElementWithTooltip(label)}
        <p className={`${dsPrefix}-grid__description`} onClick={toggleTooltip}>
          {dataState.description}
        </p>
      </React.Fragment>
    );
  };

  const renderDataStateGridItemsXSmall = () => {
    const icon = <DataStateIcon dataState={dataState} onClick={toggleTooltip} />;
    return renderElementWithTooltip(icon);
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

DataStateRenderer.propTypes = { size: CardPropTypes.size, dataState: ValueCardPropTypes.dataState };

export default DataStateRenderer;
