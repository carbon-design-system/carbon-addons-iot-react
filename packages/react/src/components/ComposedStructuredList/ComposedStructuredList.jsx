import React from 'react';
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from '@carbon/react';
import PropTypes from 'prop-types';
import { Bee } from '@carbon/react/icons';
import warning from 'warning';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import { COLORS } from '../../styles/styles';

const { iotPrefix } = settings;

/**
 * Carbon Structured List simple with custom design and onClick
 */
const StructuredList = ({
  columns,
  data,
  design,
  isFixedWidth,
  onRowClick,
  loadingDataLabel,
  StructuredListWrapperProps,
  StructuredListHeadClassName,
  testId,
}) => {
  if (__DEV__) {
    warning(
      false,
      'ComposedStructuredList component has been deprecated and will be removed in the next release of `carbon-addons-iot-react`. \n Refactor to use StructureList component instead.'
    );
  }
  return (
    <>
      <StructuredListWrapper
        {...StructuredListWrapperProps}
        className={classnames({
          [`${iotPrefix}--composed-structured-list__wrapper`]: isFixedWidth,
        })}
        selection
        data-testid={testId}
      >
        <StructuredListHead data-testid={`${testId}-head`} className={StructuredListHeadClassName}>
          <StructuredListRow head>
            {columns.map(({ id, title, width = undefined }) => (
              <StructuredListCell
                className={classnames({
                  [`${iotPrefix}--composed-structured-list__list-cell`]: width !== undefined,
                })}
                key={`${id}-column`}
                title={title}
                head
              >
                {title}
              </StructuredListCell>
            ))}
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody data-testid={`${testId}-body`}>
          {data.map((item) => (
            <StructuredListRow
              data-testid={`${testId}-row-${item.id}`}
              key={`${item.id}-row`}
              onClick={() => onRowClick(item.id)}
            >
              {columns.map((col) => (
                <StructuredListCell
                  className={classnames({
                    [`${iotPrefix}--composed-structured-list__list-cell`]: col.width !== undefined,
                  })}
                  key={`${col.id}-item`}
                  noWrap
                  title={
                    typeof item.values[col.id] === 'string' ||
                    typeof item.values[col.id] === 'number'
                      ? item.values[col.id]
                      : null
                  }
                  style={
                    design === 'normal'
                      ? { '--width': col.width, lineHeight: '16px' }
                      : { '--width': col.width }
                  }
                >
                  {col.renderDataFunction
                    ? col.renderDataFunction({
                        // Call the column renderer if it's provided
                        value: item.values[col.id],
                        columnId: col.id,
                        rowId: item.id,
                        row: item.values,
                      })
                    : item.values[col.id]}
                </StructuredListCell>
              ))}
            </StructuredListRow>
          ))}
        </StructuredListBody>
        {!data.length ? (
          <div
            data-testid={`${testId}-empty`}
            className={`${iotPrefix}--composed-structured-list__empty-content`}
          >
            <Bee size={32} width={100} height={100} fill={COLORS.gray} />
            <div className={`${iotPrefix}--composed-structured-list__loading`}>
              {loadingDataLabel}
            </div>
          </div>
        ) : undefined}
      </StructuredListWrapper>
    </>
  );
};

StructuredList.propTypes = {
  /** Pass in props for StructuredListWrapper  */
  StructuredListWrapperProps: PropTypes.shape({
    /** Specify an optional className to be applied to the container node */
    className: PropTypes.string,
    /** Specify whether a border should be added to your StructuredListWrapper */
    border: PropTypes.bool,
    /** Specify whether your StructuredListWrapper should have selections */
    selection: PropTypes.bool,
    /** Specify a label to be read by screen readers on the container node */
    ariaLabel: PropTypes.string,
  }),
  /** Specify an optional className to be applied to the container node */
  StructuredListHeadClassName: PropTypes.string,
  /** Pass in props for StructuredListWrapper  */
  StructuredListInputProps: PropTypes.shape({
    /** Specify an optional className to be applied to the input */
    className: PropTypes.string,
    /** Provide an optional hook that is called each time the input is updated */
    onChange: PropTypes.func,
  }),
  /** Component row height */
  design: PropTypes.oneOf(['normal', 'mini']),
  /** Array of columns - header */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.string,
      /** for each column you can register a render callback function that is called with this object payload
       * {
       *    value: PropTypes.any (current cell value),
       *    columnId: PropTypes.string,
       *    rowId: PropTypes.string,
       *    row: PropTypes.object like this {col: value, col2: value}
       * }, you should return the node that should render within that cell */
      renderDataFunction: PropTypes.func,
    })
  ).isRequired,
  /** Array of data - table content */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.shape(PropTypes.string.isRequired).isRequired,
    })
  ).isRequired,
  /** If true, list will not take 100% of width */
  isFixedWidth: PropTypes.bool,
  /** Callback for when row is clicked */
  onRowClick: PropTypes.func.isRequired,
  /** Text label for loading data */
  loadingDataLabel: PropTypes.string,

  testId: PropTypes.string,
};

StructuredList.defaultProps = {
  StructuredListWrapperProps: null,
  StructuredListHeadClassName: null,
  StructuredListInputProps: null,
  design: 'mini',
  isFixedWidth: false,
  loadingDataLabel: '',
  testId: 'structured-list',
};

export default StructuredList;
