import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import HeaderHelp from '@carbon/icons-react/lib/help/20';
import Avatar from '@carbon/icons-react/lib/user--avatar/20';

import HeaderPanelAction from './HeaderPanelAction';

const item = {
  label: 'help',
  btnContent: (
    <HeaderHelp
      fill="white"
      description="Icon"
      className="bx--header__menu-item bx--header__menu-title"
    />
  ),
  childContent: [
    {
      metaData: {
        href: 'http://google.com',
        title: 'this is a title',
        target: '_blank',
        rel: 'noopener noreferrer',
        element: 'a',
      },
      content: 'this is my message to you',
    },
    {
      metaData: {
        onClick: action('do another action'),
        className: 'this',
        element: 'button',
      },
      content: (
        <span>
          JohnDoe@ibm.com
          <Avatar fill="white" description="Icon" />
        </span>
      ),
    },
  ],
};

storiesOf('Watson IoT|Header Panel Action', module).add('Header action panel', () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <HeaderPanelAction
      item={item}
      index={0}
      isExpanded
      onToggleExpansion={action('onToggleExpansion')}
    />
  </div>
));
