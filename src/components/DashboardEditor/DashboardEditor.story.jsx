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
import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import DashboardEditor from './DashboardEditor';

const mockDataItems = ['Torque Max', 'Torque Min', 'Torque Mean'];

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
);

Default.story = {
  name: 'default',
};

export const WithInitialValue = () => (
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
);

WithInitialValue.story = {
  name: 'with initialValue',
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
    />
  </div>
);

WithNotifications.story = {
  name: 'with notifications',
};

export const CustomHeaderRenderer = () => (
  <div style={{ height: 'calc(100vh - 3rem)', marginRight: '-3rem' }}>
    <DashboardEditor renderHeader={() => <h1>Custom Header</h1>} />
  </div>
);

CustomHeaderRenderer.story = {
  name: 'custom header renderer',
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
);

CustomCardPreviewRenderer.story = {
  name: 'custom card preview renderer',
};
