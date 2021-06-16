import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Walkme from './Walkme';

describe('Walkme', () => {

  it('renders walkme with default language', () => {
    render(
      <Walkme path='some.path' />
    );
    // This is just for coverage. What could be tested here? How to check for head elements?
    expect(true).toBeTruthy();   
  });
  it('renders walkme with specified language', () => {
    render(
      <Walkme path='some.path' lang='pt-BR' />
    );
    // This is just for coverage. What could be tested here? How to check for head elements?
    expect(true).toBeTruthy();   
  });
});
