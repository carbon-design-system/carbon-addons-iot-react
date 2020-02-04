import React from 'react';
import { render } from '@testing-library/react';

import List from './List';
import { sampleHierarchy } from './List.story';

describe('List component tests', () => {
  test('list gets rendered', () => {
    const renderedElement = render(
      <List
        title="list"
        items={Object.entries(sampleHierarchy.MLB['American League']['New York Yankees']).map(
          ([key]) => ({
            id: key,
            content: { value: key },
          })
        )}
      />
    );
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });
});
