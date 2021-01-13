import filter from 'lodash/filter';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;
export const baseClassName = `${iotPrefix}--value-card`;

/** Determine the max value card attribute count */
// TODO: this is no longer valid with new design
export const determineMaxValueCardAttributeCount = (
  size,
  currentAttributeCount
) => {
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
 */
export const determineAttributes = (size, attributes) => {
  if (!attributes || !Array.isArray(attributes)) {
    return attributes;
  }
  // TODO: need to remove this max attributes for new design
  const attributeCount = determineMaxValueCardAttributeCount(
    size,
    attributes.length
  );
  return attributes.slice(0, attributeCount);
};

/**
 * @param {string} size card size
 * @param {Array<Object>} attributes
 * @param {Number} measuredWidth
 * @returns card layout - horizontal or vertical
 */
export const determineLayout = (size, attributes, measuredWidth) => {
  switch (size) {
    case CARD_SIZES.SMALL:
      return CARD_LAYOUTS.HORIZONTAL;

    case CARD_SIZES.SMALLWIDE:
      return measuredWidth && measuredWidth < 300 && attributes.length > 1
        ? CARD_LAYOUTS.VERTICAL
        : CARD_LAYOUTS.HORIZONTAL;

    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.MEDIUMTHIN:
      return CARD_LAYOUTS.VERTICAL;

    case CARD_SIZES.LARGETHIN:
    case CARD_SIZES.MEDIUMWIDE:
      if (attributes.length > 2) {
        return CARD_LAYOUTS.VERTICAL;
      }
      return CARD_LAYOUTS.HORIZONTAL;

    case CARD_SIZES.LARGE:
      if (attributes.length > 2) {
        return CARD_LAYOUTS.VERTICAL;
      }
      return CARD_LAYOUTS.HORIZONTAL;

    case CARD_SIZES.LARGEWIDE:
      if (attributes.length > 5) {
        return CARD_LAYOUTS.VERTICAL;
      }
      return CARD_LAYOUTS.HORIZONTAL;

    default:
      return CARD_LAYOUTS.HORIZONTAL;
  }
};

/**
 * @param {Object} props
 * @param {string} props.title
 * @returns {Boolean}
 */
export const shouldLabelWrap = (title) => {
  if (!title) {
    return false;
  }
  const words = title.split(' ');
  if (words.length > 1 && words.length < 3) {
    return true;
  }
  return false;
};
