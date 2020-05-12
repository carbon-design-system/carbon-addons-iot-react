import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Add16, Edit16 } from '@carbon/icons-react';

import ListItem from './ListItem';

describe('ListItem', () => {
  it('test ListItem gets rendered', () => {
    const { getByText } = render(<ListItem id="1" value="test" />);
    expect(getByText('test')).toBeTruthy();
  });

  it('ListItem with large row and secondary value', () => {
    const { getByText } = render(
      <ListItem id="1" value="test" secondaryValue="second" isLargeRow />
    );
    expect(getByText('test')).toBeTruthy();
    expect(getByText('second')).toBeTruthy();
  });

  it('ListItem when isSelectable set to true', () => {
    const onSelect = jest.fn();
    const { getAllByRole } = render(
      <ListItem id="1" value="test" isSelectable onSelect={onSelect} />
    );
    fireEvent.keyPress(getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ListItem when isSelectable is set to true and onClick will trigger onSelect', () => {
    const onSelect = jest.fn();
    const { getAllByRole } = render(<ListItem id="1" value="" isSelectable onSelect={onSelect} />);
    fireEvent.click(getAllByRole('button')[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ListItem when is Expandable set to true', () => {
    const onExpand = jest.fn();
    const { getAllByRole } = render(<ListItem id="1" value="" isExpandable onExpand={onExpand} />);
    fireEvent.keyPress(getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('ListItem when is Expandable set to true and onClick will trigger onExpand', () => {
    const onExpand = jest.fn();
    const { getAllByRole } = render(<ListItem id="1" value="" isExpandable onExpand={onExpand} />);
    fireEvent.click(getAllByRole('button')[0]);
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('ListItem with Icon', () => {
    const onClick = jest.fn();
    const { getByTitle } = render(
      <ListItem
        id="1"
        value="test"
        icon={<Add16 title="iconTitle" onClick={onClick} />}
        iconPosition="left"
      />
    );
    fireEvent.click(getByTitle('iconTitle'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ListItem with rowActions', () => {
    const rowActionOnClick = jest.fn();
    const rowActions = [<Edit16 title="iconTitle" onClick={rowActionOnClick} />];
    const { getByTitle } = render(<ListItem id="1" value="test" rowActions={rowActions} />);
    fireEvent.click(getByTitle('iconTitle'));
    expect(rowActionOnClick).toHaveBeenCalledTimes(1);
  });
});
