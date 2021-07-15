import React from 'react';
import { screen, render } from '@testing-library/react';

import Hero from './Hero';

describe('Hero', () => {
  it('should be selectable by testId', () => {
    render(<Hero testId="HERO" onClose={jest.fn()} title="title" description="description" />);

    expect(screen.getByTestId('HERO')).toBeDefined();
    expect(screen.getByTestId('HERO-close-button')).toBeDefined();
    expect(screen.getByTestId('HERO-title')).toBeDefined();
    expect(screen.getByTestId('HERO-description')).toBeDefined();
  });
});
