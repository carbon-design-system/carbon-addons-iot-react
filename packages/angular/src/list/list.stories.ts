import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListModule } from './list.module';
import { AIListModel } from './ai-list-model.class';
import { simpleListItems, nestedListItems, singleSelectNestedListItems, multiSelectNestedListItems } from './sample-data';
import { DialogModule, IconModule, PlaceholderModule } from 'carbon-components-angular';
import { AppHierarchyList } from './stories/app-hierarchy-list.component';

const simpleListModel = new AIListModel();
simpleListModel.items = simpleListItems;

const singleSelectHierarchyListModel = new AIListModel();
singleSelectHierarchyListModel.items = singleSelectNestedListItems;

const multiSelectHierarchyListModel = new AIListModel();
multiSelectHierarchyListModel.items = multiSelectNestedListItems;

const draggableListModel = new AIListModel();
draggableListModel.items = nestedListItems;

storiesOf('Components/List', module)
  .addDecorator(
    moduleMetadata({
      imports: [ListModule, DialogModule, IconModule, PlaceholderModule],
      declarations: [AppHierarchyList]
    })
  )
  .addDecorator(withKnobs)
  .add('Simple list', () => ({
    template: `
      <ai-list [model]="model" title="Simple list"></ai-list>
    `,
    props: {
      model: simpleListModel,
    },
  }))
  .add('Hierarchy list with single select', () => ({
    template: `
      <ai-list [model]="model" selectionType="single" title="Single selection"></ai-list>
    `,
    props: {
      model: singleSelectHierarchyListModel,
    },
  }))
  .add('Hierarchy list with multi select', () => ({
    template: `
      <ai-list [model]="model" selectionType="multi" title="Multi selection"></ai-list>
    `,
    props: {
      model: multiSelectHierarchyListModel,
    },
  }))
  .add('Hierarchy list draggable items', () => ({
    template: `
      <app-hierarchy-list></app-hierarchy-list>
    `,
    props: {
      model: draggableListModel,
    },
  }));
