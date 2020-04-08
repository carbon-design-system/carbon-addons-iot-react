import React from 'react';
import PropTypes from 'prop-types';

import { Search } from '../../Search';
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
  /** optional skeleton to be rendered while loading data */
  isLoading: PropTypes.bool.isRequired,
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

const ListHeader = ({ title, buttons, search, i18n, isLoading }) => {
  return (
    <div className={`${iotPrefix}--list-header-container`}>
      {title || (buttons && buttons.length > 0) ? (
        <div className={`${iotPrefix}--list-header`}>
          <div className={`${iotPrefix}--list-header--title`}>{title}</div>
          <div className={`${iotPrefix}--list-header--btn-container`}>
            {!isLoading ? buttons : null}
          </div>
        </div>
      ) : null}
      {search && !isLoading ? (
        <div className={`${iotPrefix}--list-header--search`}>
          <Search
            placeHolderText={i18n.searchPlaceHolderText}
            onChange={search.onChange}
            size="sm"
            value={search.value}
            labelText={i18n.searchPlaceHolderText}
          />
        </div>
      ) : null}
    </div>
  );
};

ListHeader.propTypes = propTypes;
ListHeader.defaultProps = defaultProps;

export default ListHeader;
