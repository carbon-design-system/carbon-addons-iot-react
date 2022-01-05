import React from 'react';
import PropTypes from 'prop-types';

import { Search } from '../../Search';
import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  title: PropTypes.string,
  buttons: PropTypes.arrayOf(PropTypes.node),
  search: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
    id: PropTypes.string,
  }),
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
    clearSearchIconDescription: PropTypes.string,
  }),
  testId: PropTypes.string,
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
  title: null,
  testId: 'list-header',
};

const ListHeader = ({ title, buttons, search, i18n, testId }) => {
  return (
    <div data-testid={testId} className={`${iotPrefix}--list-header-container`}>
      {title || (buttons && buttons.length > 0) ? (
        <div className={`${iotPrefix}--list-header`}>
          <div className={`${iotPrefix}--list-header--title`}>{title}</div>
          <div className={`${iotPrefix}--list-header--btn-container`}>{buttons}</div>
        </div>
      ) : null}
      {search ? (
        <div className={`${iotPrefix}--list-header--search`}>
          <Search
            closeButtonLabelText={i18n.clearSearchIconDescription}
            id={search.id || `${iotPrefix}--list-header--search`}
            placeholder={i18n.searchPlaceHolderText}
            onChange={search.onChange}
            size="lg"
            value={search.value}
            labelText={i18n.searchPlaceHolderText}
            data-testid={`${testId}-search-input`}
          />
        </div>
      ) : null}
    </div>
  );
};

ListHeader.propTypes = propTypes;
ListHeader.defaultProps = defaultProps;

export default ListHeader;
