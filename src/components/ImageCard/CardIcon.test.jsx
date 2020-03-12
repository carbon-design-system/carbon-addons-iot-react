import { render } from '@testing-library/react';
import React from 'react';

import CardIcon from './CardIcon';

describe('CardIcon', () => {
  const spy = {};
  beforeAll(() => {
    spy.console = jest.spyOn(console, 'error');
    // globally this is false, but we need it true so the warning pops
    global.__DEV__ = true;
  });
  afterAll(() => {
    spy.console.mockRestore();
    // globally this is false, but we need it true so the warning pops
    global.__DEV__ = false;
  });
  test('validate default', () => {
    render(<CardIcon icon="bogus" title="title" color="#FFFFFF" />);
    expect(spy.console).toHaveBeenCalled();
  });
});
