import React from 'react';
import { mount } from 'enzyme';
import Notification from '@carbon/icons-react/lib/notification/20';
import Avatar from '@carbon/icons-react/lib/user--avatar/20';
import HeaderHelp from '@carbon/icons-react/lib/help/20';

import Header from './Header';

React.Fragment = ({ children }) => children;

describe('Header testcases', () => {
  // it.skip('skip this suite', () => {});
  it('should render', () => {
    const onClick = jest.fn();
    const actionItems = [
      {
        label: 'alerts',
        onClick,
        btnContent: <Notification fill="white" description="Icon" />,
      },
      {
        label: 'help',
        onClick,
        btnContent: (
          <HeaderHelp
            fill="white"
            description="Icon"
            className="bx--header__menu-item bx--header__menu-title"
          />
        ),
        childContent: [
          {
            onCLick: () => console.log('hi'),
            content: <p>This is a link</p>,
          },
          {
            onCLick: () => console.log('hi'),
            content: (
              <React.Fragment>
                <span>
                  JohnDoe@ibm.com
                  <Avatar fill="white" description="Icon" />
                </span>
              </React.Fragment>
            ),
          },
        ],
      },
    ];

    const header = mount(
      <Header
        title="My Title"
        user="j@test.com"
        tenant="acme"
        appName="platform"
        actionItems={actionItems}
      />
    );

    expect(header).toMatchSnapshot();
  });
});
