import React, { useState } from 'react';
import List from '../List';

const SimpleList = ({
  title,
  hasSearch = false,
  buttons = [],
  items = [],
  i18n,
  isFullHeight,
  pageSize,
  ...others
}) => {
  const [searchValue, setSearchValue] = useState(null);
  const filteredItems =
    searchValue !== null
      ? items.filter(item => item.name.toLowerCase().search(searchValue.toLowerCase()) !== -1)
      : items;
  return (
    <List
      title={title}
      search={
        hasSearch
          ? {
              value: searchValue,
              onChange: evt => setSearchValue(evt.target.value),
            }
          : null
      }
      buttons={buttons}
      i18n={i18n}
      isFullHeight={isFullHeight}
      items={filteredItems}
      pageSize={pageSize}
    />
  );
};

export default SimpleList;
