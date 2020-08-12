import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { settings } from '../../constants/Settings';
import SimplePagination, { SimplePaginationPropTypes } from '../SimplePagination/SimplePagination';
import { SkeletonText } from '../SkeletonText';
import { Checkbox } from '../..';
import { moveItemsInList } from '../../utils/DragAndDropUtils';

import ListItem from './ListItem/ListItem';
import ListHeader from './ListHeader/ListHeader';

const { iotPrefix } = settings;

export const itemPropTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    value: PropTypes.string,
    icon: PropTypes.node,
    /** The nodes should be Carbon Tags components */
    tags: PropTypes.arrayOf(PropTypes.node),
  }),
  children: PropTypes.arrayOf(PropTypes.object),
  isSelectable: PropTypes.bool,
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
  /** data source of list items */
  items: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)).isRequired,
  /** list can be rearranged */
  editMode: PropTypes.oneOf(['single', 'multiple']),
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
    items: PropTypes.string,
  }),
  /** Currently selected item */
  selectedId: PropTypes.string,
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
  /** callback to check if item is allowed to be moved */
  itemWillMove: PropTypes.func,
};

const defaultProps = {
  className: null,
  title: null,
  search: null,
  buttons: [],
  editMode: null,
  isFullHeight: false,
  isLargeRow: false,
  isLoading: false,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    expand: 'Expand',
    close: 'Close',
    items: '%d items',
  },
  iconPosition: 'left',
  pagination: null,
  selectedId: null,
  selectedIds: [],
  expandedIds: [],
  handleSelect: () => {},
  toggleExpansion: () => {},
  onItemMoved: null,
  itemWillMove: () => {
    return true;
  },
};

const getAllChildIds = listItem => {
  let childIds = [];

  if (listItem.children) {
    listItem.children.forEach(child => {
      childIds.push(child.id);

      childIds = [...childIds, ...getAllChildIds(child)];
    });
  }

  return childIds;
};

const handleEditModeSelect = (list, currentSelection, id, parentId) => {
  let newSelection = [];
  if (currentSelection.filter(editId => editId === id).length > 0) {
    // setEditModeSelection(editModeSelection.filter(selected => selected !== item.id && selected !== parentId));
    newSelection = currentSelection.filter(selected => selected !== id && selected !== parentId);
  } else {
    list.forEach(editItem => {
      if (editItem.id === id) {
        newSelection.push(id);

        newSelection = [...newSelection, ...getAllChildIds(editItem)];
      }

      if (editItem.children) {
        newSelection = [
          ...newSelection,
          ...handleEditModeSelect(editItem.children, currentSelection, id, parentId),
        ];
      }

      if (currentSelection.some(selectionId => selectionId === editItem.id)) {
        newSelection.push(editItem.id);
      }
    });
  }

  return newSelection;
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
    selectedId,
    selectedIds,
    expandedIds,
    handleSelect,
    toggleExpansion,
    iconPosition,
    editMode,
    isLargeRow,
    isLoading,
    itemWillMove,
    onItemMoved,
  } = props;

  const [editingItems, setEditingItems] = useState(items);
  const [editModeSelection, setEditModeSelection] = useState([]);

  const selectedItemRef = ref;
  const renderItemAndChildren = (item, index, depth, parentId) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.filter(rowId => rowId === item.id).length > 0;

    const {
      content: { value, secondaryValue, icon, rowActions, tags },
      isSelectable,
      isCategory,
    } = item;

    const isEditSelected = editModeSelection.filter(editId => editId === item.id).length > 0;

    const isSelected =
      editMode === null ? item.id === selectedId || selectedIds.some(id => item.id === id) : false;

    return [
<<<<<<< HEAD
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
          nestingLevel={level}
          value={value}
          icon={icon}
          iconPosition={iconPosition}
          isEditing={isEditing}
          secondaryValue={secondaryValue}
          rowActions={rowActions}
          onSelect={handleSelect}
          onExpand={toggleExpansion}
          onItemMoved={onItemMoved}
          selected={isSelected}
          expanded={isExpanded}
          isExpandable={hasChildren}
          isLargeRow={isLargeRow}
          isCategory={isCategory}
          isSelectable={isSelectable}
          i18n={i18n}
          selectedItemRef={isSelected ? selectedItemRef : null}
          tags={tags}
        />
      </div>,
=======
      <ListItem
        id={item.id}
        index={index}
        key={`${item.id}-list-item-${depth.length}-${value}`}
        dragPreviewText={
          isEditSelected ? i18n.items.replace('%d', editModeSelection.length) : value
        }
        nestedIndex={depth}
        value={value}
        icon={
          editMode === 'multiple' ? (
            <Checkbox
              id={`${item.id}-checkbox`}
              name={item.id}
              onClick={() => {
                const newSelection = handleEditModeSelect(
                  editingItems,
                  editModeSelection,
                  item.id,
                  parentId
                );

                setEditModeSelection(newSelection);
              }}
              checked={isEditSelected}
            />
          ) : (
            icon
          )
        }
        iconPosition={iconPosition}
        isEditing={editMode !== null}
        secondaryValue={secondaryValue}
        rowActions={rowActions}
        onSelect={editMode === null ? handleSelect : () => {}}
        onExpand={toggleExpansion}
        selected={isSelected}
        expanded={isExpanded}
        isExpandable={hasChildren}
        isLargeRow={isLargeRow}
        isCategory={isCategory}
        isSelectable={isSelectable}
        i18n={i18n}
        selectedItemRef={isSelected ? selectedItemRef : null}
        onItemMoved={(dragId, hoverId, target) => {
          if (
            editModeSelection.length > 0 &&
            editModeSelection.find(selectionId => selectionId === dragId)
          ) {
            setEditingItems(moveItemsInList(editingItems, editModeSelection, hoverId, target));
          } else {
            setEditingItems(moveItemsInList(editingItems, [dragId], hoverId, target));
          }
        }}
        itemWillMove={itemWillMove}
      />,
>>>>>>> feat(list): uadded multi-select for drag and drop
      ...(hasChildren && isExpanded
        ? item.children.map((child, nestedIndex) => {
            const newDepth = [...depth, index];

            return renderItemAndChildren(child, nestedIndex, newDepth, item.id);
          })
        : []),
    ];
  };

  const listItems = (editMode ? editingItems : items).map((item, index) =>
    renderItemAndChildren(item, index, [], null)
  );

  return (
    <div
      className={classnames(`${iotPrefix}--list`, className, {
        [`${iotPrefix}--list__full-height`]: isFullHeight,
      })}
    >
      <ListHeader
        className={`${iotPrefix}--list--header`}
        title={title}
        buttons={buttons}
        search={search}
        i18n={i18n}
        isLoading={isLoading}
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
          listItems
        ) : (
          <SkeletonText className={`${iotPrefix}--list--skeleton`} width="90%" />
        )}
      </div>
      {pagination && !isLoading ? (
        <div className={`${iotPrefix}--list--page`}>
          <SimplePagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
});

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export { List as UnconnectedList };
export default DragDropContext(HTML5Backend)(List);
