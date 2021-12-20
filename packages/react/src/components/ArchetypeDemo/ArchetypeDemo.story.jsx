import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

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
            // These props contain customized defaults that this specific
            // implementation of the ComposedModal is using.
            {...headerProps}
            // This prop is set directly on the ModalHeader
            label={text('label', 'I am set directly on the ModalHeader')}
          />
          <ModalBody>
            <CheckboxList
              // Get the wiring of data, selectedIds, onChange for free
              {...checkboxListProps}
              renderRow={({ customKey }, xxx) => {
                return (
                  // checkboxListItemProps gives us the wiring of checked, onChange, id for free
                  <CheckboxListItem primaryValue={customKey} {...xxx} />
                );
              }}
            />
          </ModalBody>
          <ModalFooter {...footerProps} secondaryButtonText="Cancel" />
        </>
      );
    }}
  </ArchetypeModal>
);

ArchetypeModalComposable.storyName = 'Archetype Modal Composable using children';
