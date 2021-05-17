import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, object, text } from '@storybook/addon-knobs';
import { OverflowMenu, OverflowMenuItem, Tooltip } from 'carbon-components-react';

import ComposedModal from './ComposedModal';

export default {
  title: '1 - Watson IoT/ComposedModal',

  parameters: {
    component: ComposedModal,

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
  },
};

export const WarningDialog = () => (
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
);

WarningDialog.story = {
  name: 'warning dialog',
};

export const BigModal = () => (
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
);

BigModal.story = {
  name: 'big modal',
};

export const FetchingData = () => <ComposedModal isFetchingData onClose={action('close')} />;

FetchingData.story = {
  name: 'fetching data',
};

export const ErrorStates = () => (
  <ComposedModal
    error="Error sending data to server"
    header={{
      label: 'DataError',
      title: 'Cannot communicate with server',
    }}
    onSubmit={action('submit')}
    onClose={action('close')}
    onClearError={action('onClearError')}
  >
    {text('body content', '')}
  </ComposedModal>
);

ErrorStates.story = {
  name: 'error states',
};

export const SendingData = () => (
  <ComposedModal
    sendingData
    header={{
      label: 'Sending data',
      title: 'We are submitting data to the backend',
    }}
    onSubmit={action('submit')}
    onClose={action('close')}
  />
);

SendingData.story = {
  name: 'sending data',
};

export const NoFooter = () => (
  <ComposedModal
    header={{
      label: 'No footer',
      title: 'Dialog without footer',
    }}
    passiveModal={boolean('passiveModal', true)}
    onSubmit={action('onSubmit')}
    onClose={action('close')}
  />
);

NoFooter.story = {
  name: 'no footer',
};

export const _CustomFooter = () => (
  <ComposedModal
    sendingData
    header={{
      label: 'Custom footer',
      title: 'Custom footer element',
    }}
    footer={
      <div
        style={{
          padding: '2rem',
        }}
      >
        custom footer element
      </div>
    }
    onClose={action('close')}
  />
);

_CustomFooter.story = {
  name: 'custom footer',
};

export const PrimaryButtonIsHidden = () => (
  <ComposedModal
    header={{
      label: 'Custom footer',
      title: 'Custom footer element',
    }}
    footer={object('footer', {
      isPrimaryButtonHidden: true,
      isPrimaryButtonDisabled: false,
    })}
    onClose={action('close')}
  />
);

PrimaryButtonIsHidden.story = {
  name: 'primary button is hidden',
};

export const HeaderCustomNodes = () => (
  <ComposedModal
    header={{
      label: <strong>Custom node label</strong>,
      title: <strong>Custom node title</strong>,
    }}
    onClose={action('close')}
    onSubmit={action('submit')}
  />
);

HeaderCustomNodes.story = {
  name: 'header custom nodes',
};

export const I18N = () => (
  <ComposedModal
    header={{
      label: 'Translated bottom buttons',
      title: 'Dialog with bottom buttons and close button flyover translated',
    }}
    iconDescription="My Close Button"
    footer={{
      primaryButtonLabel: 'My Submit',
      secondaryButtonLabel: 'My Cancel',
    }}
    onClose={action('close')}
    onSubmit={action('submit')}
  />
);

I18N.story = {
  name: 'i18n',
};

export const ComposedModalWithOverflowAndTooltip = () => (
  <ComposedModal
    header={{
      label: 'Translated bottom buttons',
      title: 'Dialog with bottom buttons and close button flyover translated',
    }}
    iconDescription="My Close Button"
    footer={{
      primaryButtonLabel: 'My Submit',
      secondaryButtonLabel: 'My Cancel',
    }}
    onClose={action('close')}
    onSubmit={action('submit')}
  >
    <OverflowMenu title="Test Overflow" iconDescription="Expand">
      <OverflowMenuItem key="default" onClick={action('onClick')} itemText="Click me" />
    </OverflowMenu>
    <Tooltip triggerId="my test tooltip" triggerText="Trigger Text">
      Hi there
    </Tooltip>
  </ComposedModal>
);

ComposedModalWithOverflowAndTooltip.story = {
  name: 'composed modal with overflow and tooltip',
};
