# `ComposedModal` component

## Table of Contents

- [Getting started](#getting-started)
- [Props](#props)
- [External links](#external-links)
  - [Source Code](#source-code)
  - [Feedback](#feedback)

## Getting Started

## Props

| Name                                           | Type                                        | Default         | Description                                                                                                                                                                  |
| :--------------------------------------------- | :------------------------------------------ | :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| header                                         | shape                                       | {}              | Header Props label: goes on top of the dialog title: Heading of the dialog helpText, additional information will stay at the top of the screen when scrolling dialog content |
| header.label                                   | node                                        |                 | goes on top of the dialog                                                                                                                                                    |
| header.title                                   | node                                        |                 | Heading of the dialog                                                                                                                                                        |
| header.helpText                                | node                                        |                 | additional information will stay at the top of the screen when scrolling dialog content                                                                                      |
| iconDescription                                | string                                      | 'Close'         | ability to add translation string to close icon                                                                                                                              |
| children                                       | node                                        | null            | Content to render inside Modal                                                                                                                                               |
| footer                                         | element, shape                              | null            | Footer Props Either supply your own footer element or supply an object with button labels and submit handlers and we will make a footer with two buttons for you             |
| footer.primaryButtonLabel                      | string                                      |                 |                                                                                                                                                                              |
| footer.secondaryButtonLabel                    | string                                      |                 |                                                                                                                                                                              |
| footer.isPrimaryButtonHidden                   | bool                                        |                 | should the primary button be hidden (i.e. only show Cancel)                                                                                                                  |
| footer.isPrimaryButtonDisabled                 | bool                                        |                 | should the primary button be disabled                                                                                                                                        |
| type                                           | enum:<br>&nbsp;'warn'<br>&nbsp;'normal'<br> | null            | NEW PROP: Type of dialog, affects colors, styles of dialog                                                                                                                   |
| isLarge                                        | bool                                        | false           | NEW PROP: Whether this particular dialog needs to be very large                                                                                                              |
| isFullScreen                                   | bool                                        | false           | NEW PROP: Whether this particular dialog needs to be full width                                                                                                              |
| open                                           | bool                                        | true            | Should the dialog be open or not                                                                                                                                             |
| <span style="color: #31a148">onClose \*</span> | function                                    |                 | Close the dialog                                                                                                                                                             |
| sendingData                                    | bool, string                                | null            | Is data currently being sent to the backend                                                                                                                                  |
| isFetchingData                                 | bool                                        | false           | Is my data actively loading?                                                                                                                                                 |
| error                                          | string                                      | null            | Form Error Details                                                                                                                                                           |
| onClearError                                   | function                                    | null            | Clear the currently shown error, triggered if the user closes the ErrorNotification                                                                                          |
| submitFailed                                   | bool                                        | false           | Did the form submission fail                                                                                                                                                 |
| invalid                                        | bool                                        | false           | Is the form currently invalid                                                                                                                                                |
| onSubmit                                       | function                                    | null            | Callback to submit the dialog/form                                                                                                                                           |
| passiveModal                                   | bool                                        | false           | Hide the footer                                                                                                                                                              |
| testID                                         | string                                      | 'ComposedModal' | Id that can be used for testing                                                                                                                                              |

## External Links

### Source Code

[Source code](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/src/components/ComposedModal)

### Feedback

Help us improve this component by providing feedback, asking questions on Slack, or updating this file on
[GitHub](https://github.com/carbon-design-system/carbon-addons-iot-react/tree/next/packages/react/src/components/ComposedModal/ComposedModal.md).
