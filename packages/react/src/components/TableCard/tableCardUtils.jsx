import React from 'react';
import isNil from 'lodash/isNil';
import { Link } from 'carbon-components-react';

import { formatNumberWithPrecision, getVariables } from '../../utils/cardUtilityFunctions';
import dayjs from '../../utils/dayjs';

export const determinePrecisionAndValue = (precision = 0, value, locale) => {
  const precisionDefined = Number.isInteger(value) ? 0 : precision;

  if (typeof value === 'number') {
    return formatNumberWithPrecision(value, precisionDefined, locale, false);
  }
  if (isNil(value)) {
    return '--';
  }
  return '--';
};

/**
 * Updates the hrefs in each column to be us-able links. If href variables are on a table that has row specific values, the user
 * should not pass in a cardVariables object as each variable with have multiple values.
 * @param {Array<Object>} columns - Array of TableCard columns
 * @return {array} array of columns with formatted links and updated variable values
 */
export const createColumnsWithFormattedLinks = (columns) => {
  return columns.map((column) => {
    const { linkTemplate } = column;
    if (linkTemplate) {
      // get the variable names from the href
      const variables = linkTemplate.href ? getVariables(linkTemplate.href) : [];
      return {
        ...column,
        // eslint-disable-next-line react/prop-types
        renderDataFunction: ({ value, row }) => {
          let variableLink;
          // if we have variables the value is based on its own row's context
          if (variables && variables.length) {
            variableLink = linkTemplate.href;
            variables.forEach((variable) => {
              const matchingColumn = columns.find(
                (variableColumn) => variableColumn.dataSourceId === variable
              );
              const variableValue =
                // format the TIMESTAMP type columns
                matchingColumn?.type === 'TIMESTAMP'
                  ? dayjs(row[variable]).format('L HH:mm')
                  : row[variable];
              // encode value so the URL can be valid
              const encodedValue =
                typeof variableValue === 'string' && variableValue?.includes('https')
                  ? variableValue
                  : encodeURIComponent(variableValue);

              variableLink = variableLink.replace(`{${variable}}`, encodedValue);
            });
          }
          return (
            <Link
              href={variableLink || linkTemplate.href}
              target={linkTemplate.target ? linkTemplate.target : null}
            >
              {value}
            </Link>
          );
        },
      };
    }
    return column;
  });
};

/**
 * Updates expandedRow to have us-able links if any hrefs are found. If href variables are on a table that has
 * row specific values, the user should not pass in a cardVariables object as each variable with have multiple values.
 * @param {object} row - Object containing each value present on the row
 * @param {Array<Object>} expandedRow - Array of data to display when the row is expanded
 * @param {object} cardVariables - object of cardVariables
 * @return {array} Array of data with formatted links to display when the row is expanded
 */
export const handleExpandedItemLinks = (row, expandedRow, cardVariables) => {
  // if the user has given us variable values, we can assume that they don't want them to be row specific
  if (cardVariables) {
    return expandedRow;
  }

  const updatedExpandedRow = [];

  expandedRow.forEach((item) => {
    const { linkTemplate } = item;
    const variables = linkTemplate?.href ? getVariables(linkTemplate.href) : [];
    let variableLink;
    // if we have variables the value is based on its own row's context
    if (variables && variables.length) {
      variableLink = linkTemplate.href;
      variables.forEach((variable) => {
        const variableValue = row[variable];
        // encode value so the URL can be valid
        const encodedValue = encodeURIComponent(variableValue);
        variableLink = variableLink.replace(`{${variable}}`, encodedValue);
      });
    }
    if (linkTemplate) {
      updatedExpandedRow.push({
        ...item,
        linkTemplate: {
          ...linkTemplate,
          href: variableLink || linkTemplate.href,
        },
      });
    } else {
      updatedExpandedRow.push(item);
    }
  });
  return updatedExpandedRow;
};

export const timeStampfilterFunction = (cellValue, filterValue) => {
    const dateString = dayjs(cellValue).format('L HH:mm');
    return dateString.includes(filterValue);
}