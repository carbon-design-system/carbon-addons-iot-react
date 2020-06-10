import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { mount } from 'enzyme';

import ComboBox from './ComboBox';

const props = {
  id: 'comboinput',
  placeholder: 'Filter...',
  titleText: 'Combobox title',
  helperText: 'Optional helper text here',
  onChange: () => {},
};

describe('ComboBox', () => {
  it('adds the text to the dropdown', () => {
    const container = mount(<ComboBox {...props} />);
    const input = container.find('input').first();
    // input.simulate('change', { target: { value: 'My new value' } });
    // input.textContent = 'Test';
    // input.value = 'Test';
    fireEvent.focus(input);
    // fireEvent.keyPress(input, { key: 'd', code: 'KeyD', charCode: 68 });
    input.simulate('keydown', { key: 'Enter', code: 13, charCode: 13 });
    expect(container.find('.iot--combobox-tags').children.length).toEqual(1);
  });
});
