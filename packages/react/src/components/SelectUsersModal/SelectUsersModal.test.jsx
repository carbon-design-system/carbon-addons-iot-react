import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';

import { settings } from '../../constants/Settings';

import SelectUsersModal from './SelectUsersModal';

const { iotPrefix } = settings;

const users = [
  {
    name: 'Onita Nieves',
    username: '@onita',
    email: 'onita.nieves@example.com',
  },
  {
    name: 'Latonya Densmore',
    username: '@latonya',
    email: 'latonya.densmore@example.com',
  },
  {
    name: 'Katelin Ngo',
    username: '@katelin',
    email: 'katelin.ngo@example.com',
  },
];

const subgroup = [
  {
    id: 'subgroup',
    name: 'Subgroup',
    users: users.slice(0, 1),
  },
];

const roles = [
  {
    id: 'group-1',
    name: 'Group One',
    users: users.concat(subgroup),
  },
  {
    id: 'group-2',
    name: 'Group Two',
    users,
  },
];

describe('SelectUsersModal', () => {
  it('renders if there are no users', () => {
    render(<SelectUsersModal users={[]} initialSelectedUsers={[]} onClose={() => {}} />);

    expect(screen.getByText('Select users')).toBeInTheDocument();
  });

  it('does not show actions for top level categories', () => {
    render(
      <SelectUsersModal
        users={[
          {
            id: 'roles',
            name: 'Roles',
            groups: roles,
          },
        ]}
        initialSelectedUsers={[]}
        onClose={() => {}}
      />
    );

    expect(screen.queryAllByRole('button', { name: 'Remove' }).length).toBe(0);
    expect(screen.queryAllByRole('button', { name: 'Add' }).length).toBe(0);
    fireEvent.click(screen.getByTestId('expand-icon'));
    expect(screen.getAllByText('Add').length).toBe(2);
  });

  it('renders initially selected users', () => {
    render(
      <SelectUsersModal
        users={[
          {
            id: 'roles',
            name: 'Roles',
            groups: roles,
          },
        ]}
        initialSelectedUsers={[
          {
            id: 'onita-nieves',
            name: 'Onita Nieves',
            username: '@onita',
            email: 'onita.nieves@example.com',
          },
        ]}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Remove')).toBeTruthy();
  });

  it('can add and remove users', () => {
    render(
      <SelectUsersModal
        users={[
          {
            name: 'Onita Nieves',
            username: '@onita',
            email: 'onita.nieves@example.com',
          },
          {
            name: 'Latonya Densmore',
            username: '@latonya',
            email: 'latonya.densmore@example.com',
          },
        ]}
        initialSelectedUsers={[]}
        onClose={() => {}}
      />
    );

    const list = screen.getByTestId('select-users__all');
    const selected = screen.getByTestId('select-users__selected');

    let selectedItems = within(selected).queryAllByText('Remove');
    expect(selectedItems).toHaveLength(0);

    const listedItems = within(list).queryAllByText('Add');
    expect(listedItems).toHaveLength(2);

    fireEvent.click(listedItems[0]);
    selectedItems = within(selected).queryAllByText('Remove');
    expect(selectedItems).toHaveLength(1);

    fireEvent.click(selectedItems[0]);
    selectedItems = within(selected).queryAllByRole('button', { name: 'Remove' });
    expect(selectedItems).toHaveLength(0);
  });

  it('disables selected items', async () => {
    render(
      <SelectUsersModal
        users={[
          {
            id: 'roles',
            name: 'Roles',
            groups: roles,
          },
        ]}
        initialSelectedUsers={[roles[0].users[0]]}
        onClose={() => {}}
      />
    );

    let buttons = screen.getAllByTestId('expand-icon');
    fireEvent.click(buttons[0]); // expand category

    buttons = screen.getAllByTestId('expand-icon');
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    expect(screen.queryAllByTitle('Onita Nieves')).toHaveLength(3);

    const list = screen.getByTestId('select-users__all');
    const selected = screen.getByTestId('select-users__selected');

    const listedItems = within(list).queryAllByTitle('Onita Nieves');
    const selectedItems = within(selected).queryAllByTitle('Onita Nieves');

    expect(selectedItems).toHaveLength(1);
    selectedItems.forEach((item) => {
      expect(item).not.toHaveClass(`${iotPrefix}--list-item--content--values__disabled`);
    });

    expect(listedItems).toHaveLength(2);
    listedItems.forEach((item) => {
      expect(item).toHaveClass(`${iotPrefix}--list-item--content--values__disabled`);
    });
  });

  it('disables selected items based on attributes ', async () => {
    render(
      <SelectUsersModal
        users={[
          {
            id: 'roles',
            name: 'Roles',
            groups: [
              {
                id: 'group-1',
                name: 'Group One',
                users: [
                  {
                    name: 'Onita Nieves',
                    username: '@onita',
                    email: 'onita.nieves@example.com',
                  },
                  {
                    name: 'Latonya Densmore',
                    username: '@latonya',
                    email: 'latonya.densmore@example.com',
                  },
                ],
              },
            ],
          },
        ]}
        initialSelectedUsers={[
          {
            name: 'Onita Nieves',
            username: '@onita',
            email: 'onita.nieves@example.com',
          },
        ]}
        onClose={() => {}}
      />
    );

    let buttons = screen.getAllByTestId('expand-icon');
    fireEvent.click(buttons[0]); // expand category

    buttons = screen.getAllByTestId('expand-icon');
    fireEvent.click(buttons[1]);

    expect(screen.queryAllByTitle('Onita Nieves')).toHaveLength(2);

    const list = screen.getByTestId('select-users__all');
    const selected = screen.getByTestId('select-users__selected');

    const listedItems = within(list).queryAllByTitle('Onita Nieves');
    const selectedItems = within(selected).queryAllByTitle('Onita Nieves');

    expect(selectedItems).toHaveLength(1);
    selectedItems.forEach((item) => {
      expect(item).not.toHaveClass(`${iotPrefix}--list-item--content--values__disabled`);
    });

    expect(listedItems).toHaveLength(1);
    listedItems.forEach((item) => {
      expect(item).toHaveClass(`${iotPrefix}--list-item--content--values__disabled`);
    });
  });
});
