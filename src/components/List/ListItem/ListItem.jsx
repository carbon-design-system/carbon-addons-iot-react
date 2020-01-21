import React, { useState } from 'react';
import classnames from 'classnames';
import { Icon } from 'carbon-components-react';
import { iconChevronDown, iconChevronUp } from 'carbon-icons';

const ListItem = ({
  selected,
  expanded,
  id,
  onSelect,
  onExpand,
  isExpandable,
  isSelectable,
  nestingLevel,
  value,
  secondaryValue,
  rowActions,
  ...others
}) => (
  <div
    className={classnames('list-item', {
      'list-item__selected': selected,
    })}
    style={{ paddingLeft: ` ${nestingLevel * 30}px` }}
    onClick={() => {
      if (isSelectable) {
        onSelect(id);
      }
      if (isExpandable) {
        onExpand(id);
      }
    }}
  >
    {isExpandable && (
      <div className="list-item--icon">
        <Icon icon={expanded ? iconChevronUp : iconChevronDown} />
      </div>
    )}

    <div
      className={classnames('list-item--content', {
        'list-item--content__selected': selected,
      })}
    >
      <div className="list-item--content--row-title-container">
        <div className="list-item--content--row-title-container--title">{value}</div>
        <div className="list-item--content--row-title-container--action">{rowActions || null}</div>
      </div>
      {secondaryValue ? (
        <div className="list-item--content--row-content">{secondaryValue}</div>
      ) : null}
    </div>
  </div>
);

export default ListItem;
