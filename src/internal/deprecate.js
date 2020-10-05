import warning from 'warning';

const didWarnAboutDeprecation = {};

export default function deprecate(propType, message) {
  function checker(props, propName, componentName, ...rest) {
    if (props[propName] === undefined) {
      return;
    }

    if (
      !didWarnAboutDeprecation[componentName] ||
      !didWarnAboutDeprecation[componentName][propName]
    ) {
      didWarnAboutDeprecation[componentName] = {
        ...didWarnAboutDeprecation[componentName],
        [propName]: true,
      };

      warning(
        false,
        message ||
          `The prop \`${propName}\` has been deprecated for the ` +
            `${componentName} component. It will be removed in the next major ` +
            `release`
      );
    }

    return propType(props, propName, componentName, ...rest); // eslint-disable-line consistent-return
  }

  return checker;
}

const mapToCellTextOverflow = (wrapCellText, truncateCellText) => {
  const truncate = wrapCellText === 'alwaysTruncate' || truncateCellText;
  return truncate ? 'truncate' : wrapCellText === 'never' ? 'prevent-wrap' : undefined;
};

/**
 * Temporary deprecation function that can be removed when the
 * TableHead and TableBody are removed, see issue #1650, or when the
 * deprectaed 'wrapCellText' and 'truncateCellText' are removed.
 * @param {*} cellTextOverflow
 * @param {*} wrapCellText
 * @param {*} truncateCellText
 */
export const handleOverflowDeprecation = (cellTextOverflow, wrapCellText, truncateCellText) => {
  const mapDeprecatedProps = !cellTextOverflow && (wrapCellText || truncateCellText);

  return mapDeprecatedProps
    ? mapToCellTextOverflow(wrapCellText, truncateCellText)
    : cellTextOverflow;
};
