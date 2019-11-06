import Ajv from 'ajv';
import some from 'lodash/some';
import countBy from 'lodash/countBy';

import { CARD_TYPES } from '../../constants/LayoutConstants';
import { determineMaxValueCardAttributeCount } from '../cardUtilityFunctions';

// schema json
import dashboardSchema from './dashboardContent.json';
import valueCardContentSchema from './valueCardContent.json';
import timeSeriesCardContentSchema from './timeSeriesCardContent.json';
import tableCardContentSchema from './tableCardContent.json';
import imageCardContentSchema from './imageCardContent.json';

// JSON validators
const ajv = new Ajv({ allErrors: true });
const validateDashboard = ajv.compile(dashboardSchema);
const validateValueCardJSON = ajv.compile(valueCardContentSchema);
const validateTimeSeriesCardJSON = ajv.compile(timeSeriesCardContentSchema);
const validateTableCardJSON = ajv.compile(tableCardContentSchema);
const validateImageCardJSON = ajv.compile(imageCardContentSchema);

/** Is a dataSource missing from the attributes and the groupBy section of the card */
export const findMissingDataSource = (attributes, dataSource, groupBy) => {
  const dataSourceIds = Array.isArray(dataSource) && dataSource.map(data => data.id);
  return Array.isArray(dataSourceIds)
    ? attributes.find(
        attribute =>
          !dataSourceIds.includes(attribute.dataSourceId) &&
          (!groupBy || (groupBy && !groupBy.includes(attribute.dataSourceId)))
      )
    : undefined;
};

export const checkForUniqueness = (array, attribute) =>
  some(Object.values(countBy(array, attribute)), ids => ids > 1);

/**
 * validate that the aggregators match the attribute type of a data item.
 */
export const validateAggregators = (dataSource, dataAttributes) => {
  const cardErrors = [];
  const nonNumericAttributes = dataAttributes
    .filter(dataItem => dataItem.columnType !== 'NUMBER')
    .map(dataAttribute => dataAttribute.name);

  // Check that only non numeric aggregators are used
  if (Array.isArray(dataSource)) {
    dataSource.forEach(data => {
      if (
        nonNumericAttributes.includes(data.attribute) &&
        data.aggregator &&
        !['first', 'last', 'count'].includes(data.aggregator)
      ) {
        cardErrors.push({
          message: `Datasource attribute ${
            data.attribute
          } is non-numeric but you attempted to apply a numeric aggregator: ${data.aggregator}.`,
        });
      }
    });
  }
  return cardErrors;
};

/**
 *
 * @param {*} card, the JSON card configuration
 * @param {*} dataAttributes, list of dataitem from the Meta data service
 */
export const validateCard = (card, dataAttributes) => {
  let cardErrors = [];
  // Image cards may not have dataSources
  if (card.dataSource) {
    const dataSource = card.dataSource.attributes;
    // Check each of the dataSource ids for uniqueness
    const hasConflicts = checkForUniqueness(card.dataSource.attributes, 'id');
    if (hasConflicts) {
      cardErrors.push({ message: 'Datasource ids must be unique.' });
    }

    // Check that all the datasource attributes exist on the object
    if (Array.isArray(dataAttributes)) {
      const dataAttributeNames = dataAttributes.map(dataAttribute => dataAttribute.name);
      const missingAttribute =
        Array.isArray(dataSource) &&
        dataSource.find(data => !dataAttributeNames.includes(data.attribute));
      if (missingAttribute) {
        cardErrors.push({
          message: `Datasource attribute ${
            missingAttribute.attribute
          } not found in the entity type.`,
        });
      }
      // find any literal (string) metric types and validate their aggregators
      const aggregatorErrors = validateAggregators(dataSource, dataAttributes);
      if (aggregatorErrors.length > 0) {
        cardErrors = cardErrors.concat(aggregatorErrors);
      }
    }
  }
  return cardErrors;
};

/**
 * Validate each Value card
 * @param {} card
 */
export const validateValueCard = card => {
  // First check against the JSON
  let valid = validateValueCardJSON(card);
  const cardErrors = validateValueCardJSON.errors || [];
  if (valid) {
    // Check if there are any missing data sources
    const missingAttribute = findMissingDataSource(
      card.content.attributes,
      card.dataSource.attributes
    );
    if (missingAttribute) {
      cardErrors.push({
        message: `Card attribute ${
          missingAttribute.dataSourceId
        } not listed in dataSource section.`,
      });
      valid = false;
    }
  }
  if (valid) {
    const maxCount = determineMaxValueCardAttributeCount(card.size, card.content.attributes.length);
    if (maxCount < card.content.attributes.length) {
      cardErrors.push({
        message: `Card size ${card.size} is too small to support ${
          card.content.attributes.length
        } attributes.`,
      });
      valid = false;
    }
  }

  return {
    isValid: valid,
    errors: cardErrors,
  };
};

/**
 * Validate each Image card
 * @param {} card
 */
export const validateImageCard = card => {
  const valid = validateImageCardJSON(card);
  const cardErrors = validateImageCardJSON.errors || [];
  return {
    isValid: valid,
    errors: cardErrors,
  };
};

/**
 * Validate each Time series card
 * @param {} card
 */
export const validateTimeSeriesCard = card => {
  // First check against the JSON
  let valid = validateTimeSeriesCardJSON(card);
  const cardErrors = validateTimeSeriesCardJSON.errors || [];
  if (valid) {
    // Check if there are any missing data sources
    const missingAttribute = findMissingDataSource(card.content.series, card.dataSource.attributes);
    if (missingAttribute) {
      cardErrors.push({
        message: `Card series dataSourceId ${
          missingAttribute.dataSourceId
        } not listed in dataSource section.`,
      });
      valid = false;
    }
  }

  return {
    isValid: valid,
    errors: cardErrors,
  };
};

/**
 * Validate each Table card
 * @param {} card
 */
export const validateTableCard = card => {
  // First check against the JSON
  let valid = validateTableCardJSON(card);
  const cardErrors = validateTableCardJSON.errors || [];
  if (valid) {
    // Check if there are any missing data sources in the columns
    const missingAttribute = findMissingDataSource(
      card.content.columns.filter(column => column.type !== 'TIMESTAMP'),
      card.dataSource.attributes,
      card.dataSource.groupBy
    );
    if (missingAttribute) {
      cardErrors.push({
        message: `Card column dataSourceId ${
          missingAttribute.dataSourceId
        } not listed in dataSource section.`,
      });
      valid = false;
    }
    // Check if there are any missing data sources in the expandedRows
    if (card.content.expandedRows) {
      const missingAttributeExpandedRow = findMissingDataSource(
        card.content.expandedRows,
        card.dataSource.attributes
      );
      if (missingAttributeExpandedRow) {
        cardErrors.push({
          message: `Card expandedRow dataSourceId ${
            missingAttributeExpandedRow.dataSourceId
          } not listed in dataSource section.`,
        });
        valid = false;
      }
    }
  }

  return {
    isValid: valid,
    errors: cardErrors,
  };
};

/**
 *
 * validates the dashboard template from the file
 *
 * dataAttributes: list of the original data items for a entity type
 *
 * */
export const validateDashboardJSON = (dashboardTemplate, dataAttributes) => {
  const valid = validateDashboard(dashboardTemplate);
  if (!valid) {
    return {
      isValid: valid,
      errors: validateDashboard.errors,
    };
  }

  // check each of the value cards
  let cardErrors = dashboardTemplate.cards
    .filter(card => card.type === CARD_TYPES.VALUE)
    .reduce((errors, card) => {
      const cardValidator = validateValueCard(card);
      if (!cardValidator.isValid) {
        errors.push(...cardValidator.errors);
      }
      return errors;
    }, []);

  // check each of the image cards
  cardErrors = dashboardTemplate.cards
    .filter(card => card.type === CARD_TYPES.IMAGE)
    .reduce((errors, card) => {
      const cardValidator = validateImageCard(card);
      if (!cardValidator.isValid) {
        errors.push(...cardValidator.errors);
      }
      return errors;
    }, []);

  // Check the time series cards
  cardErrors = cardErrors.concat(
    dashboardTemplate.cards
      .filter(card => card.type === CARD_TYPES.TIMESERIES)
      .reduce((errors, card) => {
        const cardValidator = validateTimeSeriesCard(card);
        if (!cardValidator.isValid) {
          errors.push(...cardValidator.errors);
        }
        return errors;
      }, [])
  );

  // Check the table cards
  cardErrors = cardErrors.concat(
    dashboardTemplate.cards
      .filter(card => card.type === CARD_TYPES.TABLE)
      .reduce((errors, card) => {
        const cardValidator = validateTableCard(card);
        if (!cardValidator.isValid) {
          errors.push(...cardValidator.errors);
        }
        return errors;
      }, [])
  );

  // Validate each card
  cardErrors = cardErrors.concat(
    ...dashboardTemplate.cards.map(card => validateCard(card, dataAttributes))
  );

  // Check each of the card ids for uniqueness
  const hasConflicts = checkForUniqueness(dashboardTemplate.cards, 'id');
  if (hasConflicts) {
    cardErrors.push({ message: 'Card ids must be unique.' });
  }
  return cardErrors.length === 0
    ? {
        isValid: true,
        errors: null,
      }
    : {
        isValid: false,
        errors: cardErrors,
      };
};
