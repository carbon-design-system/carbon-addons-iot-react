import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListModule } from './list.module';
import { AIListModel } from './ai-list-model.class';
import { simpleListItems, nestedListItems, singleSelectNestedListItems, multiSelectNestedListItems } from './sample-data';
import { DialogModule, IconModule, IconService } from 'carbon-components-angular';

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
      imports: [ListModule, DialogModule, IconModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Simple list', () => ({
    template: `
      <ai-list [model]="model"></ai-list>
    `,
    props: {
      model: simpleListModel,
    },
  }))
  .add('Hierarchy list with single select', () => ({
    template: `
      <ai-list [model]="model" selectionType="single"></ai-list>
    `,
    props: {
      model: singleSelectHierarchyListModel,
    },
  }))
  .add('Hierarchy list with multi select', () => ({
    template: `
      <ai-list [model]="model" selectionType="multi"></ai-list>
    `,
    props: {
      model: multiSelectHierarchyListModel,
    },
  }))
  .add('Hierarchy list draggable items', () => ({
    template: `
      <ai-list [model]="model" [itemsDraggable]="true"></ai-list>
    `,
    props: {
      model: draggableListModel,
    },
  }));
