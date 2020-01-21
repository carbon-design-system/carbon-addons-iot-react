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
  const [expandedId, setExpandedId] = useState(null);

  const handleSelect = id => {
    setSelectedId(selectedId === id ? null : id);
    setSelectedIds(
      selectedId === id ? selectedIds.filter(item => item.id !== id) : [...selectedIds, id]
    );
  };

  const handleExpansion = id => setExpandedId(expandedId === id ? null : id);

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  let [itemsToShow, setItemsToShow] = useState(filteredItems.slice(0, rowPerPage));

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
                const searchTerm = evt.target.value === undefined ? '' : evt.target.value;
                const filteredItems = items.filter(item => {
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
                    } else {
                      return (
                        item.content.value.toLowerCase().search(searchTerm.toLowerCase()) !== -1
                      );
                    }
                  }
                });

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
      selectedId={selectedId}
      selectedIds={selectedIds}
      handleSelect={handleSelect}
      handleExpansion={handleExpansion}
    />
  );
};

export default SimpleList;
