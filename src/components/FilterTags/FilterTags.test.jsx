import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tag } from '../../index';

import FilterTags from './FilterTags';
import { tagData } from './FilterTags.story';

describe('Filtertags', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
  });

  afterAll(() => {
    delete HTMLElement.prototype.clientWidth;
    delete HTMLElement.prototype.scrollWidth;
  });

  it('will render tags without overflow when size is large enough', async () => {
    const { rerender } = render(
      <FilterTags>
        {tagData.map(tag => (
          <Tag
            key={`tag-${tag.id}`}
            filter
            type={tag.type}
            title="Clear Filter"
            style={{ marginRight: '1rem' }}
          >
            {tag.text}
          </Tag>
        ))}
      </FilterTags>
    );
    expect(screen.getByTestId('filter-tag-container')).toBeTruthy();
    expect(screen.queryByText(/More:*/)).toBeTruthy();
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });
    rerender(
      <FilterTags>
        {tagData.map(tag => (
          <Tag
            key={`tag-${tag.id}`}
            filter
            type={tag.type}
            title="Clear Filter"
            style={{ marginRight: '1rem' }}
          >
            {tag.text}
          </Tag>
        ))}
      </FilterTags>
    );
    expect(screen.queryByText(/More:*/)).toBeFalsy();
  });

  it('will render tags with overflow tag when size is too small', async () => {
    render(
      <FilterTags>
        {tagData.map(tag => (
          <Tag
            key={`tag-${tag.id}`}
            filter
            type={tag.type}
            title="Clear Filter"
            style={{ marginRight: '1rem' }}
          >
            {tag.text}
          </Tag>
        ))}
      </FilterTags>
    );
    expect(screen.queryByText(/More:*/)).toBeTruthy();
  });

  it('will collapse tags that do not fit into an overflow menu', async () => {
    render(
      <FilterTags>
        {tagData.map(tag => (
          <Tag
            key={`tag-${tag.id}`}
            filter
            type={tag.type}
            title="Clear Filter"
            style={{ marginRight: '1rem' }}
          >
            {tag.text}
          </Tag>
        ))}
      </FilterTags>
    );
    const moreButton = screen.queryByText(/More:*/);

    expect(moreButton).toBeTruthy();
    userEvent.click(moreButton);
    expect(screen.getByText('Hello Daughter')).toBeTruthy();
  });

  it('will pass onClose cb to corresponding OverflowItem', async () => {
    const mockOnClose = jest.fn();
    render(
      <FilterTags>
        {tagData.map(tag => (
          <Tag
            key={`tag-${tag.id}`}
            filter
            type={tag.type}
            title="Clear Filter"
            style={{ marginRight: '1rem' }}
            onClose={() => mockOnClose(tag.id)}
          >
            {tag.text}
          </Tag>
        ))}
      </FilterTags>
    );
    const moreButton = screen.queryByText(/More:*/);
    userEvent.click(moreButton);
    expect(screen.getByText('Hello Daughter')).toBeTruthy();
    userEvent.click(screen.getByText('Hello Daughter'));
    expect(mockOnClose).toHaveBeenCalledWith('tag-four');
  });
});
