import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'carbon-components-react';

const propTypes = {
  /** i18n strings */
  i18n: PropTypes.shape({
    iconDescription: PropTypes.string,
    placeHolderText: PropTypes.string,
    closeButtonText: PropTypes.string,
  }),
  searchValue: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.string,
};

const defaultProps = {
  i18n: {
    iconDescription: 'Search',
    placeHolderText: '',
    closeButtonText: 'Clear search input',
  },
  searchValue: '',
  onChange: () => {},
  width: '304px',
};

const TileGallerySearch = ({ i18n, searchValue, onChange, width }) => {
  return (
    <div>
      <Search
        style={{ background: '#fff', width }}
        value={searchValue}
        labelText={i18n.iconDescription}
        placeHolderText={i18n.placeHolderText}
        onChange={event => onChange(event)}
        closeButtonLabelText={i18n.closeButtonText}
        id="dashboard-search"
      />
    </div>
  );
};

TileGallerySearch.propTypes = propTypes;
TileGallerySearch.defaultProps = defaultProps;

export default TileGallerySearch;
