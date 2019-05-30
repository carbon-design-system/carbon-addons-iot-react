import React from 'react';
import PropTypes from 'prop-types';

import { CardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';
import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import Table from '../Table/Table';

const TableCard = ({ title, design, data, columns, actions, options, size, ...others }) => {
  const layout = CARD_LAYOUTS.HORIZONTAL;

  return (
    <Card title={title} size={size} layout={layout} {...others}>
      <Table
        style={{ flex: 'inherit' }}
        columns={columns}
        data={data}
        actions={actions}
        options={options}
        lightweight
      />
    </Card>
  );
};

TableCard.propTypes = {
  ...CardPropTypes,
  /** Array of data - table content */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.shape(PropTypes.string.isRequired).isRequired,
    })
  ).isRequired,
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
};

TableCard.displayName = 'TableCard';

export default TableCard;
