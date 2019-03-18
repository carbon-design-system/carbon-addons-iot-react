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

const StructuredListWrapperStyled = styled(StructuredListWrapper)`
   {
    background-color: #ffffff;
    margin-bottom: 0;

    .bx--structured-list-th {
      padding-left: 16px;
    }

    .bx--structured-list-td {
      padding-left: 16px;
      line-height: 8px;
    }
  }
`;

const EmptyDiv = styled.div`
   {
    background-color: #ffffff;
    text-align: center;
    color: #5a6872;
    font-size: 14px;
    padding-top: 90px;
    padding-bottom: 115px;
    font-weight: regular;
  }
`;

const LoadingDiv = styled.div`
   {
    padding-top: 16px;
  }
`;

const IconDiv = styled.div`
   {
    fill: #5a6872;
    width: 100px;
    height: 100px;
    display: inline-block;
  }
`;

/**
 * Carbon Structured List simple with custom design and onClick
 */
const StructuredList = ({ columns, data, design, onRowClick, loadingDataLabel }) => (
  <Fragment>
    <StructuredListWrapperStyled selection>
      <StructuredListHead>
        <StructuredListRow head>
          {columns.map(({ id, title }) => (
            <StructuredListCell key={`${id}-column`} head>
              {title}
            </StructuredListCell>
          ))}
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {data.map(item => (
          <StructuredListRow key={`${item.id}-row`} onClick={() => onRowClick(item.id)}>
            {columns.map(col => (
              <StructuredListCell
                key={`${col.id}-item`}
                noWrap
                style={design === 'normal' ? { lineHeight: '16px' } : {}}>
                {item.values[col.id]}
              </StructuredListCell>
            ))}
          </StructuredListRow>
        ))}
      </StructuredListBody>
    </StructuredListWrapperStyled>
    {!data.length ? (
      <EmptyDiv>
        <IconDiv>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="M16 10a6 6 0 0 0-6 6v8a6 6 0 0 0 12 0v-8a6 6 0 0 0-6-6zm-4.25 7.87h8.5v4.25h-8.5zM16 28.25A4.27 4.27 0 0 1 11.75 24v-.13h8.5V24A4.27 4.27 0 0 1 16 28.25zm4.25-12.13h-8.5V16a4.25 4.25 0 0 1 8.5 0zm10.41 3.09L24 13v9.1a4 4 0 0 0 8 0 3.83 3.83 0 0 0-1.34-2.89zM28 24.35a2.25 2.25 0 0 1-2.25-2.25V17l3.72 3.47A2.05 2.05 0 0 1 30.2 22a2.25 2.25 0 0 1-2.2 2.35zM0 22.1a4 4 0 0 0 8 0V13l-6.66 6.21A3.88 3.88 0 0 0 0 22.1zm2.48-1.56L6.25 17v5.1a2.25 2.25 0 0 1-4.5 0 2.05 2.05 0 0 1 .73-1.56zM15 5.5A3.5 3.5 0 1 0 11.5 9 3.5 3.5 0 0 0 15 5.5zm-5.25 0a1.75 1.75 0 1 1 1.75 1.75A1.77 1.77 0 0 1 9.75 5.5zM20.5 2A3.5 3.5 0 1 0 24 5.5 3.5 3.5 0 0 0 20.5 2zm0 5.25a1.75 1.75 0 1 1 1.75-1.75 1.77 1.77 0 0 1-1.75 1.75z" />
          </svg>
        </IconDiv>
        <LoadingDiv>{loadingDataLabel}</LoadingDiv>
      </EmptyDiv>
    ) : (
      undefined
    )}
  </Fragment>
);

StructuredList.propTypes = {
  /** Component row height */
  design: PropTypes.oneOf(['normal', 'mini']),
  /** Array of columns - header */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Array of data - table content */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.shape(PropTypes.string.isRequired).isRequired,
    })
  ).isRequired,
  /** Callback for when row is clicked */
  onRowClick: PropTypes.func.isRequired,
  /** Text label for loading data */
  loadingDataLabel: PropTypes.string,
};

StructuredList.defaultProps = {
  design: 'mini',
  loadingDataLabel: '',
};

export default StructuredList;
