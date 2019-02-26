import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FileDrop from './FileDrop';

const FileDropProps = {
  onClick: action('click'),
  title:"Account Photo",
  acceptFiles:[".json"],
  description:"only .json 500kb max file size.",
};



storiesOf('FileDrop', module)
  .add('Non drag drop', () => (
    <FileDrop {...FileDropProps}/>
  ))
  .add('Drag Drop', () => (
    <FileDrop {...FileDropProps} dragDrop/>
  ))
  .add('Drag Drop data', () => (
    <FileDrop
      {...FileDropProps}
      dragDrop
      // onSubmit={action('submit')}
      onData={(data) => {
        window.alert('Data loaded, see console')
        console.log(data)
      }}

    />
  ));
