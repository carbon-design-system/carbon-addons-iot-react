import React from 'react';
import { render } from '@testing-library/react';

import List from './List';
import { sampleHierarchy } from './List.story';

describe('List component tests', () => {
  const getListItems = num =>
    Array(num)
      .fill(0)
      .map((i, idx) => ({
        id: idx + 1,
        content: { value: `Item ${idx + 1}` },
        isSelectable: true,
      }));

  test('List when pagination is null', () => {
    const renderedElement = render(<List title="list" items={getListItems(5)} />);
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });

  test('List to have default handleSelect', () => {
    expect(List.defaultProps.handleSelect).toBeDefined();
    List.defaultProps.handleSelect();
  });

  test('List to have default toggleExpansion', () => {
    expect(List.defaultProps.toggleExpansion).toBeDefined();
    List.defaultProps.toggleExpansion();
  });

  test('List when selectedIds is set', () => {
    const renderedElement = render(
      <List title="list" items={getListItems(5)} selectedIds={[1, 2]} />
    );
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });

  test('List hasChildren and expanded', () => {
    const { getByTitle } = render(
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
    expect(getByTitle('Chicago White Sox')).toBeTruthy();
  });
});
