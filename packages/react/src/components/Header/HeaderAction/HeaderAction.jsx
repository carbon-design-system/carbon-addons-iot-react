import React, { useMemo, useRef, useState } from 'react';
import { settings } from 'carbon-components';
import { HeaderGlobalAction } from 'carbon-components-react/es/components/UIShell';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Close16 } from '@carbon/icons-react';
import { white } from '@carbon/colors';

import { keyCodes } from '../../../constants/KeyCodeConstants';
import { HeaderActionItemPropTypes } from '../Header';
import deprecate from '../../../internal/deprecate';
import { handleSpecificKeyDown } from '../../../utils/componentUtilityFunctions';

import HeaderActionMenu from './HeaderActionMenu';
import HeaderActionPanel from './HeaderActionPanel';

const { prefix: carbonPrefix } = settings;

export const HeaderActionPropTypes = {
  /** details of the item to render in the action */
  item: PropTypes.shape(HeaderActionItemPropTypes).isRequired,
  /** unique index for the menu item */
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  /** Id that can be used for testing */
  testId: PropTypes.string,

  /** render only the label instead of the button */
  renderLabel: PropTypes.bool,

  /** should this action item be expanded by default */
  defaultExpanded: PropTypes.bool,

  /** a callback to trigger when the item is closed. used to managing icons for the overflow menu */
  onClose: PropTypes.func,

  i18n: PropTypes.shape({
    closeMenu: PropTypes.string,
  }),
  inOverflow: PropTypes.bool,
};

const defaultProps = {
  testId: 'header-action',
  renderLabel: false,
  defaultExpanded: false,
  onClose: null,
  i18n: {
    closeMenu: 'Close menu',
  },
  inOverflow: false,
};

/**
 * Listens to blur events and sends state changes back to the HeaderBar to determine
 * which items should be expanded
 *
 * Determines which element to render based on item
 *
 * Consists of nav buttons that can be clicked to perform actions, open header panels (side panels),
 * or dropdown menus
 */
const HeaderAction = ({
  item,
  index,
  testID,
  testId,
  renderLabel,
  defaultExpanded,
  onClose,
  i18n,
  inOverflow,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const parentContainerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const mergedI18n = useMemo(
    () => ({
      ...defaultProps.i18n,
      ...i18n,
    }),
    [i18n]
  );

  // expanded state for HeaderAction dropdowns
  const toggleExpandedState = () => {
    setIsExpanded((state) => {
      if (state && typeof onClose === 'function') {
        onClose();
      }
      return !state;
    });
  };

  /**
   * close header panel when focus is lost as long as we didn't enter into the child panel
   * */
  const handleHeaderClose = (event) => {
    if (!parentContainerRef.current.contains(event.relatedTarget)) {
      // Only close the header if the header is already expanded
      if (isExpanded) toggleExpandedState();
    }
  };

  /**
   * Toggles expanded state and return focus to menu button
   */
  const handleHeaderKeyDown = (event) => {
    // Handle keydowns for opening and closing the menus
    if (
      (event.keyCode === keyCodes.ESCAPE && isExpanded) ||
      event.keyCode === keyCodes.SPACE ||
      event.keyCode === keyCodes.ENTER
    ) {
      event.stopPropagation();
      event.preventDefault();
      toggleExpandedState();

      // Return focus to menu button when the user hits ESC.
      /* istanbul ignore else */
      if (menuButtonRef && menuButtonRef.current) {
        menuButtonRef.current.focus();
      }
    }
  };

  if (item.hasOwnProperty('childContent')) {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        data-testid="action-btn__group"
        className={`${carbonPrefix}--header__submenu ${carbonPrefix}--header-action-btn action-btn__group`}
        key={`submenu-${index}`}
        onBlur={(e) => handleHeaderClose(e)}
        onKeyDown={handleHeaderKeyDown}
        ref={parentContainerRef}
      >
        {item.hasOwnProperty('hasHeaderPanel') ? (
          // Render a subpanel type action
          <HeaderActionPanel
            item={item}
            onToggleExpansion={toggleExpandedState}
            isExpanded={isExpanded}
            ref={menuButtonRef}
            index={index}
            renderLabel={renderLabel}
            i18n={mergedI18n}
            inOverflow={inOverflow}
          />
        ) : (
          // otherwise render a submenu type dropdown
          <HeaderActionMenu
            className={`${carbonPrefix}--header-action-btn`}
            key={`menu-item-${item.label}`}
            aria-label={item.label}
            renderMenuContent={() => {
              return isExpanded && inOverflow ? (
                <Close16 fill={white} description={mergedI18n.closeMenu} />
              ) : (
                item.btnContent
              );
            }}
            menuLinkName={item.menuLinkName ? item.menuLinkName : ''}
            isExpanded={isExpanded}
            ref={menuButtonRef}
            onToggleExpansion={toggleExpandedState}
            label={item.label}
            data-testid={testID || testId}
            title={item.label}
            childContent={item.childContent}
          />
        )}
      </div>
    );
  }

  const onClick = item.onClick || (() => {});
  const onKeyDown = item.onKeyDown || onClick;
  // Otherwise render a simple menu button with no wrapper div
  return (
    <HeaderGlobalAction
      className={classnames(`${carbonPrefix}--header-action-btn`, item.className)}
      key={`menu-item-${item.label}-global-${index}`}
      data-testid={`menu-item-${item.label}-global`}
      aria-label={item.label}
      onClick={onClick}
      onKeyDown={handleSpecificKeyDown(['Enter', ' '], onKeyDown)}
    >
      {renderLabel ? item.label : item.btnContent}
    </HeaderGlobalAction>
  );
};

HeaderAction.propTypes = HeaderActionPropTypes;
HeaderAction.defaultProps = defaultProps;

export default HeaderAction;
