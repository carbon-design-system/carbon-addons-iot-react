import React from 'react';
import { render } from '@testing-library/react';

import SimpleList from './SimpleList';
import { getListItems } from './SimpleList.story';

describe('SimpleList component tests', () => {
  test('SimpleList gets rendered', () => {
    const renderedElement = render(<SimpleList title="simple list" items={getListItems(5)} />);
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });

  test('pageSize is set to sm', () => {
    const renderedElement = render(
      <SimpleList title="simple list" items={getListItems(5)} pageSize="sm" />
    );
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });

  test('pageSize is set to lg', () => {
    const renderedElement = render(
      <SimpleList title="simple list" items={getListItems(5)} pageSize="lg" />
    );
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });

  test('pageSize is set to lg', () => {
    const renderedElement = render(
      <SimpleList title="simple list" items={getListItems(5)} pageSize="xl" />
    );
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });
});
