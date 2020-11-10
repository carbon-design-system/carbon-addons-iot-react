import React from 'react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  boolean,
  text,
  object,
  array,
} from '@storybook/addon-knobs';

import { Card, Link, InlineNotification } from '../../index';

import DashboardEditor from './DashboardEditor';

const mockDataItems = [
  { dataSourceId: 'torque_max', label: 'Torque Max' },
  { dataSourceId: 'torque_min', label: 'Torque Min' },
  { dataSourceId: 'torque_mean', label: 'Torque Mean' },
  { dataSourceId: 'temperature', label: 'Temperature' },
  { dataSourceId: 'pressure', label: 'Pressure' },
];

export default {
  title: 'Watson IoT Experimental/DashboardEditor',
  decorators: [withKnobs],

  parameters: {
    component: DashboardEditor,
  },
};

export const Default = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title={text('title', 'My dashboard')}
      dataItems={mockDataItems}
      onAddImage={action('onAddImage')}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onLayoutChange={action('onLayoutChange')}
      submitDisabled={boolean('submitDisabled', false)}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
        'CUSTOM',
      ])}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

Default.story = {
  name: 'default',
};

export const WithInitialValue = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title="Custom dashboard"
      dataItems={mockDataItems}
      initialValue={{
        cards: [
          {
            id: 'Table',
            title: 'Table card',
            size: 'LARGE',
            type: 'TABLE',
            content: {
              columns: [
                {
                  dataSourceId: 'undefined',
                  label: '--',
                },
                {
                  dataSourceId: 'undefined2',
                  label: '--',
                },
              ],
            },
          },
          {
            id: 'Custom',
            title: 'Custom rendered card',
            type: 'CUSTOM',
            size: 'MEDIUM',
            value: 35,
          },
          {
            id: 'Standard',
            title: 'Default rendered card',
            type: 'VALUE',
            size: 'MEDIUM',
            content: {
              attributes: [
                {
                  dataSourceId: 'key1',
                  unit: '%',
                  label: 'Key 1',
                },
                {
                  dataSourceId: 'key2',
                  unit: 'lb',
                  label: 'Key 2',
                },
              ],
            },
          },
          {
            id: 'Timeseries',
            title: 'Untitled',
            size: 'MEDIUMWIDE',
            type: 'TIMESERIES',
            content: {
              series: [
                {
                  label: 'Temperature',
                  dataSourceId: 'temperature',
                },
                {
                  label: 'Pressure',
                  dataSourceId: 'pressure',
                },
              ],
              xLabel: 'Time',
              yLabel: 'Temperature (˚F)',
              includeZeroOnXaxis: true,
              includeZeroOnYaxis: true,
              timeDataSourceId: 'timestamp',
              addSpaceOnEdges: 1,
            },
            interval: 'day',
          },
        ],
        layouts: {
          lg: [
            { h: 4, i: 'Table', w: 8, x: 0, y: 0 },
            { h: 2, i: 'Custom', w: 4, x: 8, y: 0 },
            {
              h: 2,
              i: 'Standard',
              w: 4,
              x: 12,
              y: 0,
            },
            {
              h: 2,
              i: 'Timeseries',
              w: 8,
              x: 1,
              y: 4,
            },
          ],
          md: [
            { h: 4, i: 'Table', w: 8, x: 0, y: 0 },
            { h: 2, i: 'Custom', w: 4, x: 8, y: 0 },
            {
              h: 2,
              i: 'Standard',
              w: 4,
              x: 12,
              y: 0,
            },
            {
              h: 2,
              i: 'Timeseries',
              w: 8,
              x: 1,
              y: 4,
            },
          ],
          xl: [
            { h: 4, i: 'Table', w: 8, x: 0, y: 0 },
            { h: 2, i: 'Custom', w: 4, x: 8, y: 0 },
            {
              h: 2,
              i: 'Standard',
              w: 4,
              x: 12,
              y: 0,
            },
            {
              h: 2,
              i: 'Timeseries',
              w: 8,
              x: 1,
              y: 4,
            },
          ],
        },
      }}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onLayoutChange={action('onLayoutChange')}
      supportedCardTypes={[
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
      ]}
      i18n={{
        cardType_CUSTOM: 'Custom',
      }}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithInitialValue.story = {
  name: 'with initialValue',
};

export const WithCustomOnCardChange = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title="Custom dashboard"
      dataItems={mockDataItems}
      initialValue={{
        cards: [
          {
            id: 'Timeseries',
            title: 'Untitled',
            size: 'MEDIUMWIDE',
            type: 'TIMESERIES',
            content: {
              series: [
                {
                  label: 'Temperature',
                  dataSourceId: 'temperature',
                },
                {
                  label: 'Pressure',
                  dataSourceId: 'pressure',
                },
              ],
              xLabel: 'Time',
              yLabel: 'Temperature (˚F)',
              includeZeroOnXaxis: true,
              includeZeroOnYaxis: true,
              timeDataSourceId: 'timestamp',
              addSpaceOnEdges: 1,
            },
            interval: 'day',
          },
        ],
        layouts: {},
      }}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onCardChange={(card) => {
        action('onCardChange');
        return card;
      }}
      onLayoutChange={action('onLayoutChange')}
      supportedCardTypes={[
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
      ]}
      i18n={{
        cardType_CUSTOM: 'Custom',
      }}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithCustomOnCardChange.story = {
  name: 'with custom onCardChange',
};

export const WithNotifications = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title={text('title', 'My dashboard')}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
        'CUSTOM',
      ])}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      notification={
        <>
          <InlineNotification
            title="This is the dashboard editor"
            subtitle="Use the side panel to create or edit cards"
            kind="info"
            lowContrast
          />
          <InlineNotification
            title="Import successful"
            subtitle="The JSON import was successful"
            kind="success"
            lowContrast
          />
          <InlineNotification
            title="Data error"
            subtitle="The image provided was not able to be fetched"
            kind="error"
            lowContrast
          />
        </>
      }
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithNotifications.story = {
  name: 'with notifications',
};

export const WithBreakpointSwitcher = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title={text('title', 'My dashboard')}
      onAddImage={action('onAddImage')}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onLayoutChange={action('onLayoutChange')}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
      ])}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      breakpointSwitcher={{ enabled: true }}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithBreakpointSwitcher.story = {
  name: 'with breakpoint switcher',
};

export const CustomCardPreviewRenderer = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title="Custom dashboard"
      initialValue={object('initialValue', {
        cards: [
          {
            id: 'Custom',
            title: 'Custom rendered card',
            type: 'CUSTOM',
            size: 'MEDIUM',
            value: 35,
          },
          {
            id: 'Standard',
            title: 'Default rendered card',
            type: 'VALUE',
            size: 'MEDIUM',
            content: {
              attributes: [
                {
                  dataSourceId: 'key1',
                  unit: '%',
                  label: 'Key 1',
                },
                {
                  dataSourceId: 'key2',
                  unit: 'lb',
                  label: 'Key 2',
                },
              ],
            },
          },
        ],
        layouts: {},
      })}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onLayoutChange={action('onLayoutChange')}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
        'CUSTOM',
      ])}
      i18n={{
        cardType_CUSTOM: 'Custom',
      }}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      renderCardPreview={(
        cardConfig,
        cardProps,
        // These props are not used, but they could be to create your own implementation
        onSelectCard, // eslint-disable-line no-unused-vars
        onDuplicateCard, // eslint-disable-line no-unused-vars
        onRemoveCard, // eslint-disable-line no-unused-vars
        isSelected // eslint-disable-line no-unused-vars
      ) => {
        return cardConfig.type === 'CUSTOM' ? (
          <Card
            key={cardConfig.id}
            id={cardConfig.id}
            size={cardConfig.size}
            title={cardConfig.title}
            isEditable
            {...cardProps}>
            <div style={{ padding: '1rem' }}>
              This content is rendered by the renderCardPreview function. The
              &quot;value&quot; property on the card will be rendered here:
              <h3>{cardConfig.value}</h3>
            </div>
          </Card>
        ) : undefined;
      }}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

CustomCardPreviewRenderer.story = {
  name: 'custom card preview renderer',
};

export const CustomHeaderRenderer = () => (
  <div style={{ height: 'calc(100vh - 3rem)', marginRight: '-3rem' }}>
    <DashboardEditor
      renderHeader={() => <h1>Custom Header</h1>}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

CustomHeaderRenderer.story = {
  name: 'custom header renderer',
};

export const isLoading = () => (
  <div style={{ height: 'calc(100vh - 3rem)', marginRight: '-3rem' }}>
    <DashboardEditor isLoading={boolean('isLoading', true)} />
  </div>
);

isLoading.story = {
  name: 'isLoading',
};
