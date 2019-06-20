import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';

import WizardInline from './WizardInline';
import { itemsAndComponents } from './WizardInline.story';

const fakeBlurb = faker.lorem.sentence();

describe('WizardInline tests', () => {
  test('blurb prop', () => {
    let wrapper = shallow(
      <WizardInline
        title="Wizard Title"
        items={itemsAndComponents}
        currentItemId="step1"
        onClose={() => {}}
      />
    );
    expect(wrapper.find('WizardHeader').prop('blurb')).toEqual(null);
    wrapper = shallow(
      <WizardInline
        title="Wizard Title"
        items={itemsAndComponents}
        blurb={fakeBlurb}
        currentItemId="step1"
        onClose={() => {}}
      />
    );
    expect(wrapper.find('WizardHeader').prop('blurb')).toEqual(fakeBlurb);
  });
});
