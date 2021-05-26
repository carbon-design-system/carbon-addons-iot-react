# `Card` component

## Table of Contents

- [Getting started](#getting-started)
- [Custom card content](#custom-card-content)
- [Props](#props)
- [External links](#external-links)
  - [Source Code](#source-code)
  - [Feedback](#feedback)

## Getting Started

The `Card` component is the foundation of all cards in the library.

## Custom Card Content

```jsx
<Card
  availableActions={{
    expand: true,
    range: true,
  }}
  breakpoint="lg"
  cardDimensions={{
    LARGE: {
      lg: {
        h: 4,
        w: 8,
      },
      max: {
        h: 4,
        w: 8,
      },
      md: {
        h: 4,
        w: 8,
      },
      sm: {
        h: 4,
        w: 4,
      },
      xl: {
        h: 4,
        w: 8,
      },
      xs: {
        h: 4,
        w: 4,
      },
    },
    LARGETHIN: {
      lg: {
        h: 4,
        w: 4,
      },
      max: {
        h: 4,
        w: 4,
      },
      md: {
        h: 4,
        w: 4,
      },
      sm: {
        h: 4,
        w: 4,
      },
      xl: {
        h: 4,
        w: 4,
      },
      xs: {
        h: 4,
        w: 4,
      },
    },
    LARGEWIDE: {
      lg: {
        h: 4,
        w: 16,
      },
      max: {
        h: 4,
        w: 16,
      },
      md: {
        h: 4,
        w: 8,
      },
      sm: {
        h: 4,
        w: 4,
      },
      xl: {
        h: 4,
        w: 16,
      },
      xs: {
        h: 4,
        w: 4,
      },
    },
    MEDIUM: {
      lg: {
        h: 2,
        w: 8,
      },
      max: {
        h: 2,
        w: 8,
      },
      md: {
        h: 2,
        w: 8,
      },
      sm: {
        h: 2,
        w: 4,
      },
      xl: {
        h: 2,
        w: 8,
      },
      xs: {
        h: 2,
        w: 4,
      },
    },
    MEDIUMTHIN: {
      lg: {
        h: 2,
        w: 4,
      },
      max: {
        h: 2,
        w: 4,
      },
      md: {
        h: 2,
        w: 4,
      },
      sm: {
        h: 2,
        w: 2,
      },
      xl: {
        h: 2,
        w: 4,
      },
      xs: {
        h: 2,
        w: 4,
      },
    },
    MEDIUMWIDE: {
      lg: {
        h: 2,
        w: 16,
      },
      max: {
        h: 2,
        w: 16,
      },
      md: {
        h: 2,
        w: 8,
      },
      sm: {
        h: 2,
        w: 4,
      },
      xl: {
        h: 2,
        w: 16,
      },
      xs: {
        h: 2,
        w: 4,
      },
    },
    SMALL: {
      lg: {
        h: 1,
        w: 4,
      },
      max: {
        h: 1,
        w: 4,
      },
      md: {
        h: 1,
        w: 4,
      },
      sm: {
        h: 1,
        w: 2,
      },
      xl: {
        h: 1,
        w: 4,
      },
      xs: {
        h: 1,
        w: 4,
      },
    },
    SMALLFULL: {
      lg: {
        h: 1,
        w: 16,
      },
      max: {
        h: 1,
        w: 16,
      },
      md: {
        h: 1,
        w: 8,
      },
      sm: {
        h: 2,
        w: 8,
      },
      xl: {
        h: 1,
        w: 16,
      },
      xs: {
        h: 1,
        w: 4,
      },
    },
    SMALLWIDE: {
      lg: {
        h: 1,
        w: 8,
      },
      max: {
        h: 1,
        w: 8,
      },
      md: {
        h: 1,
        w: 8,
      },
      sm: {
        h: 2,
        w: 4,
      },
      xl: {
        h: 1,
        w: 8,
      },
      xs: {
        h: 1,
        w: 4,
      },
    },
    TALL: {
      lg: {
        h: 4,
        w: 4,
      },
      max: {
        h: 4,
        w: 4,
      },
      md: {
        h: 4,
        w: 4,
      },
      sm: {
        h: 4,
        w: 4,
      },
      xl: {
        h: 4,
        w: 4,
      },
      xs: {
        h: 4,
        w: 4,
      },
    },
    WIDE: {
      lg: {
        h: 2,
        w: 8,
      },
      max: {
        h: 2,
        w: 8,
      },
      md: {
        h: 2,
        w: 8,
      },
      sm: {
        h: 2,
        w: 4,
      },
      xl: {
        h: 2,
        w: 8,
      },
      xs: {
        h: 2,
        w: 4,
      },
    },
    XLARGE: {
      lg: {
        h: 4,
        w: 16,
      },
      max: {
        h: 4,
        w: 16,
      },
      md: {
        h: 4,
        w: 8,
      },
      sm: {
        h: 4,
        w: 4,
      },
      xl: {
        h: 4,
        w: 16,
      },
      xs: {
        h: 4,
        w: 4,
      },
    },
    XSMALL: {
      lg: {
        h: 1,
        w: 4,
      },
      max: {
        h: 1,
        w: 2,
      },
      md: {
        h: 1,
        w: 4,
      },
      sm: {
        h: 1,
        w: 2,
      },
      xl: {
        h: 1,
        w: 2,
      },
      xs: {
        h: 1,
        w: 4,
      },
    },
    XSMALLWIDE: {
      lg: {
        h: 1,
        w: 4,
      },
      max: {
        h: 1,
        w: 4,
      },
      md: {
        h: 1,
        w: 4,
      },
      sm: {
        h: 2,
        w: 4,
      },
      xl: {
        h: 1,
        w: 4,
      },
      xs: {
        h: 1,
        w: 4,
      },
    },
  }}
  dashboardBreakpoints={{
    lg: 1056,
    max: 1584,
    md: 672,
    sm: 480,
    xl: 1312,
    xs: 320,
  }}
  dashboardColumns={{
    lg: 16,
    max: 16,
    md: 8,
    sm: 8,
    xl: 16,
    xs: 4,
  }}
  hideHeader
  i18n={{
    cloneCardLabel: 'Clone card',
    closeLabel: 'Close',
    dailyLabel: 'Daily',
    defaultLabel: 'Default',
    deleteCardLabel: 'Delete card',
    editCardLabel: 'Edit card',
    errorLoadingDataLabel: 'Error loading data for this card: ',
    errorLoadingDataShortLabel: 'Data error.',
    expandLabel: 'Expand to fullscreen',
    hourlyLabel: 'Hourly',
    last24HoursLabel: 'Last 24 hrs',
    last7DaysLabel: 'Last 7 days',
    lastMonthLabel: 'Last month',
    lastQuarterLabel: 'Last quarter',
    lastYearLabel: 'Last year',
    monthlyLabel: 'Monthly',
    noDataLabel: 'No data is available for this time range.',
    noDataShortLabel: 'No data',
    overflowMenuDescription: 'Open and close list of options',
    periodToDateLabel: 'Period to date',
    rollingPeriodLabel: 'Rolling period',
    selectTimeRangeLabel: 'Select time range',
    thisMonthLabel: 'This month',
    thisQuarterLabel: 'This quarter',
    thisWeekLabel: 'This week',
    thisYearLabel: 'This year',
    timeRangeLabel: 'Time range',
    weeklyLabel: 'Weekly',
  }}
  id="mycard"
  isEditable={false}
  isEmpty={false}
  isExpanded={false}
  isLazyLoading={false}
  isLoading={false}
  layout="HORIZONTAL"
  onBlur={undefined}
  onCardAction={(cardId, action) => {}}
  onFocus={undefined}
  onMouseDown={undefined}
  onMouseUp={undefined}
  onScroll={undefined}
  onTouchEnd={undefined}
  onTouchStart={undefined}
  renderExpandIcon={undefined}
  rowHeight={{
    lg: 144,
    max: 144,
    md: 144,
    sm: 144,
    xl: 144,
    xs: 144,
  }}
  size="MEDIUM"
  tabIndex={undefined}
  testID="Card"
  timeRange={undefined}
  title="Custom Card Title"
  toolbar={undefined}
  values={[
    {
      timestamp: 12341231231,
      value1: 'my value',
    },
  ]}
/>
```

## Props

| Name                            | Type                                                                                                                                                  | Default                                                                   | Description                                                                                                                                        |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                              | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| size                            | enum: <br/>'SMALL'<br/>'SMALLWIDE'<br/>'SMALLFULL'<br/>'MEDIUMTHIN'<br/>'MEDIUM' <br/> 'MEDIUMWIDE' <br/> 'LARGETHIN' <br/> 'LARGE' <br/> 'LARGEWIDE' |                                                                           | card size                                                                                                                                          |
| layout                          | enum: <br/>'VERTICAL'<br/>'HORIZONTAL'<br/>                                                                                                           |                                                                           |                                                                                                                                                    |
| title                           | string                                                                                                                                                | undefined                                                                 |                                                                                                                                                    |
| toolbar                         | element                                                                                                                                               | undefined                                                                 |                                                                                                                                                    |
| hideHeader                      | bool                                                                                                                                                  | false                                                                     |                                                                                                                                                    |
| timeRange                       | string                                                                                                                                                | undefined                                                                 |                                                                                                                                                    |
| isLoading                       | bool                                                                                                                                                  | false                                                                     |                                                                                                                                                    |
| isEmpty                         | bool                                                                                                                                                  | false                                                                     |                                                                                                                                                    |
| isEditable                      | bool                                                                                                                                                  | false                                                                     |                                                                                                                                                    |
| isExpanded                      | bool                                                                                                                                                  | false                                                                     |                                                                                                                                                    |
| isLazyLoading                   | bool                                                                                                                                                  | false                                                                     |                                                                                                                                                    |
| availableActions                | shape                                                                                                                                                 | { edit: false, clone: false, delete: false, range: false, expand: false,} |                                                                                                                                                    |
| availableActions.edit           | bool                                                                                                                                                  |                                                                           |                                                                                                                                                    |
| availableActions.clone          | bool                                                                                                                                                  |                                                                           |                                                                                                                                                    |
| availableActions.delete         | bool                                                                                                                                                  |                                                                           |                                                                                                                                                    |
| availableActions.expand         | bool                                                                                                                                                  |                                                                           |                                                                                                                                                    |
| availableActions.range          | bool                                                                                                                                                  |                                                                           |                                                                                                                                                    |
| renderExpandIcon                | function, node                                                                                                                                        | undefined                                                                 |                                                                                                                                                    |
| rowHeight                       | shape                                                                                                                                                 |                                                                           | Row height in pixels for each layout                                                                                                               |
| rowHeight.lg                    | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| rowHeight.md                    | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| rowHeight.sm                    | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| rowHeight.xs                    | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| breakpoint                      | enum:<br>'lg'<br>'max'<br>'md'<br>'sm'<br>'xl'<br>'xs'<br>                                                                                            |                                                                           |                                                                                                                                                    |
| dashboardBreakpoints            | shape                                                                                                                                                 |                                                                           | media query pixel measurement that determines which particular dashboard layout should be used                                                     |
| dashboardBreakpoints.lg         | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| dashboardBreakpoints.md         | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| dashboardBreakpoints.sm         | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| dashboardBreakpoints.xs         | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| dashboardColumns                | shape                                                                                                                                                 |                                                                           | map of number of columns to a given dashboard layout                                                                                               |
| dashboardColumns.lg             | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| dashboardColumns.md             | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| dashboardColumns.sm             | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| dashboardColumns.xs             | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions                  | shape                                                                                                                                                 |                                                                           | array of configurable sizes to dimensions. The numbered sizes represent the number of columns and rows the card spans at that size and breakpoint. |
| cardDimensions.XSMALL           | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.lg        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.lg.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.lg.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.md        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.md.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.md.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.sm        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.sm.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.sm.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.xs        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.xs.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XSMALL.xs.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL            | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.lg         | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.lg.w       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.lg.h       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.md         | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.md.w       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.md.h       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.sm         | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.sm.w       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.sm.h       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.xs         | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.xs.w       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.SMALL.xs.h       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL             | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.lg          | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.lg.w        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.lg.h        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.md          | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.md.w        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.md.h        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.sm          | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.sm.w        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.sm.h        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.xs          | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.xs.w        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.TALL.xs.h        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM           | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.lg        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.lg.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.lg.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.md        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.md.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.md.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.sm        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.sm.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.sm.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.xs        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.xs.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.MEDIUM.xs.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE             | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.lg          | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.lg.w        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.lg.h        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.md          | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.md.w        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.md.h        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.sm          | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.sm.w        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.sm.h        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.xs          | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.xs.w        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.WIDE.xs.h        | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE            | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.lg         | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.lg.w       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.lg.h       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.md         | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.md.w       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.md.h       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.sm         | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.sm.w       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.sm.h       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.xs         | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.xs.w       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.LARGE.xs.h       | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE           | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.lg        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.lg.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.lg.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.md        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.md.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.md.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.sm        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.sm.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.sm.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.xs        | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.xs.w      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| cardDimensions.XLARGE.xs.h      | number                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n                            | shape                                                                                                                                                 |                                                                           |                                                                                                                                                    |
| i18n.noDataLabel                | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.noDataShortLabel           | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.errorLoadingDataLabel      | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.errorLoadingDataShortLabel | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.rollingPeriodLabel         | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.last24HoursLabel           | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.last7DaysLabel             | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.lastMonthLabel             | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.lastQuarterLabel           | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.lastYearLabel              | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.periodToDateLabel          | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.thisWeekLabel              | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.thisMonthLabel             | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.thisQuarterLabel           | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.thisYearLabel              | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.hourlyLabel                | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.dailyLabel                 | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.weeklyLabel                | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.monthlyLabel               | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.defaultLabel               | node                                                                                                                                                  |                                                                           |                                                                                                                                                    |
| i18n.selectTimeRangeLabel       | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.editCardLabel              | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.cloneCardLabel             | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.deleteCardLabel            | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.expandLabel                | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.closeLabel                 | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.loadingDataLabel           | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| i18n.overflowMenuDescription    | string                                                                                                                                                |                                                                           |                                                                                                                                                    |
| onMouseDown                     | function                                                                                                                                              | undefined                                                                 |                                                                                                                                                    |
| onMouseUp                       | function                                                                                                                                              | undefined                                                                 |                                                                                                                                                    |
| onTouchEnd                      | function                                                                                                                                              | undefined                                                                 |                                                                                                                                                    |
| onTouchStart                    | function                                                                                                                                              | undefined                                                                 |                                                                                                                                                    |
| onScroll                        | function                                                                                                                                              | undefined                                                                 |                                                                                                                                                    |
| onFocus                         | function                                                                                                                                              | undefined                                                                 |                                                                                                                                                    |
| onBlur                          | function                                                                                                                                              | undefined                                                                 |                                                                                                                                                    |
| tabIndex                        | number                                                                                                                                                | undefined                                                                 |                                                                                                                                                    |
| testID                          | string                                                                                                                                                | CardWrapper.defaultProps.testID                                           |                                                                                                                                                    |

## External Links

### Source Code

[Source code](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/src/components/Card)

### Feedback

Help us improve this component by providing feedback, asking questions on Slack, or updating this file on
[GitHub](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/src/components/Card/Card.md).
