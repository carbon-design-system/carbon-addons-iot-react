import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardEditorHeader from './DashboardEditorHeader';

const commonProps = {
  title: 'title',
  dashboardJson: {},
};

describe('DashboardEditorHeader', () => {
  it('should be selectable by testId', () => {
    const mockEditTitle = jest.fn();
    render(
      <DashboardEditorHeader
        {...commonProps}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
        onImport={jest.fn()}
        onDelete={jest.fn()}
        onExport={jest.fn()}
        breakpointSwitcher={{
          enabled: true,
        }}
        onEditTitle={mockEditTitle}
        testId="DASHBOARD_EDITOR_HEADER"
      />
    );

    expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER')).toBeDefined();
    expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-file-uploader-button')).toBeDefined();
    expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-breakpoint-switcher')).toBeDefined();
    expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-fit-to-screen-switch')).toBeDefined();
    expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-large-switch')).toBeDefined();
    expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-medium-switch')).toBeDefined();
    expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-small-switch')).toBeDefined();
    expect(screen.getAllByTestId('Button').length).toBeGreaterThan(1);
    // these can be added back in after v3 passes testId to these components and overrides the defaults
    // expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-page-title-bar')).toBeDefined();
    // expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-export-button')).toBeDefined();
    // expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-cancel-button')).toBeDefined();
    // expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-delete-button')).toBeDefined();
    // expect(screen.getByTestId('DASHBOARD_EDITOR_HEADER-submit-button')).toBeDefined();
  });

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
