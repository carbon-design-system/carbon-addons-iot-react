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
  isLargeRow = false,
  ...others
}) => {
  const [searchValue, setSearchValue] = useState(null);
  const [filteredItems, setfilteredItems] = useState(items);

  const numberOfItems = filteredItems.length;
  let rowPerPage = numberOfItems;
  switch (pageSize) {
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

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = id => {
    setSelectedId(selectedId === id ? null : id);
    setSelectedIds(
      selectedId === id ? selectedIds.filter(item => item.id !== id) : [...selectedIds, id]
    );
  };

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [itemsToShow, setItemsToShow] = useState(filteredItems.slice(0, rowPerPage));

  const onPage = page => {
    const rowUpperLimit = page * rowPerPage;
    const currentItemsOnPage = filteredItems.slice(rowUpperLimit - rowPerPage, rowUpperLimit);
    setCurrentPageNumber(page);
    setItemsToShow(currentItemsOnPage);
  };

  const pagination = {
    page: currentPageNumber,
    onPage,
    maxPage: Math.ceil(numberOfItems / rowPerPage),
    pageOfPagesText: page => `Page ${page}`,
  };

  return (
    <List
      title={title}
      search={
        hasSearch
          ? {
              value: searchValue,
              onChange: evt => {
                setSearchValue(evt.target.value);
                const searchTerm = evt.target.value === undefined ? '' : evt.target.value;
                const tempFilteredItems = items.filter(item => {
                  if (item.content.value !== '' && item.content.value !== undefined) {
                    if (
                      item.content.secondaryValue !== '' &&
                      item.content.secondaryValue !== undefined
                    ) {
                      return (
                        item.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
                        item.content.secondaryValue
                          .toLowerCase()
                          .search(searchTerm.toLowerCase()) !== -1
                      );
                    }
                    return item.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1;
                  }
                });
                setfilteredItems(filteredItems);
                setSearchValue(searchTerm);
                if (pageSize !== null) {
                  setItemsToShow(tempFilteredItems.slice(0, rowPerPage));
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
      selectedId={selectedId}
      selectedIds={selectedIds}
      handleSelect={handleSelect}
      isLargeRow={isLargeRow}
    />
  );
};

export default SimpleList;
