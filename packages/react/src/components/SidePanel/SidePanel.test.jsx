import React from 'react';
import { render, screen } from '@testing-library/react';
import { Edit16, Information16, SendAlt16 } from '@carbon/icons-react';

import Button from '../Button/Button';
import { settings } from '../../constants/Settings';

import SidePanel from './SidePanel';

const { iotPrefix } = settings;
const primaryButton = (
  <Button
    testId="buttonIcon1"
    kind="primary"
    onClick={() => {
      console.log('Clicked on the primary button');
    }}
  >
    Initiate
  </Button>
);

const secondaryButton = (
  <Button
    testId="buttonIcon2"
    kind="secondary"
    onClick={() => {
      console.log('Clicked on the secondary button');
    }}
  >
    Cancel
  </Button>
);

const iconButtons = [
  <Button
    data-testid="icon1"
    hasIconOnly
    kind="ghost"
    renderIcon={Edit16}
    onClick={() => console.log('icon clicked')}
    size="small"
  />,
  <Button
    data-testid="icon2"
    hasIconOnly
    kind="ghost"
    renderIcon={Information16}
    onClick={() => console.log('icon clicked')}
    size="small"
  />,
  <Button
    data-testid="icon3"
    hasIconOnly
    kind="ghost"
    renderIcon={SendAlt16}
    onClick={() => console.log('icon clicked')}
    size="small"
  />,
];

describe('SidePanel Component Test', () => {
  const commonProps = {
    title: 'test title',
    content: 'test content',
    open: true,
  };

  it('should be selectable by testId', () => {
    render(<SidePanel {...commonProps} testId="side-panel" icons={iconButtons} />);
    expect(screen.getByTestId('side-panel')).toBeDefined();
    expect(screen.getByTestId('side-panel-title')).toBeDefined();
    expect(screen.getByTestId('side-panel-content')).toBeDefined();
    expect(screen.getByTestId('side-panel-footer')).toBeDefined();
    expect(screen.getByTestId('side-panel-action-bar')).toBeDefined();
  });

  it('should render slide over side panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideOver />);
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--slide-over`);
  });

  it('should render slide in side panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideIn />);
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--slide-in`);
  });

  it('should render inline side panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" inline />);
    expect(screen.getByTestId('side-panel')).toHaveClass(`${iotPrefix}--side-panel--inline`);
  });

  it('should show close button in slide over side panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideOver showCloseButton open />);
    expect(screen.queryByTestId('close-button')).toBeDefined();
  });

  it('should show primary button and secondary button in slide over side panel', () => {
    render(
      <SidePanel
        {...commonProps}
        testId="side-panel"
        slideOver
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
      />
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Initiate' })).toBeDefined();
  });

  it('should not show close button in slide in side panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" slideIn />);
    expect(screen.queryByTestId('close-button')).toBeNull();
  });

  it('should show close button in inline side panel', () => {
    render(<SidePanel {...commonProps} testId="side-panel" inline showDrawer open />);
    expect(screen.getByTestId('close-button')).toBeDefined();
  });

  it('should show action bar in slide over side panel', () => {
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
  });
});
