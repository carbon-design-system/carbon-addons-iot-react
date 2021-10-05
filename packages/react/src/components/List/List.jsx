import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import SimplePagination, { SimplePaginationPropTypes } from '../SimplePagination/SimplePagination';
import { EditingStyle, DragAndDrop } from '../../utils/DragAndDropUtils';
import { OverridePropTypes } from '../../constants/SharedPropTypes';

import DefaultListHeader from './ListHeader/ListHeader';
import DefaultListContent from './ListContent/ListContent';
import VirtualListContent from './VirtualListContent/VirtualListContent';

const { iotPrefix } = settings;

export const ListItemPropTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    value: PropTypes.string,
    icon: PropTypes.node,
    /** The nodes should be Carbon Tags components */
    tags: PropTypes.arrayOf(PropTypes.node),
  }),
  children: PropTypes.arrayOf(PropTypes.object),
  isSelectable: PropTypes.bool,
  /** boolean to define load more row is needed */
  hasLoadMore: PropTypes.bool,
};

const propTypes = {
  /** Specify an optional className to be applied to the container */
  className: PropTypes.string,
  /** list title */
  title: PropTypes.string,
  /** search bar call back function and search value */
  search: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
  }),
  /** action buttons on right side of list title */
  buttons: PropTypes.arrayOf(PropTypes.node),
  /** Node to override the default header */
  overrides: PropTypes.shape({
    header: OverridePropTypes,
    content: OverridePropTypes,
  }),
  /** data source of list items */
  items: PropTypes.arrayOf(PropTypes.shape(ListItemPropTypes)),
  /** list editing style */
  editingStyle: PropTypes.oneOf([
    EditingStyle.Single,
    EditingStyle.Multiple,
    EditingStyle.SingleNesting,
    EditingStyle.MultipleNesting,
  ]),
  /** use full height in list */
  isFullHeight: PropTypes.bool,
  /** use large/fat row in list */
  isLargeRow: PropTypes.bool,
  /** optional skeleton to be rendered while loading data */
  isLoading: PropTypes.bool,
  /** optional prop to use a virtualized version of the list instead of rendering all items */
  isVirtualList: PropTypes.bool,
  /** icon can be left or right side of list row primary value */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** i18n strings */
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
    expand: PropTypes.string,
    close: PropTypes.string,
    loadMore: PropTypes.string,
  }),
  /** Multiple currently selected items */
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  /** pagination at the bottom of list */
  pagination: PropTypes.shape(SimplePaginationPropTypes),
  /** ids of row expanded */
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  /** call back function of select */
  handleSelect: PropTypes.func,
  /** call back function of expansion */
  toggleExpansion: PropTypes.func,
  /** callback function for reorder */
  onItemMoved: PropTypes.func,
  /** callback function when reorder will occur - can cancel the move by returning false */
  itemWillMove: PropTypes.func,
  /** content shown if list is empty */
  emptyState: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  testId: PropTypes.string,
  /** call back function for when load more row is clicked  (rowId) => {} */
  handleLoadMore: PropTypes.func,
  /** RowIds for rows currently loading more child rows */
  loadingMoreIds: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  className: null,
  title: null,
  search: null,
  buttons: [],
  editingStyle: null,
  overrides: null,
  isFullHeight: false,
  isLargeRow: false,
  isLoading: false,
  isVirtualList: false,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    expand: 'Expand',
    close: 'Close',
    loadMore: 'Load more...',
  },
  iconPosition: 'left',
  pagination: null,
  selectedIds: [],
  expandedIds: [],
  loadingMoreIds: [],
  items: [],
  handleSelect: () => {},
  toggleExpansion: () => {},
  onItemMoved: () => {},
  itemWillMove: () => {
    return true;
  },
  emptyState: 'No list items to show',
  testId: 'list',
  handleLoadMore: () => {},
};

const List = forwardRef((props, ref) => {
  // Destructuring this way is needed to retain the propTypes and defaultProps
  const {
    className,
    title,
    search,
    buttons,
    items,
    isFullHeight,
    i18n,
    pagination,
    selectedIds,
    expandedIds,
    handleSelect,
    overrides,
    toggleExpansion,
    iconPosition,
    editingStyle,
    isLargeRow,
    isLoading,
    isVirtualList,
    onItemMoved,
    itemWillMove,
    emptyState,
    testId,
    handleLoadMore,
    loadingMoreIds,
  } = props;
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const ListHeader = overrides?.header?.component || DefaultListHeader;
  const ListContent =
    overrides?.content?.component || isVirtualList ? VirtualListContent : DefaultListContent;

  return (
    <DragAndDrop>
      <div
        data-testid={testId}
        className={classnames(`${iotPrefix}--list`, className, {
          [`${iotPrefix}--list__full-height`]: isFullHeight,
          [`${iotPrefix}--list--virtual`]: isVirtualList,
        })}
      >
        <ListHeader
          className={classnames(`${iotPrefix}--list--header`, overrides?.header?.props?.className)}
          title={title}
          buttons={buttons}
          search={search}
          i18n={mergedI18n}
          testId={`${testId}-header`}
          {...overrides?.header?.props}
        />
        <ListContent
          emptyState={emptyState}
          items={items}
          isFullHeight={isFullHeight}
          testId={testId}
          isLoading={isLoading}
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          handleSelect={handleSelect}
          toggleExpansion={toggleExpansion}
          iconPosition={iconPosition}
          editingStyle={editingStyle}
          isLargeRow={isLargeRow}
          onItemMoved={onItemMoved}
          itemWillMove={itemWillMove}
          handleLoadMore={handleLoadMore}
          loadingMoreIds={loadingMoreIds}
          selectedItemRef={ref}
          i18n={mergedI18n}
          hasPagination={!(pagination?.maxPage === 1 && pagination?.page === 1)}
        />
        {pagination && !isLoading ? (
          <div className={`${iotPrefix}--list--page`}>
            <SimplePagination {...pagination} />
          </div>
        ) : null}
      </div>
    </DragAndDrop>
  );
});

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export { List as UnconnectedList };
export default List;
