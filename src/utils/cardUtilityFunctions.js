import warning from 'warning';

import { CARD_SIZES } from '../constants/LayoutConstants';

/* eslint-disable no-unused-expressions */

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
  let updatedTarget = target;
  variables.forEach(variable => {
    const variableRegex = new RegExp(`{${variable}}`, 'g');
    // if the variable is found in the cardVariables object, replace it on the target with the corresponding value
    updatedTarget = cardVariables[variable]
      ? updatedTarget.replace(variableRegex, cardVariables[variable])
      : target;
  });
  return updatedTarget;
};

/**
 * Replace variables from the list of variables that are found on the target with their corresponding value
 * @param {array} variables - Array of variables to be replaced
 * @param {object} values - Object with variable properties and replacement values, i.e. { manufacturer: 'Rentech', sensor: 3 }
 * @param {string} target - The raw string to insert variable values into
 * @return {array} updatedTarget - the new string with the updated variable values
 */
export const handleTitleVariables = (title, cardVariables) => {
  const titleVariables = getVariables(title);
  return titleVariables ? replaceVariables(titleVariables, cardVariables, title) : title;
};

/**
 * Replace variables from the list of variables that are found on the target with their corresponding value
 * @param {string} title - Title for the card
 * @param {object} content - Contents for the card
 * @param {string} values - Values for the card
 * @param {object} card - The rest of the card
 * @return {object} updatedCard - card with any found variables replaced by their coresponding values, or the original card if no variables
 */
export const handleValueCardVariables = (title, content, values, card) => {
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

  // check for variables in the title and replace them
  updatedCard.title = handleTitleVariables(title, cardVariables);

  const { attributes } = updatedCard.content;
  attributes?.forEach((attribute, i) => {
    const { label, unit, thresholds } = attribute;

    // check for variables in the labels and replace them
    const labelVariables = getVariables(label);
    if (labelVariables) {
      const updatedLabel = replaceVariables(labelVariables, cardVariables, label);
      updatedCard.content.attributes[i].label = updatedLabel;
    }
    // check for variables in the units and replace them
    const unitVariables = getVariables(unit);
    if (unitVariables) {
      const updatedUnit = replaceVariables(unitVariables, cardVariables, unit);
      updatedCard.content.attributes[i].unit = updatedUnit;
    }
    thresholds?.forEach((threshold, x) => {
      const { value } = threshold;
      // check for variables in each threshold value and replace them
      const thresholdValueVariables = getVariables(value);
      if (thresholdValueVariables) {
        const updatedThresholdValue = replaceVariables(
          thresholdValueVariables,
          cardVariables,
          value
        );
        updatedCard.content.attributes[i].thresholds[x].value = updatedThresholdValue;
      }
    });
  });

  return updatedCard;
};

/**
 * Replace variables from the list of variables that are found on the target with their corresponding value
 * @param {string} title - Title for the card
 * @param {object} content - Content for the card
 * @param {string} values - Values for the card
 * @param {object} card - The rest of the card
 * @return {object} updatedCard - card with any found variables replaced by their coresponding values, or the original card if no variables
 */
export const handleTableCardVariables = (title, content, values, card) => {
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

  // check for variables in the title and replace them
  updatedCard.title = handleTitleVariables(title, cardVariables);

  const { columns, thresholds } = updatedCard.content;
  columns.forEach((column, i) => {
    const { linkTemplate } = column;
    if (linkTemplate) {
      const { href } = linkTemplate;
      // Check for variables in the hrefs
      const hrefVariables = getVariables(href);
      if (hrefVariables) {
        const updatedHref = replaceVariables(hrefVariables, cardVariables, href);
        updatedCard.content.columns[i].linkTemplate.href = updatedHref;
      }
    }
  });
  thresholds?.forEach((threshold, x) => {
    const { label, severityLabel, value } = threshold;
    // Check if there are variables in the threshold labels
    const thresholdLabelVariables = getVariables(label);
    if (thresholdLabelVariables) {
      const updatedLabel = replaceVariables(thresholdLabelVariables, cardVariables, label);
      updatedCard.content.thresholds[x].label = updatedLabel;
    }
    // Check if there are variables in the threshold severity labels
    const severityLabelVariables = getVariables(severityLabel);
    if (severityLabelVariables) {
      const updatedSeverityLabel = replaceVariables(
        severityLabelVariables,
        cardVariables,
        severityLabel
      );
      updatedCard.content.thresholds[x].severityLabel = updatedSeverityLabel;
    }
    // Check if there are variables in the threshold values
    const thresholdValueVariables = getVariables(value);
    if (thresholdValueVariables) {
      const updatedValue = replaceVariables(thresholdValueVariables, cardVariables, value);
      updatedCard.content.thresholds[x].value = updatedValue;
    }
  });

  return updatedCard;
};
