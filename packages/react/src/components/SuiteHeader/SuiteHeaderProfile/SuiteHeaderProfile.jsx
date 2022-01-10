import React from 'react';
import PropTypes from 'prop-types';
import { ButtonSkeleton } from 'carbon-components-react';

import Button from '../../Button';
import { SkeletonText } from '../../SkeletonText';
import { settings } from '../../../constants/Settings';
import { handleSpecificKeyDown } from '../../../utils/componentUtilityFunctions';
import useMerged from '../../../hooks/useMerged';

const defaultProps = {
  username: '',
  displayName: '',
  onRequestLogout: null,
  i18n: {
    profileTitle: 'Profile',
    profileButton: 'Manage profile',
    logoutButton: 'Log out',
  },
  testId: 'suite-header-profile',
};

const propTypes = {
  displayName: PropTypes.string,
  username: PropTypes.string,
  onProfileClick: PropTypes.func.isRequired,
  onRequestLogout: PropTypes.func,
  i18n: PropTypes.shape({
    profileTitle: PropTypes.string,
    profileButton: PropTypes.string,
    logoutButton: PropTypes.string,
  }),
  testId: PropTypes.string,
};

const SuiteHeaderProfile = ({
  displayName,
  username,
  onProfileClick,
  onRequestLogout,
  i18n,
  testId,
}) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  const baseClassName = `${settings.iotPrefix}--suite-header-profile`;
  const chipText = (displayName || '')
    .split(' ')
    .map((i) => i.charAt(0))
    .join('');
  return (
    <div data-testid={testId} className={baseClassName}>
      <h5>{mergedI18n.profileTitle}</h5>
      {username ? (
        <>
          <div className={`${baseClassName}--user`}>
            <div className={`${baseClassName}--user--chip`}>{chipText}</div>
            <div className={`${baseClassName}--user--detail`}>
              <div>
                <strong>{displayName}</strong>
              </div>
              <div>{username}</div>
            </div>
          </div>
          <div
            className={`${baseClassName}--manage-button${
              onRequestLogout ? '' : ` ${baseClassName}--manage-button--no-logout`
            }`}
          >
            <Button
              kind="secondary"
              size="small"
              testId={`${testId}--profile`}
              onClick={onProfileClick}
              onKeyDown={handleSpecificKeyDown(['Enter', ' '], onProfileClick)}
            >
              {mergedI18n.profileButton}
            </Button>
          </div>
          {onRequestLogout && (
            <div className={`${baseClassName}--logout`}>
              <Button kind="secondary" testId={`${testId}--logout`} onClick={onRequestLogout}>
                {mergedI18n.logoutButton}
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div
            className={`${baseClassName}--loading${
              onRequestLogout ? '' : ` ${baseClassName}--loading--no-logout`
            }`}
            data-testid="suite-header-profile--loading"
          >
            <SkeletonText paragraph lineCount={3} width="80%" />
          </div>
          {onRequestLogout && (
            <div className={`${baseClassName}--logout ${baseClassName}--logout--loading`}>
              <ButtonSkeleton />
            </div>
          )}
        </>
      )}
    </div>
  );
};

SuiteHeaderProfile.propTypes = propTypes;
SuiteHeaderProfile.defaultProps = defaultProps;

export default SuiteHeaderProfile;
