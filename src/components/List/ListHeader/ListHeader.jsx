import React from 'react';
import { Search } from 'carbon-components-react';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.node),
  search: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
  }),
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
  }),
};

const defaultProps = {
  buttons: [],
  search: {
    onChange: () => {},
    value: '',
  },
  i18n: {
    searchPlaceHolderText: 'Enter a value',
  },
};

const ListHeader = ({ title, buttons, search, i18n }) => {
  return (
    <div className={`${iotPrefix}--list-header-container`}>
      {title || (buttons && buttons.length > 0) ? (
        <div className={`${iotPrefix}--list-header`}>
          <div className={`${iotPrefix}--list-header--title`}>{title}</div>
          <div className={`${iotPrefix}--list-header--btn-container`}>{buttons}</div>
        </div>
      ) : null}
      {search && (
        <div className={`${iotPrefix}--list-header--search`}>
          <Search
            placeHolderText={i18n.searchPlaceHolderText}
            onChange={search.onChange}
            size="sm"
            value={search.value}
            labelText={i18n.searchPlaceHolderText}
          />
        </div>
      )}
    </div>
  );
};

ListHeader.propTypes = propTypes;
ListHeader.defaultProps = defaultProps;

export default ListHeader;
