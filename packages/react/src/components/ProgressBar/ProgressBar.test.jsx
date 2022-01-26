import React from 'react';
import { render, screen } from '@testing-library/react';
import { CheckmarkFilled16, WarningAltFilled16, WarningFilled16 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';

import ProgressBar from './ProgressBar';

const { iotPrefix } = settings;

describe('ProgressBar', () => {
  it('should render by default without an icon', () => {
    render(<ProgressBar label="A progress label" value={40} />);
    expect(screen.queryByTestId('progress-bar-icon')).toBeNull();
    expect(screen.getByLabelText('A progress label')).toBeVisible();
  });

  it('should render an icon when renderIcon is given', () => {
    render(
      <ProgressBar
        label="A progress label"
        value={40}
        renderIcon={() => <WarningFilled16 aria-label="warning filled 16" />}
      />
    );
    expect(screen.getByTestId('progress-bar-icon')).toBeVisible();
    expect(screen.getByLabelText('warning filled 16')).toBeVisible();
  });

  it('should render an icon by string when renderIconByName is given', () => {
    render(
      <ProgressBar
        label="A progress label"
        value={40}
        renderIconByName={(name) => {
          switch (name) {
            case 'warning':
              return <WarningFilled16 aria-label="warning filled 16" />;
            default:
              return null;
          }
        }}
        renderIcon="warning"
      />
    );
    expect(screen.getByTestId('progress-bar-icon')).toBeVisible();
    expect(screen.getByLabelText('warning filled 16')).toBeVisible();
  });

  it('should render different colors based on thresholds', () => {
    const thresholds = [
      {
        comparison: '<',
        value: 40,
        color: 'green',
        icon: CheckmarkFilled16,
      },
      {
        comparison: (value) => value >= 50 && value <= 75,
        color: 'yellow',
        icon: (props) => <WarningAltFilled16 {...props} />,
      },
      {
        comparison: '>',
        value: 75,
        color: 'red',
        icon: () => <WarningFilled16 aria-label="warning-filled-16" fill="purple" />,
      },
    ];

    const { rerender } = render(
      <ProgressBar label="A progress label" value={33} thresholds={thresholds} />
    );
    expect(screen.getByLabelText('progress bar icon')).toBeVisible();
    expect(screen.getByLabelText('progress bar icon')).toHaveAttribute('fill', 'green');

    rerender(<ProgressBar label="A progress label" value={51} thresholds={thresholds} />);
    expect(screen.getByLabelText('progress bar icon')).toBeVisible();
    expect(screen.getByLabelText('progress bar icon')).toHaveAttribute('fill', 'yellow');

    rerender(<ProgressBar label="A progress label" value={80} thresholds={thresholds} />);
    expect(screen.getByLabelText('warning-filled-16')).toBeVisible();
    expect(screen.getByLabelText('warning-filled-16')).toHaveAttribute('fill', 'purple');
  });

  it('should apply the `over` class when value exceeds max', () => {
    const { container } = render(<ProgressBar label="A progress label" value={101} max={100} />);
    expect(container.querySelector(`.${iotPrefix}--progress-bar__value-label--over`)).toBeVisible();
  });

  it('should apply matching threshold color to `over` class when value exceeds max', () => {
    const thresholds = [
      {
        comparison: '>',
        value: 75,
        color: {
          fill: 'red',
          stroke: 'white',
        },
        icon: WarningFilled16,
      },
    ];

    render(<ProgressBar label="A progress label" value={101} thresholds={thresholds} max={100} />);
    expect(screen.getByLabelText('progress bar icon')).toBeVisible();
    expect(screen.getByLabelText('progress bar icon')).toHaveAttribute('fill', 'red');
    expect(screen.getByTestId('progress-bar-container')).toHaveStyle(
      '--progress-bar-fill-color:red'
    );
    expect(screen.getByTestId('progress-bar-container')).toHaveStyle(
      '--progress-bar-stroke-color:white'
    );
    expect(screen.getByText('101%')).toHaveClass(`${iotPrefix}--progress-bar__value-label--over`);
  });
});
