import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tooltip } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  wrapText: PropTypes.oneOf(['always', 'never', 'auto']).isRequired,
  truncateCellText: PropTypes.bool.isRequired,
  allowTooltip: PropTypes.bool,
  /** What locale should the number be rendered in */
  locale: PropTypes.string,
};

const defaultProps = {
  children: null,
  allowTooltip: true,
  locale: 'en',
};

const isElementTruncated = element => element.offsetWidth < element.scrollWidth;

/** Supports our default render decisions for primitive values */
const TableCellRenderer = ({ children, wrapText, allowTooltip, truncateCellText, locale }) => {
  const mySpanRef = React.createRef();
  const myClasses = classnames({
    [`${iotPrefix}--table__cell-text--truncate`]: wrapText !== 'always' && truncateCellText,
    [`${iotPrefix}--table__cell-text--no-wrap`]: wrapText === 'never',
  });

  const [useTooltip, setUseTooltip] = useState(false);

  const withTooltip = element => {
    return (
      <Tooltip
        showIcon={false}
        triggerText={element}
        triggerId="table-cell-tooltip-trigger"
        tooltipId="table-cell-tooltip"
      >
        {element}
      </Tooltip>
    );
  };

  useEffect(
    () => {
      const canBeTruncated =
        typeof children === 'string' ||
        typeof children === 'number' ||
        typeof children === 'boolean';
      if (canBeTruncated && truncateCellText && allowTooltip && mySpanRef && mySpanRef.current) {
        setUseTooltip(isElementTruncated(mySpanRef.current));
      }
    },
    [mySpanRef, children, wrapText, truncateCellText, allowTooltip]
  );

  const cellContent =
    typeof children === 'string' || typeof children === 'number' ? (
      <span className={myClasses} title={children} ref={mySpanRef}>
        {typeof children === 'number'
          ? children.toLocaleString(locale, { maximumFractionDigits: 20 })
          : children}
      </span>
    ) : typeof children === 'boolean' ? ( // handle booleans
      <span className={myClasses} title={children.toString()}>
        {children.toString()}
      </span>
    ) : (
      children
    );

  return useTooltip ? withTooltip(cellContent) : cellContent;
};

TableCellRenderer.propTypes = propTypes;
TableCellRenderer.defaultProps = defaultProps;

export default TableCellRenderer;
