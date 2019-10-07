import { CARD_SIZES } from '../constants/LayoutConstants';

/**
 * determine time range from drop down action
 * range - requested range from card dropdown action
 */
export const determineCardRange = range => {
  switch (range) {
    case 'last24Hours':
      return { interval: 'day', count: -1, timeGrain: 'hour', type: 'rolling' };
    case 'last7Days':
      return { interval: 'week', count: -1, timeGrain: 'day', type: 'rolling' };
    case 'lastMonth':
      return { interval: 'month', count: -1, timeGrain: 'day', type: 'rolling' };
    case 'lastQuarter':
      return { interval: 'quarter', count: -1, timeGrain: 'month', type: 'rolling' };
    case 'lastYear':
      return {
        interval: 'year',
        count: -1,
        timeGrain: 'month',
        type: 'rolling',
      };
    case 'thisWeek':
      return {
        interval: 'week',
        count: -1,
        timeGrain: 'day',
        type: 'periodToDate',
      };
    case 'thisMonth':
      return {
        interval: 'month',
        count: -1,
        timeGrain: 'day',
        type: 'periodToDate',
      };
    case 'thisQuarter':
      return { interval: 'quarter', count: -1, timeGrain: 'month', type: 'periodToDate' };
    case 'thisYear':
      return {
        interval: 'year',
        count: -1,
        timeGrain: 'month',
        type: 'periodToDate',
      };
    default:
      return { interval: 'day', count: -5, timeGrain: 'day', type: 'rolling' };
  }
};

/** Compare grains to decide which is greater */
export const compareGrains = (grain1, grain2) => {
  const greaterGrains = {
    hour: ['day', 'week', 'month', 'year'],
    day: ['week', 'month', 'year'],
    week: ['month', 'year'],
    month: ['year'],
    year: [],
  };
  if (grain1 === grain2) {
    return 0;
  }

  if (!grain1 || greaterGrains[grain1].includes(grain2)) {
    return -1;
  }
  return 1;
};

/** Determine the max value card attribute count */
export const determineMaxValueCardAttributeCount = (size, currentAttributeCount) => {
  let attributeCount = currentAttributeCount;
  switch (size) {
    case CARD_SIZES.XSMALL:
      attributeCount = 1;
      break;
    case CARD_SIZES.XSMALLWIDE:
      attributeCount = 2;
      break;
    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.SMALL:
    case CARD_SIZES.WIDE:
      attributeCount = 3;
      break;
    case CARD_SIZES.LARGE:
      attributeCount = 5;
      break;
    case CARD_SIZES.TALL:
    case CARD_SIZES.XLARGE:
      attributeCount = 7;
      break;
    default:
  }
  return attributeCount;
};
