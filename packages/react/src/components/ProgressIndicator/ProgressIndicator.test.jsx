import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import ProgressIndicator from './ProgressIndicator';

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
      {
        id: 'step2_substep2',
        label: 'Sub Step 2',
        secondaryLabel: 'Optional label',
      },
      { id: 'step2_substep3', label: 'Sub Step 3' },
      { id: 'step2_substep4', label: 'Sub Step 4', invalid: true },
    ],
  },
  {
    id: 'step3',
    label: 'Third Step',
    secondaryLabel: 'Optional label',
    disabled: true,
  },
  { id: 'step4', label: 'Fourth Step', invalid: true },
  { id: 'step5', label: 'Fifth Step' },
];

describe('ProgressIndicator', () => {
  it('should be selectable by testId', () => {
    render(<ProgressIndicator items={mockItems} isClickable testId="progress_indicator" />);
    expect(screen.getAllByTestId('progress_indicator')).toBeDefined();
  });

  it('simulate onClick on isClickable', () => {
    render(<ProgressIndicator items={mockItems} isClickable />);
    const beforeClick = screen.getAllByTitle('First Step')[0].children[0];
    screen.getByTestId('iot--progress-step-button-main-second-step').click();
    expect(screen.getAllByTitle('First Step')[0].children[0]).not.toContain(beforeClick);
  });

  it('check last number of step', () => {
    render(<ProgressIndicator items={mockItems} />);
    // Check if last step is number 5
    expect(screen.getAllByTitle('Fifth Step')[0].children[0].textContent).toEqual('5');
  });

  it('handleChange', () => {
    const mockOnClickItem = jest.fn();
    render(<ProgressIndicator items={mockItems} onClickItem={mockOnClickItem} isClickable />);
    screen.getByTestId('iot--progress-step-button-main-second-step').click();
    expect(mockOnClickItem).toHaveBeenCalledWith('step2');
  });

  it('should make steps spaced equally within available flex container ', () => {
    render(<ProgressIndicator items={mockItems} spaceEqually />);
    screen.getAllByRole('listitem').forEach((eachli) => {
      expect(eachli).toHaveStyle(`flex-grow: 1`);
    });
  });
});
