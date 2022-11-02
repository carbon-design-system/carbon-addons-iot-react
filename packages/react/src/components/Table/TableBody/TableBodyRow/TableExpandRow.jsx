import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { ChevronRight16 } from '@carbon/icons-react';
import { TableCell } from 'carbon-components-react';

import Button from '../../../Button';
import { settings } from '../../../../constants/Settings';

const { prefix, iotPrefix } = settings;

const propTypes = {
  /**
   * Specify the string read by a voice reader when the expand trigger is
   * focused
   */
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * The id of the matching th node in the table head. Addresses a11y concerns outlined here: https://www.ibm.com/able/guidelines/ci162/info_and_relationships.html and https://www.w3.org/TR/WCAG20-TECHS/H43
   */
  expandHeader: PropTypes.string,

  /**
   * The description of the chevron right icon, to be put in its SVG `<title>` element.
   */
  expandIconDescription: PropTypes.string,

  /**
   * Specify whether this row is expanded or not. This helps coordinate data
   * attributes so that `TableExpandRow` and `TableExpandedRow` work together
   */
  isExpanded: PropTypes.bool.isRequired,

  /**
   * Specify if the row is selected
   */
  isSelected: PropTypes.bool,

  /**
   * Hook for when a listener initiates a request to expand the given row
   */
  onExpand: PropTypes.func.isRequired,

  /**
   * Unique row id
   */
  rowId: PropTypes.string.isRequired,

  /**
   * direction of document
   */
  langDir: PropTypes.oneOf(['ltr', 'rtl']),
};

const defaultProps = {
  children: [],
  className: '',
  expandHeader: 'expand',
  expandIconDescription: 'Click to expand content',
  isSelected: false,
  langDir: 'ltr',
};

const TableExpandRow = ({
  ariaLabel,
  className: rowClassName,
  children,
  isExpanded,
  onExpand,
  expandIconDescription,
  isSelected,
  expandHeader,
  rowId,
  langDir,
  ...rest
}) => {
  const className = cx(
    {
      [`${prefix}--parent-row`]: true,
      [`${prefix}--expandable-row`]: isExpanded,
      [`${prefix}--data-table--selected`]: isSelected,
    },
    rowClassName
  );
  const previousValue = isExpanded ? 'collapsed' : undefined;

  return (
    <tr {...rest} className={className} data-parent-row data-testid={`expand-row-${rowId}`}>
      <TableCell
        className={`${prefix}--table-expand`}
        data-previous-value={previousValue}
        headers={expandHeader}
      >
        <Button
          aria-label={ariaLabel}
          testId={`expand-icon-button-${rowId}`}
          className={cx(
            `${prefix}--btn--icon-only`,
            `${iotPrefix}--tooltip-svg-wrapper`,
            `${iotPrefix}--table-expand__button`,
            {
              [`${iotPrefix}--table-expand__button--open`]: !isExpanded,
              [`${iotPrefix}--table-expand__button--close`]: isExpanded,
            }
          )}
          onClick={onExpand}
          iconDescription={expandIconDescription}
          renderIcon={ChevronRight16}
          size="sm"
          tooltipAlignment={langDir === 'ltr' ? 'start' : 'end'}
          tooltipPosition="top"
          kind="icon-selection"
        />
      </TableCell>
      {children}
    </tr>
  );
};

TableExpandRow.propTypes = propTypes;
TableExpandRow.defaultProps = defaultProps;

export default TableExpandRow;
