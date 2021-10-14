# Testing

Enabling projects that consume this library to accurately test applications
using the components from this library is an important use case that we intend
to support as best we can. If you have suggestions as to how we can improve,
please
[open an issue](https://github.com/carbon-design-system/carbon-addons-iot-react/issues/new?assignees=&labels=%3Ahammer%3A++Enhancement&template=feature-request-or-enhancement.md&title=%5BComponentName%5D+request_title).

## Automated Testing Support

To enable support of testing automation in applications that consume this
library, we are working to provide a dedicated `data-testid` data attribute for
each component.
[Here's a link to the issue to follow our progress](https://github.com/carbon-design-system/carbon-addons-iot-react/issues/1001).

This attribute will be placed on the containing element of each component. This
attribute should be used in place of class or id selectors in your testing
automation.

If you find a component is missing a dedicated `data-testid` attribute, or would
like us to consider adding another attribute to a different sub-element of a
component, please
[open an issue](https://github.com/carbon-design-system/carbon-addons-iot-react/issues/new?assignees=&labels=%3Ahammer%3A++Enhancement&template=feature-request-or-enhancement.md&title=%5BComponentName%5D+request_title).

### Configuration

For exported non-internal components this will be configurable via a prop with a
default of the component name.

```jsx
function ExportedComponent({ testId }) {
  return (
    <>
      <span data-testid={testId}>Example</span>
    </>
  );
}

ExportedComponent.propTypes = {
  testId: PropTypes.string,
};
ExportedComponent.defaultProps = {
  testId: 'ExportedComponent',
};
```

Internal components will utilize any available id props to attempt to provide a
unique value.

```jsx
function InternalTableCell({ tableId, columnId, rowId }) {
  return <td data-testid={`InternalTableCell-${tableId}-${columnId}-${rowId}`}>Example</td>;
}
```

This attribute should be treated as a unique identifier that the component uses
for something that it renders. The underlying DOM node can change (though
unlikely and is avoided), due to this it is best to not rely on this attribute
to point to a specific element or element type.

### Targeting the `data-testid` attribute

Data attributes can be targeted via
[`querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
or
[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll).

```js
const component = document.querySelectorAll("[data-testid='ExampleComponent']");
```
