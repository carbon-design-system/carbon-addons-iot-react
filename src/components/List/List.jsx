import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ListItem from './ListItem/ListItem';
import ListHeader from './ListHeader/ListHeader';
import SimplePagination from '../SimplePagination/SimplePagination';

const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

const List = ({ title, search = null, buttons, items, isFullHeight, i18n, ...others }) => {
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
      <SimplePagination page="1" maxPage="4" onPage="1" className="list--page" />
    </div>
  );
};

export default List;
