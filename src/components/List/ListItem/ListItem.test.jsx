import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Add16, Edit16 } from '@carbon/icons-react';
import '@testing-library/jest-dom/extend-expect';

import ListItem from './ListItem';

describe('ListItem', () => {
  it('test ListItem gets rendered', () => {
    render(<ListItem id="1" value="test" />);
    expect(screen.getByText('test')).toBeTruthy();
  });

  it('ListItem with large row and secondary value', () => {
    render(<ListItem id="1" value="test" secondaryValue="second" isLargeRow />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.getByText('second')).toBeTruthy();
  });

  it('ListItem when isSelectable set to true', () => {
    const onSelect = jest.fn();
    render(<ListItem id="1" value="test" isSelectable onSelect={onSelect} />);
    fireEvent.keyPress(screen.getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ListItem when isSelectable is set to true and onClick will trigger onSelect', () => {
    const onSelect = jest.fn();
    render(<ListItem id="1" value="" isSelectable onSelect={onSelect} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ListItem when is Expandable set to true', () => {
    const onExpand = jest.fn();
    render(<ListItem id="1" value="" isExpandable onExpand={onExpand} />);
    fireEvent.keyPress(screen.getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('ListItem when is Expandable set to true and onClick will trigger onExpand', () => {
    const onExpand = jest.fn();
    render(<ListItem id="1" value="" isExpandable onExpand={onExpand} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('ListItem with Icon', () => {
    const onClick = jest.fn();
    render(
      <ListItem
        id="1"
        value="test"
        icon={<Add16 title="iconTitle" onClick={onClick} />}
        iconPosition="left"
      />
    );
    fireEvent.click(screen.getByTitle('iconTitle'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ListItem with rowActions', () => {
    const rowActionOnClick = jest.fn();
    const rowActions = [<Edit16 title="iconTitle" onClick={rowActionOnClick} />];
    render(<ListItem id="1" value="test" rowActions={rowActions} />);
    fireEvent.click(screen.getByTitle('iconTitle'));
    expect(rowActionOnClick).toHaveBeenCalledTimes(1);
  });

  it('ListItem with long value has visible rowActions', () => {
    const rowActionOnClick = jest.fn();
    const rowActions = [<Edit16 title="iconTitle" onClick={rowActionOnClick} />];
    render(
      <ListItem
        id="1"
        value="test value with a really long string to ensure that it stretches the length of the ListItem"
        rowActions={rowActions}
      />
    );
    fireEvent.click(screen.getByTitle('iconTitle'));
    expect(rowActionOnClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTitle('iconTitle')).toBeVisible();
  });

  it('ListItem i18n string test', () => {
    const i18nTest = {
      expand: 'expand',
      close: 'close',
    };
    const i18nDefaults = ListItem.defaultProps.i18n;
    const { rerender } = render(<ListItem i18n={i18nTest} id="1" value="" isExpandable />);
    expect(screen.getByLabelText(i18nTest.close)).toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefaults.close)).not.toBeInTheDocument();

    rerender(<ListItem i18n={i18nTest} id="1" value="" isExpandable expanded />);
    expect(screen.getByLabelText(i18nTest.expand)).toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefaults.expand)).not.toBeInTheDocument();
  });
});
