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

  // TODO: write tests that actually test selection
  it('List to have default handleSelect', () => {
    expect(UnconnectedList.defaultProps.handleSelect).toBeDefined();
    UnconnectedList.defaultProps.handleSelect();
  });

  // TODO: write tests that actually test selection
  it('List to have default toggleExpansion', () => {
    expect(UnconnectedList.defaultProps.toggleExpansion).toBeDefined();
    UnconnectedList.defaultProps.toggleExpansion();
  });

  it('List when selectedIds is set', () => {
    const renderedElement = render(
      <UnconnectedList title="list" items={getListItems(5)} selectedIds={['1', '2']} />
    );
    expect(renderedElement.container.innerHTML).toBeTruthy();
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
  it('should not call onSelect when editingStyle is set', () => {
    const onSelect = jest.fn();
    render(<List title="list" items={getListItems(1)} onSelect={onSelect} editingStyle="single" />);
    userEvent.click(screen.getByTitle('Item 1'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
