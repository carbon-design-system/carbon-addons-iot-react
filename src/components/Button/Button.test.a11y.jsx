import React from 'react';
import { render } from '@testing-library/react';

import { emptyDOMTree } from '../../../config/testHelpers';

import Button from './Button';

describe('Button', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = emptyDOMTree;
  });

  it('is accessible', async () => {
    const { container } = render(<Button onClick={() => {}}>Label</Button>, {
      container: document.getElementById('main'),
    });
    await expect(container).toBeAccessible('Button is accessible');
  }, 20000);
});
