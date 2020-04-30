import warning from 'warning';

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

export const getUpdatedCardSize = oldSize => {
  const changedSize =
    oldSize === 'XSMALL'
      ? 'SMALL'
      : oldSize === 'XSMALLWIDE'
      ? 'SMALLWIDE'
      : oldSize === 'WIDE'
      ? 'MEDIUMWIDE'
      : oldSize === 'TALL'
      ? 'LARGETHIN'
      : oldSize === 'XLARGE'
      ? 'LARGEWIDE'
      : null;
  let newSize = oldSize;
  if (changedSize) {
    if (__DEV__) {
      warning(
        false,
        `You have set your card to a ${oldSize} size. This size name is deprecated. The card will be displayed as a ${changedSize} size.`
      );
    }
    newSize = changedSize;
  }
  return newSize;
};

export const formatNumberWithPrecision = (value, precision, locale) =>
  value > 1000000000000
    ? `${(value / 1000000000000).toLocaleString(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}T`
    : value > 1000000000
    ? `${(value / 1000000000).toLocaleString(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}B`
    : value > 1000000
    ? `${(value / 1000000).toLocaleString(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}M`
    : value > 1000
    ? `${(value / 1000).toLocaleString(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}K`
    : value.toLocaleString(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
/**
 * Find variables in a string that are identified by surrounding curly braces
 * @param {string} value - A string with variables, i.e. `{manufacturer} acceleration over the last {sensor} hours`
 * @return {array} variables - an array of variables, i.e. ['manufacturer', 'sensor']
 */
export const getVariables = value => {
  // an array of instances of a substring surrounded by curly braces
  const variables = value && typeof value === 'string' ? value.match(/{[a-zA-Z0-9_-]+}/g) : null;
  // if there are variables found, trim the curly braces from each and return
  return variables ? variables.map(variable => variable.replace(/[{}]/g, '')) : null;
};

/**
 * Replace variables from the list of variables that are found on the target with their corresponding value
 * @param {array} variables - Array of variables to be replaced
 * @param {object} cardVariables - Object with variable properties and replacement values, i.e. { manufacturer: 'Rentech', sensor: 3 }
 * @param {string} target - The raw string to insert variable values into
 * @return {array} updatedTarget - the new string with the updated variable values
 */
export const replaceVariables = (variables, cardVariables, target) => {
  let updatedTarget = JSON.stringify(target);

  // Need to create a copy of cardVariables with all lower-case keys
  const insensitiveCardVariables = Object.keys(cardVariables).reduce((acc, variable) => {
    acc[variable.toLowerCase()] = cardVariables[variable];
    return acc;
  }, {});

  variables.forEach(variable => {
    const insensitiveVariable = variable.toLowerCase();
    const variableRegex = new RegExp(`{${variable}}`, 'g');
    // Need to update the target with all lower-case variables for case-insesitivity
    updatedTarget = updatedTarget.replace(variableRegex, `{${insensitiveVariable}}`);

    if (typeof insensitiveCardVariables[insensitiveVariable] === 'function') {
      const callback = insensitiveCardVariables[insensitiveVariable];
      updatedTarget = callback(variable, target);
    } else {
      const insensitiveVariableRegex = new RegExp(`{${insensitiveVariable}}`, 'g');
      updatedTarget = updatedTarget.replace(
        insensitiveVariableRegex,
        insensitiveCardVariables[insensitiveVariable]
      );
    }
  });
  return JSON.parse(updatedTarget);
};

/**
 *
 * @param {object} card
 * @returns {array} an array of unique variable values
 */
export const getCardVariables = card => [...new Set(getVariables(JSON.stringify(card)))];

/**
 * Replace variables from the list of variables that are found on the target with their corresponding value
 * @param {string} title - Title for the card
 * @param {object} content - Contents for the card
 * @param {string} values - Values for the card
 * @param {object} card - The rest of the card
 * @return {object} updatedCard - card with any found variables replaced by their coresponding values, or the original card if no variables
 */
export const handleCardVariables = (title, content, values, card) => {
  const updatedCard = {
    title,
    content,
    values,
    ...card,
  };
  if (!updatedCard.cardVariables) {
    return updatedCard;
  }
  const { cardVariables } = updatedCard;

  const variablesArray = getCardVariables(updatedCard);

  return replaceVariables(variablesArray, cardVariables, updatedCard);
};
