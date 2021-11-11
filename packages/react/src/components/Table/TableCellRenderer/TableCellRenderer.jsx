import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tooltip, TooltipDefinition } from 'carbon-components-react';
import warning from 'warning';

import { settings } from '../../../constants/Settings';
import { CellTextOverflowPropType } from '../TablePropTypes';
import { CELL_TEXT_OVERFLOW } from '../tableConstants';

const { iotPrefix } = settings;

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]),
  cellTextOverflow: CellTextOverflowPropType,
  allowTooltip: PropTypes.bool,
  /** What locale should the number be rendered in */
  locale: PropTypes.string,
  renderDataFunction: PropTypes.func,
  columnId: PropTypes.string,
  rowId: PropTypes.string,
  row: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.node, PropTypes.bool, PropTypes.object, PropTypes.array])
  ),
};

const defaultProps = {
  row: null,
  children: null,
  allowTooltip: true,
  locale: null,
  renderDataFunction: null,
  columnId: null,
  rowId: null,
  cellTextOverflow: null,
};

const isElementTruncated = (element) => element.offsetWidth < element.scrollWidth;

const renderCustomCell = (renderDataFunction, args, className) => {
  const result = renderDataFunction(args);
  const title = typeof result === 'string' ? result : undefined;
  return (
    <span className={className} title={title}>
      {result}
    </span>
  );
};

/** Supports our default render decisions for primitive values */
const TableCellRenderer = ({
  children,
  allowTooltip,
  cellTextOverflow,
  locale,
  tooltip,
  renderDataFunction,
  columnId,
  rowId,
  row,
  isSortable,
  sortFunction,
  isFilterable,
  filterFunction,
}) => {
  const mySpanRef = React.createRef();
  const myClasses = classnames({
    [`${iotPrefix}--table__cell-text--truncate`]: cellTextOverflow === CELL_TEXT_OVERFLOW.TRUNCATE,
    [`${iotPrefix}--table__cell-text--no-wrap`]: cellTextOverflow === CELL_TEXT_OVERFLOW.GROW,
  });

  const [useTooltip, setUseTooltip] = useState(false);

  const withTooltip = (element, tooltipForExtraInformation) => {
    return tooltip ? (
      <TooltipDefinition
        triggerClassName={`${iotPrefix}--table__cell-tooltip`}
        tooltipText={tooltipForExtraInformation}
        id="table-header-tooltip"
      >
        {element}
      </TooltipDefinition>
    ) : (
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

  useEffect(() => {
    const canBeTruncated =
      typeof children === 'string' || typeof children === 'number' || typeof children === 'boolean';
    if (
      canBeTruncated &&
      cellTextOverflow === CELL_TEXT_OVERFLOW.TRUNCATE &&
      allowTooltip &&
      mySpanRef.current
    ) {
      setUseTooltip(isElementTruncated(mySpanRef.current));
    }
  }, [mySpanRef, children, cellTextOverflow, allowTooltip]);

  if (__DEV__) {
    const isObject =
      !React.isValidElement(children) && typeof children === 'object' && children !== null;
    const missingRender = isObject && typeof renderDataFunction !== 'function';
    const missingSort = isObject && isSortable && typeof sortFunction !== 'function';
    const missingFilter = isObject && isFilterable && typeof filterFunction !== 'function';
    warning(
      !missingRender,
      `You must supply a 'renderDataFunction' when passing objects as column values.`
    );

    warning(
      !missingSort,
      `You must supply a 'sortFunction' when isSortable is true and you're passing objects as column values.`
    );

    warning(
      !missingFilter,
      `You must supply a 'filterFunction' when passing objects as column values and want them filterable.`
    );
  }
  const cellContent = renderDataFunction ? (
    renderCustomCell(renderDataFunction, { value: children, columnId, rowId, row }, myClasses)
  ) : typeof children === 'string' || typeof children === 'number' ? (
    <span
      className={myClasses}
      title={
        useTooltip || tooltip
          ? undefined
          : typeof children === 'number' && locale
          ? children.toLocaleString(locale, { maximumFractionDigits: 20 })
          : children
      }
      ref={mySpanRef}
    >
      {typeof children === 'number' && locale
        ? children.toLocaleString(locale, { maximumFractionDigits: 20 })
        : children}
    </span>
  ) : typeof children === 'boolean' ? ( // handle booleans
    <span className={myClasses} title={useTooltip || tooltip ? undefined : children.toString()}>
      {children.toString()}
    </span>
  ) : typeof children === 'object' && !React.isValidElement(children) ? null : (
    children
  );

  return useTooltip || tooltip ? withTooltip(cellContent, tooltip) : cellContent;
};

TableCellRenderer.propTypes = propTypes;
TableCellRenderer.defaultProps = defaultProps;

export default TableCellRenderer;
