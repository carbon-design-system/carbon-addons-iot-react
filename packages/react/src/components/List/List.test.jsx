import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from '../..';
import { settings } from '../../constants/Settings';

import List, { UnconnectedList } from './List';
import { sampleHierarchy } from './List.story';

const { iotPrefix } = settings;
const defaultEmptyText = 'No list items to show';

describe('List', () => {
  const getListItems = (num) =>
    Array(num)
      .fill(0)
      .map((i, idx) => ({
        id: (idx + 1).toString(),
        content: { value: `Item ${idx + 1}` },
        isSelectable: true,
      }));

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
        isSelectable
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
        isSelectable
      />
    );
    userEvent.click(screen.getByTestId('1-checkbox'));
    expect(onSelect).toHaveBeenCalledWith('1', null);
  });
});
