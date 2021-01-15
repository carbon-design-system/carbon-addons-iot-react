import filter from 'lodash/filter';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

export const BASE_CLASS_NAME = `${iotPrefix}--value-card`;
export const PREVIEW_DATA = '--';

/** Determine the max value card attribute count */
// TODO: this is no longer valid with new design, but needs to stay because its being exported
export const determineMaxValueCardAttributeCount = (
  size,
  currentAttributeCount
) => {
  console.warn('DEPRECATION: This function is no longer valid.');
  let attributeCount = currentAttributeCount;
  switch (size) {
    case CARD_SIZES.SMALL:
      attributeCount = 1;
      break;
    case CARD_SIZES.SMALLWIDE:
      attributeCount = 2;
      break;
    case CARD_SIZES.MEDIUMTHIN:
    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.MEDIUMWIDE:
      attributeCount = 3;
      break;
    case CARD_SIZES.LARGE:
      attributeCount = 5;
      break;
    case CARD_SIZES.LARGETHIN:
    case CARD_SIZES.LARGEWIDE:
      attributeCount = 7;
      break;
    default:
  }
  return attributeCount;
};

/**
 * Support either an array of values or an object of values
 * @param {string} dataSourceId
 * @param {Array<Object>} values
 * @param {Object} dataFilter
 */
export const determineValue = (dataSourceId, values, dataFilter = {}) =>
  Array.isArray(values)
    ? filter(values, dataFilter)[0] &&
      filter(values, dataFilter)[0][dataSourceId]
    : values && values[dataSourceId];

/**
 * @param {string} size card size
 * @param {Array<Object>} attributes
 * @param {Number} measuredWidth
 * @returns card layout - horizontal or vertical
 */
export const determineLayout = (size) => {
  switch (size) {
    case CARD_SIZES.SMALL:
    case CARD_SIZES.SMALLWIDE:
      return CARD_LAYOUTS.HORIZONTAL;

    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.MEDIUMTHIN:
    case CARD_SIZES.MEDIUMWIDE:
    case CARD_SIZES.LARGETHIN:
    case CARD_SIZES.LARGE:
    case CARD_SIZES.LARGEWIDE:
      return CARD_LAYOUTS.VERTICAL;

    default:
      return CARD_LAYOUTS.HORIZONTAL;
  }
};
