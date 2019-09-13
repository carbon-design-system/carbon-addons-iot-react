import React from 'react';
/* eslint-disable */
import { mount } from 'enzyme';
import AAT from '@ibma/aat';
/* eslint-enable */

import HTMLWrap from '../../a11y/a11y-test-helper';

import AddCard from './AddCard';

describe('AddCard a11y scan', () => {
  it('AddCard is accessible', done => {
    const wrapper = mount(
      <HTMLWrap>
        <AddCard title="a11y test" onClick={() => {}} />
      </HTMLWrap>
    );

    AAT.getCompliance(wrapper.html(), 'AddCard', data => {
      expect(AAT.assertCompliance(data)).toEqual(0);
      done();
    });
  });
});
