import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CARD_DATA_STATE, CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import ValueCard from './ValueCard';
import { PREVIEW_DATA } from './valueCardUtils';

const { iotPrefix } = settings;

describe('ValueCard', () => {
  it('should be selectable by testID or testId', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 'value' }}
        testID="VALUE_CARD"
      />
    );
    expect(screen.getByTestId('VALUE_CARD')).toBeDefined();
    expect(screen.getByTestId('VALUE_CARD-attribute-0-threshold-label')).toBeDefined();
    expect(screen.getByTestId('VALUE_CARD-attribute-0-value')).toBeDefined();
    expect(screen.getByTestId('VALUE_CARD-title')).toBeDefined();
    expect(console.error).toHaveBeenCalledWith(
      `Warning: The 'testID' prop has been deprecated. Please use 'testId' instead.`
    );
    console.error.mockReset();
    rerender(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 'value' }}
        testID="value_card"
      />
    );
    expect(screen.getByTestId('value_card')).toBeDefined();
    expect(screen.getByTestId('value_card-attribute-0-threshold-label')).toBeDefined();
    expect(screen.getByTestId('value_card-attribute-0-value')).toBeDefined();
    expect(screen.getByTestId('value_card-title')).toBeDefined();
  });

  it('DataState prop shows DataState elements instead of content', () => {
    const { container, rerender } = render(
      <ValueCard
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 'value' }}
      />
    );
    expect(container.querySelectorAll(`.${iotPrefix}--data-state-container`)).toHaveLength(0);

    rerender(
      <ValueCard
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        dataState={{
          type: CARD_DATA_STATE.NO_DATA,
          label: '-',
          description: '-',
        }}
        values={{ v: 'value' }}
      />
    );
    expect(container.querySelectorAll(`.${iotPrefix}--data-state-container`)).toHaveLength(1);
  });

  it('Id is passed down to the card', () => {
    const { container } = render(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 'value' }}
      />
    );
    expect(container.querySelectorAll('#myIdTest')).toHaveLength(1);
  });

  it('Custom formatter is used', () => {
    let originalValue = '';
    let defaultFormattedValue = '';
    const testValue = 'Test Value!';

    render(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v' }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 10000 }}
        customFormatter={(formatted, original) => {
          originalValue = original;
          defaultFormattedValue = formatted;

          return testValue;
        }}
      />
    );

    expect(originalValue).toBe(10000);
    expect(defaultFormattedValue).toBe('10,000');
    expect(screen.queryByText(testValue)).toBeTruthy();
  });
  it('Precision value for attribute is used', () => {
    const { rerender } = render(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v', precision: 2 }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 10000 }}
      />
    );
    expect(screen.queryByText('10,000.00')).toBeTruthy();

    rerender(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v', precision: 1 }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 10000 }}
      />
    );
    expect(screen.queryByText('10,000.0')).toBeTruthy();
  });

  it('should render a span when no onAttributeClick provided', () => {
    render(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v', precision: 2 }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 10000 }}
      />
    );
    expect(screen.queryByText('10,000.00').tagName).toEqual('SPAN');
  });

  it('should use onAttributeClick when provided', () => {
    const onAttributeClick = jest.fn();
    render(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{ attributes: [{ label: 'title', dataSourceId: 'v', precision: 2 }] }}
        size={CARD_SIZES.SMALL}
        values={{ v: 10000 }}
        onAttributeClick={onAttributeClick}
      />
    );
    const button = screen.queryByText('10,000.00');
    userEvent.click(button);
    expect(button.tagName).toEqual('BUTTON');
    expect(onAttributeClick).toHaveBeenCalledWith({ dataSourceId: 'v', value: 10000 });
  });

  it('should show PREVIEW_DATA as primary value when editable and no data', () => {
    render(
      <ValueCard
        id="myIdTest"
        title="Health score"
        content={{
          attributes: [
            {
              label: 'title',
              dataSourceId: 'v',
              precision: 2,
              secondaryValue: {
                dataSourceId: 'trend',
                trend: 'down',
                color: 'red',
              },
            },
          ],
        }}
        size={CARD_SIZES.SMALL}
        isEditable
      />
    );
    const previewData = screen.getAllByText(PREVIEW_DATA);
    expect(previewData).toHaveLength(1);
    expect(previewData[0]).toHaveClass(`${iotPrefix}--value-card__value-renderer--value`);
  });
});
