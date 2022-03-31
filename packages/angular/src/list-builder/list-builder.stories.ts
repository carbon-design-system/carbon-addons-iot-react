import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { AIListBuilderModule } from './list-builder.module';
import { ListModule } from '../list/list.module';
import { ButtonModule, IconModule, IconService } from 'carbon-components-angular';
import { Add16, SubtractAlt16 } from '@carbon/icons';
import { AIListBuilderItem } from './list-builder-item.class';
import { getSelectedItems } from './list-builder-utils';
import { Component, Input, OnInit } from '@angular/core';

const simpleItems = [
  new AIListBuilderItem({
    unselectedItemProps: { value: 'Item 1' },
    selectedItemProps: { value: 'Item 1 selected' },
  }),
  new AIListBuilderItem({
    unselectedItemProps: { value: 'Item 2' },
    selectedItemProps: { value: 'Item 2 yay' },
  }),
  new AIListBuilderItem({
    unselectedItemProps: { value: 'Item 3' },
    selectedItemProps: { value: 'Item 3' },
  }),
  new AIListBuilderItem({
    unselectedItemProps: { value: 'Item 4' },
    selectedItemProps: { value: 'Item 4' },
  }),
];

const selectableItems = [
  new AIListBuilderItem({
    addingMethod: 'select',
    hideUnselectedItemOnSelect: false,
    unselectedItemProps: { value: 'Yo', isSelectable: true, expanded: true },
    selectedItemProps: { value: 'Yo' },
    children: [
      new AIListBuilderItem({
        addingMethod: 'select',
        hideUnselectedItemOnSelect: false,
        unselectedItemProps: { value: 'YoChild', isSelectable: true },
        selectedItemProps: { value: 'YoChild' },
      }),
      new AIListBuilderItem({
        addingMethod: 'select',
        hideUnselectedItemOnSelect: false,
        unselectedItemProps: { value: 'YoChild2', isSelectable: true },
        selectedItemProps: { value: 'YoChild2' },
      }),
    ],
  }),
  new AIListBuilderItem({
    addingMethod: 'select',
    hideUnselectedItemOnSelect: false,
    unselectedItemProps: { value: 'Yo2', isSelectable: true, expanded: true },
    selectedItemProps: { value: 'Yo2' },
    children: [
      new AIListBuilderItem({
        addingMethod: 'select',
        hideUnselectedItemOnSelect: false,
        unselectedItemProps: { value: 'Yo2Child', isSelectable: true },
        selectedItemProps: { value: 'Yo2Child' },
      }),
      new AIListBuilderItem({
        addingMethod: 'select',
        hideUnselectedItemOnSelect: false,
        unselectedItemProps: { value: 'Yo2Child2', isSelectable: true },
        selectedItemProps: { value: 'Yo2Child2' },
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
        [unselectedListProps]="{
          selectionType: 'multi',
          title: 'Available items'
        }"
        [selectedListProps]="{
          title: 'Selected items'
        }"
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
      imports: [ButtonModule, AIListBuilderModule, ListModule, IconModule],
      declarations: [CustomIconStory],
    })
  )
  .addDecorator(withKnobs)
  .add('Simple', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [items]="items"
          [unselectedListProps]="{
            title: 'Available items'
          }"
          [selectedListProps]="{
            title: 'Selected items'
          }">
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
          [unselectedListProps]="{
            title: 'Available items',
            selectionType: 'multi'
          }"
          [selectedListProps]="{
            title: 'Selected items'
          }">
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
          [unselectedListProps]="{
            title: 'Available items'
          }"
          [selectedListProps]="{
            title: 'Selected items'
          }">
        </ai-list-builder>
        <p>{{ selectedItems }}</p>
        <button (click)="getSelectedItems()">Get all selected items</button>
      </div>
      `,
    props: {
      items: simpleItems,
      selectedItems: [],
      getSelectedItems: function () {
        this.selectedItems = JSON.stringify(getSelectedItems(this.items), null, 2);
      },
    },
  }));
