import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as utilityFunctions from '../../utils/componentUtilityFunctions';
import { settings } from '../../constants/Settings';

import ComposedModal from './ComposedModal';

const { iotPrefix } = settings;

const modalProps = {
  onClose: () => jest.fn(),
};

describe('ComposedModal', () => {
  beforeEach(() => {
    jest.spyOn(global, 'ResizeObserver').mockImplementation((callback) => {
      callback([{ contentRect: { width: 1000, height: 800 } }]);

      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be selectable with either testID or testId', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<ComposedModal {...modalProps} testID="COMPOSED_MODAL" />);
    expect(console.error).toHaveBeenCalledWith(
      `Warning: The 'testID' prop has been deprecated. Please use 'testId' instead.`
    );
    console.error.mockReset();

    expect(screen.getByTestId('COMPOSED_MODAL')).toBeDefined();
    rerender(<ComposedModal {...modalProps} testId="composed_modal" />);

    expect(screen.getByTestId('composed_modal')).toBeDefined();
    expect(screen.getByTestId('composed_modal-modal-secondary-button')).toBeDefined();
    expect(screen.getByTestId('composed_modal-modal-primary-button')).toBeDefined();
  });

  it('invalid field should be scrolled into view', () => {
    jest.spyOn(utilityFunctions, 'scrollErrorIntoView');
    const { rerender } = render(<ComposedModal {...modalProps} />);
    rerender(<ComposedModal {...modalProps} invalid submitFailed />);
    expect(utilityFunctions.scrollErrorIntoView).toHaveBeenCalledTimes(1);
  });

  it('errors should be cleared', () => {
    const onClearError = jest.fn();
    render(<ComposedModal {...modalProps} error="error" onClearError={onClearError} />);
    userEvent.click(screen.queryByRole('button', { name: 'closes notification' }));
    expect(onClearError).toHaveBeenCalledTimes(1);
  });

  it('errors should not cause error', () => {
    render(<ComposedModal {...modalProps} error="error" />);
    userEvent.click(screen.queryByRole('button', { name: 'closes notification' }));
    // the close button shouldn't cause exception so the save button should render
    expect(screen.queryByRole('button', { name: 'Save' })).toBeVisible();
  });

  it('clicking outside Composedmodal does not close it', async () => {
    render(<ComposedModal {...modalProps}>My content</ComposedModal>);
    expect(screen.getByTestId('ComposedModal')).toHaveClass('is-visible');

    userEvent.click(screen.getByTestId('ComposedModal'));
    // The component should not remove the is-visible
    await waitFor(() => expect(screen.getByTestId('ComposedModal')).toHaveClass('is-visible'));
  });

  it('there should be enough space for the error message to avoid double scrollbars', () => {
    const { rerender } = render(
      <ComposedModal {...modalProps} error="There is an error">
        My test content
      </ComposedModal>
    );
    expect(screen.queryByText('My test content')).toHaveClass(
      `${iotPrefix}--composed-modal__body--small-margin-bottom`
    );

    rerender(<ComposedModal {...modalProps}>My test content</ComposedModal>);
    expect(screen.queryByText('My test content')).not.toHaveClass(
      `${iotPrefix}--composed-modal__body--small-margin-bottom`
    );
  });

  it('should render a loading message when isFetchingData is true', () => {
    render(<ComposedModal {...modalProps} isFetchingData />);
    expect(screen.getAllByText('Active loading indicator')[0]).toBeInTheDocument();
  });

  it('should show a help text if defined', () => {
    render(<ComposedModal {...modalProps} header={{ helpText: 'This is my helptext' }} />);
    expect(screen.getByText('This is my helptext')).toBeVisible();
  });

  it('hides the footer when passiveModal is true', () => {
    const { rerender } = render(<ComposedModal {...modalProps} />);
    expect(screen.queryByRole('button', { name: 'Save' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeTruthy();

    rerender(<ComposedModal {...modalProps} passiveModal />);
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeTruthy();
  });

  it('can render custom footer element', () => {
    const customFooter = <div>My custom footer</div>;
    render(<ComposedModal {...modalProps} footer={customFooter} />);
    expect(screen.getByText('My custom footer')).toBeVisible();
  });

  it('can render alternative footer button texts', () => {
    render(
      <ComposedModal
        {...modalProps}
        footer={{
          primaryButtonLabel: 'My primary button',
          secondaryButtonLabel: 'My secondary button',
        }}
      />
    );
    expect(screen.queryByRole('button', { name: 'My primary button' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'My secondary button' })).toBeTruthy();
  });

  it('can hide the footer primary button', () => {
    render(<ComposedModal {...modalProps} footer={{ isPrimaryButtonHidden: true }} />);
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeTruthy();
  });

  describe('has dev console errors', () => {
    const originalDev = window.__DEV__;

    beforeAll(() => {
      // Prevent the actual error logging
      jest.spyOn(console, 'error').mockImplementation(() => {});
      window.__DEV__ = true;
    });

    afterAll(() => {
      window.__DEV__ = originalDev;
      jest.resetAllMocks();
    });

    it('when passive modal is combined with a footer or onSubmit', () => {
      const customFooter = <div>My custom footer</div>;
      const { rerender } = render(
        <ComposedModal {...modalProps} footer={customFooter} passiveModal />
      );

      expect(console.error).toHaveBeenCalledTimes(1);

      rerender(<ComposedModal {...modalProps} onSubmit={() => {}} passiveModal />);
      expect(console.error).toHaveBeenCalledTimes(2);
      jest.restoreAllMocks();
    });
  });
});
