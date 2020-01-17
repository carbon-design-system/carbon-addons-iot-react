import React, { useState } from 'react';
import List from '../List';

const SimpleList = ({
  title,
  hasSearch = false,
  buttons = [],
  items = [],
  i18n,
  isFullHeight,
  pageSize = null,
  ...others
}) => {
  const [searchValue, setSearchValue] = useState(null);
  const [filteredItems, setfilteredItems] = useState(items);

  let rowPerPage = 0;
  switch (pageSize) {
    default:
      rowPerPage = 5;
      break;
    case 'sm':
      rowPerPage = 5;
      break;
    case 'lg':
      rowPerPage = 10;
      break;
    case 'xl':
      rowPerPage = 20;
      break;
  }

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  let [itemsToShow, setItemsToShow] = useState(filteredItems.slice(0, rowPerPage));

  const numberOfItems = filteredItems.length;
  const onPage = page => {
    const rowUpperLimit = page * rowPerPage;
    const currentItemsOnPage = filteredItems.slice(rowUpperLimit - rowPerPage, rowUpperLimit);
    setCurrentPageNumber(page);
    setItemsToShow(currentItemsOnPage);
  };

  const pagination = {
    page: currentPageNumber,
    onPage: onPage,
    maxPage: Math.ceil(numberOfItems / rowPerPage),
  };

  return (
    <List
      title={title}
      search={
        hasSearch
          ? {
              value: searchValue,
              onChange: evt => {
                const searchTerm = evt.target.value === undefined ? '' : evt.target.value;
                const filteredItems = items.filter(
                  item => item.content.name.toLowerCase().search(searchTerm.toLowerCase()) !== -1
                );

                setfilteredItems(filteredItems);
                if (pageSize !== null) {
                  setItemsToShow(filteredItems.slice(0, rowPerPage));
                }
              },
            }
          : null
      }
      buttons={buttons}
      i18n={i18n}
      isFullHeight={isFullHeight}
      items={pageSize != null ? itemsToShow : filteredItems}
      pagination={pagination}
    />
  );
};

export default SimpleList;
