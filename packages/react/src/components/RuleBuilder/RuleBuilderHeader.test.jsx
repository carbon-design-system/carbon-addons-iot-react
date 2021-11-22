import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { settings } from '../../constants/Settings';

import RuleBuilderHeader from './RuleBuilderHeader';

const { iotPrefix } = settings;
describe('RuleBuilderHeader', () => {
  it('should render and respond to button clicks.', () => {
    const testId = 'render-test';
    const id = '1';
    const onAddRule = jest.fn();
    const onAddRuleFactory = jest.fn(() => onAddRule);
    const onChange = jest.fn();
    render(
      <RuleBuilderHeader id={id} testId={testId} onAddRule={onAddRuleFactory} onChange={onChange} />
    );
    expect(screen.getByTestId(testId)).toHaveClass(`${iotPrefix}--rule-builder-header`);
    expect(onAddRuleFactory).toHaveBeenCalledTimes(2);
    expect(onAddRuleFactory.mock.calls[0]).toEqual([]);
    expect(onAddRuleFactory.mock.calls[1]).toEqual([undefined, true]);
    fireEvent.click(screen.getByTestId(`${testId}-add-rule-button`));
    expect(onAddRule).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId(`${testId}-add-group-button`));
    expect(onAddRule).toHaveBeenCalledTimes(2);
  });

  it('should call onchange when switching groupLogic', () => {
    const testId = 'render-test';
    const id = '1';
    const onAddRule = jest.fn();
    const onAddRuleFactory = jest.fn(() => onAddRule);
    const onChange = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <RuleBuilderHeader id={id} testID={testId} onAddRule={onAddRuleFactory} onChange={onChange} />
    );
    expect(console.error).toHaveBeenCalledWith(
      `Warning: The 'testID' prop has been deprecated. Please use 'testId' instead.`
    );
    console.error.mockReset();

    fireEvent.click(screen.getByText('ALL'));
    fireEvent.click(screen.getAllByText('ANY')[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ groupLogic: 'ANY', id }, true);
  });

  it('should fallback when i18n is null', async () => {
    const testId = 'render-test';
    const id = '1';
    const onAddRule = jest.fn();
    const onAddRuleFactory = jest.fn(() => onAddRule);
    const onChange = jest.fn();
    render(
      <RuleBuilderHeader
        id={id}
        testID={testId}
        onAddRule={onAddRuleFactory}
        onChange={onChange}
        i18n={null}
      />
    );

    expect((await screen.findAllByText('Add rule')).length).toEqual(1);
  });
});
