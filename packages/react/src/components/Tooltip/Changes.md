1. Uncontrolled tooltip example is not supported now.
2. Usage changes, before changes

```js
withIcon: () => ({
  direction: select('Tooltip direction (direction)', directions, 'bottom'),
  triggerText: text('Trigger text (triggerText)', 'Tooltip label'),
  tabIndex: number('Tab index (tabIndex in <Tooltip>)', 0),
  selectorPrimaryFocus: text('Primary focus element selector (selectorPrimaryFocus)', ''),
  triggerId: 'withIcon',
}),
  (
    <Tooltip {...props.withIcon()} tooltipBodyId="tooltip-body">
      <p id="tooltip-body">
        This is some tooltip text. This box shows the maximum amount of text that should appear
        inside. If more room is needed please use a modal instead.
      </p>
      <div className={`${prefix}--tooltip__footer`}>
        <a href="/" className={`${prefix}--link`}>
          Learn More
        </a>
        <Button size="sm">Create</Button>
      </div>
    </Tooltip>
  );
```

after changes, need to set content and action properties as below:

```js
withIcon: () => ({
  direction: select('Tooltip direction (direction)', directions, 'bottom'),
  triggerText: text('Trigger text (triggerText)', 'Tooltip label'),
  tabIndex: number('Tab index (tabIndex in <Tooltip>)', 0),
  selectorPrimaryFocus: text('Primary focus element selector (selectorPrimaryFocus)', ''),
  triggerId: 'withIcon',
  content: (
    <p>
      Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut fsil labore et dolore magna aliqua.
    </p>
  ),
  action: (
    <>
      <a href="/" className={`${prefix}--link`}>
        Learn More
      </a>
      <Button size="sm">Create</Button>
    </>
  ),
}),
  (<Tooltip {...props.withIcon()} tooltipBodyId="tooltip-body" />);
```
