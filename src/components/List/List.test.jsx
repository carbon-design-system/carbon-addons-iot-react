import React from 'react';
import { render, screen } from '@testing-library/react';

import List, { UnconnectedList } from './List';
import { sampleHierarchy } from './List.story';

describe('List', () => {
  const getListItems = num =>
    Array(num)
      .fill(0)
      .map((i, idx) => ({
        id: (idx + 1).toString(),
        content: { value: `Item ${idx + 1}` },
        isSelectable: true,
      }));

  it('List when pagination is null', () => {
    const renderedElement = render(<UnconnectedList title="list" items={getListItems(5)} />);
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });

  it('List to have default handleSelect', () => {
    expect(UnconnectedList.defaultProps.handleSelect).toBeDefined();
    UnconnectedList.defaultProps.handleSelect();
  });

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
          ...Object.keys(sampleHierarchy.MLB['American League']).map(team => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['American League'][team]).map(player => ({
              id: `${team}_${player}`,
              content: {
                value: player,
                secondaryValue: sampleHierarchy.MLB['American League'][team][player],
              },
              isSelectable: true,
            })),
          })),
          ...Object.keys(sampleHierarchy.MLB['National League']).map(team => ({
            id: team,
            isCategory: true,
            content: {
              value: team,
            },
            children: Object.keys(sampleHierarchy.MLB['National League'][team]).map(player => ({
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
});
