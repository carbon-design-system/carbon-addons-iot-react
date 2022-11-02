import React from 'react';
import { mount } from '@cypress/react';

import { settings } from '../../constants/Settings';

import { OverflowMenu, OverflowMenuItem } from '.';

const { prefix } = settings;

// eslint-disable-next-line react/prop-types
const OverflowMenuExample = ({ overflowMenuProps, overflowMenuItemProps }) => (
  <>
    <OverflowMenu {...overflowMenuProps}>
      <OverflowMenuItem {...overflowMenuItemProps} itemText="Option 1" />
      <OverflowMenuItem
        {...overflowMenuItemProps}
        itemText="Option 2 is an example of a really long string and how we recommend handling this"
        requireTitle
      />
      <OverflowMenuItem {...overflowMenuItemProps} itemText="Option 3" />
      <OverflowMenuItem {...overflowMenuItemProps} itemText="Option 4" />
      <OverflowMenuItem {...overflowMenuItemProps} itemText="Danger option" hasDivider isDelete />
    </OverflowMenu>
  </>
);

const defaultProps = {
  menu: () => ({
    direction: 'bottom',
    ariaLabel: 'A really long tooltip text to display',
    onClick: () => {},
    onFocus: () => {},
    onKeyDown: () => {},
    onClose: () => {},
    onOpen: () => {},
  }),
  menuItem: () => ({
    className: 'some-class',
    onClick: () => {},
  }),
};

describe('IotOverflowMenu', () => {
  beforeEach(() => {
    cy.viewport(1680, 900);
  });

  it('should auto-position tooltip correctly', () => {
    mount(
      <div
        style={{
          display: 'flex',
          flex: '1',
          flexDirection: 'row',
          height: 'calc(100vh - 4rem)',
          marginTop: '4rem',
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
            <OverflowMenuExample
              overflowMenuProps={{
                ...defaultProps.menu(),
                flipped: true,
                direction: 'top',
                useAutoPositioning: true,
                withCarbonTooltip: true,
                testId: 'tooltip-1',
              }}
              overflowMenuItemProps={defaultProps.menuItem()}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <OverflowMenuExample
              overflowMenuProps={{
                ...defaultProps.menu(),
                flipped: true,
                direction: 'top',
                useAutoPositioning: true,
                withCarbonTooltip: true,
                testId: 'tooltip-2',
              }}
              overflowMenuItemProps={defaultProps.menuItem()}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              flex: 1,
            }}
          >
            <OverflowMenuExample
              overflowMenuProps={{
                ...defaultProps.menu(),
                flipped: true,
                direction: 'top',
                useAutoPositioning: true,
                withCarbonTooltip: true,
                testId: 'tooltip-3',
              }}
              overflowMenuItemProps={defaultProps.menuItem()}
            />
          </div>
        </div>
      </div>
    );

    cy.findByTestId('tooltip-1').should('be.visible');
    cy.findByTestId('tooltip-2').should('be.visible');
    cy.findByTestId('tooltip-3').should('be.visible');

    cy.findByTestId('tooltip-1').should('have.class', `${prefix}--tooltip--align-center`);
    cy.findByTestId('tooltip-2').should('have.class', `${prefix}--tooltip--align-center`);
    cy.findByTestId('tooltip-3').should('have.class', `${prefix}--tooltip--align-end`);
  });

  it('should close the menu on the outside click', () => {
    mount(
      <div
        style={{
          display: 'flex',
          flex: '1',
          flexDirection: 'row',
          height: 'calc(100vh - 4rem)',
          marginTop: '4rem',
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
            <OverflowMenuExample
              overflowMenuProps={{
                ...defaultProps.menu(),
                flipped: true,
                direction: 'bottom',
                useAutoPositioning: true,
                withCarbonTooltip: true,
                testId: 'tooltip-1',
              }}
              overflowMenuItemProps={defaultProps.menuItem()}
            />
          </div>
        </div>
      </div>
    );

    cy.findByTestId('tooltip-1').click();
    cy.findByText('Option 1').should('be.visible');

    cy.get('body').click();
    cy.findByText('Option 1').should('not.exist');
  });

  it('should close the menu on item select', () => {
    mount(
      <OverflowMenuExample
        overflowMenuProps={{
          ...defaultProps.menu(),
          flipped: true,
          direction: 'bottom',
          useAutoPositioning: true,
          withCarbonTooltip: true,
          testId: 'tooltip-1',
        }}
        overflowMenuItemProps={defaultProps.menuItem()}
      />
    );

    cy.findByTestId('tooltip-1').click();
    cy.findByText('Option 1').should('be.visible');
    cy.findByText('Option 1').click();

    cy.findByText('Option 1').should('not.exist');
    cy.findByTestId('tooltip-1').should('not.be.focused');
  });

  it('should be accessible from keyboard', () => {
    mount(
      <div
        style={{
          display: 'flex',
          flex: '1',
          flexDirection: 'row',
          height: 'calc(100vh - 4rem)',
          marginTop: '4rem',
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
            <OverflowMenuExample
              overflowMenuProps={{
                ...defaultProps.menu(),
                flipped: true,
                direction: 'bottom',
                useAutoPositioning: true,
                withCarbonTooltip: true,
                testId: 'tooltip-1',
              }}
              overflowMenuItemProps={defaultProps.menuItem()}
            />
          </div>
        </div>
      </div>
    );

    // initial focus made without keyboard due to https://docs.cypress.io/api/commands/type#Tabbing
    cy.findByTestId('tooltip-1').click();
    cy.get(`.${prefix}--overflow-menu-options__option`).first().find('button').should('be.focused');

    cy.focused().type('{downarrow}');
    cy.get(`.${prefix}--overflow-menu-options__option`).eq(1).find('button').should('be.focused');

    cy.focused().type('{downarrow}{downarrow}{downarrow}{downarrow}');
    cy.get(`.${prefix}--overflow-menu-options__option`).first().find('button').should('be.focused');

    cy.focused().type('{uparrow}{uparrow}{uparrow}{uparrow}{uparrow}');
    cy.get(`.${prefix}--overflow-menu-options__option`).first().find('button').should('be.focused');

    cy.focused().realPress('Escape');
    cy.findByTestId('tooltip-1').should('be.focused');
  });

  it('should invoke callbacks', () => {
    const onClick = cy.stub();
    const onFocus = cy.stub();
    const onKeyDown = cy.stub();
    const onClose = cy.stub();
    const onOpen = cy.stub();

    mount(
      <OverflowMenuExample
        overflowMenuProps={{
          ...defaultProps.menu(),
          flipped: true,
          direction: 'bottom',
          useAutoPositioning: true,
          withCarbonTooltip: true,
          testId: 'tooltip-1',
          onClick,
          onFocus,
          onKeyDown,
          onClose,
          onOpen,
        }}
        overflowMenuItemProps={defaultProps.menuItem()}
      />
    );

    cy.findByTestId('tooltip-1')
      .focus()
      .should(() => {
        expect(onFocus).to.be.calledOnce;
      });

    cy.findByTestId('tooltip-1')
      .click()
      .should(() => {
        expect(onClick).to.be.calledOnce;
        expect(onOpen).to.be.calledOnce;
      });

    cy.findByTestId('tooltip-1')
      .click()
      .should(() => {
        expect(onClose).to.be.calledOnce;
      });

    cy.get('body').realPress('Tab');
    cy.focused()
      .type('{enter}')
      .should(() => {
        expect(onKeyDown).to.be.calledOnce;
        expect(onOpen).to.be.calledOnce;
      });
  });
});
