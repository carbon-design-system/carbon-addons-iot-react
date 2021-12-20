import React from 'react';
import PropTypes from 'prop-types';

import CheckboxListItem from './CheckboxListItem';

// This render functions provides the default mapping for black box components
const renderDefaultRow = ({ primaryValue }, { onChange, id, checked }) => (
  <CheckboxListItem primaryValue={primaryValue} onChange={onChange} id={id} checked={checked} />
);

const renderDefaultListContainer = (children) => <ul>{children}</ul>;

const CheckboxListPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderRow: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};
const DefaultCheckboxListProps = {
  selectedIds: [],
};

const CheckboxList = ({ data, renderRow: renderRowProp, selectedIds, onChange }) => {
  const renderRow = renderRowProp || renderDefaultRow;
  return renderDefaultListContainer(
    data.map((rowData) => {
      // Not sure if this is reasonable, but:
      // We need to stay data agnostic so we don't know which property can be used as key
      const id = JSON.stringify(rowData);
      const checked = selectedIds.includes(id);
      return renderRow(rowData, { id, checked, onChange });
    })
  );
};

CheckboxList.propTypes = CheckboxListPropTypes;
CheckboxList.defaultProps = DefaultCheckboxListProps;

export default CheckboxList;
