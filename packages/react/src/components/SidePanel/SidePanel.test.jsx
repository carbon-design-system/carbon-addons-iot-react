import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Edit16, Information16, SendAlt16 } from '@carbon/icons-react';

import Button from '../Button/Button';
import { settings } from '../../constants/Settings';

import SidePanel from './SidePanel';

const { iotPrefix } = settings;

describe('SidePanel Component Test', () => {
  const mockCloseButtonOnClose = jest.fn();
  const mockPrimaryButtonOnClick = jest.fn();
  const mockSecondaryButtonOnClick = jest.fn();
  const mockIconButtonOnClick = jest.fn();
  const commonProps = {
    title: 'test title',
    content: 'test content',
  };
  const primaryButton = (
    <Button testId="buttonIcon1" kind="primary" onClick={mockPrimaryButtonOnClick}>
      Initiate
    </Button>
  );

  const secondaryButton = (
    <Button testId="buttonIcon2" kind="secondary" onClick={mockSecondaryButtonOnClick}>
      Cancel
    </Button>
  );

  const iconButtons = [
    <Button
      testId="icon1"
      hasIconOnly
      kind="ghost"
      renderIcon={Edit16}
      onClick={mockIconButtonOnClick}
      size="small"
    />,
    <Button
      testId="icon2"
      hasIconOnly
      kind="ghost"
      renderIcon={Information16}
      onClick={mockIconButtonOnClick}
      size="small"
    />,
    <Button
      testId="icon3"
      hasIconOnly
      kind="ghost"
      renderIcon={SendAlt16}
      onClick={mockIconButtonOnClick}
      size="small"
    />,
  ];

  it('should be selectable by testId', () => {
    render(<SidePanel {...commonProps} testId="side-panel" icons={iconButtons} open />);
    expect(screen.getByTestId('side-panel')).toBeDefined();
    expect(screen.getByTestId('side-panel-title')).toBeDefined();
    expect(screen.getByTestId('side-panel-content')).toBeDefined();
    expect(screen.getByTestId('side-panel-footer')).toBeDefined();
    expect(screen.getByTestId('side-panel-action-bar')).toBeDefined();
  });

  it('should not render footer', () => {
    render(<SidePanel {...commonProps} testId="side-panel" icons={iconButtons} open={false} />);
    expect(screen.queryByTestId('side-panel-footer')).toBeNull();
  });

  it('should render slide-over panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideOver />);
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--slide-over`);
  });

  it('should render slide-in panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideIn />);
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--slide-in`);
  });

  it('should render inline panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" inline />);
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--inline`);
  });

  it('should show close button in slide-over panel', () => {
    render(
      <SidePanel
        {...commonProps}
        testId="side-panel"
        slideOver
        showCloseButton
        open
        onClose={mockCloseButtonOnClose}
      />
    );
    expect(screen.getByTestId('close-button')).toBeDefined();
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockCloseButtonOnClose).toHaveBeenCalled();
  });

  it('should not show close button in slide-over panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideOver open />);
    expect(screen.queryByTestId('close-button')).toBeNull();
  });

  it('should show primary button and secondary button in slide-over panel', () => {
    render(
      <SidePanel
        {...commonProps}
        testId="side-panel"
        slideOver
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        open
      />
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Initiate' })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Initiate' }));
    expect(mockPrimaryButtonOnClick).toHaveBeenCalledTimes(1);
    expect(mockSecondaryButtonOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not show close button in slide-in panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideIn />);
    expect(screen.queryByTestId('close-button')).toBeNull();
  });

  it('should show close button in inline panel', () => {
    render(
      <SidePanel
        {...commonProps}
        testId="side-panel"
        inline
        showDrawer
        open
        onClose={mockCloseButtonOnClose}
      />
    );
    expect(screen.getByTestId('close-button')).toBeDefined();
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockCloseButtonOnClose).toHaveBeenCalled();
  });

  it('should show action bar in slide-over panel', () => {
    render(
      <SidePanel
        {...commonProps}
        testId="side-panel"
        slideOver
        showCloseButton
        icons={iconButtons}
      />
    );
    expect(screen.getByTestId('side-panel-action-bar')).toBeDefined();
    expect(screen.getByTestId('icon1')).toBeDefined();
    expect(screen.getByTestId('icon2')).toBeDefined();
    expect(screen.getByTestId('icon3')).toBeDefined();
    fireEvent.click(screen.getByTestId('icon1'));
    fireEvent.click(screen.getByTestId('icon2'));
    fireEvent.click(screen.getByTestId('icon3'));
    expect(mockIconButtonOnClick).toHaveBeenCalledTimes(3);
  });

  it('should show condensed title in slide-over panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideOver condensed open />);
    expect(screen.getByTestId('side-panel-title')).toHaveClass(
      `${iotPrefix}--side-panel--title--condensed`
    );
  });

  it('should show inline panel from the left side', () => {
    render(<SidePanel {...commonProps} testId="side-panel" inline direction="start" open />);
    expect(screen.getByTestId('side-panel').firstChild).toHaveClass(
      `${iotPrefix}--side-panel--start`
    );
  });

  it('should show drawer from the left side', () => {
    render(<SidePanel {...commonProps} testId="side-panel" inline direction="start" showDrawer />);
    expect(screen.getByTestId('side-panel').firstChild).toHaveClass(
      `${iotPrefix}--side-panel--start`
    );
  });

  it('should show inline panel from the right side', () => {
    render(<SidePanel {...commonProps} testId="side-panel" inline direction="end" open />);
    expect(screen.getByTestId('side-panel').firstChild).toHaveClass(
      `${iotPrefix}--side-panel--end`
    );
  });

  it('should show drawer from the right side', () => {
    render(<SidePanel {...commonProps} testId="side-panel" inline direction="end" />);
    expect(screen.getByTestId('side-panel').firstChild).toHaveClass(
      `${iotPrefix}--side-panel--end`
    );
  });
});
