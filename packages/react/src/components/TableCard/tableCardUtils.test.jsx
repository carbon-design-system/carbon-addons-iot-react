import { render, screen } from '@testing-library/react';

import { createColumnsWithFormattedLinks } from './tableCardUtils';

describe('tableCardUtils', () => {
  it('createColumnsWithFormattedLinks skip encoding', () => {
    const columns = createColumnsWithFormattedLinks([{ linkTemplate: { href: '{myurl}' } }]);
    render(columns[0].renderDataFunction({ value: 'Link', row: { myurl: 'https://www.ibm.com' } }));
    expect(screen.getByText('Link').parentNode.innerHTML).toEqual(
      expect.stringContaining('https://www.ibm.com')
    );
  });
  it('createColumnsWithFormattedLinks encode value', () => {
    const columns = createColumnsWithFormattedLinks([
      { linkTemplate: { href: 'https://www.ibm.com?{asset}' } },
    ]);
    render(columns[0].renderDataFunction({ value: 'Link', row: { asset: 'asset with spaces' } }));
    expect(screen.getByText('Link').parentNode.innerHTML).toEqual(
      expect.stringContaining('https://www.ibm.com?asset%20with%20spaces')
    );
  });
});
