import React from 'react';
import { render, screen } from '@testing-library/react';

import HeaderActionMenu from './HeaderActionMenu';

describe('HeaderActionMenu', () => {
  const mockProps = {
    'aria-label': 'Accessibility label',
    className: 'custom-class',
    // We use `ref` instead of `focusRef` becase `HeaderActionMenu` forwards the ref
    // to the underlying menu button
    ref: jest.fn(),
    tabIndex: -1,
    onToggleExpansion: jest.fn(),
    label: 'my-menu',
    childContent: [
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is a title',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: 'this is my message to you',
      },
      {
        metaData: {
          onClick: jest.fn(),
          className: 'this',
          element: 'button',
        },
        content: <span>JohnDoe@ibm.com</span>,
      },
    ],
  };

  it('should render', () => {
    const { container } = render(<HeaderActionMenu {...mockProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should render aria-label', () => {
    render(<HeaderActionMenu {...mockProps} />);

    expect(screen.getByText('Accessibility label')).toBeInTheDocument();
  });

  it('should render content prop', () => {
    const menuContent = () => <p>Some other text</p>;
    render(<HeaderActionMenu renderMenuContent={menuContent} {...mockProps} />);

    expect(screen.queryByText('Accessibility label')).not.toBeInTheDocument();
    expect(screen.getByText('Some other text')).toBeInTheDocument();
  });
});
