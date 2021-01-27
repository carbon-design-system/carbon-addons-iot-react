import * as React from 'react';
import { render, screen } from '@testing-library/react';

import Rule from './Rule';
import { generateRule } from './utils';

describe('Rule', () => {
  it('should fallback when i18n is null', async () => {
    const rule = generateRule();
    render(
      <Rule
        rule={rule}
        i18n={null}
        onChange={jest.fn()}
        columns={[{ id: 'column1', name: 'Column 1' }]}
        onAddRule={jest.fn()}
        onRemoveRule={jest.fn()}
      />
    );

    expect(screen.getAllByTestId(`${rule.id}-rule`).length).toEqual(1);
  });
});
