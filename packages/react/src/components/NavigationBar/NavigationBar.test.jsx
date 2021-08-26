import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NavigationBar from './NavigationBar';

const commonNavigationBarProps = {
  tabs: [
    { id: 'tab1', label: 'tabLabel', 'data-id': 'tab1', children: 'my content' },
    { id: 'tab2', label: 'tabLabel2', 'data-id': 'tab2', children: 'my content2' },
  ],
};

describe('NavigationBar', () => {
  it('should be selectable by testId', () => {
    render(
      <NavigationBar
        {...commonNavigationBarProps}
        testId="navigation_bar"
        actions={[
          {
            id: 'button1',
            children: 'New Entity Type',
            onClick: jest.fn(),
          },
          {
            id: 'button2',
            children: 'Button 2',
            kind: 'secondary',
            onClick: jest.fn(),
          },
        ]}
      />
    );

    expect(screen.getByTestId('navigation_bar')).toBeDefined();
    expect(screen.getByTestId('navigation_bar-tabs')).toBeDefined();
    expect(screen.getByTestId('navigation_bar-actions')).toBeDefined();
    expect(screen.getByTestId('navigation_bar-button-button1')).toBeDefined();
    expect(screen.getByTestId('navigation_bar-button-button2')).toBeDefined();
  });

  it('clicking tab without onSelectionChange callback works', () => {
    render(<NavigationBar {...commonNavigationBarProps} />);
    const tab1 = screen.getByRole('tab', { name: 'tabLabel' });
    userEvent.click(tab1);

    // no exception should be thrown
    expect(screen.getByText('my content')).toBeVisible();
  });

  it('calls onSelectionChange if present', () => {
    const mockSelectionChange = jest.fn();
    render(<NavigationBar {...commonNavigationBarProps} onSelectionChange={mockSelectionChange} />);
    expect(mockSelectionChange).not.toHaveBeenCalled();

    const tab2 = screen.getByRole('tab', { name: /tabLabel2/i });
    userEvent.click(tab2);
    expect(mockSelectionChange).toHaveBeenCalledWith('tab2');
    expect(screen.getByText('my content2')).toBeVisible();
  });

  it('renders workArea', () => {
    render(<NavigationBar {...commonNavigationBarProps} workArea={<div>My work area</div>} />);
    expect(screen.getByText('My work area')).toBeVisible();
  });
});
