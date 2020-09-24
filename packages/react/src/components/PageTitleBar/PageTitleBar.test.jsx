import React from 'react';
import { mount } from 'enzyme';
import { SkeletonText, Tabs, Tab } from 'carbon-components-react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Button from '../Button';

import PageTitleBar from './PageTitleBar';
import { commonPageTitleBarProps, pageTitleBarBreadcrumb } from './PageTitleBar.story';

describe('PageTitleBar', () => {
  it('Renders common props as expected', () => {
    const wrapper = mount(<PageTitleBar {...commonPageTitleBarProps} />);
    expect(wrapper.find('.page-title-bar-title--text h2')).toHaveLength(1);
    expect(wrapper.find('.page-title-bar-description')).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('Renders breadrumbs as expected', () => {
    const wrapper = mount(
      <PageTitleBar {...commonPageTitleBarProps} breadcrumb={pageTitleBarBreadcrumb} />
    );
    expect(wrapper.find('.page-title-bar-breadcrumb')).toHaveLength(1);
  });

  it('Renders tooltip as expected', () => {
    const wrapper = mount(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        description={commonPageTitleBarProps.description}
        breadcrumb={pageTitleBarBreadcrumb}
        collapsed
      />
    );
    expect(wrapper.find('.bx--tooltip__label')).toHaveLength(1);
    expect(wrapper.find('.page-title-bar-description')).toHaveLength(0);
  });

  it('Renders content and tooltip as expected', () => {
    const wrapper = mount(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        description={commonPageTitleBarProps.description}
        breadcrumb={pageTitleBarBreadcrumb}
        content={
          <div>
            <h3>Some content for the page</h3>
            <p>More text</p>
          </div>
        }
      />
    );
    expect(wrapper.find('.bx--tooltip__label')).toHaveLength(1);
    expect(wrapper.find('.page-title-bar-description')).toHaveLength(0);
    expect(wrapper.find('.page-title-bar-content')).toHaveLength(1);
  });

  it('Does not render tooltip when no description', () => {
    const wrapper = mount(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        breadcrumb={pageTitleBarBreadcrumb}
        collapsed
      />
    );
    expect(wrapper.find('.bx--tooltip__label')).toHaveLength(0);
    expect(wrapper.find('.page-title-bar-description')).toHaveLength(0);
  });

  it('Does not render tooltip when no description with content', () => {
    const wrapper = mount(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        breadcrumb={pageTitleBarBreadcrumb}
        content={
          <Tabs>
            <Tab label="Tab 1">
              <div>Content for first tab.</div>
            </Tab>
            <Tab label="Tab 2">
              <div>Content for second tab.</div>
            </Tab>
            <Tab label="Tab 3">
              <div>Content for third tab.</div>
            </Tab>
          </Tabs>
        }
      />
    );
    expect(wrapper.find('.bx--tooltip__label')).toHaveLength(0);
    expect(wrapper.find('.page-title-bar-description')).toHaveLength(0);
    expect(wrapper.find('.page-title-bar-content')).toHaveLength(1);
  });

  describe('Renders editable title as expected', () => {
    const onEdit = jest.fn();
    const wrapper = mount(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        description={commonPageTitleBarProps.description}
        editable
        onEdit={onEdit}
      />
    );

    it('Renders edit icon button', () => {
      expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('Calls callback when edit is clicked', () => {
      wrapper.find(Button).simulate('click');
      expect(onEdit.mock.calls).toHaveLength(1);
    });
  });

  it('Renders loading state as expected', () => {
    const wrapper = mount(<PageTitleBar title={commonPageTitleBarProps.title} isLoading />);
    expect(wrapper.find(SkeletonText)).toHaveLength(1);
  });

  it('i18n string test', () => {
    const i18nTest = {
      editIconDescription: 'edit-icon-description',
      tooltipIconDescription: 'tooltip-icon-description',
    };

    const i18nDefault = PageTitleBar.defaultProps.i18n;
    render(
      <PageTitleBar title="testTitle" i18n={i18nTest} editable description="test" collapsed />
    );

    expect(screen.getByText(i18nTest.editIconDescription)).toBeInTheDocument();
    expect(screen.getByLabelText(i18nTest.tooltipIconDescription)).toBeInTheDocument();

    expect(screen.queryByText(i18nDefault.editIconDescription)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.tooltipIconDescription)).not.toBeInTheDocument();
  });
});
