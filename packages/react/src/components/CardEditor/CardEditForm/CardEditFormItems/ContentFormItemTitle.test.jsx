import { render, screen } from '@testing-library/react';
import React from 'react';
// import userEvent from '@testing-library/user-event';

import ContentFormItemTitle from './ContentFormItemTitle';

describe('ContentFormItemTitle', () => {
  it('render with tooltip and linkText', () => {
    render(
      <ContentFormItemTitle
        title="my title"
        tooltip={{ tooltipText: 'tooltipText', href: 'http://www.cnn.com', linkText: 'More info' }}
      />
    );
    // title should render
    expect(screen.queryByText('my title')).toBeDefined();
    expect(screen.queryByText('tooltipText')).toBeDefined();

    expect(screen.queryByText('More info')).toBeDefined();
  });
});
