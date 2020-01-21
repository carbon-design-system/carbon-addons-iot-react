import React, { useState } from 'react';
import classnames from 'classnames';
import { Icon } from 'carbon-components-react';
import { iconChevronDown, iconChevronUp } from 'carbon-icons';

const ListItem = ({
  id,
  isLargeRow,

  isExpandable = false,
  onExpand,
  expanded,

  isSelectable = false,
  onSelect,
  selected,

  value,
  secondaryValue,

  rowActions,
  icon,

  nestingLevel,
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
      <div className="list-item--expand-icon">
        <Icon icon={expanded ? iconChevronUp : iconChevronDown} />
      </div>
    )}

    <div
      className={classnames('list-item--content', {
        'list-item--content__selected': selected,
      })}
    >
      {icon && <div className="list-item--content--icon">{icon}</div>}
      <div
        className={classnames('list-item--content--values', {
          'list-item--content--values__large': isLargeRow,
        })}
      >
        {isLargeRow ? (
          <React.Fragment>
            <div
              className={classnames(
                'list-item--content--values--main',
                'list-item--content--values--main__large'
              )}
            >
              <div title={value}>{value}</div>
              <div>{rowActions || null}</div>
            </div>
            <div
              className={classnames(
                'list-item--content--values--secondary',
                'list-item--content--values--secondary__large'
              )}
            >
              {secondaryValue || null}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="list-item--content--values--main">
              <div title={value}>{value}</div>
              {secondaryValue ? <div title={secondaryValue}>{secondaryValue}</div> : null}
              {rowActions ? <div>{rowActions}</div> : null}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  </div>
);

export default ListItem;
