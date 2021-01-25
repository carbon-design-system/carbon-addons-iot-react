import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight16, ArrowLeft16, Idea32 } from '@carbon/icons-react';
import isEmpty from 'lodash/isEmpty';

import ComposedModal from '../ComposedModal/ComposedModal';
import HierarchyList from '../List/HierarchyList';
import { settings } from '../../constants/Settings';
import { Button } from '../..';

const { iotPrefix } = settings;

export const UserShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  username: PropTypes.string,
})

export const GroupShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  groups: PropTypes.arrayOf(PropTypes.any),
  users: PropTypes.arrayOf(UserShape)
})

export const propTypes = {
  i18n: PropTypes.shape({
    modalHeaderTitle: PropTypes.string,
    modalHeaderLabel: PropTypes.string,
    users: PropTypes.string,
    available: PropTypes.string,
    selected: PropTypes.string,
    addUser: PropTypes.string,
    removeUser: PropTypes.string,
    recent: PropTypes.string,
  }),
  users: PropTypes.arrayOf(GroupShape).isRequired,
  initialSelectedUsers: PropTypes.arrayOf(GroupShape).isRequired,

  /** Should the dialog be open or not */
  open: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  /**   Close the dialog */
  onClose: PropTypes.func.isRequired,
  /** Callback to submit the dialog/form */
  onSubmit: PropTypes.func,
};

const defaultProps = {
  i18n: {
    modalHeaderTitle: 'Select users',
    modalHeaderLabel: 'Selected users will have edit access',
    users: 'users',
    available: 'available ',
    selected: 'selected ',
    addUser: 'Add',
    removeUser: 'Remove',
    recent: 'Recent',
  },
  open: false,
  onSubmit: null,
};

const mapUsers = (unmodifiedUsers, icon, iconDescription, depth) =>
  unmodifiedUsers.map((user) => {
    

    const { id, name, username, email, users = [], groups = []} = user;

    const mappedGroups = isEmpty(groups) ? [] : mapUsers(groups, icon, iconDescription, depth + 1);
    const mappedUsers = isEmpty(users) ? [] : mapUsers(users, icon, iconDescription, depth + 1);



    const rowActions =
    icon !== null && (depth > 0 || !isEmpty(email) ) && isEmpty(groups)
      ? [
          <Button
            key={`${username}-list-item-button-${depth}`}
            style={{ color: 'black' }}
            renderIcon={icon}
            hasIconOnly
            kind="ghost"
            size="small"
            onClick={() => console.log(`here i clicked: ${id}`)}
            iconDescription={iconDescription}
          />,
        ]
      : null;

    const children = mappedGroups.concat(mappedUsers);
    

    return {
      id,
      content: {
        value: isEmpty(children) ? name : `${name} (${children.length})`,
        secondaryValue: username,
        tertiaryValue: email,
        rowActions,
      },
      children
    };
  });

const SelectUsersModal = ({
  open,
  onClose,
  onSubmit,
  users,
  initialSelectedUsers,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);

  const usersList = mapUsers(users, ArrowRight16, mergedI18n.addUser, 0);

  return (
    <div className={`${iotPrefix}--select-users-modal`}>
      <ComposedModal
        isLarge
        header={{
          label: mergedI18n.modalHeaderLabel,
          title: mergedI18n.modalHeaderTitle,
        }}
        open={open}
        onSubmit={onSubmit}
        onClose={onClose}>
        <div className={`${iotPrefix}--select-users-modal-content`}>
          <div
            className={`${iotPrefix}--select-users-modal-content__all-users`}>
            <HierarchyList
              title="test"
              items={usersList}
              hasSearch
              hasPagination={false}
            />
          </div>
          <div
            className={`${iotPrefix}--select-users-modal-content__selected-users`}>
            <HierarchyList
              title="test"
              items={selectedUsers}
              hasSearch
              hasPagination={false}
            />
          </div>
        </div>
      </ComposedModal>
    </div>
  );
};

SelectUsersModal.propTypes = propTypes;
SelectUsersModal.defaultProps = defaultProps;

export default SelectUsersModal;
