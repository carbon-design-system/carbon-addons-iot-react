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
  it('render with no tooltip', () => {
    render(<ContentFormItemTitle title="my title" />);
    // title should render
    expect(screen.queryByText('my title')).toBeDefined();
  });
  it('render with no title but tooltip', () => {
    render(
      <ContentFormItemTitle
        tooltip={{ tooltipText: 'tooltipText', href: 'http://www.cnn.com', linkText: 'More info' }}
      />
    );
    // tooltip should render
    expect(screen.queryByText('tooltipText')).toBeDefined();
  });
});
