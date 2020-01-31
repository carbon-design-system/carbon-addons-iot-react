import React from 'react';
import { Search } from 'carbon-components-react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.node),
  search: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
  }),
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
  }).isRequired,
};

const defaultProps = {
  buttons: [],
  search: {
    onChange: () => {},
    value: '',
  },
};

const ListHeader = ({ title, buttons, search, i18n, ...others }) => {
  return (
    <div className="list-header-container">
      <div className="list-header">
        <div className="list-header--title">{title}</div>
        <div className="list-header--btn-container">{buttons}</div>
      </div>
      {search && (
        <div className="list-header--search">
          <Search
            placeHolderText={i18n.searchPlaceHolderText}
            onChange={search.onChange}
            size="sm"
            className=""
            value={search.value}
            labelText="Search"
          />
        </div>
      )}
    </div>
  );
};

ListHeader.propTypes = propTypes;
ListHeader.defaultProps = defaultProps;

export default ListHeader;
