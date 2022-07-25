import React from 'react';
import { render, screen } from '@testing-library/react';
import { Edit16, Information16, SendAlt16 } from '@carbon/icons-react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';
import Button from '../Button';

import SidePanel from './SidePanel';

const { iotPrefix } = settings;

describe('SidePanel Component Test', () => {
  const commonProps = {
    title: 'test title',
    subtitle: 'test content',
  };
  const mockOnToggle = jest.fn();
  const mockOnPrimaryClick = jest.fn();
  const mockOnSecondaryClick = jest.fn();
  const editButtonFunc = jest.fn();
  const infoButtonFunc = jest.fn();
  const sendButtonFunc = jest.fn();
  const actionItemButtons = [
    {
      buttonLabel: 'Edit',
      buttonIcon: Edit16,
      buttonCallback: editButtonFunc,
    },
    {
      buttonLabel: 'Info',
      buttonIcon: Information16,
      buttonCallback: infoButtonFunc,
    },
    {
      buttonLabel: 'Send',
      buttonIcon: SendAlt16,
      buttonCallback: sendButtonFunc,
    },
  ];
  const actionItemSlot = (
    <Button size="field" kind="primary">
      Action button
    </Button>
  );

  it('should be selectable by testId', () => {
    render(
      <SidePanel
        {...commonProps}
        actionItems={actionItemButtons}
        isOpen
        onToggle={mockOnToggle}
        onPrimaryButtonClick={mockOnPrimaryClick}
        onSecondaryButtonClick={mockOnSecondaryClick}
      >
        This is content
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel')).toBeDefined();
    expect(screen.getByTestId('side-panel-toggle-button')).toBeDefined();
    expect(screen.getByTestId('side-panel-title')).toBeDefined();
    expect(screen.getByTestId('side-panel-subtitle')).toBeDefined();
    expect(screen.getByTestId('side-panel-content')).toBeDefined();
    expect(screen.getByTestId('side-panel-footer')).toBeDefined();
    expect(screen.getByTestId('side-panel-action-bar')).toBeDefined();
    expect(screen.getByTestId('side-panel-action-button-Edit')).toBeDefined();
    expect(screen.getByTestId('side-panel-action-button-Info')).toBeDefined();
    expect(screen.getByTestId('side-panel-action-button-Send')).toBeDefined();
    expect(screen.getByTestId('side-panel-secondary-button')).toBeDefined();
    expect(screen.getByTestId('side-panel-primary-button')).toBeDefined();
  });

  it('should render slide-over panel', () => {
    render(
      <SidePanel {...commonProps} type="over">
        This is content
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--sidepanel--slide-over`);
  });

  it('should render inline panel', () => {
    render(
      <SidePanel {...commonProps} type="inline" onToggle={mockOnToggle}>
        This is content
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--sidepanel--inline`);
    expect(screen.getByTestId('side-panel-toggle-button')).toBeTruthy();
  });

  it('should not show close button when closed but show when opened', () => {
    const { rerender } = render(
      <SidePanel {...commonProps} onToggle={mockOnToggle}>
        This is content
      </SidePanel>
    );
    expect(screen.queryByTestId('side-panel-toggle-button')).toBeNull();
    rerender(
      <SidePanel {...commonProps} onToggle={mockOnToggle} isOpen direction="left">
        This is content
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel-toggle-button')).toBeTruthy();
  });

  it('should only render title if defined', () => {
    const { rerender } = render(<SidePanel>This is content</SidePanel>);
    expect(screen.queryByTestId('side-panel-title')).toBeNull();
    rerender(<SidePanel {...commonProps}>This is content</SidePanel>);
    expect(screen.getByTestId('side-panel-title')).toBeTruthy();
  });

  it('should only render subtitle if defined', () => {
    const { rerender } = render(<SidePanel direction="left">This is content</SidePanel>);
    expect(screen.queryByTestId('side-panel-subtitle')).toBeNull();
    rerender(
      <SidePanel {...commonProps} direction="right">
        This is content
      </SidePanel>
    );
    expect(screen.getByTestId('side-panel-subtitle')).toBeTruthy();
  });

  it('should render action items only if action items are defined', () => {
    const { rerender } = render(<SidePanel {...commonProps}>This is content</SidePanel>);
    expect(screen.queryByTestId('side-panel-action-bar')).toBeNull();
    rerender(
      <SidePanel {...commonProps} actionItems={actionItemButtons}>
        This is content
      </SidePanel>
    );
    expect(screen.queryByTestId('side-panel-action-bar')).toBeTruthy();
    userEvent.click(screen.getByTestId('side-panel-action-button-Edit'));
    expect(editButtonFunc).toHaveBeenCalled();
  });

  it('should render footer only if callbacks are defined', () => {
    const { rerender } = render(<SidePanel>This is content</SidePanel>);
    expect(screen.queryByTestId('side-panel-footer')).toBeNull();
    rerender(
      <SidePanel
        {...commonProps}
        onSecondaryButtonClick={mockOnSecondaryClick}
        onPrimaryButtonClick={mockOnPrimaryClick}
      >
        This is content
      </SidePanel>
    );
    userEvent.click(screen.getByTestId('side-panel-secondary-button'));
    userEvent.click(screen.getByTestId('side-panel-primary-button'));
    expect(screen.getByTestId('side-panel-secondary-button')).toBeDefined();
    expect(screen.getByTestId('side-panel-primary-button')).toBeDefined();
    expect(mockOnSecondaryClick).toHaveBeenCalled();
    expect(mockOnPrimaryClick).toHaveBeenCalled();
  });

  it('should render panel in busy state and with button in actionItems slot', () => {
    const { container } = render(
      <SidePanel
        {...commonProps}
        onToggle={mockOnToggle}
        onSecondaryButtonClick={mockOnSecondaryClick}
        onPrimaryButtonClick={mockOnPrimaryClick}
        actionItems={actionItemSlot}
        isOpen
        isBusy
      >
        This is content
      </SidePanel>
    );
    expect(container.querySelector('.iot--sidepanel__toggle-button')).toHaveProperty(
      'disabled',
      true
    );
    expect(container.querySelector('.iot--sidepanel__footer__secondary-button')).toHaveProperty(
      'disabled',
      true
    );
    expect(container.querySelector('.iot--sidepanel__footer__primary-button')).toHaveProperty(
      'disabled',
      true
    );
    expect(screen.getByTestId('side-panel-action-bar')).toBeDefined();
    expect(screen.getByTestId('Button')).toBeDefined();
  });
});
