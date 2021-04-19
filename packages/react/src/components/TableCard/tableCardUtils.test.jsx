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
  it('createColumnsWithFormattedLinks encode timestamp value', () => {
    const columns = createColumnsWithFormattedLinks([
      { linkTemplate: { href: 'https://www.ibm.com?{time}' } },
      { dataSourceId: 'time', type: 'TIMESTAMP' },
    ]);
    render(columns[0].renderDataFunction({ value: 'Link', row: { time: 1618431426000 } }));
    expect(screen.getByText('Link').parentNode.innerHTML).toEqual(
      expect.stringContaining('https://www.ibm.com?04%2F14%2F2021%2015%3A17')
    );
  });
});
