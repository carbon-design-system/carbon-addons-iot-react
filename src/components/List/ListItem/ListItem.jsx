import React from 'react';
import classnames from 'classnames';
import { Icon } from 'carbon-components-react';
import { iconChevronDown, iconChevronUp } from 'carbon-icons';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

// internal component
// eslint-disable-next-line
const ListItemWrapper = ({ id, isSelectable, onSelect, selected, isLargeRow, children }) =>
  isSelectable ? (
    <div
      role="button"
      tabIndex={0}
      className={classnames(
        `${iotPrefix}--list-item`,
        `${iotPrefix}--list-item__selectable`,
        { [`${iotPrefix}--list-item__selected`]: selected },
        { [`${iotPrefix}--list-item__large`]: isLargeRow }
      )}
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
      })}
    >
      {children}
    </div>
  );

const ListItemPropTypes = {
  id: PropTypes.string.isRequired,
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
  nestingLevel: PropTypes.number,
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
};

const ListItemDefaultProps = {
  isLargeRow: false,
  isExpandable: false,
  onExpand: () => {},
  isSelectable: false,
  onSelect: () => {},
  selected: false,
  expanded: false,
  secondaryValue: null,
  rowActions: [],
  icon: null,
  iconPosition: 'left',
  nestingLevel: null,
  isCategory: false,
  i18n: {
    expand: 'Expand',
    close: 'Close',
  },
  selectedItemRef: null,
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
  iconPosition, // or "right"
  nestingLevel,
  isCategory,
  i18n,
  selectedItemRef,
}) => {
  const handleExpansionClick = () => isExpandable && onExpand(id);

  const renderNestingOffset = () =>
    nestingLevel > 0 ? <div style={{ width: `${nestingLevel * 30}px` }}>&nbsp;</div> : null;

  const renderExpander = () =>
    isExpandable ? (
      <div
        role="button"
        tabIndex={0}
        className={`${iotPrefix}--list-item--expand-icon`}
        onClick={handleExpansionClick}
        onKeyPress={({ key }) => key === 'Enter' && handleExpansionClick()}
      >
        <Icon
          icon={expanded ? iconChevronUp : iconChevronDown}
          description={expanded ? i18n.expand : i18n.close}
        />
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

  return (
    <ListItemWrapper {...{ id, isSelectable, selected, isLargeRow, onSelect }}>
      {renderNestingOffset()}
      {renderExpander()}
      <div
        className={classnames(
          `${iotPrefix}--list-item--content`,
          { [`${iotPrefix}--list-item--content__selected`]: selected },
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
                  })}
                  title={value}
                >
                  {value}
                </div>
                {renderRowActions()}
              </div>
              {secondaryValue ? (
                <div
                  title={secondaryValue}
                  className={`${iotPrefix}--list-item--content--values--secondary
                   ${iotPrefix}--list-item--content--values--secondary__large`}
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
                  })}
                  title={value}
                >
                  {value}
                </div>
                {secondaryValue ? (
                  <div
                    title={secondaryValue}
                    className={`${iotPrefix}--list-item--content--values--secondary`}
                  >
                    {secondaryValue}
                  </div>
                ) : null}
                {renderRowActions()}
              </div>
            </>
          )}
        </div>
      </div>
    </ListItemWrapper>
  );
};

ListItem.propTypes = ListItemPropTypes;
ListItem.defaultProps = ListItemDefaultProps;
export default ListItem;
