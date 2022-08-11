/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight16, ChevronLeft16, Launch16, Bee32 } from '@carbon/icons-react';
import { SideNavLink } from 'carbon-components-react/es/components/UIShell';

import { settings } from '../../../constants/Settings';
import Button from '../../Button';
import { shouldOpenInNewWindow } from '../suiteHeaderUtils';
import { SUITE_HEADER_ROUTE_TYPES } from '../suiteHeaderConstants';
import {
  SuiteHeaderApplicationPropTypes,
  SuiteHeaderWorkspacePropTypes,
} from '../SuiteHeaderPropTypes';
import { handleSpecificKeyDown } from '../../../utils/componentUtilityFunctions';

const defaultProps = {
  customApplications: [],
  globalApplications: [],
  onRouteChange: async () => true,
  i18n: {
    workspace: 'Workspace',
    workspaces: 'Workspaces',
    workspaceAdmin: 'Workspace administration',
    backToAppSwitcher: 'Back to application switcher',
    selectWorkspace: 'Select a workspace',
    availableWorkspaces: 'Available workspaces',
    suiteAdmin: 'Suite administration',
    allApplicationsLink: 'All applications',
    requestAccess: 'Contact your administrator to request application access.',
    learnMoreLink: 'Learn more',
  },
  testId: 'multi-workspace-suite-header-app-switcher',
  isExpanded: false,
  workspaces: null,
  noAccessLink: null,
  adminLink: null,
  isAdminView: false,
};

const propTypes = {
  customApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  globalApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  noAccessLink: PropTypes.string,
  onRouteChange: PropTypes.func,
  i18n: PropTypes.shape({
    workspace: PropTypes.string,
    workspaces: PropTypes.string,
    workspaceAdmin: PropTypes.string,
    backToAppSwitcher: PropTypes.string,
    selectWorkspace: PropTypes.string,
    availableWorkspaces: PropTypes.string,
    suiteAdmin: PropTypes.string,
    allApplicationsLink: PropTypes.string,
    requestAccess: PropTypes.string,
    learnMoreLink: PropTypes.string,
  }),
  testId: PropTypes.string,
  isExpanded: PropTypes.bool,
  workspaces: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderWorkspacePropTypes)),
  adminLink: PropTypes.string,
  isAdminView: PropTypes.bool,
};

const MultiWorkspaceSuiteHeaderAppSwitcher = ({
  customApplications,
  globalApplications,
  noAccessLink,
  i18n,
  onRouteChange,
  testId,
  isExpanded,
  workspaces,
  adminLink,
  isAdminView,
}) => {
  const [isWorkspacesView, setWorkspacesView] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${settings.iotPrefix}--suite-header-app-switcher-multiworkspace`;
  const workspaceApplications = workspaces ? selectedWorkspace?.applications ?? [] : null;
  const currentWorkspace = workspaces?.find((wo) => wo.isCurrent);

  useEffect(() => {
    // Show the workspace selection list if no workspace has been selected yet and if we are in an admin page
    if (!isWorkspacesView && !selectedWorkspace && workspaces?.length > 1 && isAdminView) {
      setWorkspacesView(true);
    }
  }, [isWorkspacesView, workspaces, selectedWorkspace, isAdminView]);

  useEffect(() => {
    if (!selectedWorkspace) {
      // If only 1 workspace is available, select it regardless of whether or not we are in a workspace-based page
      if (workspaces?.length === 1) {
        setSelectedWorkspace(workspaces[0]);
        setWorkspacesView(false);
      } else if (currentWorkspace) {
        // If there are more workspace, select the one with the isCurrent flag set
        setSelectedWorkspace(currentWorkspace);
        setWorkspacesView(false);
      }
    }
  }, [workspaces, currentWorkspace, selectedWorkspace, setSelectedWorkspace]);

  const handleRouteChange = useCallback(
    async (event, routeType, url, isExternal = false, data = null) => {
      event.preventDefault();
      const newWindow = shouldOpenInNewWindow(event);
      const result = await onRouteChange(routeType, url, data);
      if (result) {
        if (isExternal || newWindow) {
          window.open(url, '_blank', 'noopener noreferrer');
        } else {
          window.location.href = url;
        }
      }
    },
    [onRouteChange]
  );

  const handleApplicationRoute = useCallback(
    ({ id, href, isExternal }) => async (e) =>
      handleRouteChange(e, SUITE_HEADER_ROUTE_TYPES.APPLICATION, href, isExternal, { appId: id }),
    [handleRouteChange]
  );

  const handleWorkspaceRoute = useCallback(
    ({ id, href }) => async (e) =>
      handleRouteChange(e, SUITE_HEADER_ROUTE_TYPES.NAVIGATOR, href, false, { workspaceId: id }),
    [handleRouteChange]
  );

  const handleWorkspaceSelection = useCallback(
    (workspace) => async (e) => {
      const { id, href } = workspace;
      if (isAdminView) {
        setSelectedWorkspace(workspace);
        setWorkspacesView(false);
      } else {
        handleWorkspaceRoute({ id, href })(e);
      }
    },
    [isAdminView, handleWorkspaceRoute]
  );

  const handleAdminRoute = useCallback(
    async (e) => handleRouteChange(e, SUITE_HEADER_ROUTE_TYPES.ADMIN, adminLink),
    [adminLink, handleRouteChange]
  );

  const tabIndex = isExpanded ? 0 : -1;

  const renderNavItem = useCallback(
    (name, href, isExternal, icon, eventHandler, isSelected, keySuffix) => (
      <SideNavLink
        id={`suite-header-${keySuffix}`}
        key={`key-${keySuffix}`}
        className={`${baseClassName}--app-link`}
        testId={`${testId}--${keySuffix}`}
        onClick={eventHandler}
        onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], eventHandler)}
        tabIndex={tabIndex}
        renderIcon={
          isExternal
            ? Launch16
            : icon
            ? () => <img src={`data:image/svg+xml;base64, ${icon}`} alt="appIcon" />
            : null
        }
        href={href}
        rel="noopener noreferrer"
        large
        isActive={isSelected}
      >
        {name}
      </SideNavLink>
    ),

    [baseClassName, tabIndex, testId]
  );

  return (
    <ul data-testid={testId} className={baseClassName}>
      {!isWorkspacesView ? (
        <>
          {workspaces?.length > 1 ? (
            <>
              <li
                id="suite-header-selected-workspace"
                key="key-selected-workspace"
                className={`${baseClassName}--app-link`}
              >
                <p>{mergedI18n.workspace}</p>

                <Button
                  kind="ghost"
                  testId={`${testId}--selected-workspace`}
                  onClick={() => setWorkspacesView(true)}
                  onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], () =>
                    setWorkspacesView(true)
                  )}
                  renderIcon={ChevronRight16}
                  tabIndex={tabIndex}
                >
                  {selectedWorkspace?.name ?? mergedI18n.selectWorkspace}
                </Button>
              </li>
              <div className={`${baseClassName}--nav-link--separator`} />
            </>
          ) : null}
          {selectedWorkspace && selectedWorkspace.href
            ? renderNavItem(
                mergedI18n.allApplicationsLink,
                selectedWorkspace.href,
                false,
                null,
                handleWorkspaceRoute({ id: selectedWorkspace.id, href: selectedWorkspace.href }),
                false,
                `all-applications`
              )
            : null}
          {workspaceApplications
            ? workspaceApplications?.map(({ id, name, href, isExternal = false, icon = null }) =>
                renderNavItem(
                  name,
                  href,
                  isExternal,
                  icon,
                  handleApplicationRoute({ id, href, isExternal }),
                  false,
                  `application-${id}`
                )
              )
            : null}
          {selectedWorkspace && selectedWorkspace.adminHref
            ? renderNavItem(
                mergedI18n.workspaceAdmin,
                selectedWorkspace.adminHref,
                false,
                null,
                handleWorkspaceRoute({
                  id: selectedWorkspace.id,
                  href: selectedWorkspace.adminHref,
                }),
                false,
                `admin-workspace`
              )
            : null}
          {selectedWorkspace && workspaceApplications?.length === 0 ? (
            <div data-testid={`${testId}--no-app`} className={`${baseClassName}--no-app`}>
              <div className="bee-icon-container">
                <Bee32 />
                <div className="bee-shadow" />
              </div>
              <span>{mergedI18n.requestAccess}</span>
              <a
                href={noAccessLink}
                rel="noopener noreferrer"
                data-testid={`${testId}--no-access`}
                onClick={async (e) => {
                  e.preventDefault();
                  const result = await onRouteChange(
                    SUITE_HEADER_ROUTE_TYPES.DOCUMENTATION,
                    noAccessLink
                  );
                  if (result) {
                    window.location.href = noAccessLink;
                  }
                }}
                tabIndex={tabIndex}
              >
                {mergedI18n.learnMoreLink}
              </a>
            </div>
          ) : null}
          {adminLink || globalApplications.length > 0 ? (
            <div className={`${baseClassName}--nav-link--separator`} />
          ) : null}
          {adminLink
            ? renderNavItem(
                mergedI18n.suiteAdmin,
                adminLink,
                false,
                null,
                handleAdminRoute,
                false,
                `admin`
              )
            : null}
          {globalApplications.map(({ id, name, href, isExternal = false, icon = null }) =>
            renderNavItem(
              name,
              href,
              isExternal,
              icon,
              handleApplicationRoute({ id, href, isExternal }),
              false,
              `global-application-${id}`
            )
          )}
          {customApplications.length > 0 ? (
            <div className={`${baseClassName}--nav-link--separator`} />
          ) : null}
          {customApplications.map(({ id, name, href, isExternal = false, icon = null }) =>
            renderNavItem(
              name,
              href,
              isExternal,
              icon,
              handleApplicationRoute({ id, href, isExternal }),
              false,
              `custom-application-${id}`
            )
          )}
        </>
      ) : (
        <>
          {selectedWorkspace ? (
            <>
              <li
                id="suite-header-back-to-switcher"
                key="key-back-to-switcher"
                className={`${baseClassName}--app-link`}
              >
                <Button
                  kind="ghost"
                  testId={`${testId}--back-to-switcher`}
                  onClick={() => setWorkspacesView(false)}
                  onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], () =>
                    setWorkspacesView(false)
                  )}
                  renderIcon={ChevronLeft16}
                  tabIndex={tabIndex}
                >
                  {mergedI18n.backToAppSwitcher}
                </Button>
              </li>
              <div className={`${baseClassName}--nav-link--separator`} />
              <li className={`${baseClassName}--app-link`}>
                <p>{mergedI18n.availableWorkspaces}</p>
              </li>
            </>
          ) : (
            <li className={`${baseClassName}--app-link`}>
              <p>{mergedI18n.selectWorkspace}</p>
            </li>
          )}
          {workspaces.map((workspace) =>
            renderNavItem(
              workspace.name,
              isAdminView ? '' : workspace.href,
              false,
              null,
              handleWorkspaceSelection(workspace),
              workspace.id === selectedWorkspace?.id,
              `workspace-${workspace.id}`
            )
          )}
        </>
      )}
    </ul>
  );
};

MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps = defaultProps;
MultiWorkspaceSuiteHeaderAppSwitcher.propTypes = propTypes;

export default MultiWorkspaceSuiteHeaderAppSwitcher;
