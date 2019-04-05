import delay from 'lodash/delay';

/** This function assumes you're using carbon widgets */
export function scrollErrorIntoView(focus = true) {
  const invalidField = document.querySelector('[data-invalid="true"]');
  if (invalidField) {
    invalidField.scrollIntoView({ behavior: 'smooth' });
    if (focus) {
      delay(() => invalidField.focus(), 250);
    }
    return true;
  }
  return false;
}

export const handleEnterKeyDown = (evt, callback) => {
  if (evt.key === 'Enter') {
    callback(evt);
  }
};

export const defaultFunction = name => () => console.info(`${name} not implemented`); //eslint-disable-line

export const getSortedData = (inputData, columnId, direction) => {
  // clone inputData because sort mutates the array
  const sortedData = inputData.map(i => i);
  return sortedData.sort((a, b) => {
    const val = direction === 'ASC' ? -1 : 1;
    if (typeof a.values[columnId] === 'string') {
      const compare = a.values[columnId].localeCompare(b.values[columnId]);
      return direction === 'ASC' ? compare : -compare;
    }
    if (a.values[columnId] < b.values[columnId]) {
      return val;
    }
    if (a.values[columnId] > b.values[columnId]) {
      return -val;
    }
    return 0;
  });
};

export const stopPropagationAndCallback = (evt, callback, ...args) => {
  evt.stopPropagation();
  callback(...args);
};
