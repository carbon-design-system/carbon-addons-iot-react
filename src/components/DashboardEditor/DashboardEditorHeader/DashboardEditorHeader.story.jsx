import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Link } from '../../../index';
import { defaultI18N } from '../DashboardEditor';

import DashboardEditorHeader from './DashboardEditorHeader';

storiesOf('Watson IoT Experimental/DashboardEditor/DashboardEditorHeader', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div style={{ height: 'calc(100vh - 6rem)' }}>
      <DashboardEditorHeader
        title={text('title', 'New dashboard')}
        breadcrumbs={[
          <Link href="www.ibm.com">Dashboard library</Link>,
          <Link href="www.ibm.com">Favorites</Link>,
        ]}
        onImport={action('onImport')}
        onExport={action('onSubmit')}
        onCancel={action('onCancel')}
        onSubmit={action('onSubmit')}
        i18n={defaultI18N}
      />
    </div>
  ));
