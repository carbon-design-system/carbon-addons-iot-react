import React from 'react';
import { render } from '@testing-library/react';

import ListHeader from './ListHeader';

describe('ListHeader tests', () => {
  test('ListHeader gets rendered', () => {
    const renderedElement = render(<ListHeader title="list" i18n="" />);
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });
});
