# `ValueCard` component

## Table of Contents

- [Getting started](#getting-started)
- [Props](#props)
- [External links](#external-links)
  - [Source Code](#source-code)
  - [Feedback](#feedback)

## Getting Started

## Props

The `Card` component is the foundation of all cards in the library.
| Name | Type | Default | Description |
| :----------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title | string | | |
| id | string | | |
| isLoading | bool | | |
| isEmpty | bool | | |
| isEditable | bool | | |
| isExpanded | bool | | goes full screen if expanded |
| isResizable | bool | | True if the card can be resizable in the DashboardGrid by dragging the borders |
| renderExpandIcon | function, object | | Define the icon render to be rendered. Can be a React component class |
| hideHeader | bool | | should hide the header |
| showOverflow | deprecate(<br/> PropTypes.bool,<br/> '\nThe prop `showOverflow` for Card has been deprecated. It was previously needed for a custom positioned tooltip in the ValueCard, but the ValueCard now uses the default positioning of the tooltip. The `iot--card--wrapper--overflowing` class has been removed. For automated testing, you can target `data-testid="Card"` instead.'<br/>) | | sets the CardWrapper CSS overflow to visible |
| size | enum: <br/>'SMALL'<br/>'SMALLWIDE'<br/>'SMALLFULL'<br/>'MEDIUMTHIN'<br/>'MEDIUM' <br/> 'MEDIUMWIDE' <br/> 'LARGETHIN' <br/> 'LARGE' <br/> 'LARGEWIDE' | | card size |
| layout | enum: <br/>'VERTICAL'<br/>'HORIZONTAL'<br/> | | |
| breakpoint | enum: <br>'lg'<br>'max'<br>'md'<br>'sm'<br>'xl'<br>'xs'<br> | | |
| availableActions | shape | { edit: false, clone: false, delete: false, range: false, expand: false,} | |
| availableActions.edit | bool | | |
| availableActions.clone | bool | | |
| availableActions.delete | bool | | |
| availableActions.expand | bool | | |
| availableActions.range | bool | | |
| i18n | shape | | |
| i18n.noDataLabel | string | | |
| i18n.noDataShortLabel | string | | |
| i18n.errorLoadingDataLabel | string | | |
| i18n.errorLoadingDataShortLabel | string | | |
| i18n.rollingPeriodLabel | string | | |
| i18n.last24HoursLabel | string | | |
| i18n.last7DaysLabel | string | | |
| i18n.lastMonthLabel | string | | |
| i18n.lastQuarterLabel | string | | |
| i18n.lastYearLabel | string | | |
| i18n.periodToDateLabel | string | | |
| i18n.thisWeekLabel | string | | |
| i18n.thisMonthLabel | string | | |
| i18n.thisQuarterLabel | string | | |
| i18n.thisYearLabel | string | | |
| i18n.hourlyLabel | string | | |
| i18n.dailyLabel | string | | |
| i18n.weeklyLabel | string | | |
| i18n.monthlyLabel | string | | |
| i18n.defaultLabel | node | | |
| i18n.selectTimeRangeLabel | string | | |
| i18n.editCardLabel | string | | |
| i18n.cloneCardLabel | string | | |
| i18n.deleteCardLabel | string | | |
| i18n.expandLabel | string | | |
| i18n.closeLabel | string | | |
| i18n.loadingDataLabel | string | | |
| i18n.overflowMenuDescription | string | | |
| tooltip | element | | |
| toolbar | element | | |
| rowHeight | shape | | Row height in pixels for each layout |
| rowHeight.lg | number | | |
| rowHeight.md | number | | |
| rowHeight.sm | number | | |
| rowHeight.xs | number | | |
| dashboardBreakpoints | shape | | media query pixel measurement that determines which particular dashboard layout should be used |
| dashboardBreakpoints.lg | number | | |
| dashboardBreakpoints.md | number | | |
| dashboardBreakpoints.sm | number | | |
| dashboardBreakpoints.xs | number | | |
| dashboardColumns | shape | | map of number of columns to a given dashboard layout |
| dashboardColumns.lg | number | | |
| dashboardColumns.md | number | | |
| dashboardColumns.sm | number | | |
| dashboardColumns.xs | number | | |
| cardDimensions | shape | | array of configurable sizes to dimensions. The numbered sizes represent the number of columns and rows the card spans at that size and breakpoint. |
| cardDimensions.XSMALL | shape | | |
| cardDimensions.XSMALL.lg | shape | | |
| cardDimensions.XSMALL.lg.w | number | | |
| cardDimensions.XSMALL.lg.h | number | | |
| cardDimensions.XSMALL.md | shape | | |
| cardDimensions.XSMALL.md.w | number | | |
| cardDimensions.XSMALL.md.h | number | | |
| cardDimensions.XSMALL.sm | shape | | |
| cardDimensions.XSMALL.sm.w | number | | |
| cardDimensions.XSMALL.sm.h | number | | |
| cardDimensions.XSMALL.xs | shape | | |
| cardDimensions.XSMALL.xs.w | number | | |
| cardDimensions.XSMALL.xs.h | number | | |
| cardDimensions.SMALL | shape | | |
| cardDimensions.SMALL.lg | shape | | |
| cardDimensions.SMALL.lg.w | number | | |
| cardDimensions.SMALL.lg.h | number | | |
| cardDimensions.SMALL.md | shape | | |
| cardDimensions.SMALL.md.w | number | | |
| cardDimensions.SMALL.md.h | number | | |
| cardDimensions.SMALL.sm | shape | | |
| cardDimensions.SMALL.sm.w | number | | |
| cardDimensions.SMALL.sm.h | number | | |
| cardDimensions.SMALL.xs | shape | | |
| cardDimensions.SMALL.xs.w | number | | |
| cardDimensions.SMALL.xs.h | number | | |
| cardDimensions.TALL | shape | | |
| cardDimensions.TALL.lg | shape | | |
| cardDimensions.TALL.lg.w | number | | |
| cardDimensions.TALL.lg.h | number | | |
| cardDimensions.TALL.md | shape | | |
| cardDimensions.TALL.md.w | number | | |
| cardDimensions.TALL.md.h | number | | |
| cardDimensions.TALL.sm | shape | | |
| cardDimensions.TALL.sm.w | number | | |
| cardDimensions.TALL.sm.h | number | | |
| cardDimensions.TALL.xs | shape | | |
| cardDimensions.TALL.xs.w | number | | |
| cardDimensions.TALL.xs.h | number | | |
| cardDimensions.MEDIUM | shape | | |
| cardDimensions.MEDIUM.lg | shape | | |
| cardDimensions.MEDIUM.lg.w | number | | |
| cardDimensions.MEDIUM.lg.h | number | | |
| cardDimensions.MEDIUM.md | shape | | |
| cardDimensions.MEDIUM.md.w | number | | |
| cardDimensions.MEDIUM.md.h | number | | |
| cardDimensions.MEDIUM.sm | shape | | |
| cardDimensions.MEDIUM.sm.w | number | | |
| cardDimensions.MEDIUM.sm.h | number | | |
| cardDimensions.MEDIUM.xs | shape | | |
| cardDimensions.MEDIUM.xs.w | number | | |
| cardDimensions.MEDIUM.xs.h | number | | |
| cardDimensions.WIDE | shape | | |
| cardDimensions.WIDE.lg | shape | | |
| cardDimensions.WIDE.lg.w | number | | |
| cardDimensions.WIDE.lg.h | number | | |
| cardDimensions.WIDE.md | shape | | |
| cardDimensions.WIDE.md.w | number | | |
| cardDimensions.WIDE.md.h | number | | |
| cardDimensions.WIDE.sm | shape | | |
| cardDimensions.WIDE.sm.w | number | | |
| cardDimensions.WIDE.sm.h | number | | |
| cardDimensions.WIDE.xs | shape | | |
| cardDimensions.WIDE.xs.w | number | | |
| cardDimensions.WIDE.xs.h | number | | |
| cardDimensions.LARGE | shape | | |
| cardDimensions.LARGE.lg | shape | | |
| cardDimensions.LARGE.lg.w | number | | |
| cardDimensions.LARGE.lg.h | number | | |
| cardDimensions.LARGE.md | shape | | |
| cardDimensions.LARGE.md.w | number | | |
| cardDimensions.LARGE.md.h | number | | |
| cardDimensions.LARGE.sm | shape | | |
| cardDimensions.LARGE.sm.w | number | | |
| cardDimensions.LARGE.sm.h | number | | |
| cardDimensions.LARGE.xs | shape | | |
| cardDimensions.LARGE.xs.w | number | | |
| cardDimensions.LARGE.xs.h | number | | |
| cardDimensions.XLARGE | shape | | |
| cardDimensions.XLARGE.lg | shape | | |
| cardDimensions.XLARGE.lg.w | number | | |
| cardDimensions.XLARGE.lg.h | number | | |
| cardDimensions.XLARGE.md | shape | | |
| cardDimensions.XLARGE.md.w | number | | |
| cardDimensions.XLARGE.md.h | number | | |
| cardDimensions.XLARGE.sm | shape | | |
| cardDimensions.XLARGE.sm.w | number | | |
| cardDimensions.XLARGE.sm.h | number | | |
| cardDimensions.XLARGE.xs | shape | | |
| cardDimensions.XLARGE.xs.w | number | | |
| cardDimensions.XLARGE.xs.h | number | | |
| renderIconByName | function | | optional function that should return an icon react element based on a icon name, it is called back with the icon name and then an object containing additional icon properties to add to the rendered icon |
| onMouseDown | function | | Event handlers needed for Dashboard Grid - isEditable |
| onMouseUp | function | | |
| onTouchEnd | function | | |
| onTouchStart | function | | |
| onScroll | function | | |
| onFocus | function | | Optional event handlers |
| onBlur | function | | |
| tabIndex | number | | Optionally adds tab index to card container |
| testID | string | | For testing |
| locale | string | 'en' | the locale of the card, needed for number and date formatting |
| resizeHandles | array | | a way to pass down dashboard grid resize handles, only used by other card types |
| renderEditContent | function | | Optional callback function that is passed an onChange function and the original cardConfig function. This allows additional information to be passed to be used in the Card Editor for this type. You need to return an array of child objects with a header: {title, tooltip: {tooltipText: PropTypes.string}} and content element to render \* |
| content | shape | | |
| content.attributes | arrayOf<object> | | |
| content.attributes[].label | string | | optional for little cards |
| content.attributes[].dataSourceId | string | | the key to load the value from the values object |
| content.attributes[].dataFilter | objectOf<any> | | optional data filter to apply to each attribute |
| content.attributes[].secondaryValue | shape | | |
| content.attributes[].secondaryValue.dataSourceId | string | | |
| content.attributes[].secondaryValue.color | string | | |
| content.attributes[].secondaryValue.trend | enum: <br/>'up'<br/>'down' | | |
| content.attributes[].thresholds | array<object> | | |
| content.attributes[].thresholds[].comparison | enum: <br/>'<'<br/>'>'<br/>'='<br/>'<='<br/>'>=' | | |
| content.attributes[].thresholds[].value | string \| number | | |
| content.attributes[].thresholds[].color | string | | |
| content.attributes[].thresholds[].icon | string | | |
| content.attributes[].precision | number | | |
| content.attributes[].unit | string | | |
| values | object, arrayOf | null | Value card expects its values passed as an object with key value pairs |
| dataState | shape | null | DataState will override the cards default empty state and error string |
| dataState.type | enum: <br/>'NO_DATA'<br/>'ERROR' | | |
| dataState.icon | element | | |
| dataState.label | string | | |
| dataState.description | string | | |
| dataState.extraTooltipText | string | | |
| dataState.learnMoreElement | element | | |
| dataState.tooltipDirection | enum: <br/>'bottom'<br/>'top'<br/>'left'<br/>'right' | | deprecated: tooltip uses autoPositioning now |
| cardVariables | objectOf<{[key: string]: string\|function\|number\|bool}> | null | |
| customFormatter | function | null | Value Card's formatting can be updated at runtime, customFormatter is provided the default formatted value and the original value and expects a value to be returned that will be rendered on the value card. customerFormatter(defaultFormattedValue, originalValue) |
| fontSize | number | DEFAULT_FONT_SIZE | optional custom font size for the displayed value |
| isNumberValueCompact | bool | false | option to determine whether the number should be abbreviated (i.e. 10,000 = 10K) |

## External Links

### Source Code

[Source code](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/src/components/ValueCard)

### Feedback

Help us improve this component by providing feedback, asking questions on Slack, or updating this file on
[GitHub](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/src/components/ValueCard/ValueCard.md).
