/*
 * Licensed Materials - Property of IBM
 * 5737-M66, 5900-AAA
 * (C) Copyright IBM Corp. 2020 All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication, or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */

import React from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft16, Bee32 } from '@carbon/icons-react';

import { settings } from '../../../constants/Settings';
import SuiteHeader from '../SuiteHeader';

const defaultProps = {
  applications: [],
  onRouteChange: async () => true,
  i18n: {
    allApplicationsLink: 'All applications',
    requestAccess: 'Contact your administrator to request application access.',
    learnMoreLink: 'Learn more',
  },
};

const propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      isExternal: PropTypes.bool,
    })
  ),
  allApplicationsLink: PropTypes.string.isRequired,
  noAccessLink: PropTypes.string.isRequired,
  onRouteChange: PropTypes.func,
  i18n: PropTypes.shape({
    allApplicationsLink: PropTypes.string,
    requestAccess: PropTypes.string,
    learnMoreLink: PropTypes.string,
  }),
};

const SuiteHeaderAppSwitcher = ({
  applications,
  allApplicationsLink,
  noAccessLink,
  i18n,
  onRouteChange,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${settings.iotPrefix}--suite-header-app-switcher`;
  return (
    <ul className={baseClassName}>
      <li className={`${baseClassName}--nav-link`}>
        <a
          href="javascript:void(0)"
          onClick={async () => {
            const result = await onRouteChange(
              SuiteHeader.ROUTE_TYPES.NAVIGATOR,
              allApplicationsLink
            );
            if (result) {
              window.location.assign(allApplicationsLink);
            }
          }}
        >
          <ArrowLeft16 />
          {mergedI18n.allApplicationsLink}
        </a>
      </li>
      {applications.map(({ id, name, href, isExternal = false }) => (
        <li key={`key-${id}`} className={`${baseClassName}--app-link`}>
          <a
            href="javascript:void(0)"
            onClick={async () => {
              const result = await onRouteChange(SuiteHeader.ROUTE_TYPES.APPLICATION, href, {
                appId: id,
              });
              if (result) {
                if (isExternal) {
                  window.open(href, 'blank');
                } else {
                  window.location.assign(href);
                }
              }
            }}
          >
            {name}
          </a>
        </li>
      ))}
      {applications.length === 0 ? (
        <div className={`${baseClassName}--no-app`}>
          <div className="bee-icon-container">
            <Bee32 />
            <div className="bee-shadow" />
          </div>
          <span>{mergedI18n.requestAccess}</span>
          <a
            href="javascript:void(0)"
            onClick={async () => {
              const result = await onRouteChange(
                SuiteHeader.ROUTE_TYPES.DOCUMENTATION,
                noAccessLink
              );
              if (result) {
                window.location.assign(noAccessLink);
              }
            }}
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
