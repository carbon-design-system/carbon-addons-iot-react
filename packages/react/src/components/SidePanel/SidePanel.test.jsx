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
    testId: 'side-panel',
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
    render(
      <SidePanel title={commonProps.title} testId={commonProps.testId} icons={iconButtons} open>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel')).toBeDefined();
    expect(screen.getByTestId('side-panel-title')).toBeDefined();
    expect(screen.getByTestId('side-panel-content')).toBeDefined();
    expect(screen.getByTestId('side-panel-footer')).toBeDefined();
    expect(screen.getByTestId('side-panel-action-bar')).toBeDefined();
  });

  it('should not render footer', () => {
    render(
      <SidePanel title={commonProps.title} testId={commonProps.testId} icons={iconButtons}>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.queryByTestId('side-panel-footer')).toBeNull();
  });

  it('should render slide-over panel', () => {
    render(
      <SidePanel title={commonProps.title} testId={commonProps.testId} slideOver open>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--slide-over`);
  });

  it('should render slide-in panel', () => {
    render(
      <SidePanel title={commonProps.title} testId={commonProps.testId} open>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--slide-in`);
  });

  it('should render inline panel', () => {
    render(
      <SidePanel title={commonProps.title} testId={commonProps.testId} inline open>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--inline`);
  });

  it('should show close button in slide-over panel', () => {
    render(
      <SidePanel
        title={commonProps.title}
        testId={commonProps.testId}
        slideOver
        open
        showCloseButton
        onClose={mockCloseButtonOnClose}
      >
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('close-button')).toBeDefined();
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockCloseButtonOnClose).toHaveBeenCalled();
  });

  it('should not show close button if onClose is undefined', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideOver showCloseButton open />);
    expect(screen.queryByTestId('close-button')).toBeNull();
  });

  it('should not show close button in slide-over panel if showCloseButton is not enabled', () => {
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
        title={commonProps.title}
        testId={commonProps.testId}
        inline
        isRail
        open
        onClose={mockCloseButtonOnClose}
      >
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('close-button')).toBeDefined();
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockCloseButtonOnClose).toHaveBeenCalled();
  });

  it('should show action bar in slide-over panel', () => {
    render(
      <SidePanel
        title={commonProps.title}
        testId={commonProps.testId}
        slideOver
        open
        icons={iconButtons}
      >
        {commonProps.content}
      </SidePanel>
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
    render(
      <SidePanel {...commonProps} testId={commonProps.testId} slideOver condensed open>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel-title')).toHaveClass(
      `${iotPrefix}--side-panel__title--condensed`
    );
  });

  it('should show inline panel from the left side', () => {
    render(
      <SidePanel {...commonProps} testId={commonProps.testId} inline direction="start" open>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel').firstChild).toHaveClass(
      `${iotPrefix}--side-panel--start`
    );
  });

  it('should show drawer from the left side', () => {
    render(
      <SidePanel {...commonProps} testId={commonProps.testId} inline direction="start" showDrawer>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel').firstChild).toHaveClass(
      `${iotPrefix}--side-panel--start`
    );
  });

  it('should show inline panel from the right side', () => {
    render(
      <SidePanel {...commonProps} testId={commonProps.testId} inline direction="end" open>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel').firstChild).toHaveClass(
      `${iotPrefix}--side-panel--end`
    );
  });

  it('should show drawer from the right side', () => {
    render(
      <SidePanel {...commonProps} testId={commonProps.testId} inline direction="end" showDrawer>
        {commonProps.content}
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel').firstChild).toHaveClass(
      `${iotPrefix}--side-panel--end`
    );
  });
});
