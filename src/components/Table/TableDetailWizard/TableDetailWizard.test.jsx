import React from 'react';
import { mount } from 'enzyme';

import TableDetailWizard from './TableDetailWizard';
import { itemsAndComponents } from './TableDetailWizard.story';

describe('TableDetailWizard tests', () => {
  test('Error dialog', () => {
    const onClearError = jest.fn();
    const errorString = 'There is an error';

    const wrapper = mount(
      <TableDetailWizard
        currentItemId="step1"
        items={itemsAndComponents}
        title="Create Physical Interface"
        onClose={() => jest.fn()}
        onBack={() => jest.fn()}
        onSubmit={() => jest.fn()}
        error={errorString}
        onClearError={onClearError}
      />
    );
    expect(wrapper.find('NotificationTextDetails').prop('title')).toEqual(errorString);
  });
  test('Handle Clear error', () => {
    const onClearError = jest.fn();
    const errorString = 'There is an error';

    const wrapper = mount(
      <TableDetailWizard
        currentItemId="step1"
        items={itemsAndComponents}
        title="Create Physical Interface"
        onClose={() => jest.fn()}
        onBack={() => jest.fn()}
        onSubmit={() => jest.fn()}
        error={errorString}
        onClearError={onClearError}
      />
    );
    wrapper.find('NotificationButton').simulate('click');
    expect(onClearError.mock.calls).toHaveLength(1);
  });
  test('Handle current item empty', () => {
    const wrapper = mount(
      <TableDetailWizard
        currentItemId=""
        items={itemsAndComponents}
        title="Create Physical Interface"
        onClose={() => jest.fn()}
        onBack={() => jest.fn()}
        onSubmit={() => jest.fn()}
      />
    );
    const element = wrapper.find('ProgressIndicator__StyledProgressIndicator');
    expect(element.prop('currentIndex')).toEqual(0);
  });
});
