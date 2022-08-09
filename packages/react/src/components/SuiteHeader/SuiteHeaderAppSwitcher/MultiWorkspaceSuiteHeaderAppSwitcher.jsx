/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight16, ChevronLeft16, Launch16, Bee32 } from '@carbon/icons-react';
import { ButtonSkeleton } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';
import Button from '../../Button';
import { SkeletonText } from '../../SkeletonText';
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
  adminLink: null,
  isAdminView: false,
};

const propTypes = {
  customApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  globalApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  noAccessLink: PropTypes.string.isRequired,
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
  const baseClassName = `${settings.iotPrefix}--suite-header-app-switcher`;
  const workspaceApplications = selectedWorkspace?.applications ?? null;

  useEffect(() => {
    // Show the workspace selection list if no workspace has been selected yet
    if (!isWorkspacesView && !selectedWorkspace && workspaces?.length > 1) {
      setWorkspacesView(true);
    }
  }, [isWorkspacesView, workspaces, selectedWorkspace]);

  useEffect(() => {
    // Set the selected workspace based on the isCurrent property
    // If this is an admin view, don't preselect any workspace, unless there is only one available, in this case select that one
    if (workspaces && !selectedWorkspace && (!isAdminView || workspaces.length === 1)) {
      setSelectedWorkspace(workspaces.find((wo) => wo.isCurrent) ?? workspaces[0]);
      setWorkspacesView(false);
    }
  }, [workspaces, selectedWorkspace, isAdminView]);

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

  const handleApplicationSelected = useCallback(
    ({ href, id, isExternal }) => async (e) =>
      handleRouteChange(e, SUITE_HEADER_ROUTE_TYPES.APPLICATION, href, isExternal, { appId: id }),
    [handleRouteChange]
  );

  const handleWorkspaceRoute = useCallback(
    ({ href, id }) => async (e) =>
      handleRouteChange(e, SUITE_HEADER_ROUTE_TYPES.WORKSPACE, href, false, { workspaceId: id }),
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

  return (
    <ul data-testid={testId} className={baseClassName}>
      {!isWorkspacesView ? (
        <>
          {selectedWorkspace && workspaces?.length > 1 ? (
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
                  {selectedWorkspace.name}
                </Button>
              </li>
              <div className={`${baseClassName}--nav-link--separator`} />
            </>
          ) : null}
          {selectedWorkspace && selectedWorkspace.href ? (
            (() => {
              const { id, href } = selectedWorkspace;
              const eventHandler = handleWorkspaceRoute({ id, href });
              return (
                <li
                  id="suite-header-all-application"
                  key="key-all-applications"
                  className={`${baseClassName}--app-link`}
                >
                  <Button
                    kind="ghost"
                    testId={`${testId}--all-applications`}
                    onClick={eventHandler}
                    onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], eventHandler)}
                    tabIndex={tabIndex}
                    href={href}
                    rel="noopener noreferrer"
                  >
                    {mergedI18n.allApplicationsLink}
                  </Button>
                </li>
              );
            })()
          ) : (
            <div className={`${baseClassName}--nav-link--button--loading`}>
              <ButtonSkeleton />
            </div>
          )}
          {workspaceApplications === null ? (
            <li>
              <div
                className={`${baseClassName}--nav-link--loading`}
                data-testid="suite-header-app-switcher--loading"
              >
                <SkeletonText paragraph lineCount={3} />
              </div>
            </li>
          ) : (
            workspaceApplications.map(({ id, name, href, isExternal = false }) => {
              const eventHandler = handleApplicationSelected({ href, id, isExternal });
              return (
                <li
                  id={`suite-header-application-${id}`}
                  key={`key-${id}`}
                  className={`${baseClassName}--app-link`}
                >
                  <Button
                    kind="ghost"
                    testId={`${testId}--${id}`}
                    onClick={eventHandler}
                    onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], eventHandler)}
                    tabIndex={tabIndex}
                    renderIcon={isExternal ? Launch16 : null}
                    href={href}
                    rel="noopener noreferrer"
                  >
                    {name}
                  </Button>
                </li>
              );
            })
          )}
          {selectedWorkspace && selectedWorkspace.adminHref
            ? (() => {
                const { id, adminHref } = selectedWorkspace;
                const eventHandler = handleWorkspaceRoute({ id, href: adminHref });
                return (
                  <li
                    id="suite-header-workspace-admin"
                    key="key-workspace-admin"
                    className={`${baseClassName}--app-link`}
                  >
                    <Button
                      kind="ghost"
                      testId={`${testId}--workspace-admin`}
                      onClick={eventHandler}
                      onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], eventHandler)}
                      tabIndex={tabIndex}
                      href={adminHref}
                      rel="noopener noreferrer"
                    >
                      {mergedI18n.workspaceAdmin}
                    </Button>
                  </li>
                );
              })()
            : null}
          {workspaceApplications?.length === 0 ? (
            <div className={`${baseClassName}--no-app`}>
              <div className="bee-icon-container">
                <Bee32 />
                <div className="bee-shadow" />
              </div>
              <span>{mergedI18n.requestAccess}</span>
              <a
                href={noAccessLink}
                rel="noopener noreferrer"
                data-testid="suite-header-app-switcher--no-access"
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
          {adminLink ? (
            <li id="suite-header-admin" key="key-admin" className={`${baseClassName}--app-link`}>
              <Button
                kind="ghost"
                testId={`${testId}--admin`}
                onClick={handleAdminRoute}
                onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], handleAdminRoute)}
                tabIndex={tabIndex}
                href={adminLink}
                rel="noopener noreferrer"
              >
                {mergedI18n.suiteAdmin}
              </Button>
            </li>
          ) : null}
          {globalApplications.map(({ id, name, href, isExternal = false }) => {
            const eventHandler = handleApplicationSelected({ href, id, isExternal });
            return (
              <li
                id={`suite-header-global-application-${id}`}
                key={`key-global-${id}`}
                className={`${baseClassName}--app-link`}
              >
                <Button
                  kind="ghost"
                  testId={`${testId}--global-${id}`}
                  onClick={eventHandler}
                  onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], eventHandler)}
                  tabIndex={tabIndex}
                  renderIcon={isExternal ? Launch16 : null}
                  href={href}
                  rel="noopener noreferrer"
                >
                  {name}
                </Button>
              </li>
            );
          })}
          {customApplications.length > 0 ? (
            <div className={`${baseClassName}--nav-link--separator`} />
          ) : null}
          {customApplications.map(({ id, name, href, isExternal = false }) => {
            const eventHandler = handleApplicationSelected({ href, id, isExternal });
            return (
              <li
                id={`suite-header-custom-application-${id}`}
                key={`key-custom-${id}`}
                className={`${baseClassName}--app-link`}
              >
                <Button
                  kind="ghost"
                  testId={`${testId}--custom-${id}`}
                  onClick={eventHandler}
                  onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], eventHandler)}
                  tabIndex={tabIndex}
                  renderIcon={isExternal ? Launch16 : null}
                  href={href}
                  rel="noopener noreferrer"
                >
                  {name}
                </Button>
              </li>
            );
          })}
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
          {workspaces.map((workspace) => {
            const eventHandler = handleWorkspaceSelection(workspace);
            return (
              <li
                id={`suite-header-workspace-${workspace.id}`}
                key={`key-${workspace.id}`}
                className={`${baseClassName}--app-link`}
              >
                <Button
                  kind="icon-selection"
                  testId={`${testId}--${workspace.id}`}
                  onClick={eventHandler}
                  onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], eventHandler)}
                  tabIndex={tabIndex}
                  href={!isAdminView && workspace.href}
                  selected={workspace.id === selectedWorkspace?.id}
                  rel="noopener noreferrer"
                >
                  {workspace.name}
                </Button>
              </li>
            );
          })}
        </>
      )}
    </ul>
  );
};

MultiWorkspaceSuiteHeaderAppSwitcher.defaultProps = defaultProps;
MultiWorkspaceSuiteHeaderAppSwitcher.propTypes = propTypes;

export default MultiWorkspaceSuiteHeaderAppSwitcher;
