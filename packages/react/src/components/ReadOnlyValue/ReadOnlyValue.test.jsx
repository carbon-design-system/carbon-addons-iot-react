import React from 'react';
import { render, screen } from '@testing-library/react';

import { settings } from '../../constants/Settings';

import ReadOnlyValue from './ReadOnlyValue';

const { iotPrefix, prefix } = settings;

describe('ReadOnlyValue', () => {
  it('should be able to be selected by testId', () => {
    render(<ReadOnlyValue testId="readOnlyValue" />);
    expect(screen.getByTestId('readOnlyValue')).toBeDefined();
    expect(screen.getByTestId('readOnlyValue--label')).toBeDefined();
    expect(screen.getByTestId('readOnlyValue--value')).toBeDefined();
  });
  it('render stacked', () => {
    const [label, value] = ['label-test01', 'some testing value'];
    const { container } = render(<ReadOnlyValue label={label} value={value} />);
    expect(container.querySelector(`.${iotPrefix}--read-only-value`)).toBeDefined();
    expect(container.querySelector(`${iotPrefix}--read-only-value__inline`)).toBeNull();
    expect(screen.getByText(label)).toBeDefined();
    expect(screen.getByDisplayValue(value)).toBeDefined();
  });
  it('render inline', () => {
    const [label, value] = ['label-test01', 'some testing value'];
    const { container } = render(<ReadOnlyValue label={label} value={value} type="inline" />);
    expect(container.querySelector(`.${iotPrefix}--read-only-value__inline`)).toBeDefined();
    expect(container.querySelector(`.${iotPrefix}--read-only-value__inline-small`)).toBeNull();
    expect(screen.getByText(label)).toBeDefined();
    expect(screen.getByDisplayValue(value)).toBeDefined();
  });
  it('render inline small', () => {
    const [label, value] = ['label-test01', 'some testing value'];
    const { container } = render(<ReadOnlyValue label={label} value={value} type="inline_small" />);
    expect(container.querySelector(`.${iotPrefix}--read-only-value__inline`)).toBeDefined();
    expect(container.querySelector(`.${iotPrefix}--read-only-value__inline-small`)).toBeDefined();
    expect(screen.getByText(label)).toBeDefined();
    expect(screen.getByDisplayValue(value)).toBeDefined();
  });
  it('render custom classname', () => {
    const { container } = render(
      <ReadOnlyValue
        label="label-test01'"
        value="some testing value"
        type="inline"
        className="mycustom-class"
      />
    );
    expect(container.querySelector(`.${iotPrefix}--read-only-value`)).toBeDefined();
    expect(container.querySelector(`.${iotPrefix}--read-only-value__stacked`)).toBeNull();
    expect(container.querySelector('mycustom-class')).toBeDefined();
  });

  it('should display skeleton loader', () => {
    const [label, value] = ['label-test01', 'some testing value'];
    const { container } = render(<ReadOnlyValue label={label} value={value} isLoading />);

    expect(screen.queryByText(label)).toBeDefined();
    expect(screen.queryByText(value)).toBeNull();
    expect(container.querySelector(`.${prefix}--skeleton__text`)).toBeInTheDocument();
    expect(container.querySelectorAll(`.${prefix}--skeleton__text`)).toHaveLength(1);
  });

  it('should pass prop to skeleton loaders', () => {
    const [label, value] = ['label-test01', 'some testing value'];
    const { container } = render(
      <ReadOnlyValue
        label={label}
        value={value}
        isLoading
        skeletonLoadingValue={{ className: 'test-class-2' }}
      />
    );

    expect(container.querySelectorAll(`.${prefix}--skeleton__text`)[0]).toHaveClass('test-class-2');
  });
});
