import React from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import { ArchetypeModal, ModalHeader, ModalBody, ModalFooter } from './ArchetypeModal';
import CheckboxList from './CheckboxList';
import CheckboxListItem from './CheckboxListItem';

export default {
  title: '1 - Watson IoT/ArchetypeModal',

  parameters: {
    component: ArchetypeModal,
    docs: {
      page: '',
    },
  },
};

export const ArchetypeModalBlackBox = () => (
  <ArchetypeModal
    // Using the default data format
    data={[{ primaryValue: '1' }, { primaryValue: '2' }]}
    header={{
      label: text('header.label', 'I am a black box label'),
      title: text('header.title', 'A black box modal'),
    }}
    onSubmit={action('submit')}
    onClose={action('close')}
  />
);

ArchetypeModalBlackBox.storyName = 'Archetype Modal black box';

export const ArchetypeModalComposable = () => (
  <ArchetypeModal
    // Using custom data format of which the ArchetypeModal is unaware
    data={[{ customKey: '1' }, { customKey: '2' }]}
    onSubmit={action('submit')}
    onClose={action('close')}
  >
    {({ headerProps, footerProps, checkboxListProps }) => {
      return (
        <>
          <ModalHeader
            // These props can contain customized defaults that this specific
            // implementation of the ComposedModal is using.
            {...headerProps}
            // This prop is set directly on the ModalHeader
            label={text('label', 'I am set directly on the ModalHeader')}
          />
          <ModalBody>
            <CheckboxList
              // We set {data, selectedIds, onChange}
              {...checkboxListProps}
              // We recieve data, { onChange, id, checked }
              // We extract any key we want to use for the data object, here we use customKey
              renderRow={({ customKey }, checkboxListItemProps) => {
                return (
                  // checkboxListItemProps is setting { onChange, id, checked }
                  <CheckboxListItem primaryValue={customKey} {...checkboxListItemProps} />
                );
              }}
            />
          </ModalBody>
          <ModalFooter
            // footerProps is setting { onRequestSubmit, primaryButtonDisabled }
            {...footerProps}
            secondaryButtonText="Cancel"
          />
        </>
      );
    }}
  </ArchetypeModal>
);

ArchetypeModalComposable.storyName = 'Archetype Modal Composable using children';
