import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Link } from '../../../index';

import DashboardEditorHeader from './DashboardEditorHeader';

export default {
  title: 'Watson IoT Experimental/DashboardEditor/DashboardEditorHeader',
  decorators: [withKnobs],

  parameters: {
    component: DashboardEditorHeader,
  },
};

export const Default = () => (
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
);

Default.story = {
  name: 'default',
};

export const WithEditableTitleAndNoImportExportDelete = () => (
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
);

WithEditableTitleAndNoImportExportDelete.story = {
  name: 'with editable title and no import/export/delete',
};
