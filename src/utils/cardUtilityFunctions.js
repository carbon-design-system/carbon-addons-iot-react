import warning from 'warning';

import { CARD_SIZES, CARD_TYPES } from '../constants/LayoutConstants';

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

// re-usable variable fetcher that returns an array of variables
// variables are identified by surrounding curly braces i.e. {deviceid}
export const getVariables = value => {
  let variables = value && typeof value === 'string' ? value.match(/{[a-zA-Z]*}/g) : null;
  if (variables) {
    variables = variables.map(variable => variable.replace(/[{}]/g, ''));
  }
  return variables;
};

// replace variables from the list of variables that are found on the target with their corresponding value
export const replaceVariables = (variables, values, target) => {
  let updatedTarget = target;
  variables.forEach(variable => {
    const variableRegex = new RegExp(`{${variable}}`, 'g');
    updatedTarget = updatedTarget.replace(variableRegex, values[variable]);
  });
  return updatedTarget;
};

export const handleVariables = card => {
  if (!card.cardVariables) {
    return card;
  }
  const updatedCard = card;
  const { cardVariables, title } = card;

  // check for title variables on all cards and replace them
  const titleVariables = getVariables(title);
  if (titleVariables) {
    const updatedTitle = replaceVariables(titleVariables, cardVariables, title);
    updatedCard.title = updatedTitle;
  }

  if (card.type === CARD_TYPES.VALUE) {
    const { attributes } = card.content;
    if (attributes) {
      attributes.forEach((attribute, i) => {
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
        if (thresholds) {
          thresholds.forEach((threshold, x) => {
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
        }
      });
    }
  }

  if (card.type === CARD_TYPES.IMAGE) {
    if (card.content.hotspots) {
      const { hotspots } = card.content;
      hotspots.forEach((hotspot, i) => {
        const { thresholds } = hotspot;
        if (thresholds) {
          thresholds.forEach((threshold, x) => {
            const { value } = threshold;
            // check for variables in each threshold value and replace them
            const thresholdValueVariables = getVariables(value);
            if (thresholdValueVariables) {
              const updatedThresholdValue = replaceVariables(
                thresholdValueVariables,
                cardVariables,
                value
              );
              updatedCard.content.hotspots[i].thresholds[x].value = updatedThresholdValue;
            }
          });
        }
        const { attributes } = hotspot.content;
        if (attributes) {
          attributes.forEach((attribute, j) => {
            const { label, unit } = attribute;
            // check for variables in the lables and replace them
            const labelVariables = getVariables(label);
            if (labelVariables) {
              const updatedLabel = replaceVariables(labelVariables, cardVariables, label);
              updatedCard.content.hotspots[i].content.attributes[j].label = updatedLabel;
            }
            // check for variables in the units and replace them
            const unitVariables = getVariables(unit);
            if (unitVariables) {
              const updatedUnit = replaceVariables(unitVariables, cardVariables, unit);
              updatedCard.content.hotspots[i].content.attributes[j].unit = updatedUnit;
            }
          });
        }
      });
    }
  }

  if (card.type === CARD_TYPES.TABLE) {
    const { columns, thresholds } = card.content;
    columns.forEach((column, i) => {
      const { linkTemplate } = column;
      if (linkTemplate) {
        const { href, displayValue } = linkTemplate;
        // Check for variables in the hrefs
        const hrefVariables = getVariables(href);
        if (hrefVariables) {
          const updatedHref = replaceVariables(hrefVariables, cardVariables, href);
          updatedCard.content.columns[i].linkTemplate.href = updatedHref;
        }
        // Check for variables in the display values
        const displayValueVariables = getVariables(displayValue);
        if (displayValueVariables) {
          const updatedDisplayValue = replaceVariables(
            displayValueVariables,
            cardVariables,
            displayValue
          );
          updatedCard.content.columns[i].linkTemplate.displayValue = updatedDisplayValue;
        }
      }
    });
    if (thresholds) {
      thresholds.forEach((threshold, x) => {
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
    }
  }

  return updatedCard;
};
