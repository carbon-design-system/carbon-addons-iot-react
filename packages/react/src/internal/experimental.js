import warning from 'warning';

const didWarnAboutExperimental = {};

export default function deprecate(propType, message) {
  function checker(props, propName, componentName, ...rest) {
    if (props[propName] === undefined) {
      return;
    }

    if (
      !didWarnAboutExperimental[componentName] ||
      !didWarnAboutExperimental[componentName][propName]
    ) {
      didWarnAboutExperimental[componentName] = {
        ...didWarnAboutExperimental[componentName],
        [propName]: true,
      };

      warning(
        false,
        message ||
          `The prop \`${propName}\` is experimental for the ` +
            `${componentName} component and may have changing APIs ` +
            `with no major version bump and/or insufficient test coverage. ` +
            `Use of this component in production is discouraged.`
      );
    }

    return propType(props, propName, componentName, ...rest); // eslint-disable-line consistent-return
  }

  return checker;
}
