import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';

import PageWorkArea from './PageWorkArea';

describe('PageWorkArea', () => {
  it('should be selectable by testId', () => {
    render(
      <PageWorkArea isOpen testId="page_work_area">
        Hi
      </PageWorkArea>
    );
    expect(screen.getByTestId('page_work_area')).toBeDefined();
  });

  it('isOpen', () => {
    const wrapper = mount(<PageWorkArea isOpen={false}>Hi</PageWorkArea>);
    expect(wrapper.find('div')).toHaveLength(0);
    const wrapper2 = mount(<PageWorkArea isOpen>Hi</PageWorkArea>);
    expect(wrapper2.find('div')).toHaveLength(1);
  });
});
