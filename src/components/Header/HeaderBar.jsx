import React, { useState } from 'react';
import { HeaderGlobalBar } from 'carbon-components-react/lib/components/UIShell';
import PropTypes from 'prop-types';

import HeaderAction from './HeaderAction/HeaderAction';
import { HeaderActionItemPropTypes, HeaderPanelPropTypes } from './Header';

const propTypes = {
  actionItems: PropTypes.arrayOf(HeaderActionItemPropTypes).isRequired,
  headerPanel: HeaderPanelPropTypes,
};

const defaultProps = {
  headerPanel: null,
};

/**
 * Toggles the state of which item is currently expanded
 * Does not listen for blur events, only expandedItem state changes
 * Contains actions that can be clicked to navigate, open header panels (side panels),
 * or dropdown menus
 */
const HeaderBar = ({ actionItems, headerPanel }) => {
  const [expandedItem, setExpandedItem] = useState({});

  // expanded state for header dropdowns
  const toggleExpandedState = index => {
    setExpandedItem({
      [index]: !expandedItem[index],
    });
  };

  return (
    <>
      <HeaderGlobalBar>
        {actionItems.map((item, i) => (
          <HeaderAction
            item={item}
            index={i}
            onToggleExpansion={toggleExpandedState}
            isExpanded={expandedItem[item.label]}
          />
        ))}
        {/* {headerPanel && (
          <>
            <HeaderAction />
            <HeaderGlobalAction
              aria-label="header-panel-trigger"
              key={appSwitcher}
              onClick={() => toggleExpandedState(appSwitcher)}
              title={appSwitcher}
              onBlur={e => toggleCloseOnTab(e)}
            >
              <AppSwitcher fill="white" description="Icon" />
            </HeaderGlobalAction>
            <HeaderPanel
              aria-label="Header Panel"
              className={cn(`${carbonPrefix}--app-switcher`, {
                [headerPanel.className]: headerPanel.className,
              })}
              expanded={expandedItem[appSwitcher]}
              data-testid="app-switcher-header-panel"
              onBlur={e => toggleClickOutside(e, appSwitcher)}
            >
              <headerPanel.content />
            </HeaderPanel>
          </>
        )} */}
      </HeaderGlobalBar>
    </>
  );
};

HeaderBar.propTypes = propTypes;
HeaderBar.defaultProps = defaultProps;

export default HeaderBar;
