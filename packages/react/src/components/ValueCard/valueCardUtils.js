import { filter } from 'lodash-es';
import warning from 'warning';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

export const BASE_CLASS_NAME = `${iotPrefix}--value-card`;
export const PREVIEW_DATA = '--';
export const DEFAULT_FONT_SIZE = 42;

/**
 * Support either an array of values or an object of values
 * @param {string} dataSourceId
 * @param {Array<Object>} values
 * @param {Object} dataFilter
 */
export const determineValue = (dataSourceId, values, dataFilter = {}) =>
  Array.isArray(values)
    ? filter(values, dataFilter)[0] && filter(values, dataFilter)[0][dataSourceId]
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
    case CARD_SIZES.SMALLFULL:
    case CARD_SIZES.MEDIUMWIDE:
      return CARD_LAYOUTS.HORIZONTAL;

    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.MEDIUMTHIN:
    case CARD_SIZES.LARGETHIN:
    case CARD_SIZES.LARGE:
    case CARD_SIZES.LARGEWIDE:
      return CARD_LAYOUTS.VERTICAL;

    default:
      return CARD_LAYOUTS.HORIZONTAL;
  }
};

/** Determine the max value card attribute count
 * TODO: remove in next release
 */
export const determineMaxValueCardAttributeCount = (size, currentAttributeCount) => {
  if (__DEV__) {
    warning(
      false,
      'Deprecation warning: There is no longer a max number of attributes allowed in ValueCards. This function will me removed in the next release.'
    );
  }
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
      attributeCount = 3;
      break;
    case CARD_SIZES.SMALLFULL:
    case CARD_SIZES.MEDIUMWIDE:
      attributeCount = 4;
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
