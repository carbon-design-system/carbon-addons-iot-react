import React from 'react';
import { render } from '@testing-library/react';

import { emptyDOMTree } from '../../../config/testHelpers';

import AddCard from './AddCard';

describe('AddCard', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = emptyDOMTree;
  });

  it('is accessible', async () => {
    const { container } = render(<AddCard title="accessibility test" onClick={() => {}} />, {
      container: document.getElementById('main'),
    });
    await expect(container).toBeAccessible('AddCard is accessible');
  }, 20000);
});
