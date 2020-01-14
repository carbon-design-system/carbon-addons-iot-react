import React from 'react';
import { Search } from 'carbon-components-react';

const ListHeader = ({ title, buttons, search, i18n, ...others }) => {
  return (
    <div className="list-header-container">
      <div className="list-header">
        <div className="list-header--title">{title}</div>
        <div className="list-header--btn-container">{buttons}</div>
      </div>
      {search !== null ? (
        <div>
          <Search
            placeHolderText={i18n.searchPlaceHolderText}
            onChange={search.onChange}
            size="sm"
            className="list--search"
            value={search.value}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ListHeader;
