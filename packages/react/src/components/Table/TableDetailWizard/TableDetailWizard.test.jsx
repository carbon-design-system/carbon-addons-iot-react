import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableDetailWizard from './TableDetailWizard';
import { itemsAndComponents } from './TableDetailWizard.story';

describe('TableDetailWizard', () => {
  it('Error dialog', () => {
    const onClearError = jest.fn();
    const errorString = 'There is an error';

    render(
      <TableDetailWizard
        currentItemId="step1"
        items={itemsAndComponents}
        title="Create Physical Interface"
        onClose={() => jest.fn()}
        onBack={() => jest.fn()}
        onSubmit={() => jest.fn()}
        error={errorString}
        onClearError={onClearError}
      />
    );
    expect(screen.getByText(errorString)).toBeVisible();
  });
  it('Error dialog without currentItemId', () => {
    const onClearError = jest.fn();
    const errorString = 'There is an error';

    render(
      <TableDetailWizard
        currentItemId=""
        items={itemsAndComponents}
        title="Create Physical Interface"
        onClose={() => jest.fn()}
        onBack={() => jest.fn()}
        onSubmit={() => jest.fn()}
        error={errorString}
        onClearError={onClearError}
      />
    );
    expect(screen.getByText(errorString)).toBeVisible();
  });
  it('Handle Clear error', () => {
    const onClearError = jest.fn();
    const errorString = 'There is an error';

    render(
      <TableDetailWizard
        currentItemId="step1"
        items={itemsAndComponents}
        title="Create Physical Interface"
        onClose={() => jest.fn()}
        onBack={() => jest.fn()}
        onSubmit={() => jest.fn()}
        error={errorString}
        onClearError={onClearError}
      />
    );
    userEvent.click(screen.getByLabelText('close notification'));
    expect(onClearError).toHaveBeenCalledTimes(1);
  });
  it('should not call onClearError when not given', () => {
    const errorString = 'There is an error';
    render(
      <TableDetailWizard
        currentItemId="step1"
        items={itemsAndComponents}
        title="Create Physical Interface"
        onClose={() => jest.fn()}
        onBack={() => jest.fn()}
        onSubmit={() => jest.fn()}
        error={errorString}
      />
    );
    userEvent.click(screen.getByLabelText('close notification'));
    expect(screen.queryByText(errorString)).toBeNull();
  });
  it('should proceed to the next step if onValidate is true', () => {
    const items = itemsAndComponents.map((item) => {
      return {
        ...item,
        onValidate: jest.fn().mockImplementation(() => true),
      };
    });
    const onNext = jest.fn();
    render(
      <TableDetailWizard
        currentItemId="step1"
        items={items}
        title="Create Physical Interface"
        onClose={() => jest.fn()}
        onBack={() => jest.fn()}
        onSubmit={() => jest.fn()}
        onNext={onNext}
      />
    );

    userEvent.click(screen.getByText('Next'));
    expect(onNext).toHaveBeenCalledTimes(2);
    expect(items[0].onValidate).toHaveBeenCalledTimes(1);
    expect(items[0].onValidate).toHaveBeenCalledWith('step1');
  });
});
