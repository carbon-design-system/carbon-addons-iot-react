# Combo box with tags

[a11y guidance](https://a11y-guidelines.orange.com/web_EN/exemples/tag/index.html)

## what is needed for implementation

- will need an `ul` full of our tag text
- each list item will need
  - a `span` that is visually hidden for screen readers with the i18n item text
  - a `button` that passes i18n tags to aria-label
  - hover and focus styles (inherited by Carbon?)
- Will need to grab a siblging to move focus to before removing tag from list
- need to vocalize screen readers that tag was removed. https://a11y-guidelines.orange.com/web_EN/exemples/speak/index.html
  - create a util function that can be reused to vocalize (takes text adds dom node and removes after item is removed - must be i18nilized)
- need to add and remove check mark next to choice when items are added and removed
- need to sync removal of tags and checkmarks
- when added we should also vocalize to screen readers
- onClick callback to call user callback and handle adding/deleting (use onChange prop)

## UX questions

- what happens when there are too many tags?
- Does this push other items down on the page as it gets bigger or does it get wider?

## Will do

- have tags and input in same flex box
- have tags push the input down
- difference between multiple and inline is the border and background of input

## Original Combo box props

```JavaScript
propTypes = {
  /**
   * 'aria-label' of the ListBox component.
   */
  ariaLabel: PropTypes.string,

  /**
   * An optional className to add to the container node
   */
  className: PropTypes.string,

  /**
   * Specify if the control should be disabled, or not
   */
  disabled: PropTypes.bool,

  /**
   * Specify a custom `id` for the input
   */
  id: PropTypes.string.isRequired,

  /**
   * Allow users to pass in an arbitrary item or a string (in case their items are an array of strings)
   * from their collection that are pre-selected
   */
  initialSelectedItem: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),

  /**
   * We try to stay as generic as possible here to allow individuals to pass
   * in a collection of whatever kind of data structure they prefer
   */
  items: PropTypes.array.isRequired,

  /**
   * Helper function passed to downshift that allows the library to render a
   * given item to a string label. By default, it extracts the `label` field
   * from a given item to serve as the item label in the list
   */
  itemToString: PropTypes.func,

  /**
   * Optional function to render items as custom components instead of strings.
   * Defaults to null and is overriden by a getter
   */
  itemToElement: PropTypes.func,

  /**
   * `onChange` is a utility for this controlled component to communicate to a
   * consuming component when a specific dropdown item is selected.
   * @param {{ selectedItem }}
   */
  onChange: PropTypes.func.isRequired,

  /**
   * Used to provide a placeholder text node before a user enters any input.
   * This is only present if the control has no items selected
   */
  placeholder: PropTypes.string.isRequired,

  /**
   * Specify your own filtering logic by passing in a `shouldFilterItem`
   * function that takes in the current input and an item and passes back
   * whether or not the item should be filtered.
   */
  shouldFilterItem: PropTypes.func,

  /**
   * Specify if the currently selected value is invalid.
   */
  invalid: PropTypes.bool,

  /**
   * Message which is displayed if the value is invalid.
   */
  invalidText: PropTypes.string,

  /**
   * For full control of the selection
   */
  selectedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

  /**
   * Specify a custom translation function that takes in a message identifier
   * and returns the localized string for the message
   */
  translateWithId: PropTypes.func,

  /**
   * Currently supports either the default type, or an inline variant
   */
  type: ListBoxPropTypes.ListBoxType,

  /**
   * Specify the size of the ListBox. Currently supports either `sm`, `lg` or `xl` as an option.
   */
  size: ListBoxPropTypes.ListBoxSize,

  /**
   * Callback function to notify consumer when the text input changes.
   * This provides support to change available items based on the text.
   * @param {string} inputText
   */
  onInputChange: PropTypes.func,

  /**
   * should use "light theme" (white background)?
   */
  light: PropTypes.bool,

  /**
   * Additional props passed to Downshift
   */
  downshiftProps: PropTypes.shape(Downshift.propTypes),

  /**
   * Specify the direction of the combobox dropdown. Can be either top or bottom.
   */
  direction: PropTypes.oneOf(['top', 'bottom']),
};

defaultProps = {
  disabled: false,
  itemToString: defaultItemToString,
  itemToElement: null,
  shouldFilterItem: defaultShouldFilterItem,
  type: 'default',
  ariaLabel: 'Choose an item',
  light: false,
  direction: 'bottom',
};
```
