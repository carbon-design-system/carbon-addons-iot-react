import React from 'react';
import { mount } from 'enzyme';
/* eslint-disable */
import AAT from '@ibma/aat';

import HTMLWrap from '../a11y-test-helper.jsx';
import AddCard from '../../components/AddCard';
import Button from '../../components/Button';

describe('a11y scan', () => {
  it('Button', done => {
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

  it('AddCard', done => {
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
