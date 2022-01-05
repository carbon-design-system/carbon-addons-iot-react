import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { settings } from '../../../constants/Settings';
import ListBuilder from '../../ListBuilder/ListBuilder';
import ComposedModal from '../../ComposedModal/ComposedModal';

import TableColumnCustomizationModal, {
  defaultProps as realDefaultProps,
} from './TableColumnCustomizationModal';
import AsyncTableColumnCustomizationModal from './AsyncTableColumnCustomizationModal';
import { generateColumns, getColumns } from './tableColumnCustomizationTestUtils';

const { iotPrefix } = settings;

const getCallbacks = () => ({
  onClose: jest.fn(),
  onChange: jest.fn(),
  onReset: jest.fn(),
  onSave: jest.fn(),
  onLoadMore: jest.fn(),
});

const getDefaultTestProps = () => ({
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
        {...getDefaultTestProps()}
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
        {...getDefaultTestProps()}
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

    render(
      <TableColumnCustomizationModal
        {...getDefaultTestProps()}
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
    render(
      <TableColumnCustomizationModal
        {...getDefaultTestProps()}
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
        {...getDefaultTestProps()}
        availableColumns={[]}
        initialOrdering={[]}
        i18n={i18n}
      />
    );
    expect(screen.getByText(i18n.availableColumnsEmptyText)).toBeVisible();
    expect(screen.getByText(i18n.selectedColumnsEmptyText)).toBeVisible();
  });

  it('should show search field when there are more than 12 available columns', () => {
    const { rerender } = render(<TableColumnCustomizationModal {...getDefaultTestProps()} />);
    expect(screen.queryByRole('searchbox')).toBeNull();
    rerender(
      <TableColumnCustomizationModal
        {...getDefaultTestProps()}
        availableColumns={generateColumns(13)}
      />
    );
    expect(withinAvailable().getByRole('searchbox')).toBeVisible();
  });

  it('should filter columns using search string', () => {
    const { i18n } = realDefaultProps;
    render(
      <TableColumnCustomizationModal
        {...getDefaultTestProps()}
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
        {...getDefaultTestProps()}
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
        {...getDefaultTestProps()}
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
        {...getDefaultTestProps()}
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
    render(<TableColumnCustomizationModal {...getDefaultTestProps()} />);

    expect(withinSelected().queryAllByText('String')).toHaveLength(0);
    expect(withinAvailable().getByTestId('string-checkbox')).not.toBeChecked();

    userEvent.click(screen.getByTestId('string-checkbox'));

    expect(withinSelected().queryAllByText('String')).not.toHaveLength(0);
    expect(withinAvailable().getByTestId('string-checkbox')).toBeChecked();
  });

  it('should select a column by clicking the row in available columns', () => {
    render(<TableColumnCustomizationModal {...getDefaultTestProps()} />);

    expect(withinSelected().queryAllByText('String')).toHaveLength(0);
    expect(withinAvailable().getByTestId('string-checkbox')).not.toBeChecked();

    userEvent.click(withinAvailable().getByTitle('String'));

    expect(withinSelected().queryAllByText('String')).not.toHaveLength(0);
    expect(withinAvailable().getByTestId('string-checkbox')).toBeChecked();
  });

  it('calls onChange when selecting and deselecting a column', () => {
    const defaultTestProps = getDefaultTestProps();
    render(<TableColumnCustomizationModal {...defaultTestProps} />);

    expect(defaultTestProps.onChange).not.toHaveBeenCalled();

    userEvent.click(withinAvailable().getByTitle('String'));

    expect(defaultTestProps.onChange).toHaveBeenCalledWith('select', 'string');
    expect(defaultTestProps.onChange).toHaveBeenCalledTimes(1);

    // Deselect from the selected list
    userEvent.click(
      screen.getByTestId('table-column-customization-modal-list-builder-remove-button-string')
    );

    expect(defaultTestProps.onChange).toHaveBeenCalledWith('deselect', 'string');
    expect(defaultTestProps.onChange).toHaveBeenCalledTimes(2);

    defaultTestProps.onChange.mockClear();
    userEvent.click(withinAvailable().getByTitle('String'));
    expect(defaultTestProps.onChange).toHaveBeenCalledWith('select', 'string');
    expect(defaultTestProps.onChange).toHaveBeenCalledTimes(1);

    // Deselect from the available list
    userEvent.click(withinAvailable().getByTitle('String'));
    expect(defaultTestProps.onChange).toHaveBeenCalledWith('deselect', 'string');
    expect(defaultTestProps.onChange).toHaveBeenCalledTimes(2);
  });

  it('calls onChange when toggling visibility of a column', () => {
    const defaultTestProps = getDefaultTestProps();
    render(
      <TableColumnCustomizationModal
        hasVisibilityToggle
        {...defaultTestProps}
        initialOrdering={[{ columnId: 'string' }]}
      />
    );

    expect(defaultTestProps.onChange).not.toHaveBeenCalled();

    userEvent.click(
      screen.getByTestId('table-column-customization-modal-toggle-visibility-button-string')
    );

    expect(defaultTestProps.onChange).toHaveBeenCalledWith('hide', 'string');
    expect(defaultTestProps.onChange).toHaveBeenCalledTimes(1);

    userEvent.click(
      screen.getByTestId('table-column-customization-modal-toggle-visibility-button-string')
    );
    expect(defaultTestProps.onChange).toHaveBeenCalledWith('show', 'string');
    expect(defaultTestProps.onChange).toHaveBeenCalledTimes(2);
  });

  it('calls onReset when the reset button is clicked', () => {
    const defaultTestProps = getDefaultTestProps();
    const { i18n } = realDefaultProps;
    render(<TableColumnCustomizationModal {...defaultTestProps} />);

    expect(defaultTestProps.onReset).not.toHaveBeenCalled();
    userEvent.click(screen.getByRole('button', { name: i18n.resetButtonLabel }));
    expect(defaultTestProps.onReset).toHaveBeenCalled();
  });

  it('does not break without non mandatory callbacks', () => {
    const defaultTestProps = getDefaultTestProps();
    const { i18n } = realDefaultProps;
    defaultTestProps.availableColumns = defaultTestProps.availableColumns.slice(0, 1);
    delete defaultTestProps.onChange;
    delete defaultTestProps.onLoadMore;
    delete defaultTestProps.onReset;

    render(<TableColumnCustomizationModal {...defaultTestProps} hasVisibilityToggle hasLoadMore />);

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
    const defaultTestProps = getDefaultTestProps();
    const { i18n } = realDefaultProps;
    render(
      <TableColumnCustomizationModal
        hasVisibilityToggle
        {...defaultTestProps}
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
    const defaultTestProps = getDefaultTestProps();
    const { i18n } = realDefaultProps;
    const { rerender, container } = render(
      <TableColumnCustomizationModal
        {...defaultTestProps}
        availableColumns={generateColumns(1)}
        hasLoadMore
      />
    );
    expect(screen.getByText('Item 1')).toBeVisible();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();

    userEvent.click(screen.getByText(i18n.loadMoreButtonLabel));
    expect(defaultTestProps.onLoadMore).toHaveBeenCalledWith('1');

    expect(container.querySelectorAll(`.${iotPrefix}--list--load-more-skeleton`)).toHaveLength(0);

    rerender(
      <TableColumnCustomizationModal
        {...defaultTestProps}
        availableColumns={generateColumns(1)}
        loadingMoreIds={['1']}
        hasLoadMore
      />
    );

    expect(container.querySelectorAll(`.${iotPrefix}--list--load-more-skeleton`)).toHaveLength(1);

    rerender(
      <TableColumnCustomizationModal
        {...defaultTestProps}
        availableColumns={generateColumns(2)}
        hasLoadMore
      />
    );
    expect(container.querySelectorAll(`.${iotPrefix}--list--load-more-skeleton`)).toHaveLength(0);
    expect(screen.getByText('Item 1')).toBeVisible();
    expect(screen.getByText('Item 2')).toBeVisible();
  });

  it('should show lock icon and prevent rows from being dragged for pinned column id', () => {
    render(
      <TableColumnCustomizationModal
        {...getDefaultTestProps()}
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
        {...getDefaultTestProps()}
        availableColumns={generateColumns(1)}
        initialOrdering={[{ columnId: '1' }]}
        pinnedColumnId="1"
      />
    );
    expect(withinAvailable().getByRole('checkbox')).toBeDisabled();
  });

  it('should save changes to columns', () => {
    const { i18n } = realDefaultProps;
    const defaultTestProps = getDefaultTestProps();
    render(
      <TableColumnCustomizationModal
        {...defaultTestProps}
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
    expect(defaultTestProps.onSave).toHaveBeenCalledWith(
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
    const defaultTestProps = getDefaultTestProps();
    const TestModal = (props) => {
      return <ComposedModal {...props} testId="custom-test-modal" />;
    };
    const TestListBuilder = (props) => {
      return <ListBuilder {...props} testId="custom-test-list-builder" />;
    };

    render(
      <TableColumnCustomizationModal
        {...defaultTestProps}
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

  it('can render primary and seondary values based on provided keys', () => {
    const defaultTestProps = getDefaultTestProps();
    defaultTestProps.availableColumns = [
      {
        id: 'col1',
        name: 'column 1',
      },
    ];

    const { rerender } = render(
      <TableColumnCustomizationModal {...defaultTestProps} primaryValue="id" />
    );
    expect(screen.getByText('col1')).toBeVisible();
    expect(
      screen.getByText('col1').closest(`.${iotPrefix}--list-item--content--values--main`)
    ).toBeVisible();
    expect(screen.queryByText('column 1')).toBeNull();

    rerender(
      <TableColumnCustomizationModal
        {...defaultTestProps}
        primaryValue="name"
        secondaryValue="id"
      />
    );
    expect(screen.getByText('column 1')).toBeVisible();
    expect(
      screen.getByText('column 1').closest(`.${iotPrefix}--list-item--content--values--main`)
    ).toBeVisible();
    expect(screen.queryByText('col1')).toBeVisible();
  });

  it('renders all rows large when a secondary value is used', () => {
    const defaultTestProps = getDefaultTestProps();
    defaultTestProps.availableColumns = [
      {
        id: 'col1',
        name: 'column 1',
      },
    ];

    const { rerender } = render(<TableColumnCustomizationModal {...defaultTestProps} />);
    expect(screen.getByText('column 1').closest(`.${iotPrefix}--list-item__large`)).toBeNull();

    rerender(<TableColumnCustomizationModal {...defaultTestProps} secondaryValue="id" />);
    expect(screen.getByText('column 1').closest(`.${iotPrefix}--list-item__large`)).toBeVisible();
  });

  describe('Groups', () => {
    it('should render groups as expanded on init', () => {
      render(
        <TableColumnCustomizationModal
          {...getDefaultTestProps()}
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

    it('is possible to expand and collapse groups', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[{ columnId: 'date' }]}
        />
      );
      expect(withinAvailable().getByTitle('Group A')).toBeVisible();
      expect(withinAvailable().getByTitle('Date')).toBeVisible();

      userEvent.click(withinAvailable().getByTestId('expand-icon'));
      expect(withinAvailable().queryByTitle('Date')).toBeNull();

      expect(withinSelected().queryByTitle('Group A')).toBeVisible();
      expect(withinSelected().getByTitle('Date')).toBeVisible();

      userEvent.click(withinSelected().getByTestId('expand-icon'));
      expect(withinSelected().queryByTitle('Date')).toBeNull();

      userEvent.click(withinSelected().getByTestId('expand-icon'));
      expect(withinSelected().getByTitle('Date')).toBeVisible();
    });

    it('shows groups with selected columns as expanded on initial rendering', () => {
      const defaultTestProps = getDefaultTestProps();

      // With initial selection
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
          groupMapping={[
            { id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] },
            {
              id: 'groupB',
              name: 'Group B',
              columnIds: ['secretField', 'status', 'number', 'boolean'],
            },
          ]}
          initialOrdering={[{ columnId: 'date' }]}
        />
      );
      expect(withinAvailable().getByTitle('Group A')).toBeVisible();
      expect(withinAvailable().getByTitle('Date')).toBeVisible();

      expect(withinSelected().getByTitle('Group A')).toBeVisible();
      expect(withinSelected().getByTitle('Date')).toBeVisible();
    });

    it('shows non selected available groups as expanded on initial rendering', () => {
      const defaultTestProps = getDefaultTestProps();
      // With no initial selection
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
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
      expect(withinAvailable().getByTitle('Group A')).toBeVisible();
      expect(withinAvailable().getByTitle('Date')).toBeVisible();
    });

    it('immediately shows selected groups as expanded when a child column is selected', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
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
      expect(withinSelected().getByTitle('Date')).toBeVisible();
    });

    it('should render selected group only if it has selected column(s)', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
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

      userEvent.click(
        withinSelected().getByTestId(
          'table-column-customization-modal-list-builder-remove-button-date'
        )
      );
      expect(withinSelected().queryByTitle('Group A')).toBeNull();
    });

    it('supports selecting a column belonging to a visible group', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[{ columnId: 'date' }]}
        />
      );
      expect(withinSelected().getByTitle('Group A')).toBeVisible();
      expect(withinSelected().queryByTitle('Select')).toBeNull();

      userEvent.click(withinAvailable().getByTitle('Select'));
      expect(withinSelected().queryByTitle('Select')).toBeVisible();
    });

    it('keeps selected group when a child column is deselected as long as it has more children', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
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

    it('selects all child columns when a group is selected', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[]}
        />
      );
      expect(withinSelected().queryByTitle('Group A')).toBeNull();
      expect(withinSelected().queryByTitle('Date')).toBeNull();
      expect(withinSelected().queryByTitle('Select')).toBeNull();

      userEvent.click(withinAvailable().getByTitle('Group A'));

      expect(withinSelected().queryByTitle('Group A')).toBeVisible();
      expect(withinSelected().getByTitle('Date')).toBeVisible();
      expect(withinSelected().getByTitle('Select')).toBeVisible();
    });

    it('corretly sets the available group checkbox state when the user selects columns', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[]}
        />
      );

      expect(withinAvailable().getByTestId('groupA-checkbox')).not.toBeChecked();
      expect(withinAvailable().getByTestId('groupA-checkbox')).not.toBePartiallyChecked();

      userEvent.click(withinAvailable().getByTitle('Date'));
      expect(withinAvailable().getByTestId('groupA-checkbox')).toBePartiallyChecked();

      userEvent.click(withinAvailable().getByTitle('Select'));
      expect(withinAvailable().getByTestId('groupA-checkbox')).toBeChecked();

      userEvent.click(withinAvailable().getByTitle('Date'));
      expect(withinAvailable().getByTestId('groupA-checkbox')).toBePartiallyChecked();

      userEvent.click(withinAvailable().getByTitle('Select'));
      expect(withinAvailable().getByTestId('groupA-checkbox')).not.toBeChecked();
      expect(withinAvailable().getByTestId('groupA-checkbox')).not.toBePartiallyChecked();
    });

    it('does not alter the available group checkbox state on initial rendering if no child columns are selected', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[]}
        />
      );

      expect(withinAvailable().getByTestId('groupA-checkbox')).not.toBeChecked();
      expect(withinAvailable().getByTestId('groupA-checkbox')).not.toBePartiallyChecked();
    });

    it('checks the available group checkbox on initial rendering if all the child columns are selected', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[{ columnId: 'date' }, { columnId: 'select' }]}
        />
      );
      expect(withinAvailable().getByTestId('groupA-checkbox')).toBeChecked();
    });

    it('partially checks the available group checkbox on initial rendering if some of the child columns are selected', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['date', 'select'] }]}
          initialOrdering={[{ columnId: 'date' }]}
        />
      );
      expect(withinAvailable().getByTestId('groupA-checkbox')).toBePartiallyChecked();
    });

    it('should deselect all columns in a group if the group is deselected', () => {
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
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
      const { i18n } = realDefaultProps;
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
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
      const { i18n } = realDefaultProps;
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
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
      const { i18n } = realDefaultProps;
      const defaultTestProps = getDefaultTestProps();
      render(
        <TableColumnCustomizationModal
          {...defaultTestProps}
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
      expect(defaultTestProps.onSave).toHaveBeenCalledWith(
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

    it('should filter grouped columns using search string', () => {
      const { i18n } = realDefaultProps;

      render(
        <TableColumnCustomizationModal
          {...getDefaultTestProps()}
          availableColumns={generateColumns(13)}
          groupMapping={[{ id: 'groupA', name: 'Group A', columnIds: ['1', '2'] }]}
          initialOrdering={[]}
        />
      );
      expect(withinAvailable().getByTitle('Group A')).toBeVisible();

      userEvent.type(screen.queryByRole('searchbox'), '2');
      expect(withinAvailable().getByTitle('Group A')).toBeVisible();
      expect(withinAvailable().getByTitle('Item 2')).toBeVisible();
      expect(withinAvailable().getByTitle('Item 12')).toBeVisible();
      expect(withinAvailable().queryByTitle('Item 1')).toBeNull();
      expect(withinAvailable().queryByTitle('Item 3')).toBeNull();

      userEvent.click(screen.getByLabelText(i18n.clearSearchIconDescription));
      userEvent.type(screen.queryByRole('searchbox'), '3');
      expect(withinAvailable().queryByTitle('Item 3')).toBeVisible();
      expect(withinAvailable().queryByTitle('Group A')).toBeNull();
      expect(withinAvailable().queryByTitle('Item 2')).toBeNull();
      expect(withinAvailable().queryByTitle('Item 1')).toBeNull();

      userEvent.click(screen.getByLabelText(i18n.clearSearchIconDescription));
      expect(withinAvailable().getByTitle('Item 1')).toBeVisible();
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
          {...getDefaultTestProps()}
          availableColumns={[{ id: 'notString', namne: 'not string' }]}
          initialOrdering={[{ columnId: 'string' }]}
        />
      );

      expect(console.error).toHaveBeenCalledWith(
        `Warning: Can't find column with id 'string'. Make sure all columns referenced in prop 'initialOrdering' also exists in  prop 'availableColumns'.`
      );
    });
  });
  describe('AsyncTableColumnCustomizationModal', () => {
    it('shows loading state until availableColumns promise is fulfilled', async () => {
      const columns = getColumns();
      const columnsPromise = new Promise((resolve) => resolve(columns));

      await act(async () => {
        render(
          <AsyncTableColumnCustomizationModal
            {...getDefaultTestProps()}
            availableColumns={columnsPromise}
            initialOrdering={[{ columnId: 'string' }]}
          />
        );
        expect(
          screen.getByRole('button', { name: realDefaultProps.i18n.saveButtonLabel })
        ).toBeDisabled();
        expect(withinAvailable().queryByTitle('String')).toBeNull();
        expect(withinSelected().queryAllByText('String')).toHaveLength(0);
        expect(withinAvailable().getByTestId('list-loading')).toBeVisible();
        expect(withinSelected().getByTestId('list-loading')).toBeVisible();
      });

      expect(
        screen.getByRole('button', { name: realDefaultProps.i18n.saveButtonLabel })
      ).not.toBeDisabled();
      expect(withinAvailable().getByTitle('String')).toBeVisible();
      expect(withinSelected().queryAllByText('String')).not.toHaveLength(0);

      expect(withinAvailable().queryByTestId('list-loading')).toBeNull();
      expect(withinSelected().queryByTestId('list-loading')).toBeNull();
    });
  });

  it('handles states on load more', async () => {
    const defaultTestProps = getDefaultTestProps();
    const { i18n } = realDefaultProps;
    let rerender;
    let container;

    await act(async () => {
      ({ rerender, container } = render(
        <AsyncTableColumnCustomizationModal
          {...defaultTestProps}
          availableColumns={new Promise((resolve) => resolve(generateColumns(1)))}
          initialOrdering={[{ columnId: '1' }]}
          hasLoadMore
        />
      ));
      expect(withinAvailable().getByTestId('list-loading')).toBeVisible();
      expect(withinSelected().getByTestId('list-loading')).toBeVisible();
    });

    // Only one column is loaded
    expect(withinAvailable().getByTitle('Item 1')).toBeVisible();
    expect(withinAvailable().queryByTitle('Item 2')).toBeNull();

    // Make sure column "Item 1" is selected and then deselect it
    expect(withinSelected().queryAllByText('Item 1')).not.toHaveLength(0);
    userEvent.click(
      screen.getByTestId('table-column-customization-modal-list-builder-remove-button-1')
    );
    expect(withinSelected().queryAllByText('Item 1')).toHaveLength(0);

    // Load more columns
    userEvent.click(screen.getByText(i18n.loadMoreButtonLabel));
    expect(defaultTestProps.onLoadMore).toHaveBeenCalledWith('1');

    expect(container.querySelectorAll(`.${iotPrefix}--list--load-more-skeleton`)).toHaveLength(1);

    // Initialordering prop is unchanged like in a real scenario when loading more.
    await act(async () => {
      rerender(
        <AsyncTableColumnCustomizationModal
          {...defaultTestProps}
          availableColumns={new Promise((resolve) => resolve(generateColumns(2)))}
          initialOrdering={[{ columnId: '1' }]}
        />
      );

      // The initial loaders used when both lists where empty are not
      // used when loading more
      expect(withinAvailable().queryByTestId('list-loading')).toBeNull();
      expect(withinSelected().queryByTestId('list-loading')).toBeNull();
    });

    // Additional columns are loaded
    expect(withinAvailable().getByTitle('Item 1')).toBeVisible();
    expect(withinAvailable().getByTitle('Item 2')).toBeVisible();

    // The rerendering does not trigger a selection of columns Initialordering
    expect(withinSelected().queryAllByText('Item 1')).toHaveLength(0);
  });

  it('shows error if promise is rejected', async () => {
    const columnsPromise = new Promise((resolve, reject) => reject(new Error('My error message')));
    const { i18n } = realDefaultProps;

    await act(async () => {
      render(
        <AsyncTableColumnCustomizationModal
          {...getDefaultTestProps()}
          availableColumns={columnsPromise}
        />
      );
      expect(withinAvailable().getByTestId('list-loading')).toBeVisible();
      expect(withinSelected().getByTestId('list-loading')).toBeVisible();
    });

    expect(screen.getByText(/My error message/)).toBeVisible();
    expect(withinAvailable().getByText(i18n.availableColumnsEmptyText)).toBeVisible();
    expect(withinSelected().getByText(i18n.selectedColumnsEmptyText)).toBeVisible();

    expect(withinAvailable().queryByTestId('list-loading')).toBeNull();
    expect(withinSelected().queryByTestId('list-loading')).toBeNull();
  });
});
