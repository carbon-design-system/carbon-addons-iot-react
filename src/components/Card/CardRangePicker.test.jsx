import { render, fireEvent, waitForElement } from '@testing-library/react';
import React from 'react';

import CardRangePicker from './CardRangePicker';

describe('CardRangePicker', () => {
  test('card editable actions', async done => {
    const mockOnCardAction = jest.fn();
    const overflowMenuDescription = 'Open and close list of options';
    const defaultLabel = 'Default';
    const last24HoursLabel = 'Last 24 Hours';
    const thisWeekLabel = 'This week';
    const CHANGE_TIME_RANGE = 'CHANGE_TIME_RANGE';
    const { getByTitle, getByText } = render(
      <CardRangePicker
        i18n={{
          overflowMenuDescription,
          defaultLabel,
          last24HoursLabel,
          thisWeekLabel,
        }}
        onCardAction={mockOnCardAction}
      />
    );
    fireEvent.click(getByTitle(overflowMenuDescription));
    // Click on the default
    const defaultRange = await waitForElement(() => getByText(defaultLabel));
    fireEvent.click(defaultRange);
    expect(mockOnCardAction).toHaveBeenCalledWith(CHANGE_TIME_RANGE, { range: 'default' });
    mockOnCardAction.mockClear();
    // Reopen menu
    fireEvent.click(getByTitle(overflowMenuDescription));
    const last24Hours = await waitForElement(() => getByText(last24HoursLabel));
    fireEvent.click(last24Hours);
    expect(mockOnCardAction).toHaveBeenCalledWith(CHANGE_TIME_RANGE, { range: 'last24Hours' });
    mockOnCardAction.mockClear();

    // Reopen menu
    fireEvent.click(getByTitle(overflowMenuDescription));
    mockOnCardAction.mockClear();
    const thisWeek = await waitForElement(() => getByText(thisWeekLabel));
    fireEvent.click(thisWeek);
    expect(mockOnCardAction).toHaveBeenCalledWith(CHANGE_TIME_RANGE, { range: 'thisWeek' });
    done();
  });
});
