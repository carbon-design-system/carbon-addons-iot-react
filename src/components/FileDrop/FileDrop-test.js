import React from 'react';
import { mount } from 'enzyme';

import FileDrop from './FileDrop';

const commonProps = {
  title: 'Upload Files',
  description: 'Any file can be uploaded.  Feel free to upload more than one!',
  buttonLabel: "Try it out!",
  kind: 'browse',
  onData: data => console.log('FileDrop.onData', data),
  onError: err => console.log('FileDrop.onError', err),
};

describe('File Drop', () => {
  test('Browse', () => {
    const wrapper = mount(
      <FileDrop {...commonProps} />
    );
    wrapper.instance().handleClick();
  });
});
