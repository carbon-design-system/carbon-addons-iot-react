import { render, screen } from '@testing-library/react';
import React from 'react';

import CardIcon from './CardIcon';

describe('CardIcon', () => {
  it('validate default', () => {
    const { rerender } = render(<CardIcon icon="help" title="title" color="#FFFFFF" />);
    // Help icon is the defaul used when Icon does not match list. Grabbing the path value
    const defaultIcon = screen.getByRole('img').querySelector('[d]').attributes[0].nodeValue;
    // Pass in bad icon name and check for default icon.
    rerender(<CardIcon icon="bogus" title="title" color="#FFFFFF" />);
    expect(screen.getByRole('img').querySelector('[d]').attributes[0].nodeValue).toEqual(
      defaultIcon
    );
    // Pass in a correct icon value and see that the default is not used.
    rerender(<CardIcon icon="warning" title="title" color="#FFFFFF" />);
    expect(screen.getByRole('img').querySelector('[d]').attributes[0].nodeValue).not.toEqual(
      defaultIcon
    );
  });
});
