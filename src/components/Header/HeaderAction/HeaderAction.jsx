import React, { useRef } from 'react';
import { settings } from 'carbon-components';
import { HeaderGlobalAction } from 'carbon-components-react/lib/components/UIShell';
import PropTypes from 'prop-types';

import { keyCodes } from '../../../constants/KeyCodeConstants';
import { HeaderActionItemPropTypes } from '../Header';

import HeaderMenu from './HeaderMenu';
import HeaderPanelAction from './HeaderPanelAction';

const { prefix: carbonPrefix } = settings;

export const appSwitcher = 'AppSwitcher';

export const HeaderActionPropTypes = {
  /** details of the item to render in the action */
  item: PropTypes.shape(HeaderActionItemPropTypes).isRequired,
  /** unique index for the menu item */
  index: PropTypes.number.isRequired,
  /** callback when the menu item should be opened or closed  */
  onToggleExpansion: PropTypes.func.isRequired,
  /** is the action panel showing or not */
  isExpanded: PropTypes.bool,
};

const defaultProps = {
  isExpanded: false,
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
// eslint-disable-next-line
const HeaderAction = ({ item, index, onToggleExpansion, isExpanded }) => {
  const parentContainerRef = useRef(null);
  const menuButtonRef = useRef(null);
  /**
   * close header panel when focus is lost as long as we didn't enter into the child panel
   * */
  const handleHeaderClose = event => {
    if (!parentContainerRef.current.contains(event.relatedTarget)) {
      onToggleExpansion();
    }
  };

  /**
   * Close expanded menu when ESC is pressed, then return focus to menu button
   */
  const handleHeaderKeyDown = event => {
    // Handle ESC keydown for closing the expanded menu.
    if (event.keyCode === keyCodes.ESC && isExpanded) {
      event.stopPropagation();
      event.preventDefault();
      onToggleExpansion(item.label);

      // Return focus to menu button when the user hits ESC.
      if (menuButtonRef && menuButtonRef.current) {
        menuButtonRef.current.focus();
      }
    }
  };

  if (item.hasOwnProperty('childContent')) {
    return (
      // eslint-disable-next-line
      <div
        data-testid="action-btn__group"
        className={`${carbonPrefix}--header__submenu ${carbonPrefix}--header-action-btn action-btn__group`}
        key={`submenu-${index}`}
        onBlur={e => handleHeaderClose(e)}
        onKeyDown={handleHeaderKeyDown}
        ref={parentContainerRef}
      >
        {item.hasOwnProperty('hasHeaderPanel') ? (
          // Render a subpanel type action
          <HeaderPanelAction
            item={item}
            onToggleExpansion={() => onToggleExpansion(item.label)}
            isExpanded={isExpanded}
            ref={menuButtonRef}
          />
        ) : (
          // otherwise render a submenu type dropdown
          <HeaderMenu
            className={`${carbonPrefix}--header-action-btn`}
            key={`menu-item-${item.label}`}
            aria-label={item.label}
            renderMenuContent={() => item.btnContent}
            menuLinkName={item.menuLinkName ? item.menuLinkName : ''}
            isExpanded={isExpanded}
            ref={menuButtonRef}
            onToggleExpansion={() => onToggleExpansion(item.label)}
            label={item.label}
            data-testid="header-menu"
            title="header-menu"
            childContent={item.childContent}
          />
        )}
      </div>
    );
  }

  // Otherwise render a simple menu button with no wrapper div
  return (
    <HeaderGlobalAction
      className={`${carbonPrefix}--header-action-btn`}
      key={`menu-item-${item.label}-global-${index}`}
      aria-label={item.label}
    >
      {item.btnContent}
    </HeaderGlobalAction>
  );
};

HeaderAction.propTypes = HeaderActionPropTypes;
HeaderAction.defaultProps = defaultProps;

export default HeaderAction;
