import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import ProgressIndicator from './IotProgressIndicator';

const mockItems = [
  {
    id: 'step1',
    label: 'First Step',
    secondaryLabel: 'Optional label',
  },
  {
    id: 'step2',
    label: 'Second Step',
    secondaryLabel: 'Optional label',
    children: [
      { id: 'step2_substep1', label: 'Sub Step 1' },
      { id: 'step2_substep2', label: 'Sub Step 2', secondaryLabel: 'Optional label' },
      { id: 'step2_substep3', label: 'Sub Step 3' },
      { id: 'step2_substep4', label: 'Sub Step 4', invalid: true },
    ],
  },
  { id: 'step3', label: 'Third Step', secondaryLabel: 'Optional label', disabled: true },
  { id: 'step4', label: 'Fourth Step', invalid: true },
  { id: 'step5', label: 'Fifth Step' },
];

test('simulate onClick on clickable', () => {
  render(<ProgressIndicator items={mockItems} clickable />);
  const beforeClick = screen.getByTitle('First Step').children[0];
  // screen.debug(beforeClick);
  screen.getByTestId('step-button-second-step').click();
  // const afterClick = screen.getByTitle('First Step').children[0];
  // screen.debug(afterClick);
  expect(screen.getByTitle('First Step').children[0]).not.toContain(beforeClick);
});

test('check last number of step', () => {
  render(<ProgressIndicator items={mockItems} />);
  // Check if last step is number 5
  expect(screen.getByTitle('Fifth Step').children[0].textContent).toEqual('5');
});
