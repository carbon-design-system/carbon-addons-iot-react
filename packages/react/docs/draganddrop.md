# Drag and Drop

To support drag and drop functionality, this library uses `react-dnd`. There are
some helpers exported to enable your application to utilize the same instance
and version that the library uses.

## `<DragAndDrop/>`

This component is exported for use and utilizes the `useDNDProviderElement` hook
to wrap any children in a shared DndProvider context (drag and drop manager)
using the HTML5Backend. This component be added at the root level of your
applications react tree or in multiple places within a subtree. The hook enables
multiple components to use the same shared drag and drop context and prevent the
"duplicate backends" problem.

This component can also be used in unit tests and component development
environments like storybook or cosmos.

#### `@testing-library/react`

```js
render(
  <DragAndDrop>
    <ComponentUsingDragAndDrop />
  </DragAndDrop>
);

// Or use the `wrapper` option: https://testing-library.com/docs/react-testing-library/api#wrapper
render(<ComponentUsingDragAndDrop />, { wrapper: DragAndDrop });
```

Instead of wrapping each test individually, all tests can be wrapped globally by
[setting up a custom render method](https://testing-library.com/docs/react-testing-library/setup#custom-render)
that includes the DragAndDrop provider.

#### `enzymejs`

```js
const wrapper = mount(<ComponentUsingDragAndDrop />, {
  wrappingComponent: DragAndDrop,
});
```

#### `storybookjs`

To enable drag and drop in the storybook environment, all stories can be wrapped
with a `DragAndDrop` component by configuring a
[global decorator](https://storybook.js.org/docs/react/writing-stories/decorators#using-decorators-to-provide-data)
in `preview.js`. This can also be done at the
[component level](https://storybook.js.org/docs/react/writing-stories/decorators#component-decorators),
or
[story level](https://storybook.js.org/docs/react/writing-stories/decorators#story-decorators).

```js
// preview.js
addDecorator((Story) => (
  <DragAndDrop>
    <Story />
  </DragAndDrop>
));
```

## `useDNDProviderElement`

This is the hook used by `DragAndDrop` to wrap components in a shared
DndProvider context. This can be used by any component to provide the Drag and
Drop manager.

## Common issues

### `Cannot have two HTML5 backends at the same time.`

To fix, replace usages of DndProvider in your application to use
`useDNDProviderElement` or wrap the component in `DragAndDrop`. This will ensure
that only one backend is used.

### `Invariant Violation: Could not find the drag and drop manager in the context of ListItem. Make sure to render a DndProvider component in your top-level component.`

To fix, wrap your component or a subtree of your application tree with a
`DragAndDrop` component.
