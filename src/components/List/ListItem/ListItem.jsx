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
  iconPosition = 'left', // or "right"

  nestingLevel,
  ...others
}) => {
  console.log(rowActions);
  return (
    <div
      className={classnames('list-item', {
        'list-item__selected': selected,
        'list-item__large': isLargeRow,
      })}
      style={{ paddingLeft: ` ${nestingLevel * 30}px` }}
    >
      {isExpandable && (
        <div
          className="list-item--expand-icon"
          onClick={() => {
            if (isSelectable) {
              onSelect(id);
            }
            if (isExpandable) {
              onExpand(id);
            }
          }}
        >
          <Icon icon={expanded ? iconChevronUp : iconChevronDown} />
        </div>
      )}

      <div
        className={classnames('list-item--content', {
          'list-item--content__selected': selected,
          'list-item--content__large': isLargeRow,
        })}
      >
        {icon && (
          <div className={`list-item--content--icon list-item--content--icon__${iconPosition}`}>
            {icon}
          </div>
        )}
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
                {rowActions ? <div>{rowActions}</div> : null}
              </div>
              <div title={secondaryValue} className="list-item--content--values--secondary">
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
};

export default ListItem;
