import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import FlyoutMenu, { FlyoutMenuDirection } from './FlyoutMenu';

const AllFlyoutMenusForPositioning = (isRTL) => (
  <div
    data-testid="flyout-positioning-test"
    style={{
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      height: '100vh',
      padding: '4rem',
    }}
  >
    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flex: 1,
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.LeftEnd}
          useAutoPositioning
          menuOffset={{ top: 2, left: isRTL ? -2 : 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.TopStart}
          useAutoPositioning
          menuOffset={{ top: 2, left: 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.RightStart}
          useAutoPositioning
          menuOffset={{ top: 2, left: isRTL ? -2 : 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
    </div>
    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flex: 1,
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.LeftStart}
          useAutoPositioning
          menuOffset={{ top: 2, left: isRTL ? -2 : 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.TopStart}
          useAutoPositioning
          menuOffset={{ top: -3, left: 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.RightEnd}
          useAutoPositioning
          menuOffset={{ top: 2, left: isRTL ? -2 : 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
    </div>
    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          flex: 1,
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.BottomEnd}
          useAutoPositioning
          menuOffset={{ top: -3, left: 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.BottomStart}
          useAutoPositioning
          menuOffset={{ top: -3, left: 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <FlyoutMenu
          direction={FlyoutMenuDirection.BottomStart}
          useAutoPositioning
          menuOffset={{ top: -3, left: 0 }}
        >
          This is some flyout content
        </FlyoutMenu>
      </div>
    </div>
  </div>
);

describe('FlyoutMenu', () => {
  describe('auto-positioning', () => {
    it('should have the correct auto-positioning for all overflow types in LTR', () => {
      cy.viewport(1680, 900);
      mount(<AllFlyoutMenusForPositioning />);

      cy.get('button').click({ multiple: true });
      onlyOn('headless', () => {
        cy.findByTestId('flyout-positioning-test').compareSnapshot('flyout-positioning-ltr');
      });
    });

    it('should have the correct auto-positioning for all overflow types in RTL', () => {
      cy.viewport(1680, 900);
      cy.window().then((win) => {
        win.document.querySelectorAll('html')[0].setAttribute('dir', 'rtl');
      });
      mount(<AllFlyoutMenusForPositioning />);

      cy.get('button').click({ multiple: true });
      onlyOn('headless', () => {
        cy.findByTestId('flyout-positioning-test').compareSnapshot('flyout-positioning-rtl');
      });
    });
  });
});
