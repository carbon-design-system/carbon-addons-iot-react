import React, { Fragment } from 'react';
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from 'carbon-components-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Bee32 from '@carbon/icons-react/lib/bee/32';
import warning from 'warning';

import { COLORS } from '../../styles/styles';

const StructuredListWrapperStyled = styled(({ isFixedWidth, ...others }) => (
  <StructuredListWrapper {...others} />
))`
  && {
    width: ${props => (props.isFixedWidth ? 'inherit;' : '')};
  }
`;

const EmptyContent = styled.div`
   {
    background-color: #ffffff;
    text-align: center;
    color: #5a6872;
    font-size: 14px;
    padding-top: 90px;
    padding-bottom: 115px;
    font-weight: regular;
    caption-side: bottom;
    display: table-caption;
  }
`;

const LoadingDiv = styled.div`
   {
    padding-top: 16px;
  }
`;

const StyledStructuredListCell = styled(StructuredListCell)`
  &&& {
    ${props => {
      const { width } = props;
      return width !== undefined
        ? `
        min-width: ${width};
        max-width: ${width};
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
      `
        : '';
    }}
  }
`;

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
}) => {
  if (__DEV__) {
    warning(
      false,
      'ComposedStructuredList component has been deprecated and will be removed in the next release of `carbon-addons-iot-react`. \n Refactor to use StructureList component instead.'
    );
  }
  return (
    <Fragment>
      <StructuredListWrapperStyled
        {...StructuredListWrapperProps}
        selection
        isFixedWidth={isFixedWidth}
      >
        <StructuredListHead className={StructuredListHeadClassName}>
          <StructuredListRow head>
            {columns.map(({ id, title, width = undefined }) => (
              <StyledStructuredListCell key={`${id}-column`} title={title} width={width} head>
                {title}
              </StyledStructuredListCell>
            ))}
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {data.map(item => (
            <StructuredListRow key={`${item.id}-row`} onClick={() => onRowClick(item.id)}>
              {columns.map(col => (
                <StyledStructuredListCell
                  key={`${col.id}-item`}
                  noWrap
                  title={
                    typeof item.values[col.id] === 'string' ||
                    typeof item.values[col.id] === 'number'
                      ? item.values[col.id]
                      : null
                  }
                  width={col.width}
                  style={design === 'normal' ? { lineHeight: '16px' } : {}}
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
                </StyledStructuredListCell>
              ))}
            </StructuredListRow>
          ))}
        </StructuredListBody>
        {!data.length ? (
          <EmptyContent>
            <Bee32 width={100} height={100} fill={COLORS.gray} />
            <LoadingDiv>{loadingDataLabel}</LoadingDiv>
          </EmptyContent>
        ) : (
          undefined
        )}
      </StructuredListWrapperStyled>
    </Fragment>
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
};

StructuredList.defaultProps = {
  StructuredListWrapperProps: null,
  StructuredListHeadClassName: null,
  StructuredListInputProps: null,
  design: 'mini',
  isFixedWidth: false,
  loadingDataLabel: '',
};

export default StructuredList;
