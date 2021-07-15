import React from 'react';
import { mount } from 'enzyme';
import { SkeletonText, Tabs, Tab } from 'carbon-components-react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Button from '../Button';

import PageTitleBar from './PageTitleBar';
import { commonPageTitleBarProps, pageTitleBarBreadcrumb } from './PageTitleBar.story';

describe('PageTitleBar', () => {
  it('should be selectable via testId', () => {
    render(<PageTitleBar {...commonPageTitleBarProps} testId="PAGE_TITLE_BAR" />);
    expect(screen.getByTestId('PAGE_TITLE_BAR')).toBeDefined();
  });
  it('Renders common props as expected', () => {
    const wrapper = mount(<PageTitleBar {...commonPageTitleBarProps} />);
    expect(wrapper.find('.page-title-bar-title--text h2')).toHaveLength(1);
    expect(wrapper.find('.page-title-bar-description')).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('renders breadcrumbs without current in default layout', () => {
    const wrapper = mount(
      <PageTitleBar {...commonPageTitleBarProps} breadcrumb={pageTitleBarBreadcrumb} />
    );
    expect(wrapper.find('.page-title-bar-breadcrumb')).toHaveLength(1);
    expect(wrapper.find('.page-title-bar-breadcrumb-current')).toHaveLength(0);
  });

  it('renders current breadcrumb if header is dynamic or condensed', () => {
    let wrapper = mount(
      <PageTitleBar
        {...commonPageTitleBarProps}
        breadcrumb={pageTitleBarBreadcrumb}
        headerMode="CONDENSED"
      />
    );
    expect(wrapper.find('.page-title-bar-breadcrumb')).toHaveLength(1);
    expect(wrapper.find('.page-title-bar-breadcrumb-current')).toHaveLength(1);

    wrapper = mount(
      <PageTitleBar
        {...commonPageTitleBarProps}
        breadcrumb={pageTitleBarBreadcrumb}
        headerMode="DYNAMIC"
      />
    );
    expect(wrapper.find('.page-title-bar-breadcrumb')).toHaveLength(1);
    expect(wrapper.find('.page-title-bar-breadcrumb-current')).toHaveLength(1);
  });

  it('renders tooltip node if collapsed', () => {
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

  it('renders content and tooltip as expected', () => {
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
        headerMode="STICKY"
        breadcrumb={pageTitleBarBreadcrumb}
        collapsed
      />
    );
    expect(wrapper.find('.bx--tooltip__label')).toHaveLength(0);
    expect(wrapper.find('.page-title-bar-description')).toHaveLength(0);
  });

  it('renders dynamic content containing tabs outside of the header element to allow proper sticky behavior', () => {
    const wrapper = mount(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        breadcrumb={pageTitleBarBreadcrumb}
        headerMode="DYNAMIC"
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
    expect(wrapper.find('.page-title-bar > .page-title-bar-content')).toHaveLength(1);
    expect(wrapper.find('.page-title-bar-header > .page-title-bar-content')).toHaveLength(0);
  });

  it('renders dynamic content containing tabs inside of the header element to allow proper sticky behavior', () => {
    const wrapper = mount(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        breadcrumb={pageTitleBarBreadcrumb}
        headerMode="DYNAMIC"
        content={<div>other content</div>}
      />
    );
    expect(wrapper.find('.page-title-bar > .page-title-bar-content')).toHaveLength(0);
    expect(wrapper.find('.page-title-bar-header > .page-title-bar-content')).toHaveLength(1);
  });

  it('Does not render tooltip when no description with content', () => {
    const wrapper = mount(
      <PageTitleBar
        title={commonPageTitleBarProps.title}
        breadcrumb={pageTitleBarBreadcrumb}
        headerMode="CONDENSED"
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

  /* TODO: create a cypress test to test this functionality, since all these elements
     render as zero width and zero height and mocking all the dimensions isn't really
     going to test the scroll handler like it should.
  */
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('Reacts to scrollY when set to dynamic', () => {
  //   const { container } = render(
  //     <div style={{ height: '30rem' }}>
  //       <PageTitleBar
  //         breadcrumb={[<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>]}
  //         title="testTitle"
  //         headerMode="DYNAMIC"
  //         description="test"
  //       />
  //     </div>
  //   );
  //   expect(container.querySelector('.page-title-bar--dynamic--during')).toBeFalsy();
  //   expect(container.querySelector('.page-title-bar--dynamic--after')).toBeFalsy();
  //   expect(container.querySelector('.page-title-bar--dynamic--before')).toBeInTheDocument();
  //   expect(container.getPropertyValue('--scroll-transition-progress')).toEqual(0);

  //   fireEvent.scroll(window, { target: { scrollY: 60 } });
  //   expect(container.querySelector('.page-title-bar--dynamic--before')).toBeFalsy();
  //   expect(container.querySelector('.page-title-bar--dynamic--during')).toBeInTheDocument();
  //   expect(container.querySelector('.page-title-bar--dynamic--after')).toBeFalsy();
  //   expect(container.getPropertyValue('--scroll-transition-progress')).toEqual(0.2);

  //   fireEvent.scroll(window, { target: { scrollY: 200 } });
  //   expect(container.querySelector('.page-title-bar--dynamic--before')).toBeFalsy();
  //   expect(container.querySelector('.page-title-bar--dynamic--during')).toBeFalsy();
  //   expect(container.getPropertyValue('--scroll-transition-progress')).toEqual(1);
  //   expect(container.querySelector('.page-title-bar--dynamic--after')).toBeInTheDocument();
  // });
});
