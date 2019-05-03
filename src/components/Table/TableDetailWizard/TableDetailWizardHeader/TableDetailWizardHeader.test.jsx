import React from 'react';
import { mount } from 'enzyme';

import TableDetailWizardHeader from './TableDetailWizardHeader';

describe('TableDetailWizardHeader tests', () => {
  test('Close Header', () => {
    const onClose = jest.fn();

    const wrapper = mount(
      <TableDetailWizardHeader title="Create Physical Interface" onClose={onClose} />
    );
    wrapper.find('button[onClick]').simulate('click');
    expect(onClose.mock.calls).toHaveLength(1);
  });
});
