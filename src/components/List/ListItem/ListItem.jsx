import React from 'react';
import classnames from 'classnames';
import { Icon } from 'carbon-components-react';
import { iconChevronDown, iconChevronUp } from 'carbon-icons';
import PropTypes from 'prop-types';

const propTypes = {
  id: PropTypes.string.isRequired,
  isLargeRow: PropTypes.bool,
  isExpandable: PropTypes.bool,
  onExpand: PropTypes.func,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  value: PropTypes.string.isRequired,
  secondaryValue: PropTypes.string,
  rowActions: PropTypes.arrayOf(PropTypes.node), // TODO
  icon: PropTypes.node,
  iconPosition: PropTypes.string,
  nestingLevel: PropTypes.number,
  isCategory: PropTypes.bool,
};

const defaultProps = {
  isLargeRow: false,
  isExpandable: false,
  onExpand: null,
  isSelectable: false,
  onSelect: null,
  selected: false,
  secondaryValue: null,
  rowActions: [],
  icon: null,
  iconPosition: 'left',
  nestingLevel: null,
  isCategory: false,
};

const ListItemWrapper = ({ id, isSelectable, onSelect, selected, isLargeRow, children }) =>
  isSelectable ? (
    <div
      role="button"
      tabIndex={0}
      className={classnames('list-item', 'list-item__selectable', {
        'list-item__selected': selected,
        'list-item__large': isLargeRow,
      })}
      onKeyPress={({ key }) => key === 'Enter' && onSelect(id)}
      onClick={() => onSelect(id)}
    >
      {children}
    </div>
  ) : (
    <div className={classnames('list-item', { 'list-item__large': isLargeRow })}>{children}</div>
  );

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
  isCategory,
  ...others
}) => {
  const handleExpansionClick = () => isExpandable && onExpand(id);

  const renderNestingOffset = () =>
    nestingLevel > 0 ? <div style={{ width: `${nestingLevel * 30}px` }}>&nbsp;</div> : null;
  const renderExpander = () =>
    isExpandable ? (
      <div
        role="button"
        tabIndex={0}
        className="list-item--expand-icon"
        onClick={handleExpansionClick}
        onKeyPress={({ key }) => key === 'Enter' && handleExpansionClick()}
      >
        <Icon
          icon={expanded ? iconChevronUp : iconChevronDown}
          description={expanded ? 'Expand' : 'Close'}
        />
      </div>
    ) : null;
  const renderIcon = () =>
    icon ? (
      <div className={`list-item--content--icon list-item--content--icon__${iconPosition}`}>
        {icon}
      </div>
    ) : null;
  const renderRowActions = () =>
    rowActions && rowActions.length > 0 ? (
      <div className="list-item--content--row-actions">{rowActions}</div>
    ) : null;

  return (
    <ListItemWrapper {...{ id, isSelectable, selected, isLargeRow, onSelect }}>
      {renderNestingOffset()}
      {renderExpander()}
      <div
        className={classnames('list-item--content', {
          'list-item--content__selected': selected,
          'list-item--content__large': isLargeRow,
        })}
      >
        {renderIcon()}
        <div
          className={classnames('list-item--content--values', {
            'list-item--content--values__large': isLargeRow,
          })}
        >
          {isLargeRow ? (
            <>
              <div
                className={classnames(
                  'list-item--content--values--main',
                  'list-item--content--values--main__large'
                )}
              >
                <div
                  className={classnames('list-item--content--values--value', {
                    'list-item--category': isCategory,
                  })}
                  title={value}
                >
                  {value}
                </div>
                {renderRowActions()}
              </div>
              <div
                title={secondaryValue}
                className={classnames(
                  'list-item--content--values--secondary',
                  'list-item--content--values--secondary__large'
                )}
              >
                {secondaryValue || null}
              </div>
            </>
          ) : (
            <>
              <div className="list-item--content--values--main">
                <div
                  className={classnames('list-item--content--values--value', {
                    'list-item--category': isCategory,
                  })}
                  title={value}
                >
                  {value}
                </div>
                <div title={secondaryValue} className="list-item--content--values--secondary">
                  {secondaryValue || null}
                </div>
                {renderRowActions()}
              </div>
            </>
          )}
        </div>
      </div>
    </ListItemWrapper>
  );
};

ListItem.propTypes = propTypes;
ListItem.defaultProps = defaultProps;

export default ListItem;
