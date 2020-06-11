import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

/* eslint-disable import/no-extraneous-dependencies */
import { mount } from 'enzyme';
import aChecker from 'accessibility-checker';
/* eslint-enable import/no-extraneous-dependencies */

import HTMLWrap from '../../a11y/a11y-test-helper';

import Button from './Button';

describe('Button', () => {
  it('is accessible', async () => {
    render(<Button onClick={() => {}}>Label</Button>, { wrapper: HTMLWrap });
    screen.debug();
    await expect(screen).toBeAccessible();
  }, 20000);

  it('Button is accessible (legacy)', done => {
    const wrapper = mount(
      <HTMLWrap>
        <Button onClick={() => {}}>Label</Button>
      </HTMLWrap>
    );

    aChecker.getCompliance(wrapper.html(), 'Button', data => {
      expect(aChecker.assertCompliance(data)).toEqual(0);
      done();
    });
  }, 20000);
});
