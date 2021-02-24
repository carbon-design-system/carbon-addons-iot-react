import * as React from 'react';
import PropTypes from 'prop-types';

import { GroupShape, UserShape } from '../SelectUsersModal/SelectUsersModal';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const baseClass = `${iotPrefix}--rule-builder-wrap`;

const UserList = ({ users, i18n }) => {
  if (!Array.isArray(users) || !users.length) {
    return null;
  }

  return (
    <ul className={`${baseClass}--user-list`}>
      <li className={`${baseClass}--user-list__header`}>
        <span>{i18n.nameColumnLabel}</span>
        <span>{i18n.typeColumnLabel}</span>
      </li>
      {users.map((user) => (
        <li className={`${baseClass}--user-list__item`} key={user.name}>
          <span>{user.name}</span>
          <span>
            {Array.isArray(user.users) && user.users.length > 0
              ? i18n.groupTypeLabel
              : i18n.userTypeLabel}
          </span>
        </li>
      ))}
    </ul>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.oneOfType([UserShape, GroupShape])).isRequired,
  i18n: PropTypes.shape({
    nameColumnLabel: PropTypes.string,
    typeColumnLabel: PropTypes.string,
    groupTypeLabel: PropTypes.string,
    userTypeLabel: PropTypes.string,
  }),
};

UserList.defaultProps = {
  i18n: {
    nameColumnLabel: 'Name',
    typeColumnLabel: 'Type',
    groupTypeLabel: 'Group',
    userTypeLabel: 'User',
  },
};

export default UserList;
