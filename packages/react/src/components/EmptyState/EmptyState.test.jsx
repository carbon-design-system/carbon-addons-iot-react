import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  EmptystateErrorIcon as ErrorImage,
  Emptystate404Icon as Error404Image,
  EmptystateDefaultIcon as EmptyImage,
  EmptystateSuccessIcon as SuccessImage,
  EmptystateNotauthorizedIcon as NotAuthImage,
  EmptystateNoresultsIcon as NoResultImage,
} from '../../icons/static';
import { DashboardIcon as CustomIcon } from '../../icons/components';
import { settings } from '../../constants/Settings';

import EmptyState from './EmptyState';

const { prefix, iotPrefix } = settings;

const title = 'Titletest';
const body = 'Titlebody';
const commonProps = {
  title,
  body,
};

const testID = 'EmptyState';

const action = (name, onClick) => ({
  label: name,
  onClick,
});

const icons = {
  error: ErrorImage,
  error404: Error404Image,
  empty: EmptyImage,
  'not-authorized': NotAuthImage,
  'no-result': NoResultImage,
  success: SuccessImage,
};

describe('EmptyState', () => {
  it('should be selectable by testID or testId', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<EmptyState {...commonProps} testID="EMPTY_STATE" />);
    expect(screen.getByTestId(`EMPTY_STATE-title`).textContent).toEqual(title);
    expect(screen.getByTestId(`EMPTY_STATE-body`).textContent).toEqual(body);
    expect(screen.queryByTestId(`EMPTY_STATE-icon`)).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(`The 'testID' prop has been deprecated. Please use 'testId' instead.`)
    );
    jest.resetAllMocks();
    rerender(<EmptyState {...commonProps} testId="empty_state" />);
    expect(screen.getByTestId(`empty_state-title`).textContent).toEqual(title);
    expect(screen.getByTestId(`empty_state-body`).textContent).toEqual(body);
    expect(screen.queryByTestId(`empty_state-icon`)).toBeNull();
  });
  it('shows title and body', () => {
    render(<EmptyState {...commonProps} />);
    expect(screen.getByTestId(`${testID}-title`).textContent).toEqual(title);
    expect(screen.getByTestId(`${testID}-body`).textContent).toEqual(body);
    expect(screen.queryByTestId(`${testID}-icon`)).toBeNull();
  });

  it.each(Object.keys(icons))('shows different images', (icon) => {
    const iconContainer = render(React.createElement(icons[icon]));
    render(<EmptyState {...commonProps} icon={icon} />);
    const renderedIcon = screen.getByTestId(`${testID}-icon`);

    // is passed image type equal to related icon
    expect(renderedIcon.innerHTML).toEqual(iconContainer.container.firstChild.innerHTML);
  });

  it('shows custom image', () => {
    const icon = render(React.createElement(CustomIcon));
    render(<EmptyState {...commonProps} icon={CustomIcon} />);
    const renderedIcon = screen.getByTestId(`${testID}-icon`);
    expect(renderedIcon.innerHTML).toEqual(icon.container.firstChild.innerHTML);
  });

  it('shows action if desired', () => {
    const actionLabel = 'Testbutton';
    const onClick = jest.fn();
    render(<EmptyState {...commonProps} action={{ ...action(actionLabel, onClick) }} />);

    // has button
    expect(screen.getByTestId(`${testID}-action`)).toBeTruthy();

    // has label
    expect(screen.getByTestId(`${testID}-action`).textContent).toEqual(actionLabel);

    // has no link
    expect(screen.queryByTestId(`${testID}-secondaryAction`)).toBeNull();

    // onclick called
    userEvent.click(screen.getByTestId(`${testID}-action`).querySelector('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('shows secondaryAction if desired', () => {
    const actionLabel = 'TestLink';
    const onClick = jest.fn();

    render(<EmptyState {...commonProps} secondaryAction={{ ...action(actionLabel, onClick) }} />);
    // has no button
    expect(screen.queryByTestId(`${testID}-action`)).toBeNull();

    // has label
    expect(screen.getByTestId(`${testID}-secondaryAction`).textContent).toEqual(actionLabel);

    // onclick called
    userEvent.click(screen.getByTestId(`${testID}-secondaryAction`).querySelector('a'));
    expect(onClick).toHaveBeenCalled();
  });

  it('shows both actions if desired', () => {
    const actionLabel = 'TestButton';
    const actionOnClick = jest.fn();
    const secondaryActionOnClick = jest.fn();

    render(
      <EmptyState
        {...commonProps}
        secondaryAction={{ ...action(actionLabel, secondaryActionOnClick) }}
        action={{ ...action(actionLabel, actionOnClick) }}
      />
    );

    // has link and button with right content
    expect(screen.getByTestId(`${testID}-action`).textContent).toEqual(actionLabel);
    expect(screen.getByTestId(`${testID}-secondaryAction`).textContent).toEqual(actionLabel);

    // onclick called
    userEvent.click(screen.getByTestId(`${testID}-action`).querySelector('button'));
    userEvent.click(screen.getByTestId(`${testID}-secondaryAction`).querySelector('a'));

    expect(actionOnClick).toHaveBeenCalled();
    expect(secondaryActionOnClick).toHaveBeenCalled();
  });

  it('should render a node as body', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<EmptyState {...commonProps} body={<div>This is a node body</div>} />);

    expect(screen.getByText('This is a node body')).toBeVisible();
    expect(console.error).not.toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it('should add class for inline arrangement', () => {
    render(<EmptyState {...commonProps} arrangement="inline" testId={testID} />);

    expect(screen.getByTestId(testID)).toHaveClass(`${iotPrefix}--empty-state--inline`);
  });

  it('should add column gap for layout if icon is present', () => {
    render(<EmptyState {...commonProps} arrangement="inline" testId={testID} icon="empty" />);

    expect(screen.getByTestId(testID).firstChild).toHaveClass(
      `${iotPrefix}--empty-state--content--with-gap`
    );
  });

  it('should add class for small empty state', () => {
    const actionLabel = 'TestButton';
    const actionOnClick = jest.fn();

    render(
      <EmptyState
        {...commonProps}
        action={{ ...action(actionLabel, actionOnClick) }}
        size="small"
        testId={testID}
        icon="empty"
      />
    );

    expect(screen.getByTestId(`${testID}-icon`)).toHaveClass(`${iotPrefix}--empty-state--icon--sm`);
    expect(screen.getByTestId(`${testID}-title`)).toHaveClass(
      `${iotPrefix}--empty-state--title--sm`
    );
    expect(screen.getByTestId(`${testID}-action`).firstChild).toHaveClass(`${prefix}--btn--sm`);
    jest.resetAllMocks();
  });
});
