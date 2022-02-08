# Onboarding

The purpose of this document is to help new developers quickly and easily onboard to this project and
pick up the styles and practices we use to make this a coherent code base.

## Coding practices

Below you will find major items we strive to provide in all of our code and try to check for in all
code reviews.

### Prop naming conventions

When naming props all names should be in camelCase, events should be prefixed with `on` (onClick),
and booleans should be prefixed with `is` or `has` (isActive, hasLabel). You may notice instances where
a boolean has been overridden with another type to extend it's functionality. This practice is frowned
upon. If you need to extend or change the functionality of an existing prop, you should create a new
prop to contain this behavior. For example, in the Table the `hasFilter` prop was overridden like so:

```jsx
hasFilter: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['onKeyPress', 'onEnterAndBlur'])]);
```

When instead this behavior should have been controlled with it's own prop.

```jsx
/**
 * Does the Table support filtering, true or false
 */
hasFilter: PropTypes.bool,

/**
 * If true, filtering will be triggered on each keystroke.
 * If false, it will only be triggered on 'Enter' key or 'onBlur'
 */
hasFastFilter: PropTypes.bool,
```

### Localization

All non-falsy translatable strings should be passed in an `i18n` prop and the defaultProps should include
an English default. If you have multiple defaults, but only want to override some of them, you can use
the `useMerged` helper hook to merge the objects together. Do not be afraid to use long prop names,
so that you can be as descriptive as possible. This helps make it clear exactly what value is used in
which component.

```jsx
// component
const defaultProps = {
  i18n: {
    searchButtonLabel: 'Search button',
    searchButtonText: 'Search',
    searchInputLabel: 'Search for something',
    searchInputPlaceholder: 'Enter a value',
  },
};

const Search = ({ i18n }) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  return (
    <>
      <input
        type="text"
        aria-label={mergedI18n.searchInputLabel}
        placeholder={mergedI18n.searchInputPlaceholder}
      />
      <button type="submit" aria-label={mergedI18n.searchButtonLabel}>
        {mergedI18n.searchButtonText}
      </button>
    </>
  );
};

Search.defaultProps = defaultProps;

// usage
// in this example, mergedI18n variable above will contain
// {
//   searchInputLabel: 'A fancy search input',
//   searchInputPlaceholder: 'Enter a value',
//   searchButtonLabel: 'Search button',
//   searchButtonText: 'Search'
// }
// because the useMerged hook will use the defaults from defaultProps.i18n, and overwrite them with anything
// from i18n of the same key. In this instance, searchInputLabel will be replaced with 'A fancy search input', but
// searchInputPlaceholder will remain the same 'Enter a value'.
<Search i18n={{ searchInputLabel: 'A fancy search input' }} />;
```

Complex components will have multiple sub-components and those sub-components may have i18n objects
and defaults of their own; however, the parent components should not rely on the child's defaults.
All i18n strings of the children that could be exposed by the parent's usage should also be explicitly
defined at the parent level including defaults.

```jsx
const ChildComponent = ({ i18n }) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  return (
    <button type="submit" aria-label={mergedI18n.childLabelText}>
      mergedI18n.childButtonText
    </button>
  );
};

ChildComponent.propTypes = {
  i18n: PropTypes.shape({
    childLabelText: PropTypes.string,
    childButtonText: PropTypes.string,
  }),
};

ChildComponent.defaultProps = {
  i18n: {
    childLabelText: 'a child label',
    childButtonText: 'a child button',
  },
};

const ParentComponent = ({ i18n }) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);

  return (
    <>
      <input type="text" aria-label={mergedI18n.parentLabelText} />
      <ChildComponent i18n={mergedI18n} />
    </>
  );
};

// 🚫  This example is INCORRECT. The parent should also expose the props of the child i18n object
// instead of relying on the default of the child to fill in the gaps.
ParentComponent.propTypes = {
  i18n: PropTypes.shape({
    parentLabelText: PropTypes.string,
  }),
};

ParentComponent.defaultProps = {
  i18n: {
    parentLabelText: 'a parent label',
  },
};

// ✅  This example is CORRECT. The parent exposes the props of the child i18n object.
ParentComponent.propTypes = {
  i18n: PropTypes.shape({
    parentLabelText: PropTypes.string,
    childLabelText: PropTypes.string,
    childButtonText: PropTypes.string,
  }),
};

ParentComponent.defaultProps = {
  i18n: {
    parentLabelText: 'a parent label',
    childLabelText: 'a child label',
    childButtonText: 'a child button',
  },
};
```

If you have data that needs to be embedded in that string, we're moving toward using index-based placeholders
to make it easy for translators.

```jsx
// example needing i18n string interpolation
const List = ({ items, title }) => {
  <div>
    <h3>{title}</h3>
    <ul>
      {items.map(({ text }) => {
        return <li>{text}</li>;
      })}
    </ul>
    <div>Item Count: {items.length}</div>
  </div>;
};

// after refactoring
const defaultProps = {
  i18n: {
    itemCountText: 'List count: {0}',
  },
};

const List = ({ items, title, i18n }) => {
  const mergedI18n = getMerged(defaultProps.i18n, i18n);

  <div>
    <h3>{title}</h3>
    <ul>
      {items.map(({ text }) => {
        return <li>{text}</li>;
      })}
    </ul>
    <div>{mergedI18n.itemCountText.replace('{0}', items.length)}</div>
  </div>;
};
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

As components become more complex with multiple items the consumers are expected to interact with we
need to make sure testIds are also applied to those elements.

```jsx
const Button = ({ testId = 'Button', i18n, children }) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  return (
    <button data-testid={testId} aria-label={mergedI18n.buttonLabel}>
      {children}
    </button>
  );
};

// a simple example with multiple buttons the user will want to test for their availability based
// on props. This allows the consumer to test for `form-buttons-reset-button` or `form-buttons-submit-button`.
const FormButtons = ({ testId = 'form-buttons', showReset = true }) => {
  return (
    <div>
      {showReset ? <Button testId={`${testId}-reset-button`}>Reset</Button> : null}
      <Button testId={`${testId}-submit-button`}>Submit</Button>
    </div>
  );
};

// usage
```

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
// @use '<react-package>/src/globals/vars' as *;

// for v2
@import '<react-package>/src/globals/vars';

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
// @use '<react-package>/src/globals/spacing' as *;
// @use '<react-package>/src/globals/colors' as *;

// v2 @import
@import '<react-package>/src/globals/vars';
@import '<react-package>/src/globals/spacing';

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
// @use '<react-package>/src/globals/vars' as *;
// @use '<react-package>/src/globals/spacing' as *;

// v2 @import
@import '<react-package>/src/globals/vars';
@import '<react-package>/src/globals/spacing';

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

// prefix       block element modifier
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

### Component pure functions

If you're writing a component and have a need for a helper function related entirely to that component
and it doesn't have any side effects on the data it's operating on, this is called a pure function. Pure
functions should be defined in the same file as the component and passed whatever parameters necessary
to their task. This is more performant because we're not allocating a new function on every render.
This is a bit of a contrived example, but just imagine the function is something more complex.

```jsx
// example before refactoring
const Button = ({ children, isActive: isActiveProp }) => {
  const [isActive, setIsActive] = useState(isActiveProp);

  const getClassNames = () => {
    return {
      [`${iotPrefix}--button`]: true,
      [`${iotPrefix}--button--is-active`]: isActive,
    };
  };

  return <button className={classnames(getClassNames())}>{children}</button>;
};
```

```jsx
// after refactoring to a pure helper function
const getClassNames = (isActive) => {
  return {
    [`${iotPrefix}--button`]: true,
    [`${iotPrefix}--button--is-active`]: isActive,
  };
};

const Button = ({ children, isActive: isActiveProp }) => {
  const [isActive, setIsActive] = useState(isActiveProp);

  return <button className={classnames(getClassNames(isActive))}>{children}</button>;
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
each render. There's no way I can write this better than Kent C. Dodds, so I let's take a look at
what he has to say in [this blog post](https://kentcdodds.com/blog/usememo-and-usecallback).

### Keep JSX clean and simple

As components grow more complex it's important to keep the code as readable as possible. While it's
easy and tempting to just keep adding if statements or ternary operators as features are added, it's
much easier to follow and maintain if we split those conditionals into their own simple components.

```jsx
// an ugly example with many nested ternary operators
const RenderItems = ({ items }) => {
  return items.length === 0 ? null : items.length === 1 ? (
    <p>{items.text}</p>
  ) : items.length === 2 ? (
    <div>
      {items.map(({ text }) => {
        <p>{text}</p>;
      })}
    </div>
  ) : (
    <ul>
      {items.map(({ text }) => {
        <li>{text}</li>;
      })}
    </ul>
  );
};
```

```jsx
// after some cleanup

// render one or no items
const ItemSingle = (items) => {
  if (!items.length) {
    return null;
  }

  const [item] = items;

  return <p>{item.text}</p>;
};

// render only two items
const ItemSet = (items) => {
  return (
    <div>
      {items.map(({ text }) => {
        <p>{text}</p>;
      })}
    </div>
  );
};

// render a full list of items
const ItemList = (items) => {
  return (
    <ul>
      {items.map(({ text }) => {
        <li>{text}</li>;
      })}
    </ul>
  );
};

const RenderItems = ({ items }) => {
  switch (items.length) {
    case 0:
    case 1:
      return <ItemSingle items={items} />;
    case 2:
      return <ItemSet items={items} />;
    default:
      return <ItemList items={items} />;
  }
};
```

### Stories

We use [Storybook](https://storybook.js.org) to demo, test, and document our components. Each component
should have a `ComponentName.story.jsx` file that imports the component and demonstrates various ways
to use the component.

#### Story structure

The stories should contain a playground story that contains all knobs possible
for the component. The playground knobs should default to `on` when in DEV to make catching bugs or issues
more apparent during the development process. However, when in production the majority of knobs should
be off and only those related to major functionality of the component turned on.

Other stories for a component should be structured around a single behavior or a group of related behaviors.
See the [Table stories](https://next.carbon-addons-iot-react.com/?path=/story/1-watson-iot-table--playground)
for examples. The [playground](https://next.carbon-addons-iot-react.com/?path=/story/1-watson-iot-table--playground) gives a broad overview of everything the table offers and other stories focus on a single function such as [sorting](https://next.carbon-addons-iot-react.com/?path=/story/1-watson-iot-table--with-sorting)
or [row expansion](https://next.carbon-addons-iot-react.com/?path=/story/1-watson-iot-table--with-row-expansion).

#### Naming stories

The storyName should match the name of the story component with spaces and the name should clearly
indicate the behavior being demonstrated. The goal is to make it easy for consumers to quickly scan
and find examples and documentation related to the specific functionality they're implementing.

```jsx
const Playground = () => {
  return <ComponentName isActive={boolean('Is this component active (isActive)', false)} />;
};

Playground.storyName = 'Playground';

const WithActive = () => {
  return <ComponentName isActive={boolean('Is this component active (isActive)', true)} />;
};

Playground.storyName = 'With active';
```

Components that have been deprecated should be prefixed with `🚫` and include the `StoryNotice` component
as the first story to explain why it is deprecated and what to replace it with. Components that have
added a piece of functionality that is experimental should prefix that individual story with a `☢️`
and also use the `StoryNotice` component to explain what experimental about it and discourage it's
usage in production.

#### Story placement

Stories for components should be placed in experimental (`2 - Watson IoT Experimental`)
if it's a new component that hasn't been thoroughly tested or could have a shifting API. If it's more
fully defined, it should go in `1 - Watson IoT`. This is determined by the title in the story default export.

```jsx
// a normal component
export default {
  title: '1 - Watson IoT/ComponentName',
};
```

```jsx
// an experimental component
export default {
  title: '2 - Watson IoT Experimental/☢️ ComponentName',
};
```

### Documentation

Documentation is written in mdx files and saved in the same folder with the same name as the component
you're documenting (For example, `<react-package>/src/components/DashboardGrid/DashboardGrid.mdx`).
However, if the component is very complex (Table, for example), you will need to create an mdx folder
and place all documentation files related to various functionality of the component into it. This
should not be the norm as we're striving to keep components simpler and composable rather than complex
and static.

The basic structure of our documentation is:

---

// Begin documentation example

---

# `ComponentName` component

## Table of contents

- [Getting started](#getting-started)
- Any additional specific examples of more complex use cases
- [Props](#props)
- [Source Code](#source-code)
- [Feedback](#feedback)

## Getting started

The getting started section should contain a small introduction about the component, how to import it
from the `carbon-addon-iot-react` library, and a simple example of usage.

```jsx
import { ComponentName } from 'carbon-addon-iot-react';

<ComponentName isActive />;
```

## Complex example

If you have other complex examples of usage they should go here and be linked in the table of contents.

## Props

The props section should contain a table of all available props for the component, their type, the
default value, and a short description of the prop. If the props are complex, an i18n prop with many
strings for example, we recommend splitting that into it's own table and linking to it from the main
props table.

| Name     | Type   | Default | Description                 |
| :------- | :----- | :------ | :-------------------------- |
| isActive | bool   | false   | Is this component active    |
| i18n     | object |         | See [i18n prop](#i18n-prop) |

### I18n prop

| Name             | Type   | Default    | Description                        |
| :--------------- | :----- | :--------- | :--------------------------------- |
| i18n.buttonLabel | string | 'a button' | The aria-label shown on the button |

## Source Code

The source code is a simple link to the Github folder containing this component.

[Source code](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/src/components/ComponentName)

## Feedback

The feedback section is a simple call to action to reach out for help or feedback with a link the
documentation file on Github.

Help us improve this component by providing feedback, asking questions on Slack, or updating this file on
[GitHub](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/src/components/ComponentName/ComponentName.mdx).

---

// End documentation example

---

This documentation file is imported into the component's story and set docs page in the storybook
default export. These changes allow a user to click on the "Docs" tab in storybook and read
documentation while interacting with a component's story.

```jsx
import DashboardGridREADME from './DashboardGrid.mdx';

export default {
  title: '1 - Watson IoT/DashboardGrid',
  parameters: {
    docs: {
      page: DashboardGridREADME,
    },
  },
};
```

### Creating new branches for PRs

When developing fixes or new features for PAL, you'll always want to start with `next` as a base, and
create a new branch using the github issue number as the start of the feature and a short description
of the issue afterwards. For example, [3173-onboarding-documentation](https://github.com/carbon-design-system/carbon-addons-iot-react/issues/3173).

## Feedback

Help us improve this documentation by providing feedback, asking questions on Slack, or updating this file on
[GitHub](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/docs/guides/onboarding.md).
