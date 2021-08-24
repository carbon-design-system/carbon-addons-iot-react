import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Add16, Edit16 } from '@carbon/icons-react';

import { DragAndDrop } from '../../../utils/DragAndDropUtils';
import { Tag } from '../../Tag';
import { settings } from '../../../constants/Settings';

import { UnconnectedListItem } from './ListItem';

const { iotPrefix } = settings;

describe('ListItem', () => {
  const commonProps = {
    itemWillMove: jest.fn(),
    onItemMoved: jest.fn(),
    connectDragSource: jest.fn(),
    connectDragPreview: jest.fn(),
    isDragging: false,
  };

  it('test ListItem gets rendered', () => {
    render(<UnconnectedListItem id="1" value="some content" index={0} {...commonProps} />);
    expect(screen.getByText('some content')).toBeTruthy();
  });

  it('ListItem with large row and secondary value', () => {
    render(
      <UnconnectedListItem
        id="1"
        value="some content"
        secondaryValue="second"
        index={0}
        isLargeRow
        {...commonProps}
      />
    );
    expect(screen.getByText('some content')).toBeTruthy();
    expect(screen.getByText('second')).toBeTruthy();
  });

  it('ListItemWrapper does not show as selected when it has an editingStyle ', () => {
    const onSelect = jest.fn();
    render(
      <UnconnectedListItem
        id="1"
        value="test"
        isSelectable
        onSelect={onSelect}
        index={0}
        editingStyle="multiple"
        {...commonProps}
        selected
      />
    );

    expect(screen.getByRole('button')).not.toHaveClass(`${iotPrefix}--list-item__selected`);
  });

  it('ListItem when isSelectable set to true', () => {
    const onSelect = jest.fn();
    render(
      <UnconnectedListItem
        id="1"
        value="test"
        isSelectable
        onSelect={onSelect}
        index={0}
        {...commonProps}
      />
    );
    fireEvent.keyPress(screen.getAllByRole('button')[0], {
      key: 'Enter',
      charCode: 13,
    });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ListItem when isSelectable is set to true and onClick will trigger onSelect', () => {
    const onSelect = jest.fn();
    render(
      <UnconnectedListItem
        id="1"
        value=""
        isSelectable
        onSelect={onSelect}
        index={0}
        {...commonProps}
      />
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('ListItem when is Expandable set to true', () => {
    const onExpand = jest.fn();
    render(
      <UnconnectedListItem
        id="1"
        value=""
        isExpandable
        onExpand={onExpand}
        index={0}
        {...commonProps}
      />
    );
    fireEvent.keyPress(screen.getAllByRole('button')[0], {
      key: 'Enter',
      charCode: 13,
    });
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('ListItem when is Expandable set to true and onClick will trigger onExpand', () => {
    const onExpand = jest.fn();
    render(
      <UnconnectedListItem
        id="1"
        value=""
        isExpandable
        onExpand={onExpand}
        index={0}
        {...commonProps}
      />
    );
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
        index={0}
        {...commonProps}
      />
    );
    fireEvent.click(screen.getByTitle('iconTitle'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ListItem with rowActions', () => {
    const rowActionOnClick = jest.fn();
    const rowActions = [<Edit16 key="edit" title="iconTitle" onClick={rowActionOnClick} />];
    render(
      <UnconnectedListItem id="1" value="test" rowActions={rowActions} index={0} {...commonProps} />
    );
    fireEvent.click(screen.getByTitle('iconTitle'));
    expect(rowActionOnClick).toHaveBeenCalledTimes(1);
  });

  it('ListItem with long value has visible rowActions', () => {
    const rowActionOnClick = jest.fn();
    const rowActions = [<Edit16 key="edit" title="iconTitle" onClick={rowActionOnClick} />];
    render(
      <UnconnectedListItem
        id="1"
        value="test value with a really long string to ensure that it stretches the length of the ListItem"
        rowActions={rowActions}
        index={0}
        {...commonProps}
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
      <UnconnectedListItem
        i18n={i18nTest}
        id="1"
        value=""
        isExpandable
        index={0}
        {...commonProps}
      />
    );
    expect(screen.getByLabelText(i18nTest.expand)).toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefaults.expand)).not.toBeInTheDocument();

    rerender(
      <UnconnectedListItem
        i18n={i18nTest}
        id="1"
        value=""
        isExpandable
        expanded
        index={0}
        {...commonProps}
      />
    );
    expect(screen.getByLabelText(i18nTest.close)).toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefaults.close)).not.toBeInTheDocument();
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
    const { rerender } = render(
      <UnconnectedListItem id="1" value="test" index={0} {...commonProps} />
    );
    expect(screen.queryByText('my tag 1')).not.toBeInTheDocument();
    expect(screen.queryByText('my tag 2')).not.toBeInTheDocument();

    rerender(<UnconnectedListItem id="1" value="test" tags={tags} index={0} {...commonProps} />);
    expect(screen.getByText('my tag 1')).toBeVisible();
    expect(screen.getByText('my tag 2')).toBeVisible();
  });

  it('ListItem in edit mode', () => {
    render(
      <UnconnectedListItem id="1" value="test" editingStyle="multiple" index={0} {...commonProps} />
    );
    expect(screen.getByTestId('list-item-editable')).toBeTruthy();
  });

  it('ListItem has three targets in nesting mode', () => {
    const listItemProps = {
      id: '1',
      value: 'test',
      editingStyle: 'single-nesting',
      index: 0,
      renderDropTargets: true,
      isDragging: false,
      connectDragSource: jest.fn(),
      connectDragPreview: jest.fn(),
      onItemMoved: jest.fn(),
      itemWillMove: jest.fn(),
    };

    render(
      <DragAndDrop>
        <UnconnectedListItem {...listItemProps} />
      </DragAndDrop>
    );

    const targets = screen.getAllByTestId('list-target');

    expect(targets.length).toEqual(3);
  });

  it('ListItem has two targets in outside of nesting mode', () => {
    const listItemProps = {
      id: '1',
      value: 'test',
      editingStyle: 'single',
      index: 0,
      renderDropTargets: true,
      isDragging: false,
      connectDragSource: jest.fn(),
      connectDragPreview: jest.fn(),
      onItemMoved: jest.fn(),
      itemWillMove: jest.fn(),
    };

    render(
      <DragAndDrop>
        <UnconnectedListItem {...listItemProps} />
      </DragAndDrop>
    );

    const targets = screen.getAllByTestId('list-target');

    expect(targets.length).toEqual(2);
  });
});
