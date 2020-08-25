import React from 'react';
import { DragSource } from 'react-dnd';
import classnames from 'classnames';
import { Draggable16, ChevronUp16, ChevronDown16 } from '@carbon/icons-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import { EditingStyle, DropLocation } from '../../../utils/DragAndDropUtils';
import { settings } from '../../../constants/Settings';

import ListTarget, { TargetSize } from './ListTarget';

const { iotPrefix } = settings;

export const ItemType = 'ListItem';

const ListItemWrapper = ({
  id,
  editingStyle,
  expanded,
  isSelectable,
  itemWillMove,
  onItemMoved,
  onSelect,
  selected,
  isDragging,
  isLargeRow,
  children,
  connectDragSource,
}) => {
  const body = isSelectable ? (
    <div
      role="button"
      tabIndex={0}
      className={classnames(
        `${iotPrefix}--list-item`,
        `${iotPrefix}--list-item__selectable`,
        { [`${iotPrefix}--list-item__selected`]: editingStyle ? false : selected },
        { [`${iotPrefix}--list-item__large`]: isLargeRow },
        { [`${iotPrefix}--list-item-editable`]: editingStyle }
      )}
      data_testid={selected ? 'list-item__selected' : null}
      onKeyPress={({ key }) => key === 'Enter' && onSelect(id)}
      onClick={() => {
        onSelect(id);
      }}
    >
      {children}
    </div>
  ) : (
    <div
      className={classnames(`${iotPrefix}--list-item`, {
        [`${iotPrefix}--list-item__large`]: isLargeRow,
        [`${iotPrefix}--list-item-editable`]: editingStyle,
      })}
    >
      {children}
    </div>
  );

  if (editingStyle) {
    const canNest =
      editingStyle === EditingStyle.SingleNesting || editingStyle === EditingStyle.MultipleNesting;

    return (
      <div
        role="listitem"
        className={classnames(`${iotPrefix}--list-item-editable--drag-container`, {
          [`${iotPrefix}--list-item-editable-dragging`]: isDragging,
        })}
        ref={instance => {
          if (connectDragSource) {
            connectDragSource(instance);
          }
        }}
      >
        <div
          className={classnames(`${iotPrefix}--list-item-editable--drop-targets`, {
            [`${iotPrefix}--list-item__large`]: isLargeRow,
          })}
        >
          {// Renders Nested location only if nesting is allowed

          canNest ? (
            <ListTarget
              id={id}
              isDragging={isDragging}
              targetPosition={DropLocation.Nested}
              targetSize={TargetSize.Full}
              itemWillMove={itemWillMove}
              onItemMoved={onItemMoved}
            />
          ) : null}

          <ListTarget
            id={id}
            isDragging={isDragging}
            targetPosition={DropLocation.Above}
            itemWillMove={itemWillMove}
            targetSize={canNest ? TargetSize.Third : TargetSize.Half}
            onItemMoved={onItemMoved}
          />

          <ListTarget
            id={id}
            isDragging={isDragging}
            targetPosition={DropLocation.Below}
            itemWillMove={itemWillMove}
            targetOverride={expanded ? DropLocation.Nested : null} // If item is expanded then the bottom target will nest
            targetSize={canNest ? TargetSize.Third : TargetSize.Half}
            onItemMoved={onItemMoved}
          />
        </div>

        {body}
      </div>
    );
  }

  return body;
};

const ListItemWrapperProps = {
  dragPreviewText: PropTypes.string,
  id: PropTypes.string.isRequired,
  editingStyle: PropTypes.oneOf([
    EditingStyle.Single,
    EditingStyle.Multiple,
    EditingStyle.SingleNesting,
    EditingStyle.MultipleNesting,
  ]),
  expanded: PropTypes.bool.isRequired,
  isLargeRow: PropTypes.bool.isRequired,
  isSelectable: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onItemMoved: PropTypes.func.isRequired,
  itemWillMove: PropTypes.func.isRequired,
};

const ListItemPropTypes = {
  id: PropTypes.string.isRequired,
  editingStyle: PropTypes.oneOf([
    EditingStyle.Single,
    EditingStyle.Multiple,
    EditingStyle.SingleNesting,
    EditingStyle.MultipleNesting,
  ]),
  isLargeRow: PropTypes.bool,
  isExpandable: PropTypes.bool,
  onExpand: PropTypes.func,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  expanded: PropTypes.bool,
  value: PropTypes.string.isRequired,
  secondaryValue: PropTypes.string,
  rowActions: PropTypes.arrayOf(PropTypes.node), // TODO
  icon: PropTypes.node,
  iconPosition: PropTypes.string,
  isCategory: PropTypes.bool,
  /** i18n strings */
  i18n: PropTypes.shape({
    expand: PropTypes.string,
    close: PropTypes.string,
  }),
  /** Default selected item ref needed for scrolling */
  selectedItemRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  /** The nodes should be Carbon Tags components */
  tags: PropTypes.arrayOf(PropTypes.node),
  /* these props come from react-dnd */
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  dragPreviewText: PropTypes.string,
  nestingLevel: PropTypes.number,
  isDragging: PropTypes.bool.isRequired,
  onItemMoved: PropTypes.func.isRequired,
  itemWillMove: PropTypes.func.isRequired,
};

const ListItemDefaultProps = {
  editingStyle: null,
  isLargeRow: false,
  isExpandable: false,
  dragPreviewText: null,
  onExpand: () => {},
  isSelectable: false,
  onSelect: () => {},
  selected: false,
  expanded: false,
  secondaryValue: null,
  rowActions: [],
  icon: null,
  iconPosition: 'left',
  nestingLevel: 0,
  isCategory: false,
  i18n: {
    expand: 'Expand',
    close: 'Close',
  },
  selectedItemRef: null,
  tags: null,
};

const ListItem = ({
  id,
  editingStyle,
  isLargeRow,
  isExpandable,
  onExpand,
  expanded,
  isSelectable,
  onSelect,
  selected,
  value,
  secondaryValue,
  rowActions,
  icon,
  iconPosition, // or "right"
  onItemMoved,
  nestingLevel,
  isCategory,
  i18n,
  isDragging,
  selectedItemRef,
  tags,
  connectDragSource,
  connectDragPreview,
  itemWillMove,
  dragPreviewText,
}) => {
  const handleExpansionClick = () => isExpandable && onExpand(id);

  const renderNestingOffset = () => {
    return nestingLevel > 0 ? (
      <div
        className={`${iotPrefix}--list-item--nesting-offset`}
        style={{ width: `${nestingLevel * 30}px` }}
      />
    ) : null;
  };

  const renderExpander = () =>
    isExpandable ? (
      <div
        role="button"
        tabIndex={0}
        className={`${iotPrefix}--list-item--expand-icon`}
        onClick={handleExpansionClick}
        data-testid="expand-icon"
        onKeyPress={({ key }) => key === 'Enter' && handleExpansionClick()}
      >
        {expanded ? (
          <ChevronUp16 aria-label={i18n.expand} />
        ) : (
          <ChevronDown16 aria-label={i18n.close} />
        )}
      </div>
    ) : null;

  const renderIcon = () =>
    icon ? (
      <div
        className={`${iotPrefix}--list-item--content--icon ${iotPrefix}--list-item--content--icon__${iconPosition}`}
      >
        {icon}
      </div>
    ) : null;

  const renderRowActions = () =>
    rowActions && rowActions.length > 0 ? (
      <div className={`${iotPrefix}--list-item--content--row-actions`}>{rowActions}</div>
    ) : null;

  const renderTags = () => (tags && tags.length > 0 ? <div>{tags}</div> : null);

  const renderDragPreview = () => {
    if (editingStyle && connectDragPreview) {
      return connectDragPreview(
        <div className={`${iotPrefix}--list-item-editable--drag-preview`}>
          {dragPreviewText || value}
        </div>
      );
    }

    return null;
  };

  const dragIcon = () =>
    editingStyle ? (
      <Draggable16
        className={classnames(`${iotPrefix}--list-item--handle`)}
        data-testid="list-item-editable"
      />
    ) : null;

  return (
    <ListItemWrapper
      isPreview={false}
      {...{
        id,
        isSelectable,
        selected,
        isDragging,
        editingStyle,
        expanded,
        isLargeRow,
        onSelect,
        connectDragSource,
        onItemMoved,
        itemWillMove,
      }}
    >
      {renderDragPreview()}
      {dragIcon()}
      {renderNestingOffset()}
      {renderExpander()}
      <div
        className={classnames(
          `${iotPrefix}--list-item--content`,
          { [`${iotPrefix}--list-item--content__selected`]: editingStyle ? null : selected },
          { [`${iotPrefix}--list-item--content__large`]: isLargeRow }
        )}
        ref={selectedItemRef}
      >
        {renderIcon()}
        <div
          className={classnames(`${iotPrefix}--list-item--content--values`, {
            [`${iotPrefix}--list-item--content--values__large`]: isLargeRow,
          })}
        >
          {isLargeRow ? (
            <>
              <div
                className={`${iotPrefix}--list-item--content--values--main ${iotPrefix}--list-item--content--values--main__large`}
              >
                <div
                  className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                    [`${iotPrefix}--list-item--category`]: isCategory,
                    [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                      rowActions
                    ),
                  })}
                  title={value}
                >
                  {value}
                </div>
                {renderTags()}
                {renderRowActions()}
              </div>
              {secondaryValue ? (
                <div
                  title={secondaryValue}
                  className={classnames(
                    `${iotPrefix}--list-item--content--values--value`,
                    `${iotPrefix}--list-item--content--values--value__large`,
                    {
                      [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                        rowActions
                      ),
                    }
                  )}
                >
                  {secondaryValue}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className={`${iotPrefix}--list-item--content--values--main`}>
                <div
                  className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                    [`${iotPrefix}--list-item--category`]: isCategory,
                    [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                      rowActions
                    ),
                  })}
                  title={value}
                >
                  {value}
                </div>
                {secondaryValue ? (
                  <div
                    title={secondaryValue}
                    className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                      [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                        rowActions
                      ),
                    })}
                  >
                    {secondaryValue}
                  </div>
                ) : null}
                {renderTags()}
                {renderRowActions()}
              </div>
            </>
          )}
        </div>
      </div>
    </ListItemWrapper>
  );
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.columnId,
      props,
      index: props.index,
    };
  },
};

const ds = DragSource(ItemType, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}));

ListItemWrapper.propTypes = ListItemWrapperProps;
ListItem.propTypes = ListItemPropTypes;
ListItem.defaultProps = ListItemDefaultProps;

export { ListItem as UnconnectedListItem };

export default ds(ListItem);
