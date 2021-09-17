# Overrides pattern

The overrides pattern can be used as a developer escape hatch for modifying subcomponents within complex aggregated components. A subcomponent can be overridden in two ways, by having its input (i.e. the props) overridden or by having the component class or function itself be overridden. It is possible to combine the two if needed.

The overrides pattern can be used with nesting, i.e. it is possible to override a subcomponent within a subcomponent if all components acting as parents have implemented the pattern.

Imagine there is a ComplexComponent that is made up out of two subcomponents. ComplexComponent accepts two string props that are passed down to each subcomponent respectively.

```jsx
<ComplexComponent title1="Text for Subcomponent1" title2="Text for Subcomponent2" />
```

At the time of design the requirements for the subcomponents were not completely clear so ComplexComponent implemented the overrides pattern for both props and component. The example below shows how the developer consuming the ComplexComponent can use this escape hatch to customize the ComplexComponent in ways that weren't originally planned for. The Subcomponent1 is overridden with a completely new component and the Subcomponent2 is kept but is having one of its non exposed props overridden.

```jsx
const CustomSubcomponent1 = ({title1})=>(<h1>{title1}</h1>);

<ComplexComponent
  title1="Text for Subcomponent1"
  title2="Text for Subcomponent2"
  overrides={{
    subcomponent1: {
      component: CustomSubcomponent1
    }
    subcomponent2: {
      props: { disabled: true }
    }
  }}
/>
```

The overrides pattern is as the name suggests just a pattern so the ComplexComponent is responsible for the implementation of it. It could look like this:

```jsx
import Subcomponent1 from './Subcomponent1';
import Subcomponent2 from './Subcomponent2';

const ComplexComponent = ({ title1, title2, overrides }) => {
  // Use the overriding components if available via the overrides prop,
  // if not then use the original
  const MySubcomponent1 = overrides?.subcomponent1?.component || Subcomponent1;
  const MySubcomponent2 = overrides?.subcomponent2?.component || Subcomponent2;
  return (
    <div>
      <MySubcomponent1 disabled={false} title={title1} {...overrides?.subcomponent1?.props)} />
      <MySubcomponent2 disabled={false} title={title2} {...overrides?.subcomponent2?.props)} />
    </div>
  );
};
```

In the example above the overriding prop is passed as an object, but it can also be a function that receives the original prop values and uses them as input for the values of other props. The function should return an object with the props as properties and it could look like this if the developer wants to use the title text to determine if the subcomponent should be enabled:

```jsx
<ComplexComponent
  title1="Text for Subcomponent1"
  title2="Text for Subcomponent2"
  overrides={{
    subcomponent2: {
      props: ({ title2 }) => ({ disabled: title2 === '' }),
    },
  }}
/>
```

The ComplexComponent should be able to handle both styles of prop overriding (using an object or a function) which is easily done with a small helper function as shown below:

```jsx
import Subcomponent1 from './Subcomponent1';
import Subcomponent2 from './Subcomponent2';

/**
 * Helper function for using the overrides props as object or a function that returns an object
 * @param {Object | Function} props the props that should override existing props
 * @param {Object} originalProps the original props, can be used as input for creating new props
 */
export const getOverrides = (props, originalProps) => {
  return typeof props === 'function' ? props(originalProps) : props;
};

const ComplexComponent = ({ title1, title2, overrides }) => {
  const MySubcomponent1 = overrides?.subcomponent1?.component || Subcomponent1;
  const MySubcomponent2 = overrides?.subcomponent2?.component || Subcomponent2;
  return (
    <div>
      <MySubcomponent1 title={title1} {...getOverrides(overrides?.subcomponent1?.props)} />
      <MySubcomponent2 title={title2} {...getOverrides(overrides?.subcomponent2?.props)} />
    </div>
  );
};
```
