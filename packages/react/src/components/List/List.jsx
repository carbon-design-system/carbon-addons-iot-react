import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Bee32 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import SimplePagination, { SimplePaginationPropTypes } from '../SimplePagination/SimplePagination';
import { SkeletonText } from '../SkeletonText';
import { EditingStyle, editingStyleIsMultiple, DragAndDrop } from '../../utils/DragAndDropUtils';
import { Checkbox, Button } from '../..';
import { OverridePropTypes } from '../../constants/SharedPropTypes';

import ListItem from './ListItem/ListItem';
import DefaultListHeader from './ListHeader/ListHeader';

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

const getAdjustedNestingLevel = (items, currentLevel) =>
  items.some((item) => item?.children && item.children.length > 0)
    ? currentLevel + 1
    : currentLevel;

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
    onItemMoved,
    itemWillMove,
    emptyState,
    testId,
    handleLoadMore,
    loadingMoreIds,
  } = props;
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const selectedItemRef = ref;
  const ListHeader = overrides?.header?.component || DefaultListHeader;

  const renderItemAndChildren = (item, index, parentId, level) => {
    const hasChildren = item?.children && item.children.length > 0;
    const isSelected = selectedIds.some((id) => item.id === id);
    const isExpanded = expandedIds.filter((rowId) => rowId === item.id).length > 0;
    const isLoadingMore = loadingMoreIds.includes(item.id);

    const {
      content: { value, secondaryValue, icon, rowActions, tags },
      isSelectable,
      isCategory,
      disabled,
    } = item;

    return [
      // data-floating-menu-container is a work around for this carbon issue: https://github.com/carbon-design-system/carbon/issues/4755
      <div
        key={`${item.id}-list-item-parent-${level}-${value}`}
        data-floating-menu-container
        className={`${iotPrefix}--list-item-parent`}
      >
        <ListItem
          id={item.id}
          index={index}
          key={`${item.id}-list-item-${level}-${value}`}
          nestingLevel={item?.children && item.children.length > 0 ? level - 1 : level}
          value={value}
          icon={
            editingStyleIsMultiple(editingStyle) ? (
              <Checkbox
                id={`${item.id}-checkbox`}
                name={item.value}
                data-testid={`${item.id}-checkbox`}
                labelText=""
                onClick={() => handleSelect(item.id, parentId)}
                checked={isSelected}
              />
            ) : (
              icon
            )
          }
          disabled={disabled}
          iconPosition={iconPosition}
          editingStyle={editingStyle}
          secondaryValue={secondaryValue}
          rowActions={rowActions}
          onSelect={() => handleSelect(item.id, parentId)}
          onExpand={toggleExpansion}
          onItemMoved={onItemMoved}
          itemWillMove={itemWillMove}
          selected={isSelected}
          expanded={isExpanded}
          isExpandable={hasChildren}
          isLargeRow={isLargeRow}
          isCategory={isCategory}
          isSelectable={editingStyle === null && isSelectable}
          i18n={mergedI18n}
          selectedItemRef={isSelected ? selectedItemRef : null}
          tags={tags}
        />
      </div>,
      ...(hasChildren && isExpanded
        ? item.children
            .map((child, nestedIndex) => {
              return renderItemAndChildren(
                child,
                nestedIndex,
                item.id,
                getAdjustedNestingLevel(item?.children, level)
              );
            })
            .concat(
              item.hasLoadMore
                ? [
                    <Button
                      key={`${item.id}-list-item-parent-loading`}
                      className={`${iotPrefix}--list-item ${iotPrefix}--load-more-row`}
                      onClick={() => handleLoadMore(item.id)}
                      data-testid={`${testId}-${item.id}-load-more`}
                      kind="ghost"
                      loading={isLoadingMore}
                    >
                      <div className={`${iotPrefix}--load-more-row--content`}>
                        {mergedI18n.loadMore}
                      </div>
                    </Button>,
                  ]
                : []
            )
        : []),
    ];
  };

  const listItems = items.map((item, index) =>
    renderItemAndChildren(item, index, null, getAdjustedNestingLevel(items, 0))
  );

  const emptyContent =
    typeof emptyState === 'string' ? (
      <div
        className={classnames(`${iotPrefix}--list--empty-state`, {
          [`${iotPrefix}--list--empty-state__full-height`]: isFullHeight,
        })}
      >
        <Bee32 />
        <p>{emptyState}</p>
      </div>
    ) : (
      emptyState
    );

  return (
    <DragAndDrop>
      <div
        data-testid={testId}
        className={classnames(`${iotPrefix}--list`, className, {
          [`${iotPrefix}--list__full-height`]: isFullHeight,
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

        <div
          className={classnames(
            {
              // If FullHeight, the content's overflow shouldn't be hidden
              [`${iotPrefix}--list--content__full-height`]: isFullHeight,
            },
            `${iotPrefix}--list--content`
          )}
        >
          {!isLoading ? (
            <>{listItems.length ? listItems : emptyContent}</>
          ) : (
            <SkeletonText
              className={`${iotPrefix}--list--skeleton`}
              width="90%"
              data-testid={`${testId}-loading`}
            />
          )}
        </div>
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
