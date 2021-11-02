import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SkeletonText } from 'carbon-components-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Bee32 } from '@carbon/icons-react';
import { VariableSizeList } from 'react-window';

import { settings } from '../../../constants/Settings';
import ListItem from '../ListItem/ListItem';
import { Checkbox } from '../../Checkbox';
import Button from '../../Button';
import { EditingStyle, editingStyleIsMultiple } from '../../../utils/DragAndDropUtils';
import { ListItemPropTypes } from '../List';
import { useResize } from '../../../internal/UseResizeObserver';

const { iotPrefix } = settings;

const propTypes = {
  /** content shown if list is empty */
  emptyState: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  /** i18n strings */
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
    expand: PropTypes.string,
    close: PropTypes.string,
    loadMore: PropTypes.string,
  }),
  /** data source of list items */
  items: PropTypes.arrayOf(PropTypes.shape(ListItemPropTypes)),
  /** use full height in list */
  // eslint-disable-next-line consistent-return
  isFullHeight: (props, propName, componentName) => {
    if (__DEV__) {
      /* istanbul ignore else */
      if (props[propName] === true) {
        return new Error(
          `${componentName}: Using '${propName}' with 'isVirtualList' could have negative performance consequences. Using the them together is discouraged.`
        );
      }
    }
  },
  /** use large/fat row in list */
  isLargeRow: PropTypes.bool,
  /** optional skeleton to be rendered while loading data */
  isLoading: PropTypes.bool,
  testId: PropTypes.string,
  /** Multiple currently selected items */
  selectedIds: PropTypes.arrayOf(PropTypes.string),
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
  /** call back function for when load more row is clicked  (rowId) => {} */
  handleLoadMore: PropTypes.func,
  /** RowIds for rows currently loading more child rows */
  loadingMoreIds: PropTypes.arrayOf(PropTypes.string),
  /** the ids of locked items that cannot be reordered */
  lockedIds: PropTypes.arrayOf(PropTypes.string),
  /** list editing style */
  editingStyle: PropTypes.oneOf([
    EditingStyle.Single,
    EditingStyle.Multiple,
    EditingStyle.SingleNesting,
    EditingStyle.MultipleNesting,
  ]),
  /** icon can be left or right side of list row primary value */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  virtualListRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

const defaultProps = {
  editingStyle: null,
  emptyState: 'No list items to show',
  expandedIds: [],
  handleLoadMore: () => {},
  handleSelect: () => {},
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    expand: 'Expand',
    close: 'Close',
    loadMore: 'Load more...',
  },
  iconPosition: 'left',
  isFullHeight: false,
  isLargeRow: false,
  isLoading: false,
  items: [],
  itemWillMove: () => {
    return true;
  },
  loadingMoreIds: [],
  lockedIds: [],
  onItemMoved: () => {},
  selectedIds: [],
  testId: 'list',
  toggleExpansion: () => {},
  virtualListRef: React.createRef(),
};

const getAdjustedNestingLevel = (items, currentLevel) =>
  items.some((item) => item?.children && item.children.length > 0)
    ? currentLevel + 1
    : currentLevel;

const VirtualListContent = ({
  editingStyle,
  emptyState,
  expandedIds,
  handleLoadMore,
  handleSelect,
  i18n,
  iconPosition,
  isFullHeight,
  isLargeRow,
  isLoading,
  items,
  itemWillMove,
  loadingMoreIds,
  lockedIds,
  onItemMoved,
  selectedIds,
  testId,
  toggleExpansion,
  virtualListRef,
}) => {
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const rowSize = isLargeRow ? 96 : 40;
  const [listHeight, setListHeight] = useState(0);
  const listOuterRef = useResize(useRef(null));
  const didScrollRef = useRef(false);

  const flatten = useCallback(
    (initialItems, parentId = null, currentLevel = 0) => {
      return initialItems.reduce((carry, item) => {
        let tmp = carry;
        const isExpanded = expandedIds.filter((rowId) => rowId === item.id).length > 0;
        const parentIsExpanded = expandedIds.some((rowId) => parentId === rowId);

        if (parentId === null || isExpanded || parentIsExpanded) {
          tmp = carry.concat({
            ...item,
            parentId,
            level: currentLevel,
          });
        }

        if (isExpanded && item.children) {
          tmp = tmp.concat(
            flatten(item.children, item.id, getAdjustedNestingLevel(item.children, currentLevel))
          );

          if (item.hasLoadMore && isExpanded) {
            tmp = tmp.concat([
              {
                ...item,
                parentId: item.id,
                level: currentLevel,
                isLoadMoreRow: true,
              },
            ]);
          }
        }

        return tmp;
      }, []);
    },
    // eslint-disable-next-line no-use-before-define
    [expandedIds, flatten]
  );

  const [flattened, setFlattened] = useState(() => {
    const flattenedItems = flatten(items);
    const parents = flattenedItems.filter(
      (item) =>
        item.level === 0 || expandedIds.includes(item.id) || expandedIds.includes(item.parentId)
    ).length;
    return {
      items: flattenedItems,
      parents,
      height: parents * rowSize,
    };
  });

  useEffect(() => {
    if (virtualListRef.current) {
      virtualListRef.current.resetAfterIndex(0);
    }
  }, [expandedIds, flattened, virtualListRef, rowSize]);

  useEffect(() => {
    const flattenedItems = flatten(items);
    const parents = flattenedItems.filter(
      (item) =>
        item.level === 0 || expandedIds.includes(item.id) || expandedIds.includes(item.parentId)
    ).length;

    setFlattened({
      items: flattenedItems,
      parents,
      height: parents * rowSize,
    });
  }, [expandedIds, flatten, items, rowSize]);

  const renderItemAndChildren = (item, index, parentId, level, style) => {
    const hasChildren = item?.children && item.children.length > 0;
    const isSelected = selectedIds.some((id) => item.id === id);
    const isExpanded = expandedIds.filter((rowId) => rowId === item.id).length > 0;
    const isLoadingMore = loadingMoreIds.includes(item.id);
    const isLocked = lockedIds.includes(item.id);
    const parentIsExpanded = expandedIds.filter((rowId) => rowId === item.parentId).length > 0;

    const {
      content: { value, secondaryValue, icon, rowActions, tags },
      isSelectable,
      isCategory,
      disabled,
    } = item;

    if (item.isLoadMoreRow) {
      if (parentIsExpanded) {
        return (
          <Button
            key={`${item.id}-list-item-parent-loading`}
            className={`${iotPrefix}--list-item ${iotPrefix}--load-more-row`}
            onClick={() => handleLoadMore(item.id)}
            data-testid={`${testId}-${item.id}-load-more`}
            kind="ghost"
            loading={isLoadingMore}
            style={style}
          >
            <div className={`${iotPrefix}--load-more-row--content`}>{mergedI18n.loadMore}</div>
          </Button>
        );
      }

      return null;
    }

    return [
      <div
        key={`${item.id}-list-item-parent-${level}-${value}`}
        className={`${iotPrefix}--list-item-parent`}
        style={style}
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
                disabled={isLocked}
              />
            ) : (
              icon
            )
          }
          disabled={disabled}
          iconPosition={iconPosition}
          editingStyle={isLocked ? null : editingStyle}
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
          isLocked={isLocked}
          isCategory={isCategory}
          isSelectable={editingStyle === null && isSelectable}
          i18n={mergedI18n}
          tags={tags}
        />
      </div>,
    ];
  };

  const getItemSize = (index) => {
    const item = flattened?.items?.[index];
    if (!item) {
      return 0;
    }

    const isExpanded = expandedIds.filter((rowId) => rowId === item.parentId).length > 0;

    if (item.isLoadMoreRow && isExpanded) {
      return 48;
    }

    if (!item.parentId || isExpanded) {
      return rowSize;
    }

    return 0;
  };

  const ListRow = ({ index, style }) => {
    const item = flattened?.items?.[index];
    if (!item) {
      return null;
    }

    const isExpanded =
      expandedIds.filter((rowId) => rowId === item.id || rowId === item.parentId).length > 0;

    if (item.parentId && !isExpanded) {
      return null;
    }

    return renderItemAndChildren(
      item,
      index,
      item.parentId,
      getAdjustedNestingLevel(items, item.level),
      style
    );
  };

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

  const handleItemsRendered = useCallback(() => {
    const parentList = listOuterRef.current.closest(`.${iotPrefix}--list`);
    if (parentList) {
      const rect = parentList.getBoundingClientRect();
      const { height } = rect;
      setListHeight(height);
    }

    if (didScrollRef.current === false && selectedIds?.length > 0 && virtualListRef.current) {
      const selectedIndex = flattened.items.findIndex((item) => item.id === selectedIds[0]);
      if (selectedIndex >= 0) {
        virtualListRef.current.scrollToItem(selectedIndex, 'start');
        didScrollRef.current = true;
      }
    }
  }, [flattened.items, listOuterRef, selectedIds, virtualListRef]);

  if (!isLoading && flattened.items.length) {
    return (
      <VariableSizeList
        ref={virtualListRef}
        itemCount={flattened.items.length}
        height={isFullHeight ? flattened.height : Math.min(listHeight, flattened.height)}
        itemSize={getItemSize}
        className={classnames(
          `${iotPrefix}--list--content`,
          `${iotPrefix}--list--content--virtual`,
          {
            // If FullHeight, the content's overflow shouldn't be hidden
            [`${iotPrefix}--list--content__full-height`]: isFullHeight,
          }
        )}
        outerRef={listOuterRef}
        style={{
          overflow: isFullHeight ? 'unset' : 'auto',
        }}
        onItemsRendered={handleItemsRendered}
      >
        {ListRow}
      </VariableSizeList>
    );
  }
  return (
    <div
      className={classnames(
        {
          // If FullHeight, the content's overflow shouldn't be hidden
          [`${iotPrefix}--list--content__full-height`]: isFullHeight,
        },
        `${iotPrefix}--list--content`
      )}
    >
      {isLoading ? (
        <SkeletonText
          className={`${iotPrefix}--list--skeleton`}
          width="90%"
          data-testid={`${testId}-loading`}
        />
      ) : (
        emptyContent
      )}
    </div>
  );
};

VirtualListContent.propTypes = propTypes;
VirtualListContent.defaultProps = defaultProps;

export default VirtualListContent;
