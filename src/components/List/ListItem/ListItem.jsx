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
}) => {
  return (
    <div>
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

        <div className="list-item--content">{content}</div>
      </div>
    </div>
  );
};

export default ListItem;
