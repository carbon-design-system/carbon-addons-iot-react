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
  content,
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
        <div className="list-item--content--row-title-container--title">{content.name}</div>
        <div className="list-item--content--row-title-container--action">
          {content.rowActions ? <div>{content.rowActions}</div> : null}
        </div>
      </div>
      {content.rowContent ? (
        <div className="list-item--content--row-content">{content.rowContent}</div>
      ) : null}
    </div>
  </div>
);

export default ListItem;
