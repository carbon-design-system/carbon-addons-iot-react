import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardEditorHeader from './DashboardEditorHeader';

const commonProps = {
  title: 'title',
  dashboardJson: {},
};

describe('DashboardEditorHeader', () => {
  it('trigger edit mode and save new title', () => {
    const mockEditTitle = jest.fn();
    render(<DashboardEditorHeader {...commonProps} onEditTitle={mockEditTitle} />);
    userEvent.click(screen.getByRole('button', { name: 'Edit title' }));
    userEvent.type(screen.getByRole('textbox', { name: 'Dashboard title' }), '25');
    userEvent.click(screen.getByRole('button', { name: 'Save title' }));
    // called with updated title
    expect(mockEditTitle).toHaveBeenCalledWith('title25');
  });
  it('trigger edit mode but cancel', () => {
    const mockEditTitle = jest.fn();
    render(<DashboardEditorHeader {...commonProps} onEditTitle={mockEditTitle} />);
    userEvent.click(screen.getByRole('button', { name: 'Edit title' }));
    userEvent.type(screen.getByRole('textbox', { name: 'Dashboard title' }), '25');
    userEvent.click(screen.getAllByRole('button', { name: 'Cancel' })[0]);
    expect(mockEditTitle).not.toHaveBeenCalled();
    // revert back to original title
    expect(screen.getByRole('heading', { name: 'title' })).not.toBeNull();
  });
});
