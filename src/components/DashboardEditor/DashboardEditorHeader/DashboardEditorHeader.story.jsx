import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Link } from '../../../index';

import DashboardEditorHeader from './DashboardEditorHeader';

storiesOf(
  'Watson IoT Experimental/DashboardEditor/DashboardEditorHeader',
  module
)
  .addParameters({
    component: DashboardEditorHeader,
  })
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
        onExport={action('onExport')}
        onDelete={action('onDelete')}
        onCancel={action('onCancel')}
        onSubmit={action('onSubmit')}
        dashboardJson={{}}
      />
    </div>
  ))
  .add('with editable title and no import/export/delete', () => (
    <div style={{ height: 'calc(100vh - 6rem)' }}>
      <DashboardEditorHeader
        title={text('title', 'New dashboard')}
        breadcrumbs={[
          <Link href="www.ibm.com">Dashboard library</Link>,
          <Link href="www.ibm.com">Favorites</Link>,
        ]}
        onEditTitle={action('onEditTitle')}
        onCancel={action('onCancel')}
        onSubmit={action('onSubmit')}
        dashboardJson={{}}
      />
    </div>
  ));
