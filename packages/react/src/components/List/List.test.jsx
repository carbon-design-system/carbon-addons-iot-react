import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from '../Checkbox';
import { settings } from '../../constants/Settings';
import { EditingStyle } from '../../utils/DragAndDropUtils';

import List, { UnconnectedList } from './List';
import { sampleHierarchy } from './List.story';
import { getListItems } from './List.test.helpers';

const { prefix, iotPrefix } = settings;
const defaultEmptyText = 'No list items to show';

describe('List', () => {
  it('should be selectable by testId', () => {
    render(
      <List
        title="list"
        items={getListItems(5)}
        search={{
          onChange: jest.fn(),
        }}
        testId="LIST"
      />
    );
    expect(screen.getByTestId('LIST')).toBeDefined();
    expect(screen.getByTestId('LIST-header')).toBeDefined();
    expect(screen.getByTestId('LIST-header-search-input')).toBeDefined();
  });

  it('List when pagination is null', () => {
    const renderedElement = render(<UnconnectedList title="list" items={getListItems(5)} />);
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });

  it('List to have default handleSelect', () => {
    const onSelect = jest.fn();
    const items = [
      ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
        id: team,
        isCategory: true,
        content: {
          value: team,
        },
        children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
          id: `${team}_${player}`,
          content: {
            value: player,
            secondaryValue: sampleHierarchy.MLB['American League'][team][player],
          },
          isSelectable: true,
        })),
      })),
      ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
        id: team,
        isCategory: true,
        content: {
          value: team,
        },
        children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
          id: `${team}_${player}`,
          content: {
            value: player,
            secondaryValue: sampleHierarchy.MLB['National League'][team][player],
          },
          isSelectable: true,
        })),
      })),
    ];
    const { rerender } = render(
      <UnconnectedList
        title="list"
        items={items}
        expandedIds={['New York Yankees', 'Atlanta Braves']}
        handleSelect={onSelect}
      />
    );
    userEvent.click(screen.getByText('DJ LeMahieu'));
    expect(onSelect).toHaveBeenCalledWith('New York Yankees_DJ LeMahieu', 'New York Yankees');

    jest.spyOn(UnconnectedList.defaultProps, 'handleSelect');
    rerender(
      <UnconnectedList
        title="list"
        items={items}
        expandedIds={['New York Yankees', 'Atlanta Braves']}
      />
    );
    userEvent.click(screen.getByText('Luke Voit'));
    expect(UnconnectedList.defaultProps.handleSelect).toHaveBeenCalledWith(
      'New York Yankees_Luke Voit',
      'New York Yankees'
    );
    jest.resetAllMocks();
  });

  it('List to have default toggleExpansion', () => {
    const onExpanded = jest.fn();
    const items = [
      ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
        id: team,
        isCategory: true,
        content: {
          value: team,
        },
        children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
          id: `${team}_${player}`,
          content: {
            value: player,
            secondaryValue: sampleHierarchy.MLB['American League'][team][player],
          },
          isSelectable: true,
        })),
      })),
      ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
        id: team,
        isCategory: true,
        content: {
          value: team,
        },
        children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
          id: `${team}_${player}`,
          content: {
            value: player,
            secondaryValue: sampleHierarchy.MLB['National League'][team][player],
          },
          isSelectable: true,
        })),
      })),
    ];
    const { rerender } = render(
      <UnconnectedList title="list" items={items} toggleExpansion={onExpanded} />
    );

    userEvent.click(screen.getAllByTitle('Expand')[0]);
    expect(onExpanded).toHaveBeenCalledWith('Chicago White Sox');
    jest.spyOn(UnconnectedList.defaultProps, 'toggleExpansion');
    rerender(<UnconnectedList title="list" items={items} />);
    userEvent.click(screen.getAllByTitle('Expand')[0]);
    expect(UnconnectedList.defaultProps.toggleExpansion).toHaveBeenCalledWith('Chicago White Sox');
    jest.resetAllMocks();
  });

  it('List when selectedIds is set', () => {
    render(<UnconnectedList title="list" items={getListItems(5)} selectedIds={['1', '2']} />);

    const selected = screen.getAllByTestId('list-item__selected');
    expect(selected).toHaveLength(2);
    expect(selected[0]).toHaveClass(`${iotPrefix}--list-item__selected`);
    expect(selected[0]).toHaveTextContent('Item 1');
    expect(selected[1]).toHaveClass(`${iotPrefix}--list-item__selected`);
    expect(selected[1]).toHaveTextContent('Item 2');
  });

  it('List hasChildren and expanded', () => {
    render(
      <List
        title="list"
        items={[
          ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
              id: `${team}_${player}`,
              content: {
                value: player,
                secondaryValue: sampleHierarchy.MLB['American League'][team][player],
              },
              isSelectable: true,
            })),
          })),
          ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
              id: `${team}_${player}`,
              content: {
                value: player,
                secondaryValue: sampleHierarchy.MLB['National League'][team][player],
              },
              isSelectable: true,
            })),
          })),
        ]}
      />
    );
    expect(screen.getByTitle('Chicago White Sox')).toBeTruthy();
  });

  it('List renders icons', () => {
    render(
      <List
        title="list"
        items={[
          ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
              icon: <Checkbox id={`${team}-checkbox`} name={team} labelText={`${team}`} checked />,
            },
          })),
        ]}
      />
    );
    expect(screen.getByLabelText('Chicago White Sox')).toBeTruthy();
  });
  it('List shows default empty text if not empty state defined', () => {
    render(<List title="list" />);
    expect(screen.getByText(defaultEmptyText)).toBeTruthy();
  });
  it('List shows no empty text if defined', () => {
    render(<List title="list" emptyState="" />);
    expect(screen.queryByText(defaultEmptyText)).toBeNull();
  });
  it('List shows empty text if desired', () => {
    const emptyText = 'empty';
    render(<List title="list" hasEmptyState emptyState={emptyText} />);
    expect(screen.getByText(emptyText)).toBeTruthy();
  });
  it('Renders custom component for empty state', () => {
    const emptyText = 'empty test';
    const emptyComponent = <div data-testid="emptyState">{emptyText}</div>;
    render(<List title="list" hasEmptyState emptyState={emptyComponent} />);
    expect(screen.getByTestId('emptyState').textContent).toEqual(emptyText);
  });

  it('should show skeleton text when loading', () => {
    const { container } = render(<List title="list" items={getListItems(1)} isLoading />);
    expect(container.querySelectorAll(`.${iotPrefix}--list--skeleton`)).toHaveLength(1);
  });
  it('should show pagination only after loaded', () => {
    const onPage = jest.fn();
    const { container, rerender } = render(
      <List
        title="list"
        items={getListItems(8)}
        isLoading
        pagination={{ page: 1, totalItems: 8, maxPage: 2, onPage }}
      />
    );
    expect(container.querySelectorAll(`.${iotPrefix}--list--skeleton`)).toHaveLength(1);
    expect(screen.queryByLabelText('Next page')).toBeNull();
    rerender(
      <List
        title="list"
        items={getListItems(8)}
        isLoading={false}
        pagination={{ page: 1, totalItems: 8, maxPage: 2, onPage }}
      />
    );
    expect(container.querySelectorAll(`.${iotPrefix}--list--skeleton`)).toHaveLength(0);
    expect(screen.getByLabelText('Next page')).toBeVisible();
    userEvent.click(screen.getByLabelText('Next page'));
    expect(onPage).toBeCalledWith(2);
  });
  it('should not call onSelect when editingStyle is set', () => {
    const onSelect = jest.fn();
    render(
      <List
        title="list"
        items={getListItems(1)}
        handleSelect={onSelect}
        editingStyle="single-nesting"
      />
    );
    userEvent.click(screen.getByTitle('Item 1'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should call onSelect when editingStyle is set to multiple', () => {
    const onSelect = jest.fn();
    render(
      <List title="list" items={getListItems(1)} handleSelect={onSelect} editingStyle="multiple" />
    );
    userEvent.click(screen.getByTestId('1-checkbox'));
    expect(onSelect).toHaveBeenCalledWith('1', null);
  });

  it('adds checkboxes when isCheckboxMultiSelect is set to true', () => {
    const onSelect = jest.fn();
    const { container } = render(
      <List title="list" items={getListItems(1)} handleSelect={onSelect} isCheckboxMultiSelect />
    );
    userEvent.click(container.querySelectorAll(`.${prefix}--checkbox-label`)[0]);
    expect(onSelect).toHaveBeenCalledWith('1', null);
  });

  it('sets selected checkboxes when isCheckboxMultiSelect is set to true', () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <List
        title="list"
        items={getListItems(1)}
        handleSelect={onSelect}
        isCheckboxMultiSelect
        selectedIds={['1']}
      />
    );
    expect(screen.getByTestId('1-checkbox')).toBeChecked();

    rerender(
      <List
        title="list"
        items={getListItems(1)}
        handleSelect={onSelect}
        isCheckboxMultiSelect
        selectedIds={[]}
      />
    );
    expect(screen.getByTestId('1-checkbox')).not.toBeChecked();
  });

  it('sets indeterminate checkboxes when isCheckboxMultiSelect is set to true', () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <List
        title="list"
        items={getListItems(1)}
        handleSelect={onSelect}
        isCheckboxMultiSelect
        indeterminateIds={['1']}
      />
    );
    expect(screen.getByTestId('1-checkbox')).toBePartiallyChecked();

    rerender(
      <List
        title="list"
        items={getListItems(1)}
        handleSelect={onSelect}
        isCheckboxMultiSelect
        indeterminateIds={[]}
      />
    );
    expect(screen.getByTestId('1-checkbox')).not.toBePartiallyChecked();
  });

  it('prevents row focus when isCheckboxMultiSelect is true', () => {
    render(<List title="list" items={getListItems(1)} isCheckboxMultiSelect />);
    expect(screen.getByRole('button')).toHaveAttribute('tabIndex', expect.stringMatching('-1'));
  });

  it('calls handleLoadMore when load more row clicked', () => {
    const mockLoadMore = jest.fn();
    const { rerender } = render(
      <List
        title="Sports Teams"
        items={[
          {
            id: 'org',
            content: { value: 'Organization' },
            children: [
              { id: 'site-01', content: { value: 'Site 1' } },
              {
                id: 'site-02',
                content: { value: 'Site 2' },
                children: [
                  { id: 'system-01', content: { value: 'System 1' } },
                  { id: 'system-02', content: { value: 'System 2' } },
                ],
                hasLoadMore: true,
              },
            ],
          },
        ]}
        expandedIds={['org', 'site-02']}
        handleLoadMore={mockLoadMore}
        testId="test-list"
        i18n={{ loadMore: 'Load more...' }}
      />
    );
    expect(mockLoadMore).not.toHaveBeenCalled();
    userEvent.click(screen.getByRole('button', { name: 'Load more...' }));
    expect(mockLoadMore).toHaveBeenCalledWith('site-02');
    expect(mockLoadMore).toHaveBeenCalledTimes(1);

    // Call load more from the top level
    mockLoadMore.mockClear();
    rerender(
      <List
        title="Sports Teams"
        items={[{ id: 'org', content: { value: 'Organization' }, hasLoadMore: true }]}
        handleLoadMore={mockLoadMore}
      />
    );
    expect(mockLoadMore).not.toHaveBeenCalled();
    userEvent.click(screen.getByRole('button', { name: 'Load more...' }));
    expect(mockLoadMore).toHaveBeenCalledWith('org');
    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });
  it(' load more row clicked without handleLoadMore function provided', () => {
    render(
      <List
        title="Sports Teams"
        items={[
          {
            id: 'org',
            content: { value: 'Organization' },
            children: [
              { id: 'site-01', content: { value: 'Site 1' } },
              {
                id: 'site-02',
                content: { value: 'Site 2' },
                children: [
                  { id: 'system-01', content: { value: 'System 1' } },
                  { id: 'system-02', content: { value: 'System 2' } },
                ],
                hasLoadMore: true,
              },
            ],
          },
        ]}
        expandedIds={['org', 'site-02']}
        testId="test-list"
      />
    );
    expect(screen.getAllByText('Load more...')[0]).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Load more...' }));
  });

  it('should show lock icons and prevent rows from being dragged for ids in lockedIds', () => {
    render(<List items={getListItems(2)} editingStyle={EditingStyle.Single} lockedIds={['1']} />);
    expect(
      screen.getByText('Item 1').closest(`.${iotPrefix}--list-item-parent > *`)
    ).not.toHaveAttribute('draggable');

    expect(screen.getByText('Item 1').closest(`.${iotPrefix}--list-item`).firstChild).toHaveClass(
      `${iotPrefix}--list-item--lock`
    );

    expect(
      screen.getAllByText('Item 2')[0].closest(`.${iotPrefix}--list-item-parent > *`)
    ).toHaveAttribute('draggable');
  });

  it('disabled the checkbox of a locked id when using isCheckboxMultiSelect', () => {
    render(<List items={getListItems(1)} isCheckboxMultiSelect lockedIds={['1']} />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  describe('isVirtualList', () => {
    beforeEach(() => {
      jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
        height: 800,
      }));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should be selectable by testId', () => {
      render(
        <List
          title="list"
          items={getListItems(5)}
          search={{
            onChange: jest.fn(),
          }}
          testId="LIST"
          isVirtualList
        />
      );
      expect(screen.getByTestId('LIST')).toBeDefined();
      expect(screen.getByTestId('LIST-header')).toBeDefined();
      expect(screen.getByTestId('LIST-header-search-input')).toBeDefined();
    });

    it('List when pagination is null', () => {
      const renderedElement = render(
        <UnconnectedList title="list" items={getListItems(5)} isVirtualList />
      );
      expect(renderedElement.container.innerHTML).toBeTruthy();
    });

    it('List to have default handleSelect', () => {
      const onSelect = jest.fn();
      const items = [
        ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
              secondaryValue: sampleHierarchy.MLB['American League'][team][player],
            },
            isSelectable: true,
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
              secondaryValue: sampleHierarchy.MLB['National League'][team][player],
            },
            isSelectable: true,
          })),
        })),
      ];
      const { rerender } = render(
        <UnconnectedList
          title="list"
          items={items}
          expandedIds={['New York Yankees', 'Atlanta Braves']}
          handleSelect={onSelect}
          isVirtualList
        />
      );
      userEvent.click(screen.getByText('DJ LeMahieu'));
      expect(onSelect).toHaveBeenCalledWith('New York Yankees_DJ LeMahieu', 'New York Yankees');

      jest.spyOn(UnconnectedList.defaultProps, 'handleSelect');
      rerender(
        <UnconnectedList
          title="list"
          items={items}
          expandedIds={['New York Yankees', 'Atlanta Braves']}
          isVirtualList
        />
      );
      userEvent.click(screen.getByText('Luke Voit'));
      expect(UnconnectedList.defaultProps.handleSelect).toHaveBeenCalledWith(
        'New York Yankees_Luke Voit',
        'New York Yankees'
      );
      jest.resetAllMocks();
    });

    it('List to have default toggleExpansion', () => {
      const onExpanded = jest.fn();
      const items = [
        ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
              secondaryValue: sampleHierarchy.MLB['American League'][team][player],
            },
            isSelectable: true,
          })),
        })),
        ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
          id: team,
          isCategory: true,
          content: {
            value: team,
          },
          children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
            id: `${team}_${player}`,
            content: {
              value: player,
              secondaryValue: sampleHierarchy.MLB['National League'][team][player],
            },
            isSelectable: true,
          })),
        })),
      ];
      const { rerender } = render(
        <UnconnectedList title="list" items={items} toggleExpansion={onExpanded} isVirtualList />
      );

      userEvent.click(screen.getAllByTitle('Expand')[0]);
      expect(onExpanded).toHaveBeenCalledWith('Chicago White Sox');
      jest.spyOn(UnconnectedList.defaultProps, 'toggleExpansion');
      rerender(<UnconnectedList title="list" items={items} isVirtualList />);
      userEvent.click(screen.getAllByTitle('Expand')[0]);
      expect(UnconnectedList.defaultProps.toggleExpansion).toHaveBeenCalledWith(
        'Chicago White Sox'
      );
      jest.resetAllMocks();
    });

    it('List when selectedIds is set', () => {
      render(
        <UnconnectedList
          title="list"
          items={getListItems(5)}
          selectedIds={['1', '2']}
          isVirtualList
        />
      );

      const selected = screen.getAllByTestId('list-item__selected');
      expect(selected).toHaveLength(2);
      expect(selected[0]).toHaveClass(`${iotPrefix}--list-item__selected`);
      expect(selected[0]).toHaveTextContent('Item 1');
      expect(selected[1]).toHaveClass(`${iotPrefix}--list-item__selected`);
      expect(selected[1]).toHaveTextContent('Item 2');
    });

    it('List hasChildren and expanded', () => {
      render(
        <List
          title="list"
          items={[
            ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
              id: team,
              isCategory: true,
              content: {
                value: team,
              },
              children: Object.keys(sampleHierarchy.MLB['American League'][team]).map((player) => ({
                id: `${team}_${player}`,
                content: {
                  value: player,
                  secondaryValue: sampleHierarchy.MLB['American League'][team][player],
                },
                isSelectable: true,
              })),
            })),
            ...Object.keys(sampleHierarchy.MLB['National League']).map((team) => ({
              id: team,
              isCategory: true,
              content: {
                value: team,
              },
              children: Object.keys(sampleHierarchy.MLB['National League'][team]).map((player) => ({
                id: `${team}_${player}`,
                content: {
                  value: player,
                  secondaryValue: sampleHierarchy.MLB['National League'][team][player],
                },
                isSelectable: true,
              })),
            })),
          ]}
          isVirtualList
        />
      );
      expect(screen.getByTitle('Chicago White Sox')).toBeTruthy();
    });

    it('List renders icons', () => {
      render(
        <List
          title="list"
          items={[
            ...Object.keys(sampleHierarchy.MLB['American League']).map((team) => ({
              id: team,
              isCategory: true,
              content: {
                value: team,
                icon: (
                  <Checkbox id={`${team}-checkbox`} name={team} labelText={`${team}`} checked />
                ),
              },
            })),
          ]}
          isVirtualList
        />
      );
      expect(screen.getByLabelText('Chicago White Sox')).toBeTruthy();
    });
    it('List shows default empty text if not empty state defined', () => {
      render(<List title="list" isVirtualList />);
      expect(screen.getByText(defaultEmptyText)).toBeTruthy();
    });
    it('List shows no empty text if defined', () => {
      render(<List title="list" emptyState="" isVirtualList />);
      expect(screen.queryByText(defaultEmptyText)).toBeNull();
    });
    it('List shows empty text if desired', () => {
      const emptyText = 'empty';
      render(<List title="list" hasEmptyState emptyState={emptyText} isVirtualList />);
      expect(screen.getByText(emptyText)).toBeTruthy();
    });
    it('Renders custom component for empty state', () => {
      const emptyText = 'empty test';
      const emptyComponent = <div data-testid="emptyState">{emptyText}</div>;
      render(<List title="list" hasEmptyState emptyState={emptyComponent} isVirtualList />);
      expect(screen.getByTestId('emptyState').textContent).toEqual(emptyText);
    });

    it('should show skeleton text when loading', () => {
      const { container } = render(
        <List title="list" items={getListItems(1)} isLoading isVirtualList />
      );
      expect(container.querySelectorAll(`.${iotPrefix}--list--skeleton`)).toHaveLength(1);
    });
    it('should show pagination only after loaded', () => {
      const onPage = jest.fn();
      const { container, rerender } = render(
        <List
          title="list"
          items={getListItems(8)}
          isLoading
          pagination={{ page: 1, totalItems: 8, maxPage: 2, onPage }}
          isVirtualList
        />
      );
      expect(container.querySelectorAll(`.${iotPrefix}--list--skeleton`)).toHaveLength(1);
      expect(screen.queryByLabelText('Next page')).toBeNull();
      rerender(
        <List
          title="list"
          items={getListItems(8)}
          isLoading={false}
          pagination={{ page: 1, totalItems: 8, maxPage: 2, onPage }}
          isVirtualList
        />
      );
      expect(container.querySelectorAll(`.${iotPrefix}--list--skeleton`)).toHaveLength(0);
      expect(screen.getByLabelText('Next page')).toBeVisible();
      userEvent.click(screen.getByLabelText('Next page'));
      expect(onPage).toBeCalledWith(2);
    });
    it('should not call onSelect when editingStyle is set', () => {
      const onSelect = jest.fn();
      render(
        <List
          title="list"
          items={getListItems(1)}
          handleSelect={onSelect}
          editingStyle="single-nesting"
          isVirtualList
        />
      );
      userEvent.click(screen.getByTitle('Item 1'));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should call onSelect when editingStyle is set to multiple', () => {
      const onSelect = jest.fn();
      render(
        <List
          title="list"
          items={getListItems(1)}
          handleSelect={onSelect}
          editingStyle="multiple"
          isVirtualList
        />
      );
      userEvent.click(screen.getByTestId('1-checkbox'));
      expect(onSelect).toHaveBeenCalledWith('1', null);
    });

    it('adds checkboxes when isCheckboxMultiSelect is set to true', () => {
      const onSelect = jest.fn();
      render(
        <List
          title="list"
          items={getListItems(1)}
          handleSelect={onSelect}
          isCheckboxMultiSelect
          isVirtualList
        />
      );
      userEvent.click(screen.getByTestId('1-checkbox'));
      expect(onSelect).toHaveBeenCalledWith('1', null);
    });

    it('sets selected checkboxes when isCheckboxMultiSelect is set to true', () => {
      const onSelect = jest.fn();
      const { rerender } = render(
        <List
          title="list"
          items={getListItems(1)}
          handleSelect={onSelect}
          isCheckboxMultiSelect
          selectedIds={['1']}
          isVirtualList
        />
      );
      expect(screen.getByTestId('1-checkbox')).toBeChecked();

      rerender(
        <List
          title="list"
          items={getListItems(1)}
          handleSelect={onSelect}
          isCheckboxMultiSelect
          selectedIds={[]}
          isVirtualList
        />
      );
      expect(screen.getByTestId('1-checkbox')).not.toBeChecked();
    });

    it('sets indeterminate checkboxes when isCheckboxMultiSelect is set to true', () => {
      const onSelect = jest.fn();
      const { rerender } = render(
        <List
          title="list"
          items={getListItems(1)}
          handleSelect={onSelect}
          isCheckboxMultiSelect
          indeterminateIds={['1']}
          isVirtualList
        />
      );
      expect(screen.getByTestId('1-checkbox')).toBePartiallyChecked();

      rerender(
        <List
          title="list"
          items={getListItems(1)}
          handleSelect={onSelect}
          isCheckboxMultiSelect
          indeterminateIds={[]}
          isVirtualList
        />
      );
      expect(screen.getByTestId('1-checkbox')).not.toBePartiallyChecked();
    });

    it('prevents row focus when isCheckboxMultiSelect is true', () => {
      render(<List title="list" items={getListItems(1)} isCheckboxMultiSelect isVirtualList />);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', expect.stringMatching('-1'));
    });

    it('calls handleLoadMore when load more row clicked', () => {
      const mockLoadMore = jest.fn();
      const { rerender } = render(
        <List
          title="Sports Teams"
          items={[
            {
              id: 'org',
              content: { value: 'Organization' },
              children: [
                { id: 'site-01', content: { value: 'Site 1' } },
                {
                  id: 'site-02',
                  content: { value: 'Site 2' },
                  children: [
                    { id: 'system-01', content: { value: 'System 1' } },
                    { id: 'system-02', content: { value: 'System 2' } },
                  ],
                  hasLoadMore: true,
                },
              ],
            },
          ]}
          expandedIds={['org', 'site-02']}
          handleLoadMore={mockLoadMore}
          testId="test-list"
          i18n={{ loadMore: 'Load more...' }}
          isVirtualList
        />
      );
      expect(mockLoadMore).not.toHaveBeenCalled();
      userEvent.click(screen.getByRole('button', { name: 'Load more...' }));
      expect(mockLoadMore).toHaveBeenCalledWith('site-02');
      expect(mockLoadMore).toHaveBeenCalledTimes(1);

      mockLoadMore.mockClear();
      rerender(
        <List
          title="Sports Teams"
          items={[{ id: 'org', content: { value: 'Organization' }, hasLoadMore: true }]}
          isVirtualList
          handleLoadMore={mockLoadMore}
        />
      );
      expect(mockLoadMore).not.toHaveBeenCalled();
      userEvent.click(screen.getByRole('button', { name: 'Load more...' }));
      expect(mockLoadMore).toHaveBeenCalledWith('org');
      expect(mockLoadMore).toHaveBeenCalledTimes(1);
    });
    it('should load more row clicked without handleLoadMore function provided', () => {
      render(
        <List
          title="Sports Teams"
          items={[
            {
              id: 'org',
              content: { value: 'Organization' },
              children: [
                { id: 'site-01', content: { value: 'Site 1' } },
                {
                  id: 'site-02',
                  content: { value: 'Site 2' },
                  children: [
                    { id: 'system-01', content: { value: 'System 1' } },
                    { id: 'system-02', content: { value: 'System 2' } },
                  ],
                  hasLoadMore: true,
                },
              ],
            },
          ]}
          expandedIds={['org', 'site-02']}
          testId="test-list"
          isVirtualList
        />
      );
      expect(screen.getAllByText('Load more...')[0]).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: 'Load more...' }));
    });

    it('should pass override props to list content', () => {
      render(
        <List
          title="Override Props"
          items={getListItems(1)}
          testId="test-list"
          isVirtualList
          isLoading
          overrides={{
            content: {
              props: {
                testId: '__test-list-virtual-content__',
              },
            },
          }}
        />
      );
      expect(screen.getByTestId('__test-list-virtual-content__-loading')).toBeInTheDocument();
    });

    it('should show lock icons and prevent rows from being dragged for ids in lockedIds', () => {
      render(
        <List
          items={getListItems(2)}
          isVirtualList
          editingStyle={EditingStyle.Single}
          lockedIds={['1']}
        />
      );
      expect(
        screen.getByText('Item 1').closest(`.${iotPrefix}--list-item-parent > *`)
      ).not.toHaveAttribute('draggable');

      expect(screen.getByText('Item 1').closest(`.${iotPrefix}--list-item`).firstChild).toHaveClass(
        `${iotPrefix}--list-item--lock`
      );

      expect(
        screen.getAllByText('Item 2')[0].closest(`.${iotPrefix}--list-item-parent > *`)
      ).toHaveAttribute('draggable');
    });

    it('disabled the checkbox of a locked id when using isCheckboxMultiSelect', () => {
      render(
        <List items={getListItems(1)} isVirtualList isCheckboxMultiSelect lockedIds={['1']} />
      );
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });
});
