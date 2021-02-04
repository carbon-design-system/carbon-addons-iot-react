import * as React from 'react';
import { render, screen } from '@testing-library/react';

import GroupLogic from './GroupLogic';

describe('GroupLogic', () => {
  it('should fallback when i18n is null', async () => {
    const id = 'render-test';
    render(<GroupLogic id={id} i18n={null} />);

    expect(screen.getByTestId(`${id}-group-logic-dropdown`)).toBeDefined();
    expect((await screen.findAllByText('ALL')).length).toEqual(1);
  });
});
