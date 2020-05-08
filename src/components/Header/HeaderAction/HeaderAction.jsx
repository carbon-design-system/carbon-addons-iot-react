import React, { useRef, useState } from 'react';
import { settings } from 'carbon-components';
import { HeaderGlobalAction } from 'carbon-components-react/es/components/UIShell';
import PropTypes from 'prop-types';

import { keyCodes } from '../../../constants/KeyCodeConstants';
import { HeaderActionItemPropTypes } from '../Header';

import HeaderActionMenu from './HeaderActionMenu';
import HeaderActionPanel from './HeaderActionPanel';

const { prefix: carbonPrefix } = settings;

export const HeaderActionPropTypes = {
  /** details of the item to render in the action */
  item: PropTypes.shape(HeaderActionItemPropTypes).isRequired,
  /** unique index for the menu item */
  index: PropTypes.number.isRequired,
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
const HeaderAction = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const parentContainerRef = useRef(null);
  const menuButtonRef = useRef(null);

  // expanded state for HeaderAction dropdowns
  const toggleExpandedState = () => {
    setIsExpanded(state => !state);
  };

  /**
   * close header panel when focus is lost as long as we didn't enter into the child panel
   * */
  const handleHeaderClose = event => {
    if (!parentContainerRef.current.contains(event.relatedTarget)) {
      // Only close the header if the header is already expanded
      if (isExpanded) toggleExpandedState();
    }
  };

  /**
   * Close expanded menu when ESC is pressed, then return focus to menu button
   */
  const handleHeaderKeyDown = event => {
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
          <HeaderActionPanel
            item={item}
            onToggleExpansion={toggleExpandedState}
            isExpanded={isExpanded}
            ref={menuButtonRef}
            index={index}
          />
        ) : (
          // otherwise render a submenu type dropdown
          <HeaderActionMenu
            className={`${carbonPrefix}--header-action-btn`}
            key={`menu-item-${item.label}`}
            aria-label={item.label}
            renderMenuContent={() => item.btnContent}
            menuLinkName={item.menuLinkName ? item.menuLinkName : ''}
            isExpanded={isExpanded}
            ref={menuButtonRef}
            onToggleExpansion={toggleExpandedState}
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
      onClick={item.onClick || (() => {})}
    >
      {item.btnContent}
    </HeaderGlobalAction>
  );
};

HeaderAction.propTypes = HeaderActionPropTypes;

export default HeaderAction;
