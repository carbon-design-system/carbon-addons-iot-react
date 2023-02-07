import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tag } from '../Tag';

import FilterTags from './FilterTags';
import { tagData } from './FilterTags.story';

describe('Filtertags', () => {
  const originalBounding = Element.prototype.getBoundingClientRect;
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
    Element.prototype.getBoundingClientRect = () => ({
      height: 100,
      width: 100,
    });
  });

  afterAll(() => {
    delete HTMLElement.prototype.clientWidth;
    delete HTMLElement.prototype.scrollWidth;
    HTMLElement.prototype.getBoundingClientRect = originalBounding;
  });

  it('should be selectable by testId', async () => {
    const { rerender } = render(
      <FilterTags id="FILTER_TAGS_CONTAINER">
        {tagData.map((tag) => (
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
    expect(screen.getByTestId('FILTER_TAGS_CONTAINER')).toBeDefined();
    expect(screen.getByTestId('filter-tags-overflow-menu')).toBeDefined();

    rerender(
      <FilterTags testId="filter_tags">
        {tagData.map((tag) => (
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
    expect(screen.getByTestId('filter-tag-container')).toBeDefined();
    expect(screen.getByTestId('filter_tags-overflow-menu')).toBeDefined();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    userEvent.click(screen.getByTestId('filter_tags-overflow-menu'));
    await waitFor(() => {
      expect(screen.getByTestId('filter_tags-overflow-menu-item-0')).toBeVisible();
    });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: validateDOMNesting(...): %s cannot appear as a descendant of <%s>.%s'
      ),
      '<button>',
      'button',
      expect.stringContaining('FilterTags')
    );
    console.error.mockReset();
  });

  it('will render tags without overflow when size is large enough', () => {
    const { rerender } = render(
      <FilterTags>
        {tagData.map((tag) => (
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
        {tagData.map((tag) => (
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

  it('will render tags without overflow when hasOverflow is false', () => {
    render(
      <FilterTags hasOverflow={false}>
        {tagData.map((tag) => (
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

  it('will render tags with overflow tag when size is too small', () => {
    render(
      <FilterTags>
        {tagData.map((tag) => (
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

  it('will collapse tags that do not fit into an overflow menu', () => {
    render(
      <FilterTags>
        {tagData.map((tag) => (
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

  it('will pass onClose cb to corresponding OverflowItem', () => {
    const mockOnClose = jest.fn();
    render(
      <FilterTags>
        {tagData.map((tag) => (
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

  it('will render custom overflow menu text from i18n prop', () => {
    const mockOnClose = jest.fn();
    render(
      <FilterTags
        i18n={{
          filterTagsOverflowMenuText: (itemCount) => `Hidden items: ${itemCount}`,
        }}
      >
        {tagData.map((tag) => (
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
    const moreButton = screen.queryByText(/Hidden items:*/);
    userEvent.click(moreButton);
    expect(screen.getByText('Hello Daughter')).toBeTruthy();
    userEvent.click(screen.getByText('Hello Daughter'));
    expect(mockOnClose).toHaveBeenCalledWith('tag-four');
  });

  it('will render text without count substitution if callback parameter is not provided', () => {
    const mockOnClose = jest.fn();
    render(
      <FilterTags
        i18n={{
          filterTagsOverflowMenuText: () => 'Hidden items',
        }}
      >
        {tagData.map((tag) => (
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
    expect(screen.getByText('Hidden items')).toBeVisible();
  });
});
