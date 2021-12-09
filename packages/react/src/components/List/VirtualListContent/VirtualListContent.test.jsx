import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DragAndDrop, EditingStyle } from '../../../utils/DragAndDropUtils';
import { settings } from '../../../constants/Settings';
import { getListItems } from '../List.test.helpers';

import VirtualListContent from './VirtualListContent';

const { iotPrefix } = settings;

describe('ListContent', () => {
  it('should fallback to default callbacks when none provided', () => {
    jest.spyOn(VirtualListContent.defaultProps, 'handleSelect');
    jest.spyOn(VirtualListContent.defaultProps, 'toggleExpansion');
    render(
      <DragAndDrop>
        <VirtualListContent
          items={[
            {
              id: 'one',
              content: {
                value: 'Item 1',
              },
              isSelectable: true,
              children: [
                {
                  id: 'one-1',
                  content: {
                    value: 'Child 1',
                  },
                  isSelectable: true,
                },
              ],
            },
            {
              id: 'two',
              content: {
                value: 'Item 2',
              },
              isSelectable: true,
            },
            {
              id: 'three',
              content: {
                value: 'Item 3',
              },
              isSelectable: true,
            },
          ]}
        />
      </DragAndDrop>
    );

    userEvent.click(screen.getByText('Item 1'));
    expect(VirtualListContent.defaultProps.handleSelect).toHaveBeenCalledWith('one', null);

    userEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(VirtualListContent.defaultProps.toggleExpansion).toHaveBeenCalledWith('one');
  });

  it('should render an empty state node', () => {
    render(
      <DragAndDrop>
        <VirtualListContent items={[]} emptyState={<div>no content available.</div>} />
      </DragAndDrop>
    );

    expect(screen.getByText('no content available.')).toBeVisible();
  });

  it('should render a loading state', () => {
    render(
      <DragAndDrop>
        <VirtualListContent items={[]} isLoading />
      </DragAndDrop>
    );

    expect(screen.getByTestId('list-loading')).toBeVisible();
  });

  it('should show a prop warning with isFullHeight', () => {
    const { __DEV__ } = global;
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.__DEV__ = true;
    render(
      <DragAndDrop>
        <VirtualListContent isFullHeight />
      </DragAndDrop>
    );

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        "Using 'isFullHeight' with 'isVirtualList' could have negative performance consequences. Using the them together is discouraged."
      )
    );
    jest.resetAllMocks();
    global.__DEV__ = __DEV__;
  });

  it('should selected items with selectedIds', () => {
    const { container } = render(
      <DragAndDrop>
        <VirtualListContent
          items={[
            {
              id: 'one',
              content: {
                value: 'Item 1',
              },
              isSelectable: true,
              children: [
                {
                  id: 'one-1',
                  content: {
                    value: 'Child 1',
                  },
                  isSelectable: true,
                },
              ],
            },
            {
              id: 'two',
              content: {
                value: 'Item 2',
              },
              isSelectable: true,
            },
            {
              id: 'three',
              content: {
                value: 'Item 3',
              },
              isSelectable: true,
            },
          ]}
          selectedIds={['one']}
          expandedIds={['one']}
        />
      </DragAndDrop>
    );

    expect(
      container.querySelector(`.${iotPrefix}--list-item--content__selected`)
    ).toHaveTextContent('Item 1');
    expect(screen.getByText('Child 1')).toBeVisible();
  });

  it('should call handleSelect with checkboxes', () => {
    const handleSelect = jest.fn();
    render(
      <DragAndDrop>
        <VirtualListContent
          editingStyle={EditingStyle.Multiple}
          items={[
            {
              id: 'one',
              content: {
                value: 'Item 1',
              },
              isSelectable: true,
              children: [
                {
                  id: 'one-1',
                  content: {
                    value: 'Child 1',
                  },
                  isSelectable: true,
                },
              ],
            },
            {
              id: 'two',
              content: {
                value: 'Item 2',
              },
              isSelectable: true,
            },
            {
              id: 'three',
              content: {
                value: 'Item 3',
              },
              isSelectable: true,
            },
          ]}
          expandedIds={['one']}
          handleSelect={handleSelect}
        />
      </DragAndDrop>
    );

    userEvent.click(screen.getByTestId('one-1-checkbox'));
    expect(handleSelect).toHaveBeenCalledWith('one-1', 'one');
  });

  it('shows list loading skeleton when isInfiniteScroll:true', () => {
    window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      const obj = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
      callback([{ isIntersecting: true }], obj);

      return obj;
    });
    const { container } = render(
      <DragAndDrop>
        <VirtualListContent
          items={getListItems(1)}
          isInfiniteScroll
          testId="test-list"
          isVirtualList
        />
      </DragAndDrop>
    );
    expect(container.querySelectorAll(`.${iotPrefix}--list--skeleton`)).toHaveLength(1);
    jest.resetAllMocks();
  });
});
