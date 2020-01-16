import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Notification from '@carbon/icons-react/lib/notification/20';
import Avatar from '@carbon/icons-react/lib/user--avatar/20';
import HeaderHelp from '@carbon/icons-react/lib/help/20';

import Header from './Header';

React.Fragment = ({ children }) => children;

describe('Header testcases', () => {
  const onClick = jest.fn();
  const actionItems = [
    {
      label: 'alerts',
      onClick,
      btnContent: <Notification fill="white" description="Icon" />,
    },
    {
      label: 'help',
      hasHeaderPanel: true,
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
    {
      label: 'other help',
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
  it('should render', () => {
    const { container } = render(
      <Header
        title="My Title"
        user="j@test.com"
        tenant="acme"
        appName="platform"
        actionItems={actionItems}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('children should render inside UL', () => {
    const { getByText } = render(
      <Header
        title="My Title"
        user="j@test.com"
        tenant="acme"
        appName="platform"
        actionItems={actionItems}
      />
    );
    // fireEvent.click(getByTitle('help'));
    // fireEvent.focus(getByText('This is a link'));
    expect(getByText('This is a link').parentElement.parentElement.nodeName).toBe('LI');
    expect(getByText('This is a link').parentElement.parentElement.className).toEqual(
      'action-btn__headerpanel-li'
    );
    expect(
      getByText('This is a link').parentElement.parentElement.parentNode.childElementCount
    ).toEqual(2);
    // fireEvent.blur(container.querySelector('.action-btn__group'));
  });

  it('clicking trigger button should expand the header panel', () => {
    const { getByTitle } = render(
      <Header
        title="My Title"
        user="j@test.com"
        tenant="acme"
        appName="platform"
        actionItems={actionItems}
      />
    );
    fireEvent.click(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    fireEvent.click(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus leaves panel', () => {
    const { getByTestId, getByTitle } = render(
      <Header
        title="My Title"
        user="j@test.com"
        tenant="acme"
        appName="platform"
        actionItems={actionItems}
      />
    );
    fireEvent.click(getByTitle('help'));
    fireEvent.focus(getByTestId('action-btn__panel'));
    fireEvent.blur(getByTestId('action-btn__panel'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus leaves trigger', () => {
    const { getByTitle } = render(
      <Header
        title="My Title"
        user="j@test.com"
        tenant="acme"
        appName="platform"
        actionItems={actionItems}
      />
    );
    fireEvent.click(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    fireEvent.blur(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus goes to next action btn', () => {
    const { getByTitle, getByTestId } = render(
      <Header
        title="My Title"
        user="j@test.com"
        tenant="acme"
        appName="platform"
        actionItems={actionItems}
      />
    );

    fireEvent.click(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    fireEvent.focus(getByTestId('headermenu'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('App switcher opens', () => {
    const headerPanel = {
      className: 'header-panel',
      /* eslint-disable */

      content: React.forwardRef((props, ref) => (
        <a href="#" ref={ref} {...props}>
          Header panel content
        </a>
      )),
      /* eslint-enable */
    };
    const { getByTitle } = render(
      <Header
        title="My Title"
        user="j@test.com"
        tenant="acme"
        appName="platform"
        actionItems={actionItems}
        headerPanel={headerPanel}
      />
    );

    fireEvent.click(getByTitle('AppSwitcher'));
    expect(getByTitle('AppSwitcher').parentNode.nextSibling.className).toContain(
      'bx--header-panel bx--header-panel--expanded bx--app-switcher header-panel'
    );
    fireEvent.click(getByTitle('AppSwitcher'));
    expect(getByTitle('AppSwitcher').parentNode.nextSibling.className).toContain(
      'bx--header-panel bx--app-switcher header-panel'
    );
  });
});
