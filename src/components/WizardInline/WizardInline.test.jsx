import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';

import WizardInline from './WizardInline';
import { itemsAndComponents } from './WizardInline.story';

const fakeBlurb = faker.lorem.sentence();

describe('WizardInline tests', () => {
  test('blurb prop', () => {
    let wrapper = shallow(<WizardInline items={itemsAndComponents} />);
    expect(wrapper.find('WizardHeader').prop('blurb')).toEqual(null);
    wrapper = shallow(<WizardInline items={itemsAndComponents} blurb={fakeBlurb} />);
    expect(wrapper.find('WizardHeader').prop('blurb')).toEqual(fakeBlurb);
  });
});
