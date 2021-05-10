import React from 'react';
import { action } from '@storybook/addon-actions';
import { select, text, boolean, number, withKnobs, optionsKnob } from '@storybook/addon-knobs';
import { Add24, TrashCan24, SettingsAdjust24, Warning24 } from '@carbon/icons-react';
import { spacing05 } from '@carbon/layout';
import { Tabs, Tab, Search, Select, SelectItem, InlineLoading } from 'carbon-components-react';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import TileCatalogNew from '../TileCatalogNew/TileCatalogNew';
import { getTiles } from '../TileCatalogNew/TileCatalogNew.story';
import Button from '../Button';

import PageTitleBar from './PageTitleBar';

export const commonPageTitleBarProps = {
  title: 'Page title',
  description: 'Descriptive text about this page and what the user can or should do on it',
  extraContent: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: spacing05 }}>
        <b>Last updated:</b> yesterday
      </span>
      <Button
        className="some-right-content"
        size="field"
        renderIcon={Add24}
        onClick={action('click')}
      >
        Take an action
      </Button>
    </div>
  ),
};

export const PageTitleBarNodeTooltip = () => (
  <div>
    <p>Descriptive text about this page and what the user can or should do on it </p>
    <div
      style={{
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        'padding-top': spacing05,
      }}
    >
      <a href="/">Link one</a>
      <Button renderIcon={Add24} onClick={action('click')}>
        Take an action
      </Button>
    </div>
  </div>
);

export const pageTitleBarBreadcrumb = [
  <a href="/">Home</a>,
  <a href="/">Type</a>,
  <span>Instance</span>,
];
const breadcrumbKnobOptions = {
  none: undefined,
  breadcrumb: pageTitleBarBreadcrumb,
};
const breadcrumbDefaultValue = pageTitleBarBreadcrumb;

export default {
  title: 'Watson IoT/PageTitleBar',
  decorators: [withKnobs, (storyFn) => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>],
  parameters: {
    component: PageTitleBar,
  },

  excludeStories: ['commonPageTitleBarProps', 'pageTitleBarBreadcrumb', 'PageTitleBarNodeTooltip'],
};

export const Base = () => <PageTitleBar title={commonPageTitleBarProps.title} />;

Base.story = {
  name: 'base',
};

export const WithBreadcrumb = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      title={commonPageTitleBarProps.title}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      extraContent={commonPageTitleBarProps.extraContent}
    />
  </div>
);

WithBreadcrumb.story = {
  name: 'with breadcrumb',
};

WithBreadcrumb.story = {
  name: 'with breadcrumb',
};

export const WithDescription = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      title={text('title', commonPageTitleBarProps.title)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, undefined, {
        display: 'select',
      })}
      description={commonPageTitleBarProps.description}
      collapsed={boolean('collapse description', false)}
    />
  </div>
);

WithDescription.story = {
  name: 'with description',
};

export const WithTooltipDescriptionWithNode = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      title={text('title', commonPageTitleBarProps.title)}
      description={<PageTitleBarNodeTooltip />}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      collapsed={boolean('collapse description', true)}
    />
  </div>
);

WithTooltipDescriptionWithNode.story = {
  name: 'with tooltip description with node',
};

export const WithStatusDescriptionAndCrumbs = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      title={text('title', 'ZH002')}
      description={<InlineLoading status="finished" description="Running" />}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      collapsed={boolean('collapse description', false)}
      headerMode={select('headerMode', ['DYNAMIC', 'STATIC', 'STICKY', 'CONDENSED'], 'STATIC')}
    />
  </div>
);

WithStatusDescriptionAndCrumbs.story = {
  name: 'with status description and breadcrumbs',
};

export const WithEditableTitleBar = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      title={text('title', commonPageTitleBarProps.title)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, undefined, {
        display: 'select',
      })}
      description={text('description', commonPageTitleBarProps.description)}
      collapsed={boolean('collapse description', false)}
      editable={boolean('editable', true)}
      onEdit={action('edit')}
    />
  </div>
);

WithEditableTitleBar.story = {
  name: 'with editable title bar and subtitle',
};

export const WithRichContent = () => (
  <PageTitleBar
    title={text('title', 'A page title could be really long, you never know')}
    description={text('description', commonPageTitleBarProps.description)}
    extraContent={
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: spacing05 }}>
          <b>Last updated:</b> yesterday
        </span>
        <Button
          className="some-right-content"
          size="field"
          renderIcon={Add24}
          onClick={action('click')}
        >
          Take an action
        </Button>
      </div>
    }
    content={<span>Just some plain text that should align nicely</span>}
  />
);

WithRichContent.story = {
  name: 'with rich content',
};

export const WithSelect = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 0)}
      title={text('title', 'A page title could be really long, you never know')}
      description={text('description', commonPageTitleBarProps.description)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      collapsed={boolean('collapse description', false)}
      editable={boolean('editable', false)}
      headerMode={select('headerMode', ['DYNAMIC', 'STATIC', 'STICKY', 'CONDENSED'], 'DYNAMIC')}
      extraContent={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            renderIcon={SettingsAdjust24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Add"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Select hideLabel id="select-1" defaultValue="placeholder-item">
            <SelectItem disabled hidden value="placeholder-item" text="Choose an option" />
            <SelectItem value="option-3" text="Option 3" />
            <SelectItem value="option-4" text="Option 4" />
          </Select>
          <Button
            renderIcon={Add24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Add"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button
            renderIcon={TrashCan24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Remove"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button onClick={action('click')} size="field">
            Take an action
          </Button>
        </div>
      }
      onEdit={action('edit')}
    />
  </div>
);

WithSelect.story = {
  name: 'with select action and an overflowing page title',
};

export const WithSearch = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 0)}
      headerMode={select('headerMode', ['DYNAMIC', 'STATIC', 'STICKY', 'CONDENSED'], 'STATIC')}
      title={text('title', commonPageTitleBarProps.title)}
      description={text('description', commonPageTitleBarProps.description)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      collapsed={boolean('collapse description', false)}
      editable={boolean('editable', true)}
      extraContent={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            renderIcon={SettingsAdjust24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Add"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Search
            id="search-1"
            placeholder="Search"
            onChange={action('search')}
            size="lg"
            labelText="Search"
          />
          <Button
            renderIcon={Add24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Add"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button
            renderIcon={TrashCan24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Remove"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button onClick={action('click')} size="field">
            Take an action
          </Button>
        </div>
      }
      content={
        <Tabs style={{ marginLeft: '-16px', marginRight: '-16px' }}>
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
      onEdit={action('edit')}
    />
  </div>
);

WithSearch.story = {
  name: 'with search and tabs',
};

export const WithEverything = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 0)}
      headerMode={select('headerMode', ['DYNAMIC', 'STATIC', 'STICKY', 'CONDENSED'], 'STATIC')}
      title={text('title', commonPageTitleBarProps.title)}
      description={text('description', commonPageTitleBarProps.description)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      collapsed={boolean('collapse description', false)}
      editable={boolean('editable', true)}
      extraContent={
        <div>
          <Button
            renderIcon={Add24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Add"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button
            renderIcon={TrashCan24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Remove"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button onClick={action('click')} size="field">
            Take an action
          </Button>
        </div>
      }
      content={
        <Tabs style={{ marginLeft: '-16px', marginRight: '-16px' }}>
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
      onEdit={action('edit')}
    />
  </div>
);

WithEverything.story = {
  name: 'with breadcrumbs, actions, and tabs',
};

export const WithCondensedHeader = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 0)}
      title={text('title', commonPageTitleBarProps.title)}
      description={text('description', commonPageTitleBarProps.description)}
      collapsed={boolean('collapse description', true)}
      editable={boolean('editable', false)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      headerMode={select('headerMode', ['DYNAMIC', 'STATIC', 'STICKY', 'CONDENSED'], 'CONDENSED')}
      extraContent={
        <div style={{ display: 'flex' }}>
          <Button size="field" kind="secondary">
            Secondary button
          </Button>
          <Button size="field" kind="primary">
            Primary button
          </Button>
        </div>
      }
      content={
        <div
          style={{
            height: '100rem',
            marginLeft: '-16px',
            marginRight: '-16px',
            marginTop: '-16px',
          }}
        >
          <TileCatalogNew tiles={getTiles(3)} numColumns={2} numRows={2} />
        </div>
      }
      onEdit={action('edit')}
    />
  </div>
);

WithCondensedHeader.story = {
  name: 'with condensed with primary + secondary buttons',
};

export const CustomRenderFunction = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      title={commonPageTitleBarProps.title}
      renderTitleFunction={(title) => (
        <h2>
          {title} <Warning24 color="red" />
        </h2>
      )}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      extraContent={commonPageTitleBarProps.extraContent}
    />
  </div>
);

export const WithJustATitleAndDynamicScrolling = () => (
  <div style={{ marginTop: '10rem', height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 100)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, undefined, {
        display: 'select',
      })}
      title="testTitle"
      headerMode="DYNAMIC"
    />
  </div>
);
WithJustATitleAndDynamicScrolling.story = {
  name: 'with dynamic with just a title',
};

export const WithOffsetDownThePage = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 20)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      title="testTitle"
      headerMode="DYNAMIC"
    />
  </div>
);
WithOffsetDownThePage.story = {
  name: 'with dynamic with an offset',
};

export const WithDynamicScrolling = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 0)}
      headerMode={select('headerMode', ['DYNAMIC', 'STATIC', 'STICKY', 'CONDENSED'], 'DYNAMIC')}
      title={text('title', commonPageTitleBarProps.title)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      description={text('description', commonPageTitleBarProps.description)}
      collapsed={boolean('collapse description', false)}
      editable={boolean('editable')}
      extraContent={
        <div style={{ display: 'flex' }}>
          <Button
            renderIcon={Add24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Add"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button
            renderIcon={TrashCan24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Remove"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button onClick={action('click')} size="field">
            Take an action
          </Button>
        </div>
      }
      content={
        <div
          style={{
            height: '100rem',
            marginLeft: '-16px',
            marginRight: '-16px',
            marginTop: '-16px',
          }}
        >
          <TileCatalogNew tiles={getTiles(3)} numColumns={2} numRows={2} />
        </div>
      }
      onEdit={action('edit')}
    />
  </div>
);

WithDynamicScrolling.story = {
  name: 'with dynamic with breadcrumbs, actions, and content',
  info: {
    text: `with dynamic scrolling, upper actions, and buttons the buttons should transition and sit next to the actions when the page header is condensed`,
  },
};

export const WithDynamicScrollingAndTabs = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 0)}
      headerMode={select('headerMode', ['DYNAMIC', 'STATIC', 'STICKY', 'CONDENSED'], 'DYNAMIC')}
      title={text('title', commonPageTitleBarProps.title)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      description={text('description', commonPageTitleBarProps.description)}
      collapsed={boolean('collapse description', false)}
      editable={boolean('editable', true)}
      extraContent={
        <div style={{ display: 'flex' }}>
          <Button
            renderIcon={Add24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Add"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button
            renderIcon={TrashCan24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Remove"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button onClick={action('click')} size="field">
            Take an action
          </Button>
        </div>
      }
      content={
        <div style={{ marginLeft: '-16px', marginRight: '-16px' }}>
          <Tabs>
            <Tab label="Tab 1">
              <div style={{ height: '100rem', marginTop: '-16px' }}>
                <TileCatalogNew tiles={getTiles(3)} numColumns={2} numRows={2} />
              </div>
            </Tab>
            <Tab label="Tab 2">
              <div style={{ height: '100rem', marginTop: '-16px' }}>
                <TileCatalogNew tiles={getTiles(5)} numColumns={2} numRows={2} />
              </div>
            </Tab>
            <Tab label="Tab 3">
              <div style={{ height: '100rem', marginTop: '-16px' }}>
                <TileCatalogNew tiles={getTiles(5)} numColumns={2} numRows={2} />
              </div>
            </Tab>
          </Tabs>
        </div>
      }
      onEdit={action('edit')}
    />
  </div>
);

WithDynamicScrollingAndTabs.story = {
  name: 'with dynamic with breadcrumbs, actions, and tabs',
};

WithDynamicScrollingAndTabs.parameters = {
  info: {
    text: `Note: We need to set the sticky offset here to 0 (from the default 3rem) because storybook sets everything relative to their container with 3rem padding.
      The dynamicTransitionOffset isn't needed here, because the default 3rem is relative to the overall window scrollY and handles the storybook padding`,
  },
};

export const WithDynamicScrollingAndUpperActions = () => (
  <div style={{ height: '150vh' }}>
    <PageTitleBar
      stickyHeaderOffset={number('sticky header offset', 0)}
      headerMode={select('headerMode', ['DYNAMIC', 'STATIC', 'STICKY', 'CONDENSED'], 'DYNAMIC')}
      title={text('title', commonPageTitleBarProps.title)}
      breadcrumb={optionsKnob('breadcrumbs', breadcrumbKnobOptions, breadcrumbDefaultValue, {
        display: 'select',
      })}
      description={text('description', commonPageTitleBarProps.description)}
      upperActions={
        <div style={{ display: 'flex' }}>
          <Button
            renderIcon={Add24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Add"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
          <Button
            renderIcon={TrashCan24}
            onClick={action('click')}
            size="field"
            hasIconOnly
            iconDescription="Remove"
            kind="ghost"
            tooltipPosition="bottom"
            tooltipAlignment="center"
          />
        </div>
      }
      extraContent={
        <div style={{ display: 'flex' }}>
          <Button onClick={action('click')} size="field">
            Take an action
          </Button>
        </div>
      }
      onEdit={action('edit')}
    />
  </div>
);

WithDynamicScrollingAndUpperActions.story = {
  name: 'with dynamic with breadcrumbs, actions, and upper actions',
  info: {
    text: `with dynamic scrolling, upper actions, and buttons the buttons should transition and sit next to the actions when the page header is condensed`,
  },
};

export const IsLoading = () => <PageTitleBar title={commonPageTitleBarProps.title} isLoading />;

IsLoading.story = {
  name: 'isLoading',
};
