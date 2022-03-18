import React from 'react';
import { render, screen } from '@testing-library/react';

import { settings } from '../../constants/Settings';

import ReadOnlyValue from './ReadOnlyValue';

const { iotPrefix } = settings;

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
    expect(
      container.querySelector(
        `.${iotPrefix}--read-only-value.${iotPrefix}--read-only-value__stacked`
      )
    ).toBeDefined();
    expect(screen.getByText(label)).toBeDefined();
    expect(screen.getByText(value)).toBeDefined();
  });
  it('render inline', () => {
    const [label, value] = ['label-test01', 'some testing value'];
    const { container } = render(<ReadOnlyValue label={label} value={value} type="inline" />);
    expect(container.querySelector(`.${iotPrefix}--read-only-value`)).toBeDefined();
    expect(container.querySelector(`.${iotPrefix}--read-only-value__stacked`)).toBeNull();
    expect(screen.getByText(label)).toBeDefined();
    expect(screen.getByText(value)).toBeDefined();
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
});
