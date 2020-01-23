import React from 'react';
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
  pagination,
  selectedId,
  selectedIds,
  expandedIds,
  handleSelect,
  toggleExpansion,
  ...others
}) => {
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
    selectedId: null,
    expandedIds: [],
    isExpandable: false,
    isSelectable: false,
  };

  const renderItemAndChildren = (item, level) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.id === selectedId && selectedIds.indexOf(item.id) !== -1;
    const isExpanded = expandedIds.filter(rowId => rowId === item.id).length > 0;

    const {
      content: { value, secondaryValue, icon, rowActions },
    } = item;

    return [
      <ListItem
        id={item.id}
        nestingLevel={level}
        value={value}
        icon={icon}
        secondaryValue={secondaryValue}
        rowActions={rowActions}
        onSelect={handleSelect}
        onExpand={toggleExpansion}
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
      <div className="list--page">
        <SimplePagination {...pagination} />
      </div>
    </div>
  );
};

export default List;
