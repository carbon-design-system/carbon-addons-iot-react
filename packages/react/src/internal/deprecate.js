import warning from 'warning';
import PropTypes from 'prop-types';

const didWarnAboutDeprecation = {};

export default function deprecate(propType, message) {
  function checker(props, propName, componentName, ...rest) {
    if (props[propName] === undefined) {
      return undefined;
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

    return propType(props, propName, componentName, ...rest);
  }

  return checker;
}

export const deprecateString = (newPropName) => {
  function checker(props, propName, componentName, ...rest) {
    if (props[propName] === undefined) {
      return undefined;
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
        `The prop \`${propName}\` has been deprecated for the \`${componentName}\` component. It will be removed in the next major release. Please use \`i18n.${
          newPropName || propName
        }\` instead.`
      );
    }

    return PropTypes.string(props, propName, componentName, ...rest);
  }

  return checker;
};
