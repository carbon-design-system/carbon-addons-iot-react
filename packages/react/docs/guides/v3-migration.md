# V3 Migration Guide

## Breaking Changes

- `TableHead`, `TableBody`, `TableToolbar`, `EmptyTable`, and `TableSkeletonWithHeaders` removed from export [PR](https://github.com/carbon-design-system/carbon-addons-iot-react/pull/2684)
- translatable strings moved into i18n prop [PR](https://github.com/carbon-design-system/carbon-addons-iot-react/pull/3110)

| Component         | Prop                          | i18n Prop Key                 |
| ----------------- | ----------------------------- | ----------------------------- |
| CardCodeEditor    | iconDescription               | closeButtonLabel              |
| ColorDropdown     | label                         | label                         |
| ColorDropdown     | titleText                     | titleText                     |
| ComboBox          | editOptionText                | editOptionText                |
| ComboBox          | CloseButtonText               | closeButtonText               |
| ComboBox          | ariaLabel                     | ariaLabel                     |
| ComposedModal     | iconDescription               | closeButtonLabel              |
| FileDrop          | buttonLabel                   | buttonLabel                   |
| FileDrop          | dragAndDropLabel              | dragAndDropLabel              |
| ImageGalleryModal | gridButtonText                | gridButtonText                |
| ImageGalleryModal | instructionText               | instructionText               |
| ImageGalleryModal | listButtonText                | listButtonText                |
| ImageGalleryModal | modalCloseIconDescriptionText | modalCloseIconDescriptionText |
| ImageGalleryModal | modalLabelText                | modalLabelText                |
| ImageGalleryModal | modalTitleText                | modalTitleText                |
| ImageGalleryModal | modalPrimaryButtonLabelText   | modalPrimaryButtonLabelText   |
| ImageGalleryModal | deleteLabelText               | deleteLabelText               |
| ImageGalleryModal | deleteModalLabelText          | deleteModalLabelText          |
| ImageGalleryModal | deleteModalTitleText          | deleteModalTitleText          |
| ImageGalleryModal | modalSecondaryButtonLabelText | modalSecondaryButtonLabelText |
| ImageGalleryModal | searchPlaceHolderText         | searchPlaceHolderText         |
| MenuButton        | closeIconDescription          | closeIconDescription          |
| MenuButton        | openIconDescription           | openIconDescription           |
| RuleBuilder       | defaultTitleText              | defaultTitleText              |
| SimplePagination  | pageOfPagesText               | pageOfPagesText               |
| SimplePagination  | nextPageText                  | nextPageText                  |
| SimplePagination  | prevPageText                  | prevPageText                  |
| SimplePagination  | totalItemsText                | totalItemsText                |
| TileCatalog       | pagination.pageOfPagesText    | pageOfPagesText               |
| TileCatalog       | pagination.nextPageText       | nextPageText                  |
| TileCatalog       | pagination.prevPageText       | prevPageText                  |

- `node-sass` must be replaced with `sass` [PR]()
- `testID` prop has been removed on all components, please use `testId` instead [Epic, there are multiple PRs](https://github.com/carbon-design-system/carbon-addons-iot-react/issues/1001)
- The `Table` component has a new `actions.toolbar.onToggleAggregations` callback. This callback is used to change the `view.aggregations.isHidden` prop to show/hide the aggregations row. Previously, (mistakenly) this was handled by an internal state in the `Table` and this state management has been removed and left to the consumer. [PR](https://github.com/carbon-design-system/carbon-addons-iot-react/pull/3009)
- `FilterTags` component has added `href="#"` to force the items in the OverflowMenu to use `a` tags instead of `button` to avoid button-within-button nesting issues in the DOM. [PR](https://github.com/carbon-design-system/carbon-addons-iot-react/pull/2682)
- `SuiteHeader` component has replaced all instances of `javascript:void(0)` with `#` and added `event.preventDefault` in click handlers to to fix warnings [PR](https://github.com/carbon-design-system/carbon-addons-iot-react/pull/2679)
- `Table` component is now using the `preserveColumnWidths` prop with a default of `true`. This allows the table to preserve the width of adjacent columns during resizing or toggling operations. [PR](https://github.com/carbon-design-system/carbon-addons-iot-react/pull/3093)
- Carbon has removed many tokens previously used. These are explained in detail here in their [v11 migration guide](https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v11.md).
