import {
  Header as CarbonHeader,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  HeaderMenuItem,
  HeaderPanel,
} from 'carbon-components-react/lib/components/UIShell';
import AppSwitcher from '@carbon/icons-react/lib/app-switcher/20';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { settings } from 'carbon-components';
import cn from 'classnames';

import HeaderMenu from './HeaderMenu';

const { prefix: carbonPrefix } = settings;

const propTypes = {
  /** Add a prefix other than IBM */
  prefix: PropTypes.string,
  /** Name to follow the IBM prefix up top, left */
  appName: PropTypes.string.isRequired,
  /** Add a class name to Header */
  className: PropTypes.string,
  /** Provide ID for the skip to content functionality */
  skipto: PropTypes.string,
  /** href optional url to file if you click on title */
  url: PropTypes.string,
  /** Object of action items */
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      /** declare control of header panel from this action item.  */
      hasHeaderPanel: PropTypes.bool,
      btnContent: PropTypes.any.isRequired,
      childContent: PropTypes.arrayOf(
        PropTypes.shape({
          /** extra data to pass to HeaderMenuLink (aria-*, href, target, etc.) */
          metaData: PropTypes.object,
          /** Optionally pass in an onClick handler to trigger action  */
          onClick: PropTypes.func,
          content: PropTypes.any.isRequired,
        })
      ),
    })
  ).isRequired,
  /** Bit to flip that tells header to render the nav toggle button */
  hasSideNav: PropTypes.bool,
  onClickSideNavExpand: PropTypes.func,
  /** Main app switcher Header panel props */
  headerPanel: PropTypes.shape({
    /** Optionally provide a custom class to apply to the underlying <li> node */
    className: PropTypes.string,
    /** the content of the header panel  */
    content: PropTypes.any,
  }),
};

const defaultProps = {
  onClickSideNavExpand: null,
  hasSideNav: true,
  prefix: 'IBM',
  className: 'main-header',
  skipto: '#main-content',
  headerPanel: null,
  url: '#',
};

export const appSwitcher = 'AppSwitcher';

/**
 * UI header with multiple side panels functionality and dropdowns
 */
const Header = ({
  appName,
  className,
  actionItems,
  prefix,
  skipto,
  hasSideNav,
  onClickSideNavExpand,
  headerPanel,
  url,
}) => {
  const [expandedItem, setExpandedItem] = useState({});

  // expanded state for header dropdowns
  const handleExpandedState = index => {
    setExpandedItem({
      [index]: !expandedItem[index],
    });
  };

  const handleClickOutside = (e, label) => {
    if (
      // not header panel trigger
      e?.relatedTarget?.title !== label &&
      // not in headerpanel
      !e?.target?.parentNode?.parentNode?.parentNode.contains(e.relatedTarget)
    ) {
      setExpandedItem(label);
    }
  };

  const actionBtnHeaderPanels = [];
  const actionBtnContent = actionItems.map((item, i) => {
    if (item.hasOwnProperty('childContent')) {
      if (item.hasOwnProperty('hasHeaderPanel')) {
        const panelChildren = item.childContent.map((childItem, k) => {
          const ChildElement = childItem?.metaData?.element || 'a';
          return (
            <li key={`listitem-${item.label}-${k}`} className="action-btn__headerpanel-li">
              <ChildElement
                key={`headerpanelmenu-item-${item.label +
                  item.childContent.indexOf(childItem)}-child-${i}`}
                {...childItem.metaData}
              >
                {childItem.content}
              </ChildElement>
            </li>
          );
        });

        return (
          <div
            data-testid="action-btn__group"
            className={`${carbonPrefix}--header__submenu ${carbonPrefix}--header-action-btn action-btn__group`}
            key={`submenu-${i}`}
            onBlur={e => handleClickOutside(e, item.label)}
          >
            <HeaderGlobalAction
              className={`${carbonPrefix}--header-action-btn action-btn__trigger`}
              key={`menu-item-${item.label}-global`}
              title={item.label}
              aria-label={item.label}
              aria-haspopup="menu"
              aria-expanded={expandedItem[item.label]}
              onClick={() => {
                handleExpandedState(item.label);
              }}
            >
              {item.btnContent}
            </HeaderGlobalAction>
            <HeaderPanel
              data-testid="action-btn__panel"
              tabIndex="-1"
              key={`panel-${i}`}
              aria-label="Header Panel"
              className={cn('action-btn__headerpanel', {
                'action-btn__headerpanel--closed': !expandedItem[item.label],
              })}
              expanded={expandedItem[item.label]}
            >
              <ul aria-label={item.label}>{panelChildren}</ul>
            </HeaderPanel>
          </div>
        );
      }
      const children = item.childContent.map(childItem => (
        <HeaderMenuItem
          key={`menu-item-${item.label + item.childContent.indexOf(childItem)}-child`}
          {...childItem.metaData}
        >
          {childItem.content}
        </HeaderMenuItem>
      ));
      return (
        <div
          data-testid="headermenu"
          className={`${carbonPrefix}--header__submenu`}
          key={`wrapper-${i}`}
          onBlur={e => handleClickOutside(e, item.label)}
        >
          <HeaderMenu
            className={`${carbonPrefix}--header-action-btn`}
            key={`menu-item-${item.label}`}
            aria-label={item.label}
            isMenu={false}
            renderMenuContent={() => item.btnContent}
            menuLinkName={item.menuLinkName ? item.menuLinkName : ''}
            expanded={expandedItem[item.label]}
            onClick={() => {
              handleExpandedState(item.label);
            }}
            handleExpandedState={handleExpandedState}
            label={item.label}
            data-testid="header-menu"
            title="header-menu"
          >
            {children}
          </HeaderMenu>
        </div>
      );
    }
    return (
      <HeaderGlobalAction
        className={`${carbonPrefix}--header-action-btn`}
        key={`menu-item-${item.label}-global-${i}`}
        aria-label={item.label}
        onClick={() => {
          handleExpandedState(item.label);
        }}
      >
        {item.btnContent}
      </HeaderGlobalAction>
    );
  });
  if (headerPanel) {
    actionBtnContent.push(
      <HeaderGlobalAction
        aria-label="header-panel-trigger"
        key={appSwitcher}
        onClick={() => handleExpandedState(appSwitcher)}
        title={appSwitcher}
        onBlur={e => handleClickOutside(e, appSwitcher)}
      >
        <AppSwitcher fill="white" description="Icon" />
      </HeaderGlobalAction>
    );
  }

  return (
    <CarbonHeader className={className} aria-label="main header">
      <SkipToContent href={skipto} />
      {hasSideNav && <HeaderMenuButton aria-label="Open menu" onClick={onClickSideNavExpand} />}
      <HeaderName href={url} prefix={prefix}>
        {appName}
      </HeaderName>
      <HeaderGlobalBar>{actionBtnContent}</HeaderGlobalBar>
      {actionBtnHeaderPanels}
      {headerPanel && (
        <HeaderPanel
          aria-label="Header Panel"
          className={cn(`${carbonPrefix}--app-switcher`, {
            [headerPanel.className]: headerPanel.className,
          })}
          expanded={expandedItem[appSwitcher]}
          data-testid="app-switcher-header-panel"
        >
          <headerPanel.content />
        </HeaderPanel>
      )}
    </CarbonHeader>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
