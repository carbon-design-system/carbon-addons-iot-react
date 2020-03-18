import { render, fireEvent, waitForElement } from '@testing-library/react';
import React from 'react';
import { mount } from 'enzyme';

import { CARD_ACTIONS } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import CardRangePicker from './CardRangePicker';

const { iotPrefix } = settings;

describe('CardRangePicker', () => {
  const mockOnCardAction = jest.fn();
  const overflowMenuDescription = 'Open and close list of options';
  const defaultLabel = 'Default';
  const last24HoursLabel = 'Last 24 Hours';
  const thisWeekLabel = 'This week';

  test('card editable actions', async done => {
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
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'default',
    });
    mockOnCardAction.mockClear();
    // Reopen menu
    fireEvent.click(getByTitle(overflowMenuDescription));
    const last24Hours = await waitForElement(() => getByText(last24HoursLabel));
    fireEvent.click(last24Hours);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'last24Hours',
    });
    mockOnCardAction.mockClear();

    // Reopen menu
    fireEvent.click(getByTitle(overflowMenuDescription));
    mockOnCardAction.mockClear();
    const thisWeek = await waitForElement(() => getByText(thisWeekLabel));
    fireEvent.click(thisWeek);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'thisWeek',
    });
    done();
  });

  test('show time range label when enough space', () => {
    const wrapper = mount(
      <CardRangePicker
        i18n={{
          thisWeekLabel,
        }}
        onCardAction={mockOnCardAction}
        cardWidth={500}
        timeRange="thisWeek"
      />
    );
    expect(wrapper.find(`.${iotPrefix}--card--toolbar-timerange-label`)).toHaveLength(1);

    const wrapper2 = mount(
      <CardRangePicker
        i18n={{
          thisWeekLabel,
        }}
        onCardAction={mockOnCardAction}
        cardWidth={229}
        timeRange="thisWeek"
      />
    );
    expect(wrapper2.find(`.${iotPrefix}--card--toolbar-timerange-label`)).toHaveLength(0);
  });
});
