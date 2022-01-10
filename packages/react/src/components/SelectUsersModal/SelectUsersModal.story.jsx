import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { floor } from 'lodash-es';

import SelectUsersModal from './SelectUsersModal';

const users = [
  'Misha Knappenberger',
  'Debra Fairfax',
  'Davida Guardiola',
  'Matilde Romberger',
  'Milan Holden',
  'Beckie Nyman',
  'Roseanne Chou',
  'Granville Graber',
  'Rob Merced',
  'Obdulia Escareno',
  'Ammie Swindler',
  'Florence Luckie',
  'Ninfa Toomer',
  'Nedra Matzen',
  'Travis Schuman',
  'Cary Nuno',
  'Lonna Sprvill',
  'Lavonne Ehmann',
  'Rashad Colella',
  'Clyde Longacre',
  'Tijuana Laurich',
  'Vance Mizer',
  'Madie Babst',
  'Sixta Capella',
  'Greta Glavin',
  'Cora Metzger',
  'Lavon Tschanz',
  'Twanna Lucero',
  'Vanda Bratton',
  'Pablo Curtsinger',
  'Wilburn Mandez',
  'Florance Braverman',
  'Porsha Delossantos',
  'Donte Boudreau',
  'Nickolas Valenza',
  'Lorri Merwin',
  'Walton Lomanto',
  'Adria Delapena',
  'Pat Trent',
  'Cathrine Talor',
  'Altagracia Mckeithan',
  'Micki Lykes',
  'Angla Zaragosa',
  'Ginny Savarese',
  'Jeanelle Mcswain',
  'Darby Ratchford',
  'Maile Mckay',
  'Yee Caouette',
  'Jacquline Dolly',
  'Signe Lavin',
  'Kaylee Cassel',
  'Marty Lawing',
  'Tobie Fender',
  'Maxine Prill',
  'Son Marra',
  'Audria Bevington',
  'Vania Schindler',
  'Dawn Coursey',
  'Wynona Aguas',
  'Bell Maser',
  'Jolene Banks',
  'Raylene Borja',
  'Donya Benning',
  'Lorrine Remaley',
  'Kerrie Scheller',
  'Adelaida Ambler',
  'Celestina Daily',
  'Laurence Finneran',
  'Antoinette Mcquiston',
  'Arlinda Larger',
  'Lester Lemmond',
  'Joycelyn Cogar',
  'Terisa Hodgson',
  'Karissa Kershner',
  'Chery Madeiros',
  'Marcellus Ikner',
  'Hedwig Coghlan',
  'Lavonia Merrell',
  'Elva Rupert',
  'Markus Deskins',
  'Latoria Cronk',
  'Monika Cortinas',
  'Karren Raynor',
  'King Deloatch',
  'Hedy Mccandless',
  'Chance Rioux',
  'Lyman Peagler',
  'Lynda Bobadilla',
  'Caitlyn Tarr',
  'Irma Salter',
  'Onita Nieves',
  'Latonya Densmore',
  'Katelin Ngo',
  'Corrina Waiters',
  'Don Bangert',
  'Bryanna Kong',
  'Anika Hillen',
  'Makeda Randles',
  'Chi Maurer',
  'Sharita Ascencio',
];

export const generateUserList = () => {
  const userList = users.map((user) => {
    const space = user.indexOf(' ');
    const username = `@${user[0]}${user.substr(space + 1)}`;
    const email = `${user.substr(0, space)}@sample.com`;

    return {
      id: `${user[0]}${user.substr(space + 1)}`,
      name: user,
      username: username.toLowerCase().substr(0, 7),
      email: email.toLowerCase(),
    };
  });

  const roles = [
    {
      id: 'role-1',
      name: 'Role One',
      users: [],
    },
    {
      id: 'role-2',
      name: 'Role Two',
      users: [],
    },
    {
      id: 'role-3',
      name: 'Role Three',
      users: [],
    },
    {
      id: 'role-4',
      name: 'Role Four',
      users: [],
    },
    {
      id: 'role-5',
      name: 'Role Five',
      users: [],
      groups: [
        {
          id: 'subgroup',
          name: 'Subgroup Example',
          users: userList.slice(floor(userList.length * 0.8)),
        },
      ],
    },
  ];

  userList.forEach((user, index) => {
    const role = index % roles.length;
    roles[role].users.push(user);
  });

  const teamSize = floor(userList.length / 3);
  const teamOne = {
    id: 'teamOne',
    name: 'Team One',
    users: userList.slice(0, teamSize),
  };

  const teamTwo = {
    id: 'teamTwo',
    name: 'Team Two',
    users: userList.slice(teamSize, teamSize * 2),
  };

  const teamThree = {
    id: 'teamThree',
    name: 'Team Three',
    users: userList.slice(teamSize * 2),
  };

  const categories = [
    {
      id: 'recents',
      name: 'Recent',
      users: userList.slice(userList.length - 10),
    },
    {
      id: 'roles',
      name: 'Roles',
      groups: roles,
    },
    {
      id: 'teams',
      name: 'Teams',
      groups: [teamOne, teamTwo, teamThree],
    },
  ];

  return categories;
};

export default {
  title: '1 - Watson IoT/SelectUsersModal',

  parameters: {
    component: SelectUsersModal,
    docs: {
      inlineStories: false,
    },
  },
  excludeStories: ['generateUserList'],
};

export const DefaultModal = () => {
  return (
    <SelectUsersModal
      users={generateUserList()}
      initialSelectedUsers={[]}
      onSubmit={action('submit', { depth: 3 })}
      onClose={action('close', { depth: 3 })}
      isOpen={boolean('isOpen', true)}
    />
  );
};

DefaultModal.storyName = 'default modal';

export const InitialSelectionModal = () => {
  const userList = generateUserList();

  return (
    <SelectUsersModal
      users={userList}
      initialSelectedUsers={[userList[0].users[0], userList[0].users[2]]}
      onSubmit={action('submit', { depth: 3 })}
      onClose={action('close', { depth: 3 })}
      isOpen={boolean('isOpen', true)}
    />
  );
};

InitialSelectionModal.storyName = 'initial selected modal';

export const FlatListModal = () => {
  const userList = generateUserList()[0].users;

  return (
    <SelectUsersModal
      users={userList}
      initialSelectedUsers={[]}
      onSubmit={action('submit', { depth: 3 })}
      onClose={action('close', { depth: 3 })}
      isOpen={boolean('isOpen', true)}
    />
  );
};

FlatListModal.storyName = 'flat list of users';

export const MixedGroupListModal = () => {
  const testUsers = [
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

  const testRoles = [
    {
      id: 'role-1',
      name: 'Role One',
      users: testUsers,
    },
    {
      id: 'role-2',
      name: 'Role Two',
      users: testUsers,
    },
    {
      name: 'Katelin Ngo',
      username: '@katelin',
      email: 'katelin.ngo@example.com',
    },
  ];

  return (
    <SelectUsersModal
      users={testRoles}
      initialSelectedUsers={[testRoles[0].users[0]]}
      onSubmit={action('submit', { depth: 3 })}
      onClose={action('close', { depth: 3 })}
      isOpen={boolean('isOpen', true)}
    />
  );
};

MixedGroupListModal.storyName = 'group list';
