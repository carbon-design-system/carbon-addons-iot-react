import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Add16, Edit16 } from '@carbon/icons-react';

import { Tag } from '../../Tag';

import { UnconnectedListItem } from './ListItem';

describe('ListItem', () => {
  it('test ListItem gets rendered', () => {
    render(<UnconnectedListItem id="1" value="some content" />);
    expect(screen.getByText('some content')).toBeTruthy();
  });

  it('ListItem with large row and secondary value', () => {
    render(<UnconnectedListItem id="1" value="some content" secondaryValue="second" isLargeRow />);
    expect(screen.getByText('some content')).toBeTruthy();
    expect(screen.getByText('second')).toBeTruthy();
  });

  it('ListItem when isSelectable set to true', () => {
    const onSelect = jest.fn();
    render(<UnconnectedListItem id="1" value="test" isSelectable onSelect={onSelect} />);
    fireEvent.keyPress(screen.getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ListItem when isSelectable is set to true and onClick will trigger onSelect', () => {
    const onSelect = jest.fn();
    render(<UnconnectedListItem id="1" value="" isSelectable onSelect={onSelect} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ListItem when is Expandable set to true', () => {
    const onExpand = jest.fn();
    render(<UnconnectedListItem id="1" value="" isExpandable onExpand={onExpand} />);
    fireEvent.keyPress(screen.getAllByRole('button')[0], { key: 'Enter', charCode: 13 });
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('ListItem when is Expandable set to true and onClick will trigger onExpand', () => {
    const onExpand = jest.fn();
    render(<UnconnectedListItem id="1" value="" isExpandable onExpand={onExpand} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('ListItem with Icon', () => {
    const onClick = jest.fn();
    render(
      <UnconnectedListItem
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
    render(<UnconnectedListItem id="1" value="test" rowActions={rowActions} />);
    fireEvent.click(screen.getByTitle('iconTitle'));
    expect(rowActionOnClick).toHaveBeenCalledTimes(1);
  });

  it('ListItem with long value has visible rowActions', () => {
    const rowActionOnClick = jest.fn();
    const rowActions = [<Edit16 title="iconTitle" onClick={rowActionOnClick} />];
    render(
      <UnconnectedListItem
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
    const i18nDefaults = UnconnectedListItem.defaultProps.i18n;
    const { rerender } = render(
      <UnconnectedListItem i18n={i18nTest} id="1" value="" isExpandable />
    );
    expect(screen.getByLabelText(i18nTest.close)).toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefaults.close)).not.toBeInTheDocument();

    rerender(<UnconnectedListItem i18n={i18nTest} id="1" value="" isExpandable expanded />);
    expect(screen.getByLabelText(i18nTest.expand)).toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefaults.expand)).not.toBeInTheDocument();
  });

  it('shows Tags when available', () => {
    const tags = [
      <Tag type="blue" title="descriptor" key="tag1">
        my tag 1
      </Tag>,
      <Tag type="red" disabled key="tag2">
        my tag 2
      </Tag>,
    ];
    const { rerender } = render(<UnconnectedListItem id="1" value="test" />);
    expect(screen.queryByText('my tag 1')).not.toBeInTheDocument();
    expect(screen.queryByText('my tag 2')).not.toBeInTheDocument();

    rerender(<UnconnectedListItem id="1" value="test" tags={tags} />);
    expect(screen.getByText('my tag 1')).toBeVisible();
    expect(screen.getByText('my tag 2')).toBeVisible();
  });

  it('ListItem in edit mode', () => {
    render(<UnconnectedListItem id="1" value="test" isEditing />);
    expect(screen.getByTestId('list-item-editable')).toBeTruthy();
  });
});
