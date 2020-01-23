import React, { useState } from 'react';
import classnames from 'classnames';
import { Icon, PropTypes } from 'carbon-components-react';
import { iconChevronDown, iconChevronUp } from 'carbon-icons';

const propTypes = {
  id: PropTypes.string.isRequired,
  isLargeRow: PropTypes.bool,
  isExpandable: PropTypes.bool,
  onExpand: PropTypes.func,
  expanded: PropTypes.any, // TODO
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.any, // TODO
  value: PropTypes.string.isRequired,
  secondaryValue: PropTypes.string,
  rowActions: PropTypes.any, // TODO
  icon: PropTypes.node,
  iconPosition: PropTypes.string,
  nestingLevel: PropTypes.string,
};

const defaultProps = {
  isLargeRow: false,
  isExpandable: false,
  onExpand: null,
  isSelectable: false,
  onSelect: null,
  secondaryValue: null,
  icon: null,
  iconPosition: 'left',
  nestingLevel: null,
};

const ListItem = ({
  id,
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

ListItem.propTypes = propTypes;
ListItem.defaultProps = defaultProps;

export default ListItem;
