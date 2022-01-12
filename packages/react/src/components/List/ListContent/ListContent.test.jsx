import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DragAndDrop } from '../../../utils/DragAndDropUtils';

import ListContent from './ListContent';

describe('ListContent', () => {
  it('should fallback to default callbacks when none provided', () => {
    jest.spyOn(ListContent.defaultProps, 'handleSelect');
    jest.spyOn(ListContent.defaultProps, 'toggleExpansion');
    render(
      <DragAndDrop>
        <ListContent
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
    expect(ListContent.defaultProps.handleSelect).toHaveBeenCalledWith('one', null);

    userEvent.click(screen.getByRole('button', { name: 'Expand' }));
    expect(ListContent.defaultProps.toggleExpansion).toHaveBeenCalledWith('one');
  });

  it(' load more row clicked without handleLoadMore function provided', () => {
    const { loadMore } = ListContent.defaultProps.i18n;
    jest.spyOn(ListContent.defaultProps, 'handleLoadMore');
    render(
      <DragAndDrop>
        <ListContent
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
      </DragAndDrop>
    );
    expect(screen.getAllByText(loadMore)[0]).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: loadMore }));
    expect(ListContent.defaultProps.handleLoadMore).toHaveBeenCalled();
  });
});
