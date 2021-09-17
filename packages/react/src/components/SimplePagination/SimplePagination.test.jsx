import { render, screen } from '@testing-library/react';
import { mount } from 'enzyme';
import React from 'react';

import SimplePagination from './SimplePagination';

describe('SimplePagination', () => {
  it('should be selectable by testID or testId', () => {
    const mockPage = jest.fn();
    const { rerender } = render(
      <SimplePagination page={2} maxPage={4} onPage={mockPage} testID="SIMPLE_PAGINATION" />
    );
    expect(screen.getByTestId('SIMPLE_PAGINATION')).toBeDefined();
    expect(screen.getByTestId('SIMPLE_PAGINATION-forward-button')).toBeDefined();
    expect(screen.getByTestId('SIMPLE_PAGINATION-backward-button')).toBeDefined();

    rerender(
      <SimplePagination page={2} maxPage={4} onPage={mockPage} testID="simple_pagination" />
    );

    expect(screen.getByTestId('simple_pagination')).toBeDefined();
    expect(screen.getByTestId('simple_pagination-forward-button')).toBeDefined();
    expect(screen.getByTestId('simple_pagination-backward-button')).toBeDefined();
  });
  it('only one page', () => {
    const mockPage = jest.fn();
    const wrapper = mount(<SimplePagination page={1} maxPage={1} onPage={mockPage} />);
    const clickableButtons = wrapper.find('div[onClick]');
    // Because the page number is the same as maxPage we shouldn't have any clickable or tabbable buttons
    expect(clickableButtons).toHaveLength(0);
    const tabbableButtons = wrapper.find('div[tabIndex=0]');
    // Because the page number is the same as maxPage we shouldn't have any clickable or tabbable buttons
    expect(tabbableButtons).toHaveLength(0);
  });
  it('offers i18n functions where needed', () => {
    // Test the defaults
    const { rerender } = render(
      <SimplePagination totalItems={10} page={1} maxPage={1} onPage={jest.fn()} />
    );
    expect(screen.getByText('10 Items')).toBeVisible();
    expect(screen.getByText('Page 1 of 1')).toBeVisible();

    // Test totalItemsText & pageText as strings for backward compatibility
    rerender(
      <SimplePagination
        totalItemsText="test-items"
        pageText="test-page"
        totalItems={10}
        page={1}
        maxPage={1}
        onPage={jest.fn()}
      />
    );
    expect(screen.getByText('10 test-items')).toBeVisible();
    expect(screen.getByText('test-page 1')).toBeVisible();

    // Test the functions
    rerender(
      <SimplePagination
        totalItemsText={(total) => `test ${total} items`}
        pageOfPagesText={(page, maxPage) => `test-function-page ${page} of ${maxPage}`}
        totalItems={10}
        page={1}
        maxPage={1}
        onPage={jest.fn()}
      />
    );
    expect(screen.getByText('test 10 items')).toBeVisible();
    expect(screen.getByText('test-function-page 1 of 1')).toBeVisible();
  });
  it('both buttons should be clickable', () => {
    const mockPage = jest.fn();
    const wrapper = mount(<SimplePagination page={2} maxPage={4} onPage={mockPage} />);
    const clickableButtons = wrapper.find('div[onClick]');
    // Because the page number is the same as maxPage we shouldn't have any clickable or tabbable buttons
    expect(clickableButtons).toHaveLength(2);
    const tabbableButtons = wrapper.find('div[tabIndex=0]');
    // Because the page number is the same as maxPage we shouldn't have any clickable or tabbable buttons
    expect(tabbableButtons).toHaveLength(2);
  });
  it('next and prev', () => {
    const mockPage = jest.fn();
    const wrapper = mount(<SimplePagination page={2} maxPage={4} onPage={mockPage} />);
    const nextAndPrevButtons = wrapper.find('div[onClick]');

    // Next button should be page 3
    nextAndPrevButtons.at(1).simulate('click');
    expect(mockPage).toHaveBeenCalledWith(3);

    // Prev button should be page 1
    nextAndPrevButtons.at(0).simulate('click');
    expect(mockPage).toHaveBeenCalledWith(1);
  });
  it('next and prev key down', () => {
    const mockPage = jest.fn();
    const wrapper = mount(<SimplePagination page={2} maxPage={4} onPage={mockPage} />);
    const nextAndPrevButtons = wrapper.find('div[tabIndex=0]');

    // Next button should be page 3
    nextAndPrevButtons.at(1).simulate('keydown', { key: 'Enter', keyCode: 13, which: 13 });
    expect(mockPage).toHaveBeenCalledWith(3);

    // Prev button should be page 1
    nextAndPrevButtons.at(0).simulate('keydown', { key: 'Enter', keyCode: 13, which: 13 });
    expect(mockPage).toHaveBeenCalledWith(1);
  });
});
