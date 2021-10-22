import { render, screen } from '@testing-library/react';
import React from 'react';
import { gray60 } from '@carbon/colors';

import Attribute from './Attribute';

const commonProps = {
  attributeCount: 1,
  isNumberValueCompact: true,
  testId: 'attribute-test',
  attribute: {
    label: 'Test',
    unit: '%',
    precision: 5,
    thresholds: [
      {
        comparison: '<=',
        value: 90,
        color: 'yellow',
        icon: 'warning',
      },
    ],
  },
  fontSize: 20,
  value: 89,
};
describe('Attribute', () => {
  it('falls back to gray60 when no secondaryValue.color given', () => {
    render(<Attribute {...commonProps} secondaryValue={{ trend: 'up', value: '22' }} />);

    expect(screen.getByText('22')).toHaveStyle(`--secondary-value-color:${gray60}`);
  });

  it('should match values less than or equal to a threshold', () => {
    render(<Attribute {...commonProps} />);

    expect(screen.getByText('89.00000')).toBeVisible();
    const matchingThreshold = screen.getByTitle('<= 90');
    expect(matchingThreshold).toBeVisible();

    // for some weird reason, the following doesn't work. Falling back to a more
    // manual method for testing svg attributes.
    // expect(matchingThreshold).toHaveAttribute('fill', 'yellow');
    expect(matchingThreshold.getAttribute('fill')).toEqual('yellow');
  });

  it('should not match thresholds when an invalid comparison is passed', () => {
    const { error } = console;
    console.error = jest.fn();
    render(
      <Attribute
        {...commonProps}
        attribute={{
          label: 'Test',
          unit: '%',
          precision: 5,
          thresholds: [
            {
              comparison: '===',
              value: 90,
              color: 'yellow',
              icon: 'warning',
            },
          ],
        }}
        value={90}
      />
    );

    expect(screen.queryByTitle('=== 90')).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Invalid prop `attribute.thresholds[0].comparison` of value `===` supplied to `Attribute`'
      )
    );
    console.error = error;
  });

  it('should not render a trend icon when an invalid trend is passed to secondaryValue', () => {
    const { error } = console;
    console.error = jest.fn();
    render(
      <Attribute
        {...commonProps}
        secondaryValue={{
          trend: 'left',
          value: '100',
        }}
      />
    );

    expect(screen.queryByTestId('attribute-test-trending-up')).toBeNull();
    expect(screen.queryByTestId('attribute-test-trending-down')).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed prop type: Invalid prop `secondaryValue.trend` of value `left` supplied to `Attribute`'
      )
    );
    console.error = error;
  });
});
