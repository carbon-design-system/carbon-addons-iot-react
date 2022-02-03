# Onboarding

The purpose of this document is to help new developers quickly and easily onboard to this project and
pick up the styles and practices we use to make this a coherent code base.

## Coding practices

Below you will find major items we strive to provide in all of our code and try to check for in all
code reviews.

### Prop naming conventions

When naming props all names should be in camelCase, events should be prefixed with `on` (onClick), and booleans should be prefixed with `is` or `has` (isActive, hasLabel).

### Localization

All non-falsy translatable strings should be passed in an `i18n` prop and the defaultProps should include
an English default. If you have multiple default, but only want to override some of them, you can use
the `useMerged` helper hook to merge the objects together.

```jsx
// component
const defaultProps = {
  onClick: undefined,
  i18n: {
    labelText: 'button label',
  },
};

const Button = ({ i18n, onClick, children }) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  return (
    <button aria-label={mergedI18n.labelText} onClick={onClick}>
      {children}
    </button>
  );
};

// usage
<Button i18n={{ labelText: 'A fancy button' }}>Fancy button</Button>;
```

### Adding data-testid

We want to make sure our components have dependable way to test all major functionality, so we provide
this to our consumers with `data-testid` props on important parts of the component. For example,
a button component could look like this:

```jsx
// component
const Button = ({ testId = 'Button', i18n, children }) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  return (
    <button data-testid={testId} aria-label={mergedI18n.buttonLabel}>
      {children}
    </button>
  );
};

// usage
<Button i18n={{ buttonLabel: 'button to open a new window' }} testId="new-window-button">
  Open a new window
</Button>;
```

This allows consumers to use various means to find the button in question:
React Testing Library could use:

- `getByLabelText("button to open a new window")`
- `getByText('Open a new window')`

or Enzyme could find by test id:

- `find('button[data-testid="new-window-button"]')`

### Using prefixes for component classes

Carbon uses a prefix `bx` (soon to be `cds`) to ensure unique classnames. We also follow suite in
this library with `iot`. These variables are available to import and re-use, so that when they change
we can do so without lots of code updates.

```jsx
// importing
import { settings } from '<react-package>/src/constants/Settings.js';

// prefix is used for Carbon, iotPrefix for our components
const { prefix, iotPrefix } = settings;

// usage
<Button className={`${iotPrefix}--button`}>A prefixed button</Button>;
```

This same structure is available within the scss files, too.

```scss
// this is using @use from newer versions of sass, but isn't supported until v3 of this library
// is released in 2022. The method in v2 is the usual @import
@use '<react-package>/src/globals/vars' as *;

// for v2
// @import '<react-package>/src/globals/vars';

.#{$prefix}--button {
  // styles to override the carbon button
}

.#{$iot-prefix}--button {
  // styles to apply to the iot button
}
```

### Using Carbon tokens

Instead of hard-coding many values, we rely on tokens from Carbon to make theming and re-use
easier. There are a multitude of tokens that can be used in a a variety of situations and themes. We
use the Gray 10 theme in PAL, and you can find more details about Carbon tokens in their documentation.

- Color: https://www.carbondesignsystem.com/guidelines/color/usage/
- Motion: https://www.carbondesignsystem.com/guidelines/motion/usage/
- Spacing: https://www.carbondesignsystem.com/guidelines/spacing/overview/
- Themes: https://www.carbondesignsystem.com/guidelines/themes/overview/
- Typography: https://www.carbondesignsystem.com/guidelines/typography/overview/
- Icons: https://www.carbondesignsystem.com/guidelines/icons/library/

```scss
// Bad example
button {
  padding: 1rem;
  color: black;
}

// Good example, v3 @use
@use '<react-package>/src/globals/spacing' as *;
@use '<react-package>/src/globals/colors' as *;

// v2 @import
// @import '<react-package>/src/globals/vars';
// @import '<react-package>/src/globals/spacing';

button {
  padding: $spacing-05;
  color: $text-01;
}
```

### BEM naming convention

When crafting css classes we use a BEM (Block, Element, Modifier) syntax to help make following the
styles easier. We don't use an exact BEM format because of the prefix mentioned above, so you'll always
want to start class with a prefix. The structure should look like this: `prefix--block__element--modifier`
or `prefix--block--modifier`.

- Prefix: A constant imported from settings to namespace this component from other Carbon or third-party components.
- Block: A standalone entity that is meaningful on its own.
- Element: An element is a part of a block that has no standalone meaning and is semantically tied to its block.
- Modifier: A flag on a block or element. Use them to change appearance or behavior.

You can learn more about BEM in this [documentation](http://getbem.com/introduction/).

```scss
// v3 @use
@use '<react-package>/src/globals/vars' as *;
@use '<react-package>/src/globals/spacing' as *;

// v2 @import
// @import '<react-package>/src/globals/vars';
// @import '<react-package>/src/globals/spacing';

// prefix        block
.#{$iot-prefix}--input {
  padding: $spacing-02 $spacing-05;
}

// prefix        block  modifier
.#{$iot-prefix}--input--large {
  padding: $spacing-05 $spacing-06;
}

// prefix       block
.#{$iot-prefix}--menu {
  padding: $spacing-02;
}

// prefix       block  element
.#{$iot-prefix}--menu__item {
  color: $text-01;
}

// prefix       block  element
.#{$iot-prefix}--menu__item--active {
  color: $focus;
}
```

### Dynamic class names

When using complex or dynamic classnames we opt for using the classnames package to make it easier
to apply multiple classes in various situations. See the example below or check the
[classnames documentation](https://github.com/JedWatson/classnames#readme) for more information.

```jsx
import classnames from 'classnames';

const Button = ({ type = 'primary', className, children, disabled = false }) => {
  return (
    <button
      className={classnames(
        // pass the given className as a string so that these classes are always added
        className,
        // You can also pass an object of classes that will be applied conditionally
        {
          [`${iotPrefix}--button`]: true,
          [`${iotPrefix}--button--${type}`]: true,
          // this class will only be applied when disabled=true
          [`${iotPrefix}--button--disabled`]: disabled,
        }
      )}
    >
      {children}
    </button>
  );
};
```

### Utility functions

When creating components often you will need helper functions that don't pertain to state. In this
situation, we create a `<componentName>Utils.js` file to house these functions and then import
them into the component for use. This file is located at `<react-package>/src/components/<ComponentName>/<componentName>Utils.js`.

```jsx
// buttonUtils.js

// simple function to stopPropagation on an event before trigging the callback.
export const stopEventPropagation = (event, callback) => {
  event.stopPropagation();
  callback(event);
};
```

Sometimes, as in this case, you'll find these helper functions to be helpful outside of a specific
component. Functions like these can be stored in `<react-package>/src/utils/componentUtilityFunctions.js`.

### Memoizing complex functions or callbacks

Memoization is the process of caching a complex process, so it doesn't have to be re-calculated on
each render. There's no way I can write this better then Kent C. Dodds, so I let's take a look at
what he has to say in [this blog post](https://kentcdodds.com/blog/usememo-and-usecallback).

### Creating new branches for PRs

When developing fixes or new features for PAL, you'll always want to start with `next` as a base, and
create a new branch using the github issue number as the start of the feature and a short description
of the issue afterwards. For example, [3173-onboarding-documentation](https://github.com/carbon-design-system/carbon-addons-iot-react/issues/3173).

## Feedback

Help us improve this documentation by providing feedback, asking questions on Slack, or updating this file on
[GitHub](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/docs/guides/onboarding.md).
