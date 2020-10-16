import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, object, array } from '@storybook/addon-knobs';

import { Card, Link, InlineNotification } from '../../index';
import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import DashboardEditor from './DashboardEditor';

storiesOf('Watson IoT Experimental/DashboardEditor', module)
  .addDecorator(withKnobs)
  .add('default', () => (
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
      />
    </div>
  ))
  .add('with initialValue', () => (
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
  .add('with breakpointSwitcher', () => (
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
      />
    </div>
  ))
  .add('custom header renderer', () => (
    <div style={{ height: 'calc(100vh - 3rem)', marginRight: '-3rem' }}>
      <DashboardEditor
        renderHeader={() => <h1>Custom Header</h1>}
        supportedCardTypes={array('supportedCardTypes', [
          'TIMESERIES',
          'SIMPLE_BAR',
          'GROUPED_BAR',
          'STACKED_BAR',
          'VALUE',
          'IMAGE',
          'TABLE',
        ])}
      />
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
        ])}
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
