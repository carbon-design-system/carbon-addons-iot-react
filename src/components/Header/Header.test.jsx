import React from 'react';
import { shallow } from 'enzyme';
import { Icon } from 'carbon-components-react';

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
        btnContent: <Icon name="notification-on" fill="white" description="Icon" />,
      },
      {
        label: 'help',
        onClick,
        btnContent: (
          <Icon
            name="header--help"
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
                  <Icon name="header--avatar" fill="white" description="Icon" />
                </span>
              </React.Fragment>
            ),
          },
        ],
      },
    ];

    const header = shallow(
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
