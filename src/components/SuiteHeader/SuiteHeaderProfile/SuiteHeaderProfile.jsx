/*
 * Licensed Materials - Property of IBM
 * 5737-M66, 5900-AAA
 * (C) Copyright IBM Corp. 2020 All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication, or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '../../../index';
import { settings } from '../../../constants/Settings';

const defaultProps = {
  i18n: {
    profileTitle: 'Profile',
    profileButton: 'Manage profile',
    logoutButton: 'Log out',
  },
};

const propTypes = {
  displayName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  profileLink: PropTypes.string.isRequired,
  onRequestLogout: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    profileTitle: PropTypes.string,
    profileButton: PropTypes.string,
    logoutButton: PropTypes.string,
  }),
};

const SuiteHeaderProfile = ({ displayName, username, profileLink, onRequestLogout, i18n }) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${settings.iotPrefix}--suite-header-profile`;
  const chipText = displayName
    ? displayName
        .split(' ')
        .map(i => i.charAt(0))
        .join('')
    : null;
  return (
    <div className={baseClassName}>
      <h5>{mergedI18N.profileTitle}</h5>
      <div className={`${baseClassName}--user`}>
        <div className={`${baseClassName}--user--chip`}>{chipText}</div>
        <div className={`${baseClassName}--user--detail`}>
          <div>
            <strong>{displayName}</strong>
          </div>
          <div>{username}</div>
        </div>
      </div>
      <div className={`${baseClassName}--manage-button`}>
        <Button
          kind="secondary"
          size="small"
          onClick={() => {
            window.location.href = profileLink;
          }}
        >
          {mergedI18N.profileButton}
        </Button>
      </div>
      <div className={`${baseClassName}--logout`}>
        <Button kind="secondary" onClick={() => onRequestLogout()}>
          {mergedI18N.logoutButton}
        </Button>
      </div>
    </div>
  );
};

SuiteHeaderProfile.propTypes = propTypes;
SuiteHeaderProfile.defaultProps = defaultProps;

export default SuiteHeaderProfile;
