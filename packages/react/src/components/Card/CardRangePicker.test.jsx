import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { mount } from 'enzyme';

import { CARD_ACTIONS } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import CardRangePicker from './CardRangePicker';

const { iotPrefix } = settings;

describe('CardRangePicker', () => {
  const mockOnCardAction = jest.fn();
  const selectTimeRangeLabel = 'Select time range';
  const defaultLabel = 'Default';
  const last24HoursLabel = 'Last 24 Hours';
  const thisWeekLabel = 'This week';

  const defaultTimeRangeOptions = {
    last24Hours: last24HoursLabel,
    last7Days: 'Last 7 days',
    lastMonth: 'Last month',
    lastQuarter: 'Last quarter',
    lastYear: 'Last year',
    thisWeek: thisWeekLabel,
    thisMonth: 'This month',
    thisQuarter: 'This quarter',
    thisYear: 'This year',
  };

  it('card editable actions', async () => {
    render(
      <CardRangePicker
        i18n={{
          selectTimeRangeLabel,
          defaultLabel,
          last24HoursLabel,
          thisWeekLabel,
        }}
        cardWidth={500}
        timeRangeOptions={defaultTimeRangeOptions}
        onCardAction={mockOnCardAction}
      />
    );
    fireEvent.click(screen.getAllByTitle(selectTimeRangeLabel)[0]);
    // Click on the default
    const defaultRange = await screen.getAllByText(defaultLabel)[1];
    fireEvent.click(defaultRange);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'default',
    });
    mockOnCardAction.mockClear();
    // Reopen menu
    fireEvent.click(screen.getAllByTitle(selectTimeRangeLabel)[0]);
    const last24Hours = await screen.findByText(last24HoursLabel);
    fireEvent.click(last24Hours);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'last24Hours',
    });
    mockOnCardAction.mockClear();

    // Reopen menu
    fireEvent.click(screen.getAllByTitle(selectTimeRangeLabel)[0]);
    mockOnCardAction.mockClear();
    const thisWeek = await screen.findByText(thisWeekLabel);
    fireEvent.click(thisWeek);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'thisWeek',
    });
  });

  it('show time range label when enough space', () => {
    const wrapper = mount(
      <CardRangePicker
        i18n={{
          thisWeekLabel,
        }}
        onCardAction={mockOnCardAction}
        cardWidth={500}
        timeRange="thisWeek"
        timeRangeOptions={defaultTimeRangeOptions}
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
        timeRangeOptions={defaultTimeRangeOptions}
      />
    );
    expect(wrapper2.find(`.${iotPrefix}--card--toolbar-timerange-label--hidden`)).toHaveLength(1);
  });

  it('should show custom time range options', async () => {
    const last2hoursLabel = 'Last 2 Hours';
    const customTimeRangeOptions = {
      last8Hours: 'Last 8 Hours',
      last4Hours: 'Last 4 Hours',
      last2Hours: last2hoursLabel,
      lastHour: 'Last Hour',
      this8Hours: 'This 8 Hours',
      this4Hours: 'This 4 Hours',
      this2Hours: 'This 2 Hours',
      thisHour: 'This Hour',
    };

    render(
      <CardRangePicker
        i18n={{
          selectTimeRangeLabel,
          defaultLabel,
          last24HoursLabel,
          thisWeekLabel,
        }}
        timeRangeOptions={customTimeRangeOptions}
        onCardAction={mockOnCardAction}
      />
    );

    // first click the CardRangePicker
    fireEvent.click(screen.getAllByTitle(selectTimeRangeLabel)[0]);
    // then find the options
    const last2hours = await screen.findByText(last2hoursLabel);
    fireEvent.click(last2hours);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'last2Hours',
    });
    mockOnCardAction.mockClear();
  });
});
