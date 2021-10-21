import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../constants/Settings';
import ListBuilder from '../../ListBuilder/ListBuilder';
import ComposedModal from '../../ComposedModal/ComposedModal';

import TableColumnCustomizationModal from './TableColumnCustomizationModal';
import { generateColumns, getColumns } from './tableColumnCustomizationTestUtils';

const { iotPrefix } = settings;

const getCallbacks = () => ({
  onClose: jest.fn(),
  onChange: jest.fn(),
  onReset: jest.fn(),
  onSave: jest.fn(),
  onLoadMore: jest.fn(),
});

const getDefaultProps = () => ({
  ...getCallbacks(),
  availableColumns: getColumns(),
  initialOrdering: [],
  open: true,
});

describe('TableColumnCustomizationModal', () => {
  // Helper functions to limit queries to the list of available
  // and selected lists respectively
  const withinAvailable = () =>
    within(screen.getByTestId(`table-column-customization-modal-list-builder__all`));
  const withinSelected = () =>
    within(screen.getByTestId(`table-column-customization-modal-list-builder__selected`));

  it('should be selectable by testId', () => {
    const { rerender } = render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        initialOrdering={[{ columnId: 'string' }]}
        hasVisibilityToggle
      />
    );

    expect(screen.getByTestId('table-column-customization-modal')).toBeDefined();
    expect(screen.getByTestId('table-column-customization-modal-list-builder')).toBeDefined();
    expect(screen.getByTestId('table-column-customization-modal-list-builder__all')).toBeDefined();
    expect(
      screen.getByTestId('table-column-customization-modal-list-builder__selected')
    ).toBeDefined();
    expect(
      screen.getByTestId('table-column-customization-modal-list-builder__selected__reset-button')
    ).toBeDefined();
    expect(
      screen.getByTestId('table-column-customization-modal-modal-primary-button')
    ).toBeDefined();
    expect(
      screen.getByTestId('table-column-customization-modal-modal-secondary-button')
    ).toBeDefined();

    expect(
      screen.getByTestId('table-column-customization-modal-list-builder-remove-button-string')
    ).toBeDefined();
    expect(
      screen.getByTestId('table-column-customization-modal-toggle-visibility-button-string')
    ).toBeDefined();

    rerender(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        initialOrdering={[{ columnId: 'string' }]}
      />
    );
    // When hasVisibilityToggle:false the remove button is rendered from within the ListBuilder
    // instead of the TableColumnCustomizationModal so we test for both scenarios.
    expect(
      screen.getByTestId('table-column-customization-modal-list-builder-remove-button-string')
    ).toBeDefined();
  });

  it('it should support i18n for all strings', () => {
    const i18n = {
      availableColumnsLabel: 'test-available-columns-label',
      cancelButtonLabel: 'test-cancel-button-label',
      clearSearchIconDescription: 'clear-search-icon-description',
      closeIconDescription: 'test-close-icon-description',
      collapseIconDescription: 'test-collapse-icon-description',
      expandIconDescription: 'test-expand-icon-description',
      hideIconDescription: 'test-hideIcon-description',
      loadMoreButtonLabel: 'test-load-more-button-label',
      modalTitle: 'test-modal-title',
      modalBody: 'test-modal-body',
      removeIconDescription: 'test-remove-icon-description',
      resetButtonLabel: 'test-reset-button-label',
      saveButtonLabel: 'test-save-button-label',
      searchPlaceholder: 'test-search-placeholder',
      selectedColumnsLabel: 'test-selected-columns-label',
      showIconDescription: 'test-show-icon-description',
    };

    const { rerender } = render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        availableColumns={generateColumns(13)}
        initialOrdering={[
          { columnId: '1', isHidden: true },
          { columnId: '2' },
          { columnId: '3' },
          { columnId: '4' },
        ]}
        groupMapping={[
          { id: 'groupA', name: 'Group A', columnIds: ['1', '2'] },
          { id: 'groupB', name: 'Group B', columnIds: ['3', '4'] },
        ]}
        hasVisibilityToggle
        i18n={i18n}
      />
    );

    expect(screen.getByText(i18n.availableColumnsLabel)).toBeVisible();
    expect(screen.getByText(i18n.cancelButtonLabel)).toBeVisible();
    expect(screen.getByLabelText(i18n.closeIconDescription)).toBeVisible();
    expect(screen.getAllByLabelText(i18n.hideIconDescription)[0]).toBeVisible();
    expect(screen.getAllByText(i18n.modalTitle)[1]).toBeVisible(); // The first title is just for generating aria-label and is hidden
    expect(screen.getByText(i18n.modalBody)).toBeVisible();
    expect(screen.getAllByText(i18n.removeIconDescription)[0]).toBeVisible();
    expect(screen.getByText(i18n.resetButtonLabel)).toBeVisible();
    expect(screen.getByText(i18n.saveButtonLabel)).toBeVisible();
    expect(screen.getByText(i18n.searchPlaceholder)).toBeVisible();
    expect(screen.getByText(i18n.selectedColumnsLabel)).toBeVisible();
    expect(screen.getByText(i18n.showIconDescription)).toBeVisible();

    // Collapse group B but let Group A stay open to verify expand/collapse i18n
    userEvent.click(screen.getAllByTestId('expand-icon')[1]);
    expect(screen.getByLabelText(i18n.expandIconDescription)).toBeVisible();
    expect(screen.getByLabelText(i18n.collapseIconDescription)).toBeVisible();

    // Render "clear search" button
    userEvent.type(screen.queryByRole('searchbox'), 'x');
    expect(screen.getByLabelText(i18n.clearSearchIconDescription)).toBeVisible();
    userEvent.click(screen.getByLabelText(i18n.clearSearchIconDescription));

    // Render the load more button
    rerender(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        availableColumns={generateColumns(1)}
        hasLoadMore
        i18n={i18n}
      />
    );
    expect(screen.getByText(i18n.loadMoreButtonLabel)).toBeVisible();
  });

  it('supports i18n for empty lists', () => {
    const i18n = {
      availableColumnsEmptyText: 'available-columns-empty-text',
      selectedColumnsEmptyText: 'selected-columns-empty-text',
    };

    render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        availableColumns={[]}
        initialOrdering={[]}
        i18n={i18n}
      />
    );
    expect(screen.getByText(i18n.availableColumnsEmptyText)).toBeVisible();
    expect(screen.getByText(i18n.selectedColumnsEmptyText)).toBeVisible();
  });

  it('should show search field when there are more than 12 available columns', () => {
    const { rerender } = render(<TableColumnCustomizationModal {...getDefaultProps()} />);
    expect(screen.queryByRole('searchbox')).toBeNull();
    rerender(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        availableColumns={generateColumns(13)}
      />
    );
    expect(withinAvailable().getByRole('searchbox')).toBeVisible();
  });

  it('should filter columns using search string', () => {
    const { i18n } = TableColumnCustomizationModal.defaultProps;
    render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        availableColumns={generateColumns(13)}
      />
    );
    userEvent.type(screen.queryByRole('searchbox'), '2');

    expect(withinAvailable().getByTitle('Item 2')).toBeVisible();
    expect(withinAvailable().getByTitle('Item 12')).toBeVisible();

    userEvent.click(screen.getByLabelText(i18n.clearSearchIconDescription));
    expect(withinAvailable().getByTitle('Item 1')).toBeVisible();
  });

  it('should render preselected items in both lists', () => {
    render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        initialOrdering={[{ columnId: 'string' }, { columnId: 'date' }]}
      />
    );

    expect(withinSelected().queryAllByText('String')).not.toHaveLength(0);

    expect(withinSelected().queryAllByText('Date')).not.toHaveLength(0);

    expect(withinAvailable().getByTitle('String')).toBeVisible();

    expect(withinAvailable().getByTitle('Date')).toBeVisible();

    expect(withinAvailable().getByTestId('string-checkbox')).toBeChecked();

    expect(withinAvailable().getByTestId('date-checkbox')).toBeChecked();
  });

  it('should handle deselecting items by clicking the deselect button', () => {
    render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        initialOrdering={[{ columnId: 'string' }, { columnId: 'date' }]}
      />
    );

    expect(withinSelected().queryAllByText('String')).not.toHaveLength(0);

    expect(withinAvailable().getByTestId('string-checkbox')).toBeChecked();

    userEvent.click(
      screen.getByTestId('table-column-customization-modal-list-builder-remove-button-string')
    );

    expect(withinSelected().queryAllByText('String')).toHaveLength(0);

    expect(withinAvailable().getByTestId('string-checkbox')).not.toBeChecked();
  });

  it('should handle deselecting items by unchecking the checkbox in available columns', () => {
    render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        initialOrdering={[{ columnId: 'string' }, { columnId: 'date' }]}
      />
    );

    expect(withinSelected().queryAllByText('String')).not.toHaveLength(0);

    expect(withinAvailable().getByTestId('string-checkbox')).toBeChecked();

    userEvent.click(withinAvailable().getByTestId('string-checkbox'));

    expect(withinSelected().queryAllByText('String')).toHaveLength(0);

    expect(withinAvailable().getByTestId('string-checkbox')).not.toBeChecked();
  });

  it('should select a column by clicking the checkbox in available columns', () => {
    render(<TableColumnCustomizationModal {...getDefaultProps()} />);

    expect(withinSelected().queryAllByText('String')).toHaveLength(0);
    expect(withinAvailable().getByTestId('string-checkbox')).not.toBeChecked();

    userEvent.click(screen.getByTestId('string-checkbox'));

    expect(withinSelected().queryAllByText('String')).not.toHaveLength(0);
    expect(withinAvailable().getByTestId('string-checkbox')).toBeChecked();
  });

  it('should select a column by clicking the row in available columns', () => {
    render(<TableColumnCustomizationModal {...getDefaultProps()} />);

    expect(withinSelected().queryAllByText('String')).toHaveLength(0);
    expect(withinAvailable().getByTestId('string-checkbox')).not.toBeChecked();

    userEvent.click(withinAvailable().getByTitle('String'));

    expect(withinSelected().queryAllByText('String')).not.toHaveLength(0);
    expect(withinAvailable().getByTestId('string-checkbox')).toBeChecked();
  });

  it('calls onChange when selecting and deselecting a column', () => {
    const defaultProps = getDefaultProps();
    render(<TableColumnCustomizationModal {...defaultProps} />);

    expect(defaultProps.onChange).not.toHaveBeenCalled();

    userEvent.click(withinAvailable().getByTitle('String'));

    expect(defaultProps.onChange).toHaveBeenCalledWith('select', 'string');
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);

    // Deselect from the selected list
    userEvent.click(
      screen.getByTestId('table-column-customization-modal-list-builder-remove-button-string')
    );

    expect(defaultProps.onChange).toHaveBeenCalledWith('deselect', 'string');
    expect(defaultProps.onChange).toHaveBeenCalledTimes(2);

    defaultProps.onChange.mockClear();
    userEvent.click(withinAvailable().getByTitle('String'));
    expect(defaultProps.onChange).toHaveBeenCalledWith('select', 'string');
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);

    // Deselect from the available list
    userEvent.click(withinAvailable().getByTitle('String'));
    expect(defaultProps.onChange).toHaveBeenCalledWith('deselect', 'string');
    expect(defaultProps.onChange).toHaveBeenCalledTimes(2);
  });

  it('calls onChange when toggling visibility of a column', () => {
    const defaultProps = getDefaultProps();
    render(
      <TableColumnCustomizationModal
        hasVisibilityToggle
        {...defaultProps}
        initialOrdering={[{ columnId: 'string' }]}
      />
    );

    expect(defaultProps.onChange).not.toHaveBeenCalled();

    userEvent.click(
      screen.getByTestId('table-column-customization-modal-toggle-visibility-button-string')
    );

    expect(defaultProps.onChange).toHaveBeenCalledWith('hide', 'string');
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);

    userEvent.click(
      screen.getByTestId('table-column-customization-modal-toggle-visibility-button-string')
    );
    expect(defaultProps.onChange).toHaveBeenCalledWith('show', 'string');
    expect(defaultProps.onChange).toHaveBeenCalledTimes(2);
  });

  it('calls onReset when the reset button is clicked', () => {
    const defaultProps = getDefaultProps();
    const { i18n } = TableColumnCustomizationModal.defaultProps;
    render(<TableColumnCustomizationModal {...defaultProps} />);

    expect(defaultProps.onReset).not.toHaveBeenCalled();
    userEvent.click(screen.getByRole('button', { name: i18n.resetButtonLabel }));
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  it('does not break without non mandatory callbacks', () => {
    const defaultProps = getDefaultProps();
    const { i18n } = TableColumnCustomizationModal.defaultProps;
    defaultProps.availableColumns = defaultProps.availableColumns.slice(0, 1);
    delete defaultProps.onChange;
    delete defaultProps.onLoadMore;
    delete defaultProps.onReset;

    render(<TableColumnCustomizationModal {...defaultProps} hasVisibilityToggle hasLoadMore />);

    userEvent.click(screen.getByRole('button', { name: i18n.resetButtonLabel }));

    userEvent.click(withinAvailable().getByTitle('String'));
    userEvent.click(
      screen.getByTestId('table-column-customization-modal-toggle-visibility-button-string')
    );

    userEvent.click(screen.getByText(i18n.loadMoreButtonLabel));

    expect(
      withinSelected().queryByRole('button', {
        name: i18n.showIconDescription,
      })
    ).toBeVisible();
  });

  it('changes the visibility and the "toggle visibility button" when clicked', () => {
    const defaultProps = getDefaultProps();
    const { i18n } = TableColumnCustomizationModal.defaultProps;
    render(
      <TableColumnCustomizationModal
        hasVisibilityToggle
        {...defaultProps}
        initialOrdering={[{ columnId: 'string', isHidden: true }]}
      />
    );

    expect(
      withinSelected().queryByRole('button', {
        name: i18n.showIconDescription,
      })
    ).toBeVisible();

    userEvent.click(
      screen.getByTestId('table-column-customization-modal-toggle-visibility-button-string')
    );

    expect(
      withinSelected().queryByRole('button', {
        name: i18n.showIconDescription,
      })
    ).toBeNull();
    expect(
      withinSelected().queryByRole('button', {
        name: i18n.hideIconDescription,
      })
    ).toBeVisible();
  });

  it('can load more rows', () => {
    const defaultProps = getDefaultProps();
    const { i18n } = TableColumnCustomizationModal.defaultProps;
    const { rerender } = render(
      <TableColumnCustomizationModal
        {...defaultProps}
        availableColumns={generateColumns(1)}
        hasLoadMore
      />
    );
    expect(screen.getByText('Item 1')).toBeVisible();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();

    userEvent.click(screen.getByText(i18n.loadMoreButtonLabel));
    expect(defaultProps.onLoadMore).toHaveBeenCalledWith('1');
    expect(screen.queryByLabelText('Active loading indicator')).not.toBeInTheDocument();

    rerender(
      <TableColumnCustomizationModal
        {...defaultProps}
        availableColumns={generateColumns(1)}
        loadingMoreIds={['1']}
        hasLoadMore
      />
    );

    expect(screen.getByLabelText('Active loading indicator')).toBeInTheDocument();

    rerender(
      <TableColumnCustomizationModal
        {...defaultProps}
        availableColumns={generateColumns(2)}
        hasLoadMore
      />
    );
    expect(screen.queryByLabelText('Active loading indicator')).not.toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeVisible();
    expect(screen.getByText('Item 2')).toBeVisible();
  });

  it('should show lock icon and prevent rows from being dragged for pinned column id', () => {
    render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        availableColumns={generateColumns(2)}
        initialOrdering={[{ columnId: '1' }, { columnId: '2' }]}
        pinnedColumnId="1"
      />
    );
    expect(
      withinSelected().getByText('Item 1').closest(`.${iotPrefix}--list-item-parent > *`)
    ).not.toHaveAttribute('draggable');

    expect(
      withinSelected().getByText('Item 1').closest(`.${iotPrefix}--list-item`).firstChild
    ).toHaveClass(`${iotPrefix}--list-item--lock`);

    expect(
      withinSelected().getAllByText('Item 2')[0].closest(`.${iotPrefix}--list-item-parent > *`)
    ).toHaveAttribute('draggable');
  });

  it('disables the checkbox of a pinned column', () => {
    render(
      <TableColumnCustomizationModal
        {...getDefaultProps()}
        availableColumns={generateColumns(1)}
        initialOrdering={[{ columnId: '1' }]}
        pinnedColumnId="1"
      />
    );
    expect(withinAvailable().getByRole('checkbox')).toBeDisabled();
  });

  it('should save changes to columns', () => {
    const { i18n } = TableColumnCustomizationModal.defaultProps;
    const defaultProps = getDefaultProps();
    render(
      <TableColumnCustomizationModal
        {...defaultProps}
        hasVisibilityToggle
        initialOrdering={[
          { columnId: 'date', isHidden: true },
          { columnId: 'select' },
          { columnId: 'status' },
        ]}
      />
    );

    userEvent.click(
      withinSelected().getByTestId('table-column-customization-modal-toggle-visibility-button-date')
    );
    userEvent.click(
      withinSelected().getByTestId(
        'table-column-customization-modal-toggle-visibility-button-select'
      )
    );

    userEvent.click(
      withinSelected().getByTestId(
        'table-column-customization-modal-list-builder-remove-button-status'
      )
    );

    userEvent.click(withinAvailable().getByTitle('String'));

    userEvent.click(screen.getByRole('button', { name: i18n.saveButtonLabel }));
    expect(defaultProps.onSave).toHaveBeenCalledWith(
      // Corresponds the table prop "view.table.ordering"
      [
        { columnId: 'date', isHidden: false },
        { columnId: 'select', isHidden: true },
        { columnId: 'string', isHidden: false },
      ],
      // Corresponds the table prop "columns"
      [
        { id: 'date', name: 'Date' },
        { id: 'select', name: 'Select' },
        { id: 'string', name: 'String' },
      ]
    );
  });

  it('allow overrides using the overrides pattern', () => {
    const defaultProps = getDefaultProps();
    const TestModal = (props) => {
      return <ComposedModal {...props} testId="custom-test-modal" />;
    };
    const TestListBuilder = (props) => {
      return <ListBuilder {...props} testId="custom-test-list-builder" />;
    };

    render(
      <TableColumnCustomizationModal
        {...defaultProps}
        hasVisibilityToggle
        initialOrdering={[]}
        overrides={{
          composedModal: { component: TestModal, props: { footer: <div>test-string</div> } },
          listBuilder: {
            component: TestListBuilder,
            props: { i18n: { allListTitle: () => 'test-title' } },
          },
        }}
      />
    );
    expect(screen.getByTestId('custom-test-modal')).toBeVisible();
    expect(screen.getByText('test-string')).toBeVisible();
    expect(screen.getByTestId('custom-test-list-builder')).toBeVisible();
    expect(screen.getByText('test-title')).toBeVisible();
  });

  describe('Groups', () => {
    it('should render groups as expanded on init', () => {
      render(
        <TableColumnCustomizationModal
          {...getDefaultProps()}
          groupMapping={[
            { id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] },
            {
              id: 'groupB',
              name: 'Group B',
              columnIds: ['secretField', 'status', 'number', 'boolean'],
            },
          ]}
          initialOrdering={[
            { columnId: 'string' },
            { columnId: 'date' },
            { columnId: 'select' },
            { columnId: 'secretField' },
            { columnId: 'status' },
            { columnId: 'number' },
          ]}
        />
      );
      expect(withinSelected().getByTitle('Group A')).toBeVisible();
      expect(withinSelected().getAllByText('Date')[0]).toBeVisible();
      expect(withinSelected().getAllByText('Select')[0]).toBeVisible();
      expect(withinSelected().getByTitle('Group B')).toBeVisible();
      expect(withinSelected().getAllByText('Secret Information')[1]).toBeVisible();
      expect(withinSelected().getAllByText('Status')[1]).toBeVisible();
      expect(withinSelected().getAllByText('Number')[1]).toBeVisible();
      expect(withinSelected().queryAllByText('Boolean')).toHaveLength(0);

      // Collapse group B
      userEvent.click(screen.getAllByRole('button', { name: 'Collapse' })[1]);
      expect(withinSelected().queryAllByText('Secret Information')).toHaveLength(0);
      expect(withinSelected().queryAllByText('Status')).toHaveLength(0);
      expect(withinSelected().queryAllByText('Number')).toHaveLength(0);
    });

    it('should render group only if it has selected column(s)', () => {
      const defaultProps = getDefaultProps();
      render(
        <TableColumnCustomizationModal
          {...defaultProps}
          groupMapping={[
            { id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] },
            {
              id: 'groupB',
              name: 'Group B',
              columnIds: ['secretField', 'status', 'number', 'boolean'],
            },
          ]}
          initialOrdering={[]}
        />
      );
      expect(withinSelected().queryByTitle('Group A')).toBeNull();

      userEvent.click(withinAvailable().getByTitle('Date'));
      expect(withinSelected().getByTitle('Group A')).toBeVisible();

      userEvent.click(withinSelected().getByTestId('expand-icon'));
      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-list-builder-remove-button-date'
        )
      );
      expect(withinSelected().queryByTitle('Group A')).toBeNull();
    });

    it('supports selecting a column belong to a visible group', () => {
      const defaultProps = getDefaultProps();
      render(
        <TableColumnCustomizationModal
          {...defaultProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[{ columnId: 'date' }]}
        />
      );
      expect(withinSelected().getByTitle('Group A')).toBeVisible();
      expect(withinSelected().queryByTitle('Select')).toBeNull();

      userEvent.click(withinAvailable().getByTitle('Select'));
      expect(withinSelected().queryByTitle('Select')).toBeVisible();
    });

    it('keeps group when a child column is deselected as long as it has more children', () => {
      const defaultProps = getDefaultProps();
      render(
        <TableColumnCustomizationModal
          {...defaultProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[{ columnId: 'date' }, { columnId: 'select' }]}
        />
      );
      expect(withinSelected().getByTitle('Group A')).toBeVisible();
      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-list-builder-remove-button-date'
        )
      );
      expect(withinSelected().queryByTitle('Group A')).toBeVisible();
      expect(withinSelected().queryByText('Date')).toBeNull();
    });

    it('should deselect all columns in a group if the group is deselected', () => {
      const defaultProps = getDefaultProps();
      render(
        <TableColumnCustomizationModal
          {...defaultProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[{ columnId: 'date' }, { columnId: 'select' }]}
        />
      );
      expect(withinSelected().queryByTitle('Group A')).toBeVisible();
      expect(withinSelected().getAllByText('Date')[0]).toBeVisible();
      expect(withinSelected().getAllByText('Select')[0]).toBeVisible();

      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-list-builder-remove-button-groupA'
        )
      );

      expect(withinSelected().queryByTitle('Group A')).toBeNull();
      expect(withinSelected().queryByText('Date')).toBeNull();
      expect(withinSelected().queryByText('Select')).toBeNull();
    });

    it('should mark all columns in a group as hidden if the group visbility is clicked to hide', () => {
      const { i18n } = TableColumnCustomizationModal.defaultProps;
      const defaultProps = getDefaultProps();
      render(
        <TableColumnCustomizationModal
          {...defaultProps}
          hasVisibilityToggle
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[{ columnId: 'date' }, { columnId: 'select' }]}
        />
      );
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-groupA'
        )
      ).toHaveProperty('title', i18n.hideIconDescription);
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-date'
        )
      ).toHaveProperty('title', i18n.hideIconDescription);
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-select'
        )
      ).toHaveProperty('title', i18n.hideIconDescription);

      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-groupA'
        )
      );

      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-groupA'
        )
      ).toHaveProperty('title', i18n.showIconDescription);
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-date'
        )
      ).toHaveProperty('title', i18n.showIconDescription);
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-select'
        )
      ).toHaveProperty('title', i18n.showIconDescription);
    });

    it('should mark group as hidden if all the columns are hidden', () => {
      const { i18n } = TableColumnCustomizationModal.defaultProps;
      const defaultProps = getDefaultProps();
      render(
        <TableColumnCustomizationModal
          {...defaultProps}
          hasVisibilityToggle
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[
            { columnId: 'date', isHidden: true },
            { columnId: 'select', isHidden: true },
          ]}
        />
      );
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-groupA'
        )
      ).toHaveProperty('title', i18n.showIconDescription);
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-date'
        )
      ).toHaveProperty('title', i18n.showIconDescription);
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-select'
        )
      ).toHaveProperty('title', i18n.showIconDescription);

      // Show one columns in the group
      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-date'
        )
      );

      // The group is made visible
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-groupA'
        )
      ).toHaveProperty('title', i18n.hideIconDescription);
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-date'
        )
      ).toHaveProperty('title', i18n.hideIconDescription);
      expect(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-select'
        )
      ).toHaveProperty('title', i18n.showIconDescription);
    });

    it('should save changes to columns that are grouped', () => {
      const { i18n } = TableColumnCustomizationModal.defaultProps;
      const defaultProps = getDefaultProps();
      render(
        <TableColumnCustomizationModal
          {...defaultProps}
          hasVisibilityToggle
          groupMapping={[
            { id: 'groupA', name: 'Group A', columnIds: ['string', 'date', 'select'] },
          ]}
          initialOrdering={[
            { columnId: 'date', isHidden: true },
            { columnId: 'select' },
            { columnId: 'status' },
          ]}
        />
      );

      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-date'
        )
      );
      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-toggle-visibility-button-select'
        )
      );

      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-list-builder-remove-button-status'
        )
      );

      userEvent.click(withinAvailable().getByTitle('String'));

      userEvent.click(screen.getByRole('button', { name: i18n.saveButtonLabel }));
      expect(defaultProps.onSave).toHaveBeenCalledWith(
        // Corresponds the table prop "view.table.ordering"
        [
          { columnId: 'date', isHidden: false },
          { columnId: 'select', isHidden: true },
          { columnId: 'string', isHidden: false },
        ],
        // Corresponds the table prop "columns"
        [
          { id: 'date', name: 'Date' },
          { id: 'select', name: 'Select' },
          { id: 'string', name: 'String' },
        ]
      );
    });
  });

  describe('DEV console warning', () => {
    const originalDev = window.__DEV__;

    beforeAll(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(() => {
      window.__DEV__ = true;
    });

    afterEach(() => {
      console.error.mockClear();
      window.__DEV__ = originalDev;
    });

    afterAll(() => {
      console.error.mockRestore();
    });

    it('should warn on missing referenced columns', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <TableColumnCustomizationModal
          {...getDefaultProps()}
          availableColumns={[]}
          initialOrdering={[{ columnId: 'string' }]}
        />
      );

      expect(console.error).toHaveBeenCalledWith(
        `Warning: Can't find column with id 'string'. Make sure all columns referenced in prop 'initialOrdering' also exists in  prop 'availableColumns'.`
      );
    });
  });
});
