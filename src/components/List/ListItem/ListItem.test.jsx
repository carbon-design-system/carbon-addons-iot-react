import React from 'react';
import { render } from '@testing-library/react';

import ListItem from './ListItem';

describe('SimpleList component tests', () => {
  test('ListItem gets rendered', () => {
    const renderedElement = render(<ListItem id="1" value="" />);
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });
});
