/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight16, Bee32 } from '@carbon/icons-react';
import { ButtonSkeleton } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';
import Button from '../../Button';
import { SkeletonText } from '../../SkeletonText';
import { shouldOpenInNewWindow } from '../suiteHeaderUtils';
import { SUITE_HEADER_ROUTE_TYPES } from '../suiteHeaderConstants';
import { SuiteHeaderApplicationPropTypes } from '../SuiteHeaderPropTypes';
import { handleSpecificKeyDown } from '../../../utils/componentUtilityFunctions';

const defaultProps = {
  applications: null,
  customApplications: [],
  allApplicationsLink: null,
  onRouteChange: async () => true,
  i18n: {
    myApplications: 'My applications',
    allApplicationsLink: 'All applications',
    requestAccess: 'Contact your administrator to request application access.',
    learnMoreLink: 'Learn more',
  },
  testId: 'suite-header-app-switcher',
  isExpanded: false,
};

const propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  customApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  allApplicationsLink: PropTypes.string,
  noAccessLink: PropTypes.string.isRequired,
  onRouteChange: PropTypes.func,
  i18n: PropTypes.shape({
    allApplicationsLink: PropTypes.string,
    requestAccess: PropTypes.string,
    learnMoreLink: PropTypes.string,
  }),
  testId: PropTypes.string,
  isExpanded: PropTypes.bool,
};

const SuiteHeaderAppSwitcher = ({
  applications,
  customApplications,
  allApplicationsLink,
  noAccessLink,
  i18n,
  onRouteChange,
  testId,
  isExpanded,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${settings.iotPrefix}--suite-header-app-switcher`;
  const mergedApplications = applications
    ? [...customApplications, ...applications]
    : customApplications.length > 0
    ? [...customApplications]
    : null;

  const handleRouteChange = useCallback(
    ({ href, id, isExternal }) => async (e) => {
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

  const handleAllApplicationRoute = useCallback(
    async (e) => {
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
      <li className={`${baseClassName}--nav-link`}>
        <p>{mergedI18n.myApplications}</p>
        {allApplicationsLink === null ? (
          <div className={`${baseClassName}--nav-link--button--loading`}>
            <ButtonSkeleton />
          </div>
        ) : (
          <Button
            kind="tertiary"
            testId={`${testId}--all-applications`}
            onClick={handleAllApplicationRoute}
            onKeyDown={handleSpecificKeyDown(['Enter', 'Space'], handleAllApplicationRoute)}
            renderIcon={ArrowRight16}
            tabIndex={tabIndex}
          >
            {mergedI18n.allApplicationsLink}
          </Button>
        )}
      </li>
      <div className={`${baseClassName}--nav-link--separator`} />
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
          const eventHandler = handleRouteChange({ href, id, isExternal });
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
              >
                {name}
              </Button>
            </li>
          );
        })
      )}
      {mergedApplications?.length === 0 ? (
        <div className={`${baseClassName}--no-app`}>
          <div className="bee-icon-container">
            <Bee32 />
            <div className="bee-shadow" />
          </div>
          <span>{mergedI18n.requestAccess}</span>
          <a
            href="javascript:void(0)"
            data-testid="suite-header-app-switcher--no-access"
            onClick={async () => {
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
    </ul>
  );
};

SuiteHeaderAppSwitcher.defaultProps = defaultProps;
SuiteHeaderAppSwitcher.propTypes = propTypes;

export default SuiteHeaderAppSwitcher;
