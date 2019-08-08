import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import ComposedModal from './ComposedModal';

const CustomFooter = styled.div`
   {
    padding: 1rem;
  }
`;

storiesOf('Watson IoT|ComposedModal', module) // Ugh I shouldn't have to add these info here, but it's not being picked up by react-docgen!
  .addParameters({
    info: `Renders a carbon modal dialog.  This dialog adds these additional features on top of the base carbon dialog:
    - adds header.helpText prop to explain dialog
    - adds type prop for warning and error type dialogs
    - adds isLarge prop for large and small class styling dialogs
    - adds isFetchingData props for loading state
    - adds error and dataError prop to display notification about error at bottom of dialog
    - if submitFailed prop, it will find and scroll the failing carbon element into view
    - shows spinner on primary dialog button if sendingData prop is true

We also prevent the dialog from closing if you click outside it.
This dialog can be decorated by reduxDialog HoC and/or reduxForm HoC to automatically populate the fields below marked as
REDUXFORM or REDUXDIALOG`,
  })
  .add('warning dialog', () => (
    <ComposedModal
      type="warn"
      header={{
        label: 'Scary Operation',
        title: 'Delete Stuff',
        helpText: 'Deleting stuff can be hazardous to your health..',
      }}
      onSubmit={action('submit')}
      onClose={action('close')}
    />
  ))
  .add('big modal', () => (
    <ComposedModal
      isLarge
      header={{
        label: 'Big Modal',
        title: 'Needs a lot of space to contain all the info',
      }}
      onSubmit={action('submit')}
      onClose={action('close')}
    >
      Lots of really wide content here...
    </ComposedModal>
  ))
  .add('fetching data', () => <ComposedModal isFetchingData onClose={action('close')} />)
  .add('error states', () => (
    <ComposedModal
      error="Error sending data to server"
      header={{
        label: 'DataError',
        title: 'Cannot communicate with server',
      }}
      onSubmit={action('submit')}
      onClose={action('close')}
      onClearError={action('onClearError')}
    />
  ))
  .add('sending data', () => (
    <ComposedModal
      sendingData
      header={{
        label: 'Sending data',
        title: 'We are submitting data to the backend',
      }}
      onSubmit={action('submit')}
      onClose={action('close')}
    />
  ))
  .add('no footer', () => (
    <ComposedModal
      sendingData
      header={{
        label: 'No footer',
        title: 'Dialog without footer',
      }}
      onClose={action('close')}
    />
  ))
  .add('add translated description', () => (
    <ComposedModal
      sendingData
      iconDescription="Translated string"
      header={{
        label: 'Add translation',
        title: 'Dialog with translated string for close icon',
      }}
      onClose={action('close')}
    />
  ))
  .add('custom footer', () => (
    <ComposedModal
      sendingData
      header={{
        label: 'Custom footer',
        title: 'Custom footer element',
      }}
      footer={<CustomFooter>custom footer element</CustomFooter>}
      onClose={action('close')}
    />
  ))
  .add('i18n', () => (
    <ComposedModal
      footer={{ primaryButtonLabel: 'My Submit', secondaryButtonLabel: 'My Cancel' }}
      onClose={action('close')}
      onSubmit={action('submit')}
    />
  ));
