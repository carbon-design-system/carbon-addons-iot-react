import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SimplePagination, { SimplePaginationPropTypes } from '../SimplePagination/SimplePagination';

import ListItem from './ListItem/ListItem';
import ListHeader from './ListHeader/ListHeader';

const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

export const itemPropTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    value: PropTypes.string,
    icon: PropTypes.node,
  }),
  children: childrenPropType,
  isSelectable: PropTypes.bool,
};

const propTypes = {
  title: PropTypes.string.isRequired,
  search: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
  }),
  buttons: PropTypes.arrayOf(PropTypes.node),
  items: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)).isRequired,
  isFullHeight: PropTypes.bool,
  isLargeRow: PropTypes.bool,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
  }), // TODO: fill this in
  pagination: PropTypes.shape(SimplePaginationPropTypes),
  selectedId: PropTypes.string,
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  handleSelect: PropTypes.func,
  toggleExpansion: PropTypes.func,
};

const defaultProps = {
  search: null,
  buttons: [],
  isFullHeight: false,
  isLargeRow: false,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
  },
  iconPosition: 'left',
  pagination: null,
  selectedId: null,
  expandedIds: [],
  handleSelect: () => {},
  toggleExpansion: () => {},
};

const List = ({
  title,
  search,
  buttons,
  items,
  isFullHeight,
  i18n,
  pagination,
  selectedId,
  expandedIds,
  handleSelect,
  toggleExpansion,
  iconPosition,
  isLargeRow,
  // ...others TODO: add this in the render
}) => {
  const renderItemAndChildren = (item, level) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.id === selectedId;
    const isExpanded = expandedIds.filter(rowId => rowId === item.id).length > 0;

    const {
      content: { value, secondaryValue, icon, rowActions },
      isSelectable,
      isCategory,
    } = item;

    return [
      <ListItem
        id={item.id}
        key={`${item.id}-list-item-${level}-${value}`}
        nestingLevel={level}
        value={value}
        icon={icon}
        iconPosition={iconPosition}
        secondaryValue={secondaryValue}
        rowActions={rowActions}
        onSelect={handleSelect}
        onExpand={toggleExpansion}
        selected={isSelected}
        expanded={isExpanded}
        isExpandable={hasChildren}
        isLargeRow={isLargeRow}
        isCategory={isCategory}
        isSelectable={isSelectable}
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
      {pagination !== null ? (
        <div className="list--page">
          <SimplePagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
};

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export default List;
