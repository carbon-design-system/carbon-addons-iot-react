import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { HeaderGlobalBar } from 'carbon-components-react/es/components/UIShell';
import PropTypes from 'prop-types';
import { Close16, OverflowMenuVertical16 } from '@carbon/icons-react';
import ReactDOM from 'react-dom';
import { white } from '@carbon/colors';

import { OverflowMenu } from '../OverflowMenu';
import { OverflowMenuItem } from '../OverflowMenuItem';
import { settings } from '../../constants/Settings';

import HeaderAction from './HeaderAction/HeaderAction';
import { HeaderActionItemPropTypes } from './Header';

const { iotPrefix, prefix } = settings;

const propTypes = {
  actionItems: PropTypes.arrayOf(PropTypes.shape(HeaderActionItemPropTypes)).isRequired,

  i18n: PropTypes.shape({
    closeMenu: PropTypes.string,
    openMenu: PropTypes.string,
  }),
};

const defaultProps = {
  i18n: {
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
  },
};
/**
 * Keeps track of the state of which header menu item is currently expanded
 *
 * Renders all the actions that can be clicked to navigate, open header panels (side panels),
 * or dropdown menus, passing an onToggleExpansion to each action
 */
const HeaderActionGroup = ({ actionItems, i18n }) => {
  const overFlowContainerRef = useRef(null);
  const [overflowItems, setOverflowItems] = useState([]);
  const breakpoint = useRef(null);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menu, setMenu] = useState(null);
  const mergedI18n = useMemo(
    () => ({
      ...defaultProps.i18n,
      ...i18n,
    }),
    [i18n]
  );

  const checkForOverflow = useCallback(() => {
    /* istanbul ignore else */
    if (overFlowContainerRef.current) {
      const firstButtonInGroupRef =
        overFlowContainerRef.current?.lastChild?.firstChild?.getBoundingClientRect();
      const nameDivRef = overFlowContainerRef.current?.previousSibling?.getBoundingClientRect();

      /* istanbul ignore else */
      if (firstButtonInGroupRef && nameDivRef) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        // check that it's also greater than zero to prevent collapsing in jest where all the values are 0.
        const tooBig = nameDivRef.right > 0 && nameDivRef.right >= firstButtonInGroupRef.left;
        const previousBreakpoint = breakpoint.current;

        if (tooBig && actionItems.length > 0 && overflowItems.length === 0) {
          breakpoint.current = windowWidth;
          setOverflowItems(actionItems);
        } else if (windowWidth > previousBreakpoint) {
          setOverflowItems([]);
        }
      }
    }
  }, [actionItems, overflowItems.length]);

  useLayoutEffect(() => {
    checkForOverflow();
    window.addEventListener('resize', checkForOverflow);

    return () => window.removeEventListener('resize', checkForOverflow);
  }, [checkForOverflow]);

  return (
    // added ever div here, because HeaderGlobalBar doesn't support refs
    <div ref={overFlowContainerRef} className={`${prefix}--header__global`}>
      <HeaderGlobalBar>
        {
          // if we have overflow items and are not showing a header action submenu
          // then render the overflow menu
          overflowItems.length > 0 && !showMenu ? (
            <div
              className={`${iotPrefix}--header__overflow-menu-container`}
              data-floating-menu-container
            >
              <OverflowMenu
                useAutoPositioning
                onOpen={() => setOverflowOpen(true)}
                onClose={() => setOverflowOpen(false)}
                renderIcon={() =>
                  // show a close icon when open per design specs
                  overflowOpen ? (
                    <Close16 fill={white} description={mergedI18n.closeMenu} />
                  ) : (
                    <OverflowMenuVertical16 fill={white} description={mergedI18n.openMenu} />
                  )
                }
              >
                {overflowItems.map((child, i) => {
                  if (
                    child.hasHeaderPanel ||
                    (Array.isArray(child.childContent) && child.childContent.length > 0)
                  ) {
                    ReactDOM.createPortal(
                      [
                        <HeaderAction
                          item={child}
                          index={i}
                          key={`header-action-item-${child.label}-${i}`}
                          testID={`header-action-item-${child.label}`}
                          // used to render only the label in the overflow menu instead of the icon
                          renderLabel
                          i18n={mergedI18n}
                        />,
                      ],
                      overFlowContainerRef.current.parentNode
                    );
                  }

                  return (
                    <OverflowMenuItem
                      title={child.label}
                      key={`${child.label}-${i}`}
                      onClick={(event) => {
                        // because these items are passed an href="#" we want to prevent the default action
                        event.preventDefault();

                        // if a header action has a submenu, we need to capture that submenu
                        // and replace the main overflow menu icon with it per design specs
                        // this saves the menu item on click, closes the overflow menu, and
                        // instead shows the header action menu.
                        /* istanbul ignore else */
                        if (Array.isArray(child.childContent) && child.childContent.length > 0) {
                          setMenu(child);
                          setOverflowOpen(false);
                          setShowMenu(true);
                        }

                        if (typeof child.onClick === 'function') {
                          child.onClick(event);
                        }
                      }}
                      itemText={child.label}
                    />
                  );
                })}
              </OverflowMenu>
            </div>
          ) : // if the user clicked on a header action with a menu
          // show that menu in place of the overflow menu.
          showMenu ? (
            <HeaderAction
              item={menu}
              index={0}
              key={`header-action-item-${menu.label}-${0}`}
              testID={`header-action-item-${menu.label}`}
              // force this menu menu to be open
              defaultExpanded
              // close the menu and restore the overflow menu button
              onClose={() => {
                setShowMenu(false);
                setMenu(null);
              }}
            />
          ) : (
            // otherwise, if we have enough space to show all the items,
            // simple render them in the header as expected.
            actionItems.map((item, i) => (
              <HeaderAction
                item={item}
                index={i}
                key={`header-action-item-${item.label}-${i}`}
                testID={`header-action-item-${item.label}`}
              />
            ))
          )
        }
      </HeaderGlobalBar>
    </div>
  );
};

HeaderActionGroup.propTypes = propTypes;
HeaderActionGroup.defaultProps = defaultProps;

export default HeaderActionGroup;
