import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SimplePagination, { SimplePaginationPropTypes } from '../SimplePagination/SimplePagination';

import ListItem from './ListItem/ListItem';
import ListHeader from './ListHeader/ListHeader';

const childrenPropType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]);

const itemPropTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    value: PropTypes.string,
    icon: PropTypes.node,
  }),
  children: PropTypes.arrayOf(PropTypes.any), // TODO: make this recursive
};

const propTypes = {
  title: PropTypes.string.isRequired,
  search: PropTypes.func,
  buttons: PropTypes.arrayOf(PropTypes.node),
  items: PropTypes.arrayOf(itemPropTypes).isRequired,
  isFullHeight: PropTypes.bool,
  i18n: PropTypes.any, // TODO: fill this in
  pagination: SimplePaginationPropTypes, // TODO: find this
  selectedId: PropTypes.string,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  handleSelect: PropTypes.func,
  toggleExpansion: PropTypes.func,

  // Do we need these below?
  children: childrenPropType,
  id: PropTypes.string,
  nestingLevel: PropTypes.string,
};

const defaultProps = {
  search: () => {},
  buttons: [],
  isFullHeight: false,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
  },
  pagination: null,
  selectedId: null,
  selectedIds: [],
  expandedIds: [],
  handleSelect: () => {},
  toggleExpansion: () => {},

  children: [],
  id: null,
  nestingLevel: null,
};

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
  const renderItemAndChildren = (item, level) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.id === selectedId && selectedIds.indexOf(item.id) !== -1;
    const isExpanded = expandedIds.filter(rowId => rowId === item.id).length > 0;

    const {
      content: { value, secondaryValue, rowActions },
    } = item;

    return [
      <ListItem
        id={item.id}
        nestingLevel={level}
        value={value}
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

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export default List;
