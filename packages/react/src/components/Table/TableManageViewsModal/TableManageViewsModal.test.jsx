import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen } from '@testing-library/react';

import TableManageViewsModal from './TableManageViewsModal';

describe('TableManageViewsModal', () => {
  const { i18n } = TableManageViewsModal.defaultProps;
  const actions = {
    onDisplayPublicChange: jest.fn(),
    onSearchChange: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onClearError: jest.fn(),
    onClose: jest.fn(),
  };
  const testID = 'my-modal';

  const testViews = [
    {
      isDeleteable: true,
      isEditable: true,
      description: 'description1',
      id: 'view1',
      title: `myView 1`,
      isPublic: true,
    },
    {
      isDeleteable: false,
      isEditable: false,
      description: 'description2',
      id: 'view2',
      title: `myView 2`,
      isPublic: false,
    },
    {
      isDeleteable: true,
      isEditable: true,
      description: 'description3',
      id: 'view3',
      title: `myView 3`,
      isPublic: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be selectable by testID or testId', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(
      <TableManageViewsModal views={testViews} actions={actions} open testID={testID} />
    );
    expect(screen.getByTestId(testID)).toBeDefined();
    expect(console.error).toHaveBeenCalledWith(
      `Warning: The 'testID' prop has been deprecated. Please use 'testId' instead.`
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'The prop `wrapperClassName` for Checkbox will be deprecated in V11 in favor of `className`. `className` will then be placed on the outer wrapper.'
      )
    );
    console.warn.mockReset();
    console.error.mockReset();

    rerender(
      <TableManageViewsModal views={testViews} actions={actions} open testId={`${testID}-two`} />
    );
    expect(screen.getByTestId(`${testID}-two`)).toBeDefined();
  });

  it('works when action callbacks are missing', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<TableManageViewsModal views={testViews} actions={{}} open testId={testID} />);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed prop type: The prop `actions.onSearchChange` is marked as required'
      )
    );
    console.error.mockReset();

    const editButton = screen.getAllByLabelText(i18n.editIconText)[0];
    fireEvent.click(editButton);
    expect(actions.onEdit).not.toHaveBeenCalled();

    const deleteButton = screen.getAllByLabelText(i18n.deleteIconText)[0];
    fireEvent.click(deleteButton);
    const confirmDeleteButton = screen.getByText(i18n.deleteWarningConfirm);
    fireEvent.click(confirmDeleteButton);
    expect(actions.onDelete).not.toHaveBeenCalled();
  });

  it('shows the search input', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);
    expect(screen.getByPlaceholderText(i18n.searchPlaceholderText)).toBeVisible();
  });

  it('calls the onSearchChange when search field is modified', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);
    const searchField = screen.getByPlaceholderText(i18n.searchPlaceholderText);
    fireEvent.change(searchField, { target: { value: 'testval1' } });
    expect(actions.onSearchChange).toHaveBeenCalledWith('testval1');
  });

  it('lists the views with public/private appended to the titles', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);
    expect(screen.getByText('myView 1 (Public)')).toBeVisible();
    expect(screen.getByText('myView 2 (Private)')).toBeVisible();
    expect(screen.getByText('myView 3 (Private)')).toBeVisible();
  });

  it('calls the onDisplayPublicChange when checkbox Display public views is changed', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);
    const checkbox = screen.getByLabelText(i18n.publicCheckboxLabelText);
    fireEvent.click(checkbox);
    expect(actions.onDisplayPublicChange).toHaveBeenCalledWith(false);
  });

  it('lists the views descriptions', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);
    expect(screen.getByText('description1')).toBeVisible();
    expect(screen.getByText('description2')).toBeVisible();
    expect(screen.getByText('description3')).toBeVisible();
  });

  it('lists shows the delete and edit button per view if applicable', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);
    expect(screen.getAllByLabelText(i18n.editIconText)).toHaveLength(2);
    expect(screen.getAllByLabelText('delete')).toHaveLength(2);
  });

  it('calls edit callback action when edit button is clicked', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);
    const editButton = screen.getAllByLabelText(i18n.editIconText)[0];
    fireEvent.click(editButton);
    expect(actions.onEdit).toHaveBeenCalledWith('view1');
  });

  it('gives user option to cancel when delete button is clicked', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);

    const warningMessage = i18n.deleteWarningTextTemplate('myView 1');

    expect(screen.queryByText(warningMessage)).not.toBeInTheDocument();

    // Triggers warning dialog
    const deleteButton = screen.getAllByLabelText(i18n.deleteIconText)[0];
    fireEvent.click(deleteButton);
    expect(screen.getByText(warningMessage)).toBeVisible();

    // Cancels warning dialog
    const confirmCancelButton = screen.getByText(i18n.deleteWarningCancel);
    fireEvent.click(confirmCancelButton);
    expect(actions.onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText(warningMessage)).not.toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked and confirmation is given', () => {
    render(<TableManageViewsModal views={testViews} actions={actions} open testId={testID} />);
    const warningMessage = i18n.deleteWarningTextTemplate('myView 1');

    expect(screen.queryByText(warningMessage)).not.toBeInTheDocument();

    // Triggers warning dialog
    const deleteButton = screen.getAllByLabelText(i18n.deleteIconText)[0];
    fireEvent.click(deleteButton);
    expect(screen.getByText(warningMessage)).toBeVisible();

    // Confirms deletion
    const confirmDeleteButton = screen.getByText(i18n.deleteWarningConfirm);
    fireEvent.click(confirmDeleteButton);
    expect(actions.onDelete).toHaveBeenCalledWith('view1');
  });
});
