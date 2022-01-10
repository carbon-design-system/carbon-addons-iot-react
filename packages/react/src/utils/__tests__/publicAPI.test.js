const { isValidElementType } = require('react-is');
const { isNil } = require('lodash-es');

/**
 * In our Public API test, we try to identify each component and its
 * corresponding API. In order to get prop type information for components,
 * we'll need to first mock the `prop-types` package to correctly identify the
 * prop types when we create our snapshot in the test below.
 *
 * If you ended up on this test file because the corresponding snapshot failed,
 * this could mean the following:
 *
 * 1) You've made a change to the public API of a component. This could mean
 *    adding a prop type, or removing one, and is intended to make you aware
 *    that this change would require a corresponding semver change. Feel free
 *    to update the snapshot if you believe this is intended
 *
 * 2) You've updated details of a component like its `defaultProps` and want
 *    to double-check that this won't break existing usage of the component. If
 *    you have verified that this change won't break existing usage, feel free
 *    to update the snapshot
 *
 * 3) You've added a field to a component. This field is now considered part of
 *    the component's public API and this test will fail if it is changed in
 *    the future. If you feel like this field should not be a part of the API,
 *    either prefix it with an underscore or add an exception to the test
 *    below.
 *
 */

beforeEach(() => {
  jest.mock('prop-types', () => {
    const PropTypes = require.requireActual('prop-types');
    const primitive = [
      'array',
      'bool',
      'func',
      'number',
      'object',
      'string',
      'symbol',
      'node',
      'element',
      'elementType',
      'any',
    ];

    const complex = ['arrayOf', 'instanceOf', 'objectOf', 'oneOf', 'oneOfType', 'shape', 'exact'];

    // We want to remap primitive prop types like PropTypes.string with a getter
    // function. This getter function should return the type of the prop type
    // and also specify the `isRequired` field so PropTypes.string.isRequired
    // works as intended
    // eslint-disable-next-line no-restricted-syntax
    for (const type of primitive) {
      Object.defineProperty(PropTypes, type, {
        get() {
          const value = {
            type,
          };
          Object.defineProperty(value, 'isRequired', {
            enumerable: false,
            get() {
              return {
                type,
                isRequired: true,
              };
            },
          });
          return value;
        },
      });
    }

    // For complex/chainable prop types, we'll redefine the value to a function
    // and have it return the prop type information as a result of calling the
    // prop-type. We'll also need to define the `isRequired` field similar to
    // how we used it in the primitive prop types
    // eslint-disable-next-line no-restricted-syntax
    for (const type of complex) {
      // eslint-disable-next-line func-names
      PropTypes[type] = function (...args) {
        const value = {
          type,
          args,
        };

        Object.defineProperty(value, 'isRequired', {
          enumerable: false,
          get() {
            return {
              type,
              args,
              isRequired: true,
            };
          },
        });

        return value;
      };
    }

    return PropTypes;
  });
});

/**
 * We construct our public API by iterating through our entrypoint and finding
 * the components that we export and their corresponding API.
 */
test('Public API should only change with a semver change', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  function mapComponentToAPI(Component) {
    const api = {};

    if (!isNil(Component)) {
      Object.keys(Component).forEach((key) => {
        // There are a couple of properties on components that we don't believe
        // are part of our API, such `_` prefixed variables, or capture details
        // that are internal to a library-specific piece of functionality. For
        // example, React's context functionality.
        if (key[0] === '_') {
          return;
        }

        if (key === 'Consumer') {
          api[key] = 'React.Consumer';
          return;
        }

        if (key === 'Provider') {
          api[key] = 'React.Provider';
          return;
        }

        // Handle components defined as fields on a component, for example
        // `MultiSelect.Filterable`
        if (
          typeof Component[key] === 'function' &&
          key !== 'render' &&
          isValidElementType(Component[key])
        ) {
          api[key] = mapComponentToAPI(Component[key]);
          return;
        }

        api[key] = Component[key];
      });
    }
    return api;
  }

  // eslint-disable-next-line global-require
  const CarbonAddonsIoTReact = require('../../index');
  const PublicAPI = new Map();

  Object.keys(CarbonAddonsIoTReact).forEach((name) => {
    const Component = CarbonAddonsIoTReact[name];
    PublicAPI.set(name, mapComponentToAPI(Component));
  });

  expect(PublicAPI).toMatchSnapshot();
  expect(console.warn).toHaveBeenCalledWith(
    `Warning: The Filterable field has been deprecated on the MultiSelect object. Please import and use MultiSelect.Filterable directly.`
  );
  expect(console.warn).toHaveBeenCalledWith(
    `Warning: The ControlledPasswordInput field has been deprecated on the TextInput object. Please import and use ControlledPasswordInput directly.`
  );
  expect(console.warn).toHaveBeenCalledWith(
    `Warning: The PasswordInput field has been deprecated on the TextInput object. Please import and use PasswordInput directly.`
  );
  expect(console.warn).toHaveBeenCalledTimes(3);
});
