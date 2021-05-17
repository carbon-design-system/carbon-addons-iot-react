import React from 'react';
import { render } from '@testing-library/react';

import { emptyDOMTree } from '../../../config/testHelpers';

import ListBuilder from './ListBuilder';

describe('ListBuilder', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = emptyDOMTree;
  });

  it('is accessible', async () => {
    const { container } = render(
      <ListBuilder
        onAdd={jest.fn()}
        onRemove={jest.fn()}
        items={[
          {
            id: '1',
            content: {
              value: 'item one',
            },
          },
        ]}
        selectedItems={[{ id: '2', content: { value: 'item two' } }]}
      />,
      {
        container: document.getElementById('main'),
      }
    );
    await expect(container).toBeAccessible('ListBuilder is accessible');
  }, 20000);
});
