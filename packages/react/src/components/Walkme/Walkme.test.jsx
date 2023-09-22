import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Walkme from './Walkme';

describe('Walkme', () => {
  it('renders walkme with default language', async () => {
    render(<Walkme path="/some/path" />);
    // Make sure the scripts in Walkme component were executed
    await waitFor(() => expect(window._walkmeConfig).toEqual({ smartLoad: true }));
    await waitFor(() => expect(window.walkme_get_language()).toEqual(''));
  });
  it('renders walkme with specified language', async () => {
    render(<Walkme path="/some/path" lang="pt-BR" />);
    // Make sure the scripts in Walkme component were executed
    await waitFor(() => expect(window._walkmeConfig).toEqual({ smartLoad: true }));
    await waitFor(() => expect(window.walkme_get_language()).toEqual('pt-BR'));
  });
});
