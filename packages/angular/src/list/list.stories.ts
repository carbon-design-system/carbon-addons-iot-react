import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListModule } from './list.module';
import { ListModel } from './list-model.class';
import { ListItem } from './list-item.class';
import { DialogModule, IconModule, IconService } from 'carbon-components-angular';

const nestedListModel = new ListModel();
nestedListModel.items = [
  new ListItem({
    value: 'Category 1',
    expanded: true,
    items: [
      new ListItem({
        value: 'Sub category 1',
        expanded: true,
        items: [
          new ListItem({
            value: 'Sub sub category 1',
            expanded: true,
            items: [
              new ListItem({ value: 'Sloth' }),
              new ListItem({
                value: 'Sub sub sub category 1',
                expanded: true,
                items: [
                  new ListItem({ value: 'Armadillo' }),
                  new ListItem({ value: 'Catfish' }),
                  new ListItem({ value: 'Alligator' })
                ]
              })
            ]
          }),
          new ListItem({ value: 'Fox' }),
          new ListItem({ value: 'Elephant' })
        ]
      }),
      new ListItem({
        value: 'Cat'
      })
    ]
  }),
  new ListItem({ value: 'Dog' }),
  new ListItem({ value: 'Fish' }),
  new ListItem({
    value: 'Category 2',
    expanded: true,
    items: [
      new ListItem({ value: 'Anteater' }),
      new ListItem({
        value: 'Sub category 1',
        expanded: true,
        items: [
          new ListItem({ value: 'Sloth' }),
          new ListItem({
            value: 'Sub sub category 2',
            expanded: true,
            items: [
              new ListItem({ value: 'Armadillo' }),
              new ListItem({ value: 'Catfish' }),
              new ListItem({ value: 'Alligator' })
            ]
          })
        ]
      }),
      new ListItem({
        value: 'Sub category 2',
        expanded: true,
        items: [
          new ListItem({ value: 'Sloth' }),
          new ListItem({
            value: 'Sub sub category 2',
            expanded: true,
            items: [
              new ListItem({ value: 'Armadillo' }),
              new ListItem({ value: 'Catfish' }),
              new ListItem({ value: 'Alligator' })
            ]
          })
        ]
      })
    ]
  }),
  new ListItem({ value: 'Giraffe' })
];

const simpleListModel = new ListModel();
simpleListModel.items = [
  new ListItem({ value: 'Sloth' }),
  new ListItem({ value: 'Elephant' }),
  new ListItem({ value: 'Giraffe' }),
  new ListItem({ value: 'Elk' }),
  new ListItem({ value: 'Anteater' }),
  new ListItem({ value: 'Armadillo' })
];

storiesOf('Components/List', module)
  .addDecorator(
    moduleMetadata({
      imports: [ListModule, DialogModule, IconModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Simple list', () => ({
    template: `
      <ai-list [model]="model" title="Simple list items" [isSelectable]="true"></ai-list>
    `,
    props: {
      model: simpleListModel
    }
  }))
  .add('Hierarchical list', () => ({
    template: `
      <ai-list [model]="model" title="Nested list items" [isSelectable]="true" [search]="true"></ai-list>
    `,
    props: {
      model: nestedListModel
    },
  }));
