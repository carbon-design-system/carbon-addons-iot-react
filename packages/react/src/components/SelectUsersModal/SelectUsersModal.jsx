import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight16, ArrowLeft16 } from '@carbon/icons-react';
import isEmpty from 'lodash/isEmpty';

import ComposedModal from '../ComposedModal/ComposedModal';
import HierarchyList from '../List/HierarchyList';
import { Button } from '../..';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

export const UserShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  username: PropTypes.string,
});

export const GroupShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  groups: PropTypes.arrayOf(PropTypes.any),
  users: PropTypes.arrayOf(UserShape),
});

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
  /** Close the dialog */
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

const itemsAreEqual = (item1, item2) => {
  if (!item1 || !item2) {
    return false;
  }

  // they're exactly the object, like some of the storybook examples
  if (item1 === item2) {
    return true;
  }

  // they have the same ids
  if (item1.id && item2.id && item1.id === item2.id) {
    return true;
  }

  return false;
};

const mapUsers = (
  unmodifiedUsers,
  { parents = [], selectedUsers = [], depth = 0, renderRowActions, renderDisabledState }
) =>
  unmodifiedUsers.map((user) => {
    const { id, name, username, email, users = [], groups = [] } = user;

    const mappedGroups = isEmpty(groups)
      ? []
      : mapUsers(groups, {
          depth: depth + 1,
          selectedUsers,
          parents: [...parents, user],
          renderRowActions,
          renderDisabledState,
        });
    const mappedUsers = isEmpty(users)
      ? []
      : mapUsers(users, {
          depth: depth + 1,
          selectedUsers,
          parents: [...parents, user],
          renderRowActions,
          renderDisabledState,
        });
    const children = mappedGroups.concat(mappedUsers);

    return {
      id: id || email,
      content: {
        value: isEmpty(children) ? name : `${name} (${children.length})`,
        secondaryValue: username,
        tertiaryValue: email,
        rowActions: renderRowActions({ user, parents, selected: selectedUsers, depth }),
      },
      isCategory: depth == 0 && !isEmpty(children),
      disabled: renderDisabledState({ user, parents, selected: selectedUsers, depth }),
      children,
    };
  });

const SelectUsersModal = ({ open, onClose, onSubmit, users, initialSelectedUsers, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);

  const handleRemove = (row) => {
    setSelectedUsers(selectedUsers.filter((s) => s !== row));
  };

  const handleAdd = (row) => {
    setSelectedUsers([row].concat(...selectedUsers));
  };

  const displayAllUsersList = (unmodifiedUsers, selection = []) => {
    return mapUsers(unmodifiedUsers, {
      selectedUsers: selection,
      renderDisabledState: ({ user, selected, parents }) => {
        const isInSelected = selected.filter((s) => itemsAreEqual(s, user)).length > 0;
        const isChildOfSelected =
          selected.filter((u) => parents.filter((p) => itemsAreEqual(p, u)).length > 0).length > 0;

        return isInSelected || isChildOfSelected;
      },
      renderRowActions: ({ user, selected, parents, depth }) => {
        const { username } = user;
        const isInSelected = selected.filter((s) => itemsAreEqual(s, user)).length > 0;
        const isChildOfSelected =
          selected.filter((u) => parents.filter((p) => itemsAreEqual(p, u)).length > 0).length > 0;

        // Don't render actions on the top level unless it's a user. TODO: is this supposed to support a flat list, too?
        const isCategory = depth === 0 && user && !user.username;

        if (isInSelected || isChildOfSelected || isCategory) {
          return null;
        }

        return () => [
          <Button
            key={`${username}-list-item-button-${depth}`}
            style={{ color: 'black' }}
            role="button"
            aria-label="Add"
            renderIcon={ArrowRight16}
            hasIconOnly
            kind="ghost"
            size="small"
            onClick={() => handleAdd(user)}
            iconDescription={mergedI18n.addUser}
          />,
        ];
      },
    });
  };

  const displaySelectedUsersList = (unmodifiedUsers) => {
    return mapUsers(unmodifiedUsers, {
      renderDisabledState: () => false,
      renderRowActions: ({ user, depth }) => {
        const { username } = user;

        if (depth === 0) {
          return () => [
            <Button
              key={`${username}-list-item-button-${depth}`}
              style={{ color: 'black' }}
              aria-label="Remove"
              renderIcon={ArrowLeft16}
              hasIconOnly
              kind="ghost"
              size="small"
              onClick={() => handleRemove(user)}
              iconDescription={mergedI18n.removeUser}
            />,
          ];
        }

        return null;
      },
    });
  };

  const flattenUsers = (results, user) => {
    return user.children && user.children.length > 0
      ? user.children.reduce(flattenUsers, results)
      : results.concat(user);
  };

  const usersList = displayAllUsersList(users, selectedUsers);
  const userCount = usersList.reduce(flattenUsers, []).length;
  const selectedList = displaySelectedUsersList(selectedUsers);

  return (
    <div className={`${iotPrefix}--select-users-modal`}>
      <ComposedModal
        isLarge
        footer={{
          isPrimaryButtonDisabled: selectedUsers.length === 0,
        }}
        header={{
          label: mergedI18n.modalHeaderLabel,
          title: mergedI18n.modalHeaderTitle,
        }}
        open={open}
        onSubmit={onSubmit}
        onClose={onClose}
      >
        <div className={`${iotPrefix}--select-users-modal-content`}>
          <div
            className={`${iotPrefix}--select-users-modal-content__all-users`}
            data-testid="select-users__all"
          >
            <HierarchyList
              title={`Users (${userCount} Available)`}
              items={usersList}
              hasSearch
              hasPagination={false}
            />
          </div>
          <div
            className={`${iotPrefix}--select-users-modal-content__selected-users`}
            data-testid="select-users__selected"
          >
            <HierarchyList
              title={`${selectedUsers.length > 0 ? `${selectedUsers.length} ` : ''}Selected`}
              items={selectedList}
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
