import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import React, { createElement, useState } from 'react';

import { settings } from '../../constants/Settings';

import TearSheet from './TearSheet';
import TearSheetWrapper from './TearSheetWrapper';

const { iotPrefix } = settings;

const TearSheetChildren = () => <div>TearSheet content</div>;
const commonProps = {
  title: 'First TearSheet',
  description: 'First TearSheet description',
  headerExtraContent: <div>Header extra content</div>,
  i18n: {
    close: 'Close',
  },
  children: <TearSheetChildren />,
};

const secondTearSheetCommonProps = {
  ...commonProps,
  title: 'Second TearSheet',
  description: 'Second TearSheet description',
};

describe('TearSheetWrapper', () => {
  it('should be selectable by testId', () => {
    const { rerender } = render(
      <TearSheetWrapper isOpen={false}>
        <TearSheet {...commonProps} testId="tearsheet" />
      </TearSheetWrapper>
    );
    expect(screen.getByTestId('tearsheet-close-button-0')).toBeInTheDocument();

    rerender(
      <TearSheetWrapper isOpen={false}>
        <TearSheet {...commonProps} />
      </TearSheetWrapper>
    );

    expect(screen.getByTestId(`tearSheetCloseBtn0`)).toBeInTheDocument();
  });

  it('renders closed TearSheetWrapper', () => {
    render(
      <TearSheetWrapper isOpen={false}>
        <TearSheet {...commonProps} />
      </TearSheetWrapper>
    );
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).not.toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
    expect(screen.getByText('First TearSheet')).toBeInTheDocument();
    expect(screen.getByText('First TearSheet description')).toBeInTheDocument();
  });
  it('renders open TearSheetWrapper with first TearSheet open', () => {
    render(
      <TearSheetWrapper isOpen>
        <TearSheet {...commonProps} />
      </TearSheetWrapper>
    );
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
  });
  it('renders TearSheetWrapper with 2 TearSheets and closes the second one', () => {
    render(
      <TearSheetWrapper isOpen>
        <TearSheet {...commonProps} />
        <TearSheet {...secondTearSheetCommonProps} />
      </TearSheetWrapper>
    );
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
    expect(screen.getByText('Second TearSheet')).toBeInTheDocument();
    expect(screen.getByText('Second TearSheet description')).toBeInTheDocument();
  });
  it('renders first TearSheet and opens second TearSheet', async () => {
    const TearSheetChild = ({ openNextSheet }) => (
      <button type="button" data-testid="openNextSheet" onClick={() => openNextSheet()}>
        Open second sheet
      </button>
    );
    render(
      createElement(() => {
        const [isOpen, setOpen] = useState(false);
        return (
          <>
            <button
              type="button"
              data-testid="openTearSheetWrapper"
              onClick={() => setOpen(true)}
            />
            <TearSheetWrapper isOpen={isOpen}>
              <TearSheet {...commonProps}>
                <TearSheetChild />
              </TearSheet>
              <TearSheet {...secondTearSheetCommonProps} />
            </TearSheetWrapper>
          </>
        );
      })
    );
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).not.toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
    await userEvent.click(screen.getByTestId('openTearSheetWrapper'));
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
    await userEvent.click(screen.getByTestId('openNextSheet'));
    expect(screen.getByTestId('container-0')).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper--container__is-hidden`
    );
    await userEvent.click(screen.getByTestId('tearSheetCloseBtn1'));
    expect(screen.getByTestId('container-0')).not.toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper--container__is-hidden`
    );
  });
  it('renders TearSheet, opens second TearSheet and closes all TearSheets', async () => {
    const TearSheetChild = ({ openNextSheet }) => (
      <button type="button" data-testid="openNextSheet" onClick={() => openNextSheet()}>
        Open second sheet
      </button>
    );
    const TearSheetChild2 = ({ closeAllTearSheets }) => (
      <button type="button" data-testid="closeAllTearSheets" onClick={() => closeAllTearSheets()}>
        Close all TearSheets
      </button>
    );
    render(
      <TearSheetWrapper isOpen onCloseAllTearSheets={jest.fn()}>
        <TearSheet {...commonProps}>
          <TearSheetChild />
        </TearSheet>
        <TearSheet {...secondTearSheetCommonProps}>
          <TearSheetChild2 />
        </TearSheet>
      </TearSheetWrapper>
    );
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
    await userEvent.click(screen.getByTestId('openNextSheet'));
    expect(screen.getByTestId('container-0')).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper--container__is-hidden`
    );
    await userEvent.click(screen.getByTestId('closeAllTearSheets'));
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).not.toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
  });
  it('renders TearSheet, opens second TearSheet and closes all TearSheets without providing the onCloseAllTearSheets funcion', async () => {
    const TearSheetChild = ({ openNextSheet }) => (
      <button type="button" data-testid="openNextSheet" onClick={() => openNextSheet()}>
        Open second sheet
      </button>
    );
    const TearSheetChild2 = ({ closeAllTearSheets }) => (
      <button type="button" data-testid="closeAllTearSheets" onClick={() => closeAllTearSheets()}>
        Close all TearSheets
      </button>
    );

    render(
      <TearSheetWrapper isOpen>
        <TearSheet {...commonProps}>
          <TearSheetChild />
        </TearSheet>
        <TearSheet {...secondTearSheetCommonProps}>
          <TearSheetChild2 />
        </TearSheet>
      </TearSheetWrapper>
    );
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
    await userEvent.click(screen.getByTestId('openNextSheet'));
    expect(screen.getByTestId('container-0')).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper--container__is-hidden`
    );
    await userEvent.click(screen.getByTestId('closeAllTearSheets'));
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).not.toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
  });
  it('renders TearSheet, opens second TearSheet, goes back to first TearSheet and closes it', async () => {
    const TearSheetChild = ({ openNextSheet }) => (
      <button type="button" data-testid="openNextSheet" onClick={() => openNextSheet()}>
        Open second sheet
      </button>
    );
    const TearSheetChild2 = ({ goToPreviousSheet }) => (
      <button type="button" data-testid="goToPreviousSheet" onClick={() => goToPreviousSheet()}>
        Go to previous sheet
      </button>
    );
    render(
      <TearSheetWrapper isOpen>
        <TearSheet {...commonProps} onClose={jest.fn()}>
          {/* eslint-disable-next-line no-unused-vars */}
          <TearSheetChild />
        </TearSheet>
        <TearSheet {...secondTearSheetCommonProps}>
          <TearSheetChild2 />
        </TearSheet>
      </TearSheetWrapper>
    );
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
    await userEvent.click(screen.getByTestId('openNextSheet'));
    expect(screen.getByTestId('container-0')).toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper--container__is-hidden`
    );
    await userEvent.click(screen.getByTestId('goToPreviousSheet'));
    await userEvent.click(screen.getByTestId('tearSheetCloseBtn0'));
    expect(screen.getByTestId(`${iotPrefix}--tear-sheet-wrapper`)).not.toHaveClass(
      `${iotPrefix}--tear-sheet-wrapper__is-visible`
    );
  });
});
