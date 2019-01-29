import { mount } from 'enzyme';
import React from 'react';

import Pagination from './Pagination';

describe('Pagination', () => {
  const commonProps = {
    totalItems: 100,
    itemsPerPage: 10,
    page: 5,
    onChangePage: jest.fn(),
    onChangeItemsPerPage: jest.fn(),
  };

  beforeEach(() => {
    console.error = jest.fn();
  });

  test('pages forward', () => {
    const wrapper = mount(<Pagination {...commonProps} />);
    wrapper.find('button.bx--pagination__button--forward').simulate('click');
    expect(commonProps.onChangePage).toHaveBeenCalledWith(6);
  });

  test('pages backwards', () => {
    const wrapper = mount(<Pagination {...commonProps} />);
    wrapper.find('button.bx--pagination__button--backward').simulate('click');
    expect(commonProps.onChangePage).toHaveBeenCalledWith(4);
  });
});
