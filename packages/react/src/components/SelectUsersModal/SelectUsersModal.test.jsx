import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';

import SelectUsersModal from './SelectUsersModal';

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
    expect(screen.queryAllByRole('button', { name: 'Add' }).length).toBe(2);
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

    expect(screen.queryByRole('button', { name: 'Remove' })).toBeTruthy();
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

    let buttons = screen.getAllByRole('img', { label: 'Expand' });
    fireEvent.click(buttons[0]); // expand category

    buttons = screen.getAllByRole('img', { label: 'Expand' });
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    expect(screen.queryAllByTitle('Onita Nieves')).toHaveLength(3);

    const list = screen.getByTestId('select-users__all');
    const selected = screen.getByTestId('select-users__selected');

    const listedItems = within(list).queryAllByTitle('Onita Nieves');
    const selectedItems = within(selected).queryAllByTitle('Onita Nieves');

    expect(selectedItems).toHaveLength(1);
    selectedItems.forEach((item) => {
      expect(item).not.toHaveClass('iot--list-item--content--values__disabled');
    });

    expect(listedItems).toHaveLength(2);
    listedItems.forEach((item) => {
      expect(item).toHaveClass('iot--list-item--content--values__disabled');
    });
  });
});
