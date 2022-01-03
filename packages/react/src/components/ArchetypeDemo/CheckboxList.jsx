import React from 'react';
import PropTypes from 'prop-types';
import { SkeletonText } from 'carbon-components-react';

import CheckboxListItem from './CheckboxListItem';

// This render functions provides the default mapping for black box components
const renderDefaultRow = ({ primaryValue }, { onChange, id, key, checked }) => (
  <CheckboxListItem
    key={key}
    primaryValue={primaryValue}
    onChange={onChange}
    id={id}
    checked={checked}
  />
);

const renderDefaultLoader = () => <SkeletonText width="90%" />;

const renderDefaultListContainer = (children) => <ul>{children}</ul>;

const CheckboxListPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
  renderLoader: PropTypes.func,
  renderRow: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};
const DefaultCheckboxListProps = {
  selectedIds: [],
  isLoading: false,
};

const CheckboxList = ({
  data,
  renderLoader: renderLoaderProp,
  renderRow: renderRowProp,
  selectedIds,
  onChange,
  isLoading,
}) => {
  const renderRow = renderRowProp || renderDefaultRow;
  const renderLoader = renderLoaderProp || renderDefaultLoader;

  return isLoading
    ? renderLoader()
    : renderDefaultListContainer(
        data.map((rowData) => {
          // Not sure if this is reasonable, but:
          // We need to stay data agnostic so we don't know which property can be used as key
          const id = JSON.stringify(rowData);
          const checked = selectedIds.includes(id);
          return renderRow(rowData, { id, checked, onChange, key: id });
        })
      );
};

CheckboxList.propTypes = CheckboxListPropTypes;
CheckboxList.defaultProps = DefaultCheckboxListProps;

export default CheckboxList;
