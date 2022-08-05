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
  allApplicationsLink: null,
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
  testId: 'suite-header-app-switcher',
  isExpanded: false,
  workspaces: null,
  adminLink: null,
  isAdminView: false,
};

const propTypes = {
  customApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  globalApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  allApplicationsLink: PropTypes.string,
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
  allApplicationsLink,
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
  const mergedApplications = selectedWorkspace
    ? [...customApplications, ...selectedWorkspace.applications]
    : customApplications.length > 0
    ? [...customApplications]
    : null;

  useEffect(() => {
    // Show the workspace selection list if no workspace has been selected yet
    if (!isWorkspacesView && !selectedWorkspace && workspaces?.length > 1) {
      setWorkspacesView(true);
    }
  }, [isWorkspacesView, workspaces, selectedWorkspace]);

  useEffect(() => {
    // Set the selected workspace based on the isCurrent property
    // If this is an admin view, don't preselect any workspace, unless there is only one available, in this case select that one
    if (!selectedWorkspace && (!isAdminView || workspaces?.length === 1)) {
      setSelectedWorkspace(workspaces.find((wo) => wo.isCurrent));
      setWorkspacesView(false);
    }
  }, [workspaces, selectedWorkspace, isAdminView]);

  const handleApplicationSelected = useCallback(
    ({ href, id, isExternal }) => async (e) => {
      e.preventDefault();
      const newWindow = shouldOpenInNewWindow(e);
      const result = await onRouteChange(SUITE_HEADER_ROUTE_TYPES.APPLICATION, href, {
        appId: id,
      });
      if (result) {
        if (isExternal || newWindow) {
          window.open(href, '_blank', 'noopener noreferrer');
        } else {
          window.location.href = href;
        }
      }
    },
    [onRouteChange]
  );

  const handleWorkspaceSelection = useCallback(
    (workspace) => async (e) => {
      const { id, href } = workspace;
      if (isAdminView) {
        setSelectedWorkspace(workspace);
        setWorkspacesView(false);
      } else {
        e.preventDefault();
        const newWindow = shouldOpenInNewWindow(e);
        const result = await onRouteChange(SUITE_HEADER_ROUTE_TYPES.WORKSPACE, href, {
          workspaceId: id,
        });
        if (result) {
          if (newWindow) {
            window.open(href, '_blank', 'noopener noreferrer');
          } else {
            window.location.href = href;
          }
        }
      }
    },
    [isAdminView, onRouteChange]
  );

  const handleAdminRoute = useCallback(
    async (e) => {
      e.preventDefault();
      const newWindow = shouldOpenInNewWindow(e);
      const result = await onRouteChange(SUITE_HEADER_ROUTE_TYPES.ADMIN, adminLink);
      if (result) {
        if (newWindow) {
          window.open(adminLink, '_blank', 'noopener noreferrer');
        } else {
          window.location.href = adminLink;
        }
      }
    },
    [adminLink, onRouteChange]
  );

  const handleWorkspaceAdminRoute = useCallback(
    (workspaceAdminHref) => async (e) => {
      e.preventDefault();
      const newWindow = shouldOpenInNewWindow(e);
      const result = await onRouteChange(SUITE_HEADER_ROUTE_TYPES.WORKSPACE, workspaceAdminHref);
      if (result) {
        if (newWindow) {
          window.open(workspaceAdminHref, '_blank', 'noopener noreferrer');
        } else {
          window.location.href = workspaceAdminHref;
        }
      }
    },
    [onRouteChange]
  );

  const handleAllApplicationRoute = useCallback(
    async (e) => {
      e.preventDefault();
      const newWindow = shouldOpenInNewWindow(e);
      const result = await onRouteChange(SUITE_HEADER_ROUTE_TYPES.NAVIGATOR, allApplicationsLink);
      if (result) {
        if (newWindow) {
          window.open(allApplicationsLink, '_blank', 'noopener noreferrer');
        } else {
          window.location.href = allApplicationsLink;
        }
      }
    },
    [allApplicationsLink, onRouteChange]
  );

  const tabIndex = isExpanded ? 0 : -1;

  return (
    <ul data-testid={testId} className={baseClassName}>
      {!isWorkspacesView ? (
        <>
          {selectedWorkspace && workspaces?.length > 1 ? (
            <>
              <li className={`${baseClassName}--app-link`}>
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
          <li className={`${baseClassName}--app-link`}>
            {allApplicationsLink === null ? (
              <div className={`${baseClassName}--nav-link--button--loading`}>
                <ButtonSkeleton />
              </div>
            ) : (
              <Button
                kind="ghost"
                testId={`${testId}--all-applications`}
                onClick={handleAllApplicationRoute}
                onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], handleAllApplicationRoute)}
                tabIndex={tabIndex}
                href={allApplicationsLink}
                rel="noopener noreferrer"
              >
                {mergedI18n.allApplicationsLink}
              </Button>
            )}
          </li>
          {mergedApplications === null ? (
            <li>
              <div
                className={`${baseClassName}--nav-link--loading`}
                data-testid="suite-header-app-switcher--loading"
              >
                <SkeletonText paragraph lineCount={3} />
              </div>
            </li>
          ) : (
            mergedApplications.map(({ id, name, href, isExternal = false }) => {
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
                const eventHandler = handleWorkspaceAdminRoute(selectedWorkspace.adminHref);
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
                      href={selectedWorkspace.adminHref}
                      rel="noopener noreferrer"
                    >
                      {mergedI18n.workspaceAdmin}
                    </Button>
                  </li>
                );
              })()
            : null}
          {mergedApplications?.length === 0 ? (
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
          {(adminLink && !isAdminView) || globalApplications.length > 0 ? (
            <div className={`${baseClassName}--nav-link--separator`} />
          ) : null}
          {adminLink ? (
            <li className={`${baseClassName}--app-link`}>
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
          })}
        </>
      ) : (
        <>
          {selectedWorkspace ? (
            <>
              <li className={`${baseClassName}--app-link`}>
                <Button
                  kind="ghost"
                  testId={`${testId}--selected-workspace`}
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
