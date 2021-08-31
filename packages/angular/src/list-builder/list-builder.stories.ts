import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListBuilderModule } from './list-builder.module';
import { ListModule } from '../list/list.module';
import { ButtonModule, IconModule } from 'carbon-components-angular';
import { AIListBuilderModel, AIListBuilderItem } from './list-builder-model.class';

const simpleModel = new AIListBuilderModel();

simpleModel.items = [
  new AIListBuilderItem({ value: 'Canada' }),
  new AIListBuilderItem({ value: 'Brazil' }),
  new AIListBuilderItem({ value: 'Columbia' }),
  new AIListBuilderItem({ value: 'United States of America' }),
  new AIListBuilderItem({ value: 'Uruguay' }),
  new AIListBuilderItem({ value: 'Spain' }),
];

const nestedItemsMultiSelectModel = new AIListBuilderModel();

nestedItemsMultiSelectModel.items = [
  new AIListBuilderItem({
    value: 'Apple',
    isSelectable: true,
    addOnSelect: true,
    addedItemProps: {
      isDraggable: true,
      secondaryValue: 'I have been chosen',
    },
    addedState: null,
    items: [
      new AIListBuilderItem({
        value: 'Apple 2',
        isSelectable: true,
        addOnSelect: true,
        addedItemProps: {
          isDraggable: true,
          secondaryValue: 'I have been chosen',
        },
        addedState: null,
      }),
      new AIListBuilderItem({
        value: 'Apple 3',
        isSelectable: true,
        addOnSelect: true,
        addedItemProps: {
          isDraggable: true,
          secondaryValue: 'I have been chosen',
        },
        addedState: null,
      }),
      new AIListBuilderItem({
        value: 'Apple 4',
        isSelectable: true,
        addOnSelect: true,
        addedItemProps: {
          isDraggable: true,
          secondaryValue: 'I have been chosen',
        },
        addedState: null,
      }),
    ],
  }),
  new AIListBuilderItem({
    value: 'Orange',
    isSelectable: true,
    addOnSelect: true,
    addedItemProps: {
      isDraggable: true,
      secondaryValue: 'I have been chosen',
    },
    addedState: null,
  }),
  new AIListBuilderItem({
    value: 'Banana',
    isSelectable: true,
    addOnSelect: true,
    addedItemProps: {
      isDraggable: true,
      secondaryValue: 'I have been chosen',
    },
    addedState: null,
  }),
  new AIListBuilderItem({
    value: 'Tomato',
    isSelectable: true,
    addOnSelect: true,
    addedItemProps: {
      isDraggable: true,
      secondaryValue: 'I have been chosen',
    },
    addedState: null,
  }),
  new AIListBuilderItem({
    value: 'Pineapple',
    isSelectable: true,
    addOnSelect: true,
    addedItemProps: {
      isDraggable: true,
      secondaryValue: 'I have been chosen',
    },
    addedState: null,
  }),
];

const categoryItemModel = new AIListBuilderModel();

categoryItemModel.items = [
  new AIListBuilderItem({
    value: 'Canada',
    isCategory: true,
    expanded: true,
    rowActions: null,
    items: [
      new AIListBuilderItem({
        value: 'Toronto',
        secondaryValue: '6,254,571',
        addedState: 'disabled',
      }),
      new AIListBuilderItem({
        value: 'Vancouver',
        secondaryValue: '2,581,000',
        addedState: 'disabled',
      }),
    ],
  }),
  new AIListBuilderItem({
    value: 'Brazil',
    expanded: true,
    isCategory: true,
    rowActions: null,
    items: [
      new AIListBuilderItem({
        value: 'São Paulo',
        secondaryValue: '12,325,232',
        addedState: 'disabled',
      }),
      new AIListBuilderItem({
        value: 'Rio de Janeiro',
        secondaryValue: '6,747,815',
        addedState: 'disabled',
      }),
    ],
  }),
  new AIListBuilderItem({
    value: 'Columbia',
    expanded: true,
    isCategory: true,
    rowActions: null,
    items: [
      new AIListBuilderItem({
        value: 'Bogotá',
        secondaryValue: '8,181,047',
        addedState: 'disabled',
      }),
      new AIListBuilderItem({
        value: 'Leticia',
        secondaryValue: '42,280',
        addedState: 'disabled',
      }),
    ],
  }),
  new AIListBuilderItem({
    value: 'United States of America',
    expanded: true,
    isCategory: true,
    rowActions: null,
    items: [
      new AIListBuilderItem({
        value: 'Chicago',
        secondaryValue: '2,677,643',
        addedState: 'disabled',
      }),
      new AIListBuilderItem({
        value: 'Los Angeles',
        secondaryValue: '3,970,219',
        addedState: 'disabled',
      }),
    ],
  }),
  new AIListBuilderItem({
    value: 'Uruguay',
    expanded: true,
    isCategory: true,
    rowActions: null,
    items: [
      new AIListBuilderItem({
        value: 'Montevideo',
        secondaryValue: '1,319,108',
        addedState: 'disabled',
      }),
      new AIListBuilderItem({
        value: 'Salto',
        secondaryValue: '104,028',
        addedState: 'disabled',
      }),
    ],
  }),
];

storiesOf('Components/List builder', module)
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule, ListBuilderModule, ListModule, IconModule],
      declarations: [],
    })
  )
  .addDecorator(withKnobs)
  .add('Simple', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [model]="model"
          [listProps]="listProps"
          [addedItemsListProps]="addedItemsListProps">
        </ai-list-builder>
      </div>
    `,
    props: {
      model: simpleModel,
      listProps: {
        title: 'All items',
      },
      addedItemsListProps: {
        title: 'Selected items',
      },
    },
  }))
  .add('Multi select', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [model]="model"
          [listProps]="listProps"
          [addedItemsListProps]="addedItemsListProps"
          addingMethod="multi-select">
        </ai-list-builder>
      </div>
    `,
    props: {
      model: nestedItemsMultiSelectModel,
      listProps: {
        title: 'All items',
      },
      addedItemsListProps: {
        title: 'Selected items',
      },
    },
  }))
  .add('With category items', () => ({
    template: `
      <div style='width: 900px; height: 1200px'>
        <ai-list-builder
          [model]="model"
          [listProps]="listProps"
          [addedItemsListProps]="addedItemsListProps">
        </ai-list-builder>
      </div>
    `,
    props: {
      model: categoryItemModel,
      listProps: {
        title: 'All items',
      },
      addedItemsListProps: {
        title: 'Selected items',
      },
    },
  }));
