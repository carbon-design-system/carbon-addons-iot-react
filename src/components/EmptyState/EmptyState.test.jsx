import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  EmptystateErrorIcon as ErrorImage,
  Emptystate404Icon as Error404Image,
  EmptystateDefaultIcon as EmptyImage,
  EmptystateSuccessIcon as SuccessImage,
  EmptystateNoresultsIcon as NoResultImage,
  EmptystateNotauthorizedIcon as NotAuthImage,
  DashboardIcon as CustomIcon,
} from '../../icons/components';

import EmptyState from './EmptyState';

const title = 'Titletest';
const body = 'Titlebody';
const iconID = 'emptystate-icon';
const commonProps = {
  title,
  body,
};
const action = (name, onClick) => ({
  label: name,
  onClick,
});

const images = {
  error: ErrorImage,
  error404: Error404Image,
  empty: EmptyImage,
  'not-authorized': NotAuthImage,
  'no-result': NoResultImage,
  success: SuccessImage,
};

describe('EmptyState', () => {
  it('shows title and body', () => {
    render(<EmptyState {...commonProps} />);
    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(body)).toBeTruthy();
    expect(screen.queryByTestId(iconID)).toBeNull();
  });

  it('shows different images', () => {
    // predefined images
    Object.keys(images).forEach((image) => {
      document.body.innerHTML = '';
      const icon = render(React.createElement(images[image]));
      render(<EmptyState {...commonProps} image={image} />);
      const renderedIcon = screen.getByTestId(iconID);
      expect(renderedIcon.innerHTML).toEqual(
        icon.container.firstChild.innerHTML
      );
    });
    // passing custom image
    document.body.innerHTML = '';
    const icon = render(React.createElement(CustomIcon));
    render(<EmptyState {...commonProps} image={CustomIcon} />);
    const renderedIcon = screen.getByTestId(iconID);
    expect(renderedIcon.innerHTML).toEqual(icon.container.firstChild.innerHTML);
  });

  it('shows action if desired', () => {
    const actionLabel = 'Testbutton';
    const onClick = jest.fn();
    render(
      <EmptyState
        {...commonProps}
        action={{ ...action(actionLabel, onClick) }}
      />
    );

    // has button
    expect(screen.getByRole('button')).toBeTruthy();
    // has label
    expect(screen.getByText(actionLabel)).toBeTruthy();

    // onclick called
    userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();

    // passing custom component
    document.body.innerHTML = '';
    const customAction = <div data-testid="customcomponent">Hello</div>;
    render(<EmptyState {...commonProps} action={customAction} />);

    expect(screen.getByTestId('customcomponent')).toBeTruthy();
  });

  it('shows secondaryAction if desired', () => {
    const actionLabel = 'TestLink';
    const onClick = jest.fn();

    render(
      <EmptyState
        {...commonProps}
        secondaryAction={{ ...action(actionLabel, onClick) }}
      />
    );
    // has no button
    expect(screen.queryByRole('button')).toBeNull();

    // has label
    expect(screen.getByText(actionLabel)).toBeTruthy();

    // onclick called
    userEvent.click(screen.getByText(actionLabel));
    expect(onClick).toHaveBeenCalled();

    // passing custom component
    document.body.innerHTML = '';
    const customAction = <div data-testid="customcomponent">Hello</div>;
    render(<EmptyState {...commonProps} secondaryAction={customAction} />);

    expect(screen.getByTestId('customcomponent')).toBeTruthy();
  });
});
