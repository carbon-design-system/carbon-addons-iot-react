import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListBuilderModule } from './list-builder.module';
import { ListModule } from '../list/list.module';
import { ButtonModule, IconModule, IconService } from 'carbon-components-angular';
import { Add16, SubtractAlt16 } from '@carbon/icons';
import { ListBuilderItem } from './list-builder-item.class';
import { Component, Input, OnInit } from '@angular/core';

const simpleItems = [
  new ListBuilderItem({
    unselectedItemState: { value: 'Item 1' },
    selectedItemState: { value: 'Item 1 selected' },
  }),
  new ListBuilderItem({
    unselectedItemState: { value: 'Item 2' },
    selectedItemState: { value: 'Item 2 yay' },
  }),
  new ListBuilderItem({
    unselectedItemState: { value: 'Item 3' },
    selectedItemState: { value: 'Item 3' },
  }),
  new ListBuilderItem({
    unselectedItemState: { value: 'Item 4' },
    selectedItemState: { value: 'Item 4' },
  }),
];

const selectableItems = [
  new ListBuilderItem({
    addingMethod: 'select',
    hideUnselectedItemOnSelect: false,
    unselectedItemState: { value: 'Yo', isSelectable: true, expanded: true },
    selectedItemState: { value: 'Yo' },
    children: [
      new ListBuilderItem({
        addingMethod: 'select',
        hideUnselectedItemOnSelect: false,
        unselectedItemState: { value: 'YoChild', isSelectable: true },
        selectedItemState: { value: 'YoChild' },
      }),
      new ListBuilderItem({
        addingMethod: 'select',
        hideUnselectedItemOnSelect: false,
        unselectedItemState: { value: 'YoChild2', isSelectable: true },
        selectedItemState: { value: 'YoChild2' },
      }),
    ],
  }),
  new ListBuilderItem({
    addingMethod: 'select',
    hideUnselectedItemOnSelect: false,
    unselectedItemState: { value: 'Yo2', isSelectable: true, expanded: true },
    selectedItemState: { value: 'Yo2' },
    children: [
      new ListBuilderItem({
        addingMethod: 'select',
        hideUnselectedItemOnSelect: false,
        unselectedItemState: { value: 'Yo2Child', isSelectable: true },
        selectedItemState: { value: 'Yo2Child' },
      }),
      new ListBuilderItem({
        addingMethod: 'select',
        hideUnselectedItemOnSelect: false,
        unselectedItemState: { value: 'Yo2Child2', isSelectable: true },
        selectedItemState: { value: 'Yo2Child2' },
      }),
    ],
  }),
];

@Component({
  selector: 'ai-custom-icon-story',
  template: `
    <div style="width: 900px; height: 1200px">
      <ai-list-builder
        [items]="items"
        unselectedListTitle="Available items"
        unselectedListSelectionType="multi"
        selectedListTItle="Selected items"
        [addItemButtonIcon]="addIcon"
        [removeItemButtonIcon]="removeIcon"
      >
      </ai-list-builder>
    </div>

    <ng-template #addIcon>
      <svg class="bx--btn__icon" ibmIcon="add" size="16"></svg>
    </ng-template>

    <ng-template #removeIcon>
      <svg class="bx--btn__icon" ibmIcon="subtract--alt" size="16"></svg>
    </ng-template>
  `,
})
class CustomIconStory implements OnInit {
  @Input() items = [];

  constructor(protected iconService: IconService) {}

  ngOnInit() {
    this.iconService.register(Add16);
    this.iconService.register(SubtractAlt16);
  }
}

storiesOf('Components/List builder', module)
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule, ListBuilderModule, ListModule, IconModule],
      declarations: [CustomIconStory],
    })
  )
  .addDecorator(withKnobs)
  .add('Simple', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [items]="items"
          unselectedListTitle="Available items"
          selectedListTitle="Selected items">
        </ai-list-builder>
      </div>
      `,
    props: {
      items: simpleItems,
    },
  }))
  .add('Multi select', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [items]="items"
          unselectedListTitle="Available items"
          unselectedListSelectionType="multi"
          selectedListTitle="Selected items"
          [selectedListItemsDraggable]="true">
        </ai-list-builder>
      </div>
    `,
    props: {
      items: selectableItems,
    },
  }))
  .add('Custom icons', () => ({
    template: `
      <ai-custom-icon-story [items]="items"></ai-custom-icon-story>
    `,
    props: {
      items: simpleItems,
    },
  }))
  .add('Obtaining all selected items', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [items]="items"
          (addedItemsChange)="onAddedItemsChange($event)"
          unselectedListTitle="Available items"
          selectedListTitle="Selected items">
        </ai-list-builder>
      </div>
      `,
    props: {
      items: simpleItems,
      onAddedItemsChange: (addedItems) => {
        console.log(addedItems);
      },
    },
  }));
