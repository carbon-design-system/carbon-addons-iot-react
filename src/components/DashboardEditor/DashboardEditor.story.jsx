import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import { PageTitleBar, Button } from '../../index';

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
  ));
