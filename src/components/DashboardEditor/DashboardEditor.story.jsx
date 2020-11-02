import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  boolean,
  text,
  object,
  array,
} from '@storybook/addon-knobs';

import sampleImage from '../CardEditor/CardGalleryList/image.svg';
import { Card, Link, InlineNotification } from '../../index';
import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import DashboardEditor from './DashboardEditor';

const mockDataItems = [
  { dataSourceId: 'torque_max', label: 'Torque Max' },
  { dataSourceId: 'torque_min', label: 'Torque Min' },
  { dataSourceId: 'torque_mean', label: 'Torque Mean' },
  { dataSourceId: 'temperature', label: 'Temperature' },
  { dataSourceId: 'pressure', label: 'Pressure' },
];

storiesOf('Watson IoT Experimental/DashboardEditor', module)
  .addDecorator(withKnobs)
  .add('default', () => (
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
      />
    </div>
  ))
  .add('with initialValue', () => (
    <div style={{ height: 'calc(100vh - 6rem)' }}>
      <DashboardEditor
        title="Custom dashboard"
        dataItems={mockDataItems}
        getValidDataItems={() => mockDataItems.slice(2)}
        initialValue={object('initialValue', {
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
              id: 'Image',
              title: 'Image card',
              size: 'MEDIUMWIDE',
              type: 'IMAGE',
              content: {
                alt: 'Sample image',
                src: sampleImage,
                hideMinimap: true,
                hideHotspots: false,
                hideZoomControls: false,
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
          layouts: {},
        })}
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
        ])}
        i18n={{
          cardType_CUSTOM: 'Custom',
        }}
        headerBreadcrumbs={[
          <Link href="www.ibm.com">Dashboard library</Link>,
          <Link href="www.ibm.com">Favorites</Link>,
        ]}
      />
    </div>
  ))
  .add('with custon onCardChange', () => (
    <div style={{ height: 'calc(100vh - 6rem)' }}>
      <DashboardEditor
        title="Custom dashboard"
        dataItems={mockDataItems}
        getValidDataItems={() => mockDataItems.slice(2)}
        getDefaultTimeRanges={() => ({
          last24Hours: 'Last 24 hrs',
          last7Days: 'Last 7 days',
          lastMonth: 'Last month',
          lastQuarter: 'Last quarter',
          lastYear: 'Last year',
          thisWeek: 'This week',
          thisMonth: 'This month',
          thisQuarter: 'This quarter',
          thisYear: 'This year',
        })}
        onCardChange={(card) => {
          console.log(card);
          return card;
        }}
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
        })}
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
        ])}
        i18n={{
          cardType_CUSTOM: 'Custom',
        }}
        headerBreadcrumbs={[
          <Link href="www.ibm.com">Dashboard library</Link>,
          <Link href="www.ibm.com">Favorites</Link>,
        ]}
      />
    </div>
  ))
  .add('with notifications', () => (
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
      />
    </div>
  ))
  .add('custom header renderer', () => (
    <div style={{ height: 'calc(100vh - 3rem)', marginRight: '-3rem' }}>
      <DashboardEditor renderHeader={() => <h1>Custom Header</h1>} />
    </div>
  ))
  .add('custom card preview renderer', () => (
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
          cardJson,
          isSelected,
          onSelectCard,
          onDuplicateCard,
          onRemoveCard
        ) => {
          const commonProps = isSelected
            ? { className: 'selected-card' }
            : {
                availableActions: { edit: true, clone: true, delete: true },
                onCardAction: (id, actionId) => {
                  if (actionId === CARD_ACTIONS.EDIT_CARD) {
                    onSelectCard(id);
                  }
                  if (actionId === CARD_ACTIONS.CLONE_CARD) {
                    onDuplicateCard(id);
                  }
                  if (actionId === CARD_ACTIONS.DELETE_CARD) {
                    onRemoveCard(id);
                  }
                },
              };
          return cardJson.type === 'CUSTOM' ? (
            <Card
              key={cardJson.id}
              id={cardJson.id}
              size={cardJson.size}
              title={cardJson.title}
              isEditable
              {...commonProps}>
              <div style={{ padding: '1rem' }}>
                This content is rendered by the renderCardPreview function. The
                &quot;value&quot; property on the card will be rendered here:
                <h3>{cardJson.value}</h3>
              </div>
            </Card>
          ) : undefined;
        }}
      />
    </div>
  ));
