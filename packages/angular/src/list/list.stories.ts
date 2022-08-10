import { AppCustomList } from './stories/app-custom-list.component';
import { moduleMetadata } from '@storybook/angular';
import { ListModule } from './list.module';
import { DialogModule, IconModule, PlaceholderModule } from 'carbon-components-angular';
import { AppHierarchyList } from './stories/app-hierarchy-list.component';
import { simpleListItems, nestedDraggableListItems, largeListItems } from './sample-data';

export default {
  title: 'Components/List',

  decorators: [
    moduleMetadata({
      imports: [ListModule, DialogModule, IconModule, PlaceholderModule],
      declarations: [AppHierarchyList, AppCustomList],
    })
  ]
};

const commonArgTypes = {
  selectionType: {
    control: {
      type: 'radio',
      options: [ 'single', 'multi' ]
    },
    defaultValue: 'single'
  },
  items: {
    table: {
      disable: true
    }
  },
  secondaryItems: {
    table: {
      disable: true
    }
  }
};

const isFullHeight = {
  control: 'boolean',
  defaultValue: true
};

const hasSearch = {
  control: 'boolean',
  defaultValue: true
};

const itemsDraggable = {
  control: 'boolean',
  defaultValue: true
};

const singleSelectTpl = (args) => ({
  template: `
    <ai-list [items]="items" title="Simple list" [selectionType]="selectionType"></ai-list>
  `,
  props: args,
  name: 'Single select'
});

export const singleSelect = singleSelectTpl.bind({});
singleSelect.argTypes = commonArgTypes;
singleSelect.args = {
  items: simpleListItems
};

const emptyListTpl = (args) => ({
  template: `
    <div style="width: 400px; height: 600px">
      <ai-list title="Empty list" [items]="[]" [isFullHeight]="isFullHeight"></ai-list>
    </div>
  `,
  name: 'Empty list',
  props: args
});
export const emptyList = emptyListTpl.bind({});
emptyList.argTypes = {
  isFullHeight
};

const hierarchyListDraggableItemsTpl = (args) => ({
  template: `
    <div style="display: flex">
      <div style="height: 600px; width: 400px; margin-right: 40px">
        <ai-list
          [items]="items"
          [selectionType]="selectionType"
          [isFullHeight]="isFullHeight"
          title="City Populations"
          emptyState="No list items to show, drag items here to add some"
          [hasSearch]="hasSearch"
          [itemsDraggable]="true"
          [(isDragging)]="isDragging"
          [(draggedItem)]="draggedItem"
        >
        </ai-list>
      </div>
      <div style="height: 600px; width: 400px">
        <ai-list
          [items]="secondaryItems"
          [selectionType]="selectionType"
          [isFullHeight]="isFullHeight"
          title="City Populations"
          emptyState="No list items to show, drag items here to add some"
          [hasSearch]="hasSearch"
          [itemsDraggable]="true"
          [(isDragging)]="isDragging"
          [(draggedItem)]="draggedItem"
        >
        </ai-list>
      </div>
    </div>
  `,
  props: args,
  name: 'Hierarchy list draggable items'
});
export const hierarchyListDraggableItems = hierarchyListDraggableItemsTpl.bind({});
hierarchyListDraggableItems.argTypes = {
  ...commonArgTypes,
  isFullHeight,
  hasSearch,
  isDragging: {
    table: {
      disable: true
    }
  },
  draggedItem: {
    table: {
      disable: true
    }
  }
};
hierarchyListDraggableItems.args = {
  items: nestedDraggableListItems,
  secondaryItems: [],
  isDragging: false,
  draggedItem: null
};

export const withRowActions = () => ({
  template: `
    <app-hierarchy-list [items]="items">
    </app-hierarchy-list>
  `,
  props: {
    items: nestedDraggableListItems,
  },
  name: 'With row actions'
});

const withLargeItemsTpl = (args) => ({
  template: `
    <ai-list
      [items]="items"
      [selectionType]="selectionType"
      title="City Populations"
      [hasSearch]="hasSearch"
      [itemsDraggable]="itemsDraggable"
    >
    </ai-list>
  `,
  props: args,
  name: 'With large items'
});
export const withLargeItems = withLargeItemsTpl.bind({});
withLargeItems.argTypes = {
  ...commonArgTypes,
  hasSearch,
  itemsDraggable
};
withLargeItems.args = {
  items: largeListItems,
};

export const withCustomSearch = () => ({
  template: `
    <app-custom-list></app-custom-list>
  `,
  name: 'With custom search',
});
