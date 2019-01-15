import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import BaseModal from './BaseModal';

storiesOf('BaseModal', module) // Ugh I shouldn't have to add these info here, but it's not being picked up by react-docgen!
  .addParameters({
    info: `Renders a carbon modal dialog.  This dialog adds these additional features on top of the base carbon dialog:
    - adds header.helpText prop to explain dialog
    - adds type prop for warning and error type dialogs
    - adds isLarge prop for large and small class styling dialogs
    - adds isFetchingData props for loading state
    - adds error and dataError prop to display notification about error at bottom of dialog
    - if submitFailed prop, it will find and scroll the failing carbon element into view
    - stops submission of the dialog if the invalid prop is true
    - shows spinner on primary dialog button if sendingData prop is true
        
We also prevent the dialog from closing if you click outside it.
This dialog can be decorated by reduxDialog HoC and/or reduxForm HoC to automatically populate the fields below marked as
REDUXFORM or REDUXDIALOG`,
  })
  .add('warning dialog', () => (
    <BaseModal
      type="warn"
      header={{
        label: 'Scary Operation',
        title: 'Delete Stuff',
        helpText: 'Deleting stuff can be hazardous to your health..',
      }}
      footer={{ onSubmit: action('submit') }}
      onClose={action('close')}
    />
  ))
  .add('big modal', () => (
    <BaseModal
      isLarge
      header={{
        label: 'Big Modal',
        title: 'Needs a lot of space to contain all the info',
      }}
      footer={{ onSubmit: action('submit') }}
      onClose={action('close')}
    />
  ))
  .add('fetching data', () => (
    <BaseModal isFetchingData onClose={action('close')} />
  ))
  .add('error states', () => (
    <BaseModal
      dataError="Error sending data to server"
      header={{
        label: 'DataError',
        title: 'Cannot communicate with server',
      }}
      footer={{ onSubmit: action('submit') }}
      onClose={action('close')}
    />
  ));
