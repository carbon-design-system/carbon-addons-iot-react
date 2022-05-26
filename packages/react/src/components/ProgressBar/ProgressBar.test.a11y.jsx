import React from 'react';
import { render } from '@testing-library/react';

import { emptyDOMTree } from '../../../config/testHelpers';

import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = emptyDOMTree;
  });

  it('is accessible', async () => {
    const { container } = render(<ProgressBar label="A progress bar" value={45} />, {
      container: document.getElementById('main'),
    });
    await expect(container).toBeAccessible('ProgressBar is accessible');
  }, 20000);
});
