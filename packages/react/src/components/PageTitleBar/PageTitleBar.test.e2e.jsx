import React from 'react';
import { mount } from '@cypress/react';

import { settings } from '../../constants/Settings';
import { Tabs, Tab } from '../Tabs';

import PageTitleBar from './PageTitleBar';

const { iotPrefix, prefix } = settings;
describe('PageTitleBar', () => {
  const breadcrumbsAndTabsAreStickyAndInTheCorrectPosition = () => {
    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-header')
      .invoke('css', 'top')
      .should('equal', '-40px');

    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-breadcrumb-bg')
      .invoke('css', 'top')
      .should('equal', '0px');

    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-breadcrumb')
      .invoke('css', 'top')
      .should('equal', '0px');

    cy.findByTestId('page-title-bar')
      .find(`.${prefix}--tabs--scrollable`)
      .invoke('css', 'top')
      .should('equal', '40px');
  };

  const tabsAreStickyAndBreadcrumbsAreHidden = () => {
    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-header')
      .invoke('css', 'top')
      // -5rem
      .should('equal', '-80px');

    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-breadcrumb-bg')
      .invoke('css', 'top')
      .should('equal', '0px');

    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-breadcrumb')
      .invoke('css', 'top')
      .should('equal', '0px');

    cy.findByTestId('page-title-bar')
      .find(`.${prefix}--tabs--scrollable`)
      .invoke('css', 'top')
      .should('equal', '0px');
  };

  const tabsAreStickyAndBreadcrumbsAreShown = () => {
    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-header')
      .invoke('css', 'top')
      .should('equal', '-40px');

    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-breadcrumb-bg')
      .invoke('css', 'top')
      .should('equal', '0px');

    cy.findByTestId('page-title-bar')
      .find('.page-title-bar-breadcrumb')
      .invoke('css', 'top')
      .should('equal', '0px');

    cy.findByTestId('page-title-bar')
      .find(`.${prefix}--tabs--scrollable`)
      .invoke('css', 'top')
      .should('equal', '40px');
  };

  it('Reacts to scrollY when set to dynamic', () => {
    mount(
      <div style={{ paddingTop: '7rem', height: '200vh' }}>
        <PageTitleBar
          breadcrumb={[<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>]}
          title="testTitle"
          headerMode="DYNAMIC"
          testId="page-title-bar"
        />
      </div>
    );

    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--dynamic')
      .should('have.class', 'page-title-bar--dynamic--before')
      .should('not.have.class', 'page-title-bar--dynamic--during')
      .should('not.have.class', 'page-title-bar--dynamic--after')
      .should(
        'have.attr',
        'style',
        '--header-offset:48px; --negative-header-offset:-48px; --scroll-transition-progress:0;'
      );

    cy.scrollTo(0, 118);
    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--dynamic--during')
      .should('not.have.class', 'page-title-bar--dynamic--after')
      .should('not.have.class', 'page-title-bar--dynamic--before')
      .should(($el) => {
        const scrollProgress = Number.parseFloat(
          $el[0].style.getPropertyValue('--scroll-transition-progress')
        ).toPrecision(1);

        expect(scrollProgress).to.equal('0.2');
      });

    cy.scrollTo(0, 200);
    cy.findByTestId('page-title-bar')
      .should('not.have.class', 'page-title-bar--dynamic--during')
      .should('have.class', 'page-title-bar--dynamic--after')
      .should('not.have.class', 'page-title-bar--dynamic--before')
      .should(
        'have.attr',
        'style',
        '--header-offset:48px; --negative-header-offset:-48px; --scroll-transition-progress:1;'
      );
  });

  it('should stack the tabs and breadcrumbs in dynamic mode', () => {
    mount(
      <div style={{ height: '150vh' }}>
        <PageTitleBar
          headerMode="DYNAMIC"
          title="Testing Stacked Tabs and Breadcrumbs"
          breadcrumb={[<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>]}
          description="A simple description"
          collapsed={false}
          editable
          stickyHeaderOffset={0}
          content={
            <Tabs>
              <Tab label="Tab 1">
                <p>Tab 1 content</p>
              </Tab>
              <Tab label="Tab 2">
                <p>Tab 2 content</p>
              </Tab>
              <Tab label="Tab 3">
                <p>Tab 3 content</p>
              </Tab>
            </Tabs>
          }
          stackBreadcrumbsWithTabs
          testId="page-title-bar"
        />
      </div>
    );

    cy.scrollTo(0, 0);

    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--dynamic')
      .should('have.class', 'page-title-bar--dynamic--before')
      .should('have.class', `${iotPrefix}--page-title-bar--stack-tabs`)
      .should('not.have.class', 'page-title-bar--dynamic--during')
      .should('not.have.class', 'page-title-bar--dynamic--after')
      .should(
        'have.attr',
        'style',
        '--header-offset:40px; --negative-header-offset:-40px; --scroll-transition-progress:0;'
      );

    cy.scrollTo(0, 100);

    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--dynamic--after')
      .should(
        'have.attr',
        'style',
        '--header-offset:40px; --negative-header-offset:-40px; --scroll-transition-progress:1;'
      );

    breadcrumbsAndTabsAreStickyAndInTheCorrectPosition();
  });

  it('should stack the tabs and breadcrumbs in condensed mode', () => {
    mount(
      <div style={{ height: '150vh' }}>
        <PageTitleBar
          headerMode="CONDENSED"
          title="Testing Stacked Tabs and Breadcrumbs"
          breadcrumb={[<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>]}
          description="A simple description"
          collapsed={false}
          editable
          stickyHeaderOffset={0}
          content={
            <Tabs>
              <Tab label="Tab 1">
                <p>Tab 1 content</p>
              </Tab>
              <Tab label="Tab 2">
                <p>Tab 2 content</p>
              </Tab>
              <Tab label="Tab 3">
                <p>Tab 3 content</p>
              </Tab>
            </Tabs>
          }
          stackBreadcrumbsWithTabs
          testId="page-title-bar"
        />
      </div>
    );

    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--condensed-static')
      .should('have.class', `${iotPrefix}--page-title-bar--stack-tabs`)
      .should(
        'have.attr',
        'style',
        '--header-offset:40px; --negative-header-offset:-40px; --scroll-transition-progress:1;'
      );

    cy.scrollTo(0, 50);

    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--condensed-static')
      .should(
        'have.attr',
        'style',
        '--header-offset:40px; --negative-header-offset:-40px; --scroll-transition-progress:1;'
      );

    breadcrumbsAndTabsAreStickyAndInTheCorrectPosition();
  });

  it('should make tabs sticky without breadcrumbs when in dynamic mode with stackBreadcrumbsWithTabs:false', () => {
    mount(
      <div style={{ paddingTop: '10rem', height: '150vh' }}>
        <PageTitleBar
          headerMode="DYNAMIC"
          title="Testing Stacked Tabs and Breadcrumbs"
          breadcrumb={[<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>]}
          description="A simple description"
          collapsed={false}
          editable
          stickyHeaderOffset={0}
          content={
            <Tabs>
              <Tab label="Tab 1">
                <p>Tab 1 content</p>
              </Tab>
              <Tab label="Tab 2">
                <p>Tab 2 content</p>
              </Tab>
              <Tab label="Tab 3">
                <p>Tab 3 content</p>
              </Tab>
            </Tabs>
          }
          stackBreadcrumbsWithTabs={false}
          testId="page-title-bar"
        />
      </div>
    );

    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--dynamic')
      .should('have.class', 'page-title-bar--dynamic--before')
      .should('have.class', `${iotPrefix}--page-title-bar--stack-tabs-override-hide`)
      .should('not.have.class', `${iotPrefix}--page-title-bar--stack-tabs`)
      .should(
        'have.attr',
        'style',
        '--header-offset:0px; --negative-header-offset:-0px; --scroll-transition-progress:0;'
      );

    cy.scrollTo(0, 250);

    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--dynamic--after')
      .should('have.class', `${iotPrefix}--page-title-bar--stack-tabs-override-hide`)
      .should(
        'have.attr',
        'style',
        '--header-offset:0px; --negative-header-offset:-0px; --scroll-transition-progress:1;'
      );

    tabsAreStickyAndBreadcrumbsAreHidden();

    cy.scrollTo(0, 220);

    cy.findByTestId('page-title-bar')
      .should('have.class', `${iotPrefix}--page-title-bar--stack-tabs`)
      .should('have.class', `${iotPrefix}--page-title-bar--stack-tabs-override-show`);

    tabsAreStickyAndBreadcrumbsAreShown();
  });
});
