import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem/ListItem';
import ListHeader from './ListHeader/ListHeader';
import SimplePagination from '../SimplePagination/SimplePagination';
import { DataTable } from 'carbon-components-react';

const { TableToolbarSearch } = DataTable;

const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

const List = ({ title, hasSearch, headerHasButton, items, ...others }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filteredItems, setFilteredItems] = useState(items);

  const handleSelect = id => {
    setSelectedId(selectedId === id ? null : id);
    setSelectedIds(
      selectedId === id ? selectedIds.filter(item => item.id !== id) : [...selectedIds, id]
    );
  };

  const handleSearch = event => {};
  const handleExpansion = id => setExpandedId(expandedId === id ? null : id);

  /*
  const handleSearch = term => {
    const list = items.filter(item => {
      return item.name.toLowerCase().search(term.toLowerCase()) !== -1;
    });
    setFilteredItems(list);
  };
  */

  const propTypes = {
    children: childrenPropType,
    id: PropTypes.string,
    nextingLevel: PropTypes.string,
    onSelect: PropTypes.func,
    onExpand: PropTypes.func,
    selected: PropTypes.bool,
    expanded: PropTypes.bool,
    isExpandable: PropTypes.bool,
    isSelectable: PropTypes.bool,
    secondColumn: '',
    paging: '',
    leftIcon: '',
    rightIcon: '',
    search: '',
    headerButton: '',
    headerSum: '',
    multiSelected: '',
  };

  const defaultProps = {
    children: [],
    id: null,
    nestingLevel: null,
    onSelect: () => {},
    onExpand: () => {},
    selected: false,
    expanded: false,
    isExpandable: false,
    isSelectable: false,
  };

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

  const listItems = items.map(item => renderItemAndChildren(item, 0));

  return (
    <div className="list">
      <ListHeader
        title={title}
        hasSearch={hasSearch}
        hasButton={headerHasButton}
        onSearch={() => {} /*handleSearch*/}
      />
      {hasSearch ? (
        <div>
          <TableToolbarSearch
            placeHolderText="Start typing to search"
            onChange={handleSearch}
            expanded
            size="large"
            className="list--search"
          />
        </div>
      ) : null}
      {listItems}
      <SimplePagination page="1" maxPage="4" onPage="1" />
    </div>
  );
};

export default List;
