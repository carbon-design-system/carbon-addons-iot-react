import React from 'react';
import { render } from 'enzyme';
/* eslint-disable */
import AAT from '@ibma/aat';

import AddCard from '../components/AddCard';
import Button from '../components/Button';

describe('a11y scan', () => {
  it('Button', done => {
    const wrapper = render(<Button>Label</Button>);

    AAT.getCompliance(wrapper.html(), 'Button', data => {
      expect(AAT.assertCompliance(data)).toEqual(0);
      done();
    });
  });

  it('AddCard', done => {
    const wrapper = render(<AddCard />);

    AAT.getCompliance(wrapper.html(), 'AddCard', data => {
      expect(AAT.assertCompliance(data)).toEqual(0);
      done();
    });
  });
});
