import React from 'react';
import { mount } from 'enzyme';

import WizardInline from './WizardInline';
import { itemsAndComponents } from './WizardInline.story';

describe('WizardInline', () => {
  it('deprecation notice', () => {
    // globally this is false, but we need it true so the warning pops
    global.__DEV__ = true;

    const spy = jest.spyOn(global.console, 'error');
    const wrapper = mount(
      <WizardInline
        title="Wizard Title"
        items={itemsAndComponents}
        currentItemId="step1"
        onClose={() => {}}
      />
    );
    expect(spy).toHaveBeenCalledWith(
      `Warning: WizardInline component has been deprecated and will be removed in the next release of \`carbon-addons-iot-react\`. \n Refactor to use PageWizard component instead.`
    );
    spy.mockRestore();
    expect(wrapper.find('WizardInline')).toHaveLength(1);
    // globally this is false, but we need it true so the warning pops
    global.__DEV__ = false;
  });
});
