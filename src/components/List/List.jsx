import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ListItem from './ListItem/ListItem';
import ListHeader from './ListHeader/ListHeader';
import SimplePagination from '../SimplePagination/SimplePagination';

const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

const List = ({
  title,
  search = null,
  buttons,
  items,
  isFullHeight,
  i18n,
  pageSize,
  ...others
}) => {
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

  const propTypes = {
    children: childrenPropType,
    id: PropTypes.string,
    nextingLevel: PropTypes.string,
    pageSize: PropTypes.oneOf(['sm', 'lg', 'xl']),
  };

  const defaultProps = {
    children: [],
    i18n: {
      searchPlaceHolderText: 'Enter a value',
    },
    id: null,
    nestingLevel: null,
    onSelect: () => {},
    onExpand: () => {},
    selected: false,
    expanded: false,
    isExpandable: false,
    isSelectable: false,
  };

  const totalItems = items.length;
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
  const [currentItems, setCurrentItems] = useState(items.slice(0, rowPerPage));
  const onPage = page => {
    const rowUpperLimit = page * rowPerPage;
    const itemsOnPage = items.slice(rowUpperLimit - rowPerPage, rowUpperLimit);
    setCurrentPageNumber(page);
    setCurrentItems(itemsOnPage);
  };

  console.log(currentItems);

  const renderItemAndChildren = (item, level) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.id === selectedId && selectedIds.indexOf(item.id) !== -1;
    const isExpanded = item.id === expandedId;

    return [
      <ListItem
        id={item.id}
        nestingLevel={level}
        content={item.name}
        onSelect={handleSelect}
        onExpand={handleExpansion}
        selected={isSelected}
        expanded={isExpanded}
        isExpandable={hasChildren}
        isSelectable={!hasChildren}
      />,
      ...(hasChildren && isExpanded
        ? item.children.map(child => renderItemAndChildren(child, level + 1))
        : []),
    ];
  };

  const listItems = currentItems.map(item => renderItemAndChildren(item, 0));

  return (
    <div
      className={classnames('list', {
        'list__full-height': isFullHeight,
      })}
    >
      <ListHeader
        className="list--header"
        title={title}
        buttons={buttons}
        search={search}
        i18n={i18n}
      />
      <div className="list--content">{listItems}</div>
      <SimplePagination
        page={currentPageNumber}
        onPage={onPage}
        maxPage={Math.ceil(totalItems / rowPerPage)}
        className="list--page"
      />
    </div>
  );
};

export default List;
