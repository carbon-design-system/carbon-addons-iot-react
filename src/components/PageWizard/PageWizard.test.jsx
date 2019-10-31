import React from 'react';
import { shallow } from 'enzyme';

import { PageWizard } from './PageWizard';
import { content } from './PageWizard.story';

describe('PageWizard tests', () => {
  test('currentStepId prop', () => {
    const wrapper = shallow(<PageWizard currentStepId="step1">{content}</PageWizard>);
    expect(wrapper.find('PageWizardStep').prop('id')).toEqual('step1');
  });
});
