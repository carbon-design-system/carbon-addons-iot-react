import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import { PageTitleBar, Button, Card } from '../../index';
import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import DashboardEditor from './DashboardEditor';

storiesOf('Watson IoT Experimental/DashboardEditor', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div style={{ height: 'calc(100vh - 6rem)' }}>
      <DashboardEditor
        renderHeader={() => (
          <PageTitleBar
            title="Custom Header content"
            extraContent={<Button>Do something</Button>}
          />
        )}
      />
    </div>
  ))
  .add('custom card preview renderer', () => (
    <div style={{ height: 'calc(100vh - 6rem)' }}>
      <DashboardEditor
        renderHeader={() => (
          <PageTitleBar
            title="Custom Header content"
            extraContent={<Button>Do something</Button>}
          />
        )}
        renderCardPreview={(cardJson, onCardSelect, onCardRemove) => (
          <Card
            id={cardJson.id}
            size={cardJson.size}
            title={cardJson.title}
            isEditable
            availableActions={{ edit: true, delete: true }}
            onCardAction={(id, actionId) => {
              if (actionId === CARD_ACTIONS.EDIT_CARD) {
                onCardSelect(id);
              }
              if (actionId === CARD_ACTIONS.DELETE_CARD) {
                onCardRemove(id);
              }
            }}
          >
            Custom content!
          </Card>
        )}
      />
    </div>
  ));
