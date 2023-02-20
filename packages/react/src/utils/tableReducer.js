import isEmpty from 'lodash-es/isEmpty';

/**
 * Pushes row id to the provided array (including row children)
 *
 * @param {object} row A table row with id
 * @param {array} arrToFill An array that will be filled with all rows id
 */

export const fillArrWithRowIds = (row, arrToFill) => {
  if (row.isSelectable !== false) {
    arrToFill.push(row.id);
  }

  if (!isEmpty(row.children)) {
    row.children.forEach((el) => fillArrWithRowIds(el, arrToFill));
  }
};
