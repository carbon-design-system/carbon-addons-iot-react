import React from 'react';
import { mount } from 'enzyme';

import WizardInline from './WizardInline';
import { itemsAndComponents } from './WizardInline.story';

describe('WizardInline', () => {
  it('deprecation notice', () => {
    // globally this is false, but we need it true so the warning pops
    const originalDEV = global.__DEV__;
    const originalError = console.error;

    global.__DEV__ = true;
    console.error = jest.fn();

    const wrapper = mount(
      <WizardInline
        title="Wizard Title"
        items={itemsAndComponents}
        currentItemId="step1"
        onClose={() => {}}
        onBack={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(console.error).toHaveBeenCalledWith(
      `Warning: WizardInline component has been deprecated and will be removed in the next release of \`carbon-addons-iot-react\`. \n Refactor to use PageWizard component instead.`
    );
    expect(wrapper.find('WizardInline')).toHaveLength(1);
    // globally this is false, but we need it true so the warning pops
    console.error = originalError;
    global.__DEV__ = originalDEV;
  });
});
