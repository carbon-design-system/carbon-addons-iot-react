import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { mount } from 'enzyme';
import aChecker from 'accessibility-checker';
/* eslint-enable import/no-extraneous-dependencies */

import HTMLWrap from '../../a11y/a11y-test-helper';

import AddCard from './AddCard';

describe('AddCard a11y scan', () => {
  it('AddCard is accessible', done => {
    const wrapper = mount(
      <HTMLWrap>
        <AddCard title="a11y test" onClick={() => {}} />
      </HTMLWrap>
    );

    aChecker.getCompliance(wrapper.html(), 'AddCard', data => {
      expect(aChecker.assertCompliance(data)).toEqual(0);
      done();
    });
  }, 20000);
});
