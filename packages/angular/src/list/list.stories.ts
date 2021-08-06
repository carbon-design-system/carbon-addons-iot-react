import { AppCustomList } from './stories/app-custom-list.component';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListModule } from './list.module';
import { DialogModule, IconModule, PlaceholderModule } from 'carbon-components-angular';
import { AppHierarchyList } from './stories/app-hierarchy-list.component';
import { simpleListItems, nestedDraggableListItems, largeListItems } from './sample-data';

storiesOf('Components/List', module)
  .addDecorator(
    moduleMetadata({
      imports: [ListModule, DialogModule, IconModule, PlaceholderModule],
      declarations: [AppHierarchyList, AppCustomList],
    })
  )
  .addDecorator(withKnobs)
  .add('Single select', () => ({
    template: `
      <ai-list [items]="items" title="Simple list" selectionType="single"></ai-list>
    `,
    props: {
      items: simpleListItems,
    },
  }))
  .add('Empty list', () => ({
    template: `
      <div style="width: 400px; height: 600px">
        <ai-list title="Empty list" [items]="[]" [isFullHeight]="true"></ai-list>
      </div>
    `,
  }))
  .add('Hierarchy list draggable items', () => ({
    template: `
    <div style="display: flex">
      <div style="height: 600px; width: 400px; margin-right: 40px">
        <ai-list
          [items]="items"
          selectionType="multi"
          [isFullHeight]="true"
          title="City Populations"
          emptyState="No list items to show, drag items here to add some"
          [hasSearch]="true"
          [itemsDraggable]="true"
          [(isDragging)]="isDragging"
          [(draggedItem)]="draggedItem"
        >
        </ai-list>
      </div>
      <div style="height: 600px; width: 400px">
        <ai-list
          [items]="secondaryItems"
          selectionType="multi"
          [isFullHeight]="true"
          title="City Populations"
          emptyState="No list items to show, drag items here to add some"
          [hasSearch]="true"
          [itemsDraggable]="true"
          [(isDragging)]="isDragging"
          [(draggedItem)]="draggedItem"
        >
        </ai-list>
      </div>
    </div>
    `,
    props: {
      items: nestedDraggableListItems,
      secondaryItems: [],
      isDragging: false,
      draggedItem: null,
    },
  }))
  .add('With row actions', () => ({
    template: `
      <app-hierarchy-list [items]="items">
      </app-hierarchy-list>
    `,
    props: {
      items: nestedDraggableListItems,
    },
  }))
  .add('With large items', () => ({
    template: `
      <ai-list
        [items]="items"
        selectionType="single"
        title="City Populations"
        [hasSearch]="true"
        [itemsDraggable]="true"
      >
      </ai-list>
    `,
    props: {
      items: largeListItems,
    },
  }))
  .add('With custom search', () => ({
    template: `
      <app-custom-list></app-custom-list>
    `,
  }));
