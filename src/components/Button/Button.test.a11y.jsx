import React from 'react';
/* eslint-disable */
import { mount } from 'enzyme';
import AAT from '@ibma/aat';
/* eslint-enable */

import HTMLWrap from '../../a11y/a11y-test-helper';

import Button from './Button';

describe('Button a11y scan', () => {
  it('Button is accessible', done => {
    const wrapper = mount(
      <HTMLWrap>
        <Button onClick={() => {}}>Label</Button>
      </HTMLWrap>
    );

    AAT.getCompliance(wrapper.html(), 'Button', data => {
      expect(AAT.assertCompliance(data)).toEqual(0);
      done();
    });
  });
});
