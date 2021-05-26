import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListModule } from './list.module';
import { ListModel } from './list-model.class';
import { ListItem } from './list-item.class';
import { DialogModule, IconModule, IconService } from 'carbon-components-angular';

const nestedListModel = new ListModel();
nestedListModel.items = [
  new ListItem({
    value: 'DJ LeMahieu',
    items: [
      new ListItem({
        value: 'Recursion!',
        items: [
          new ListItem({
            value: 'DJ LeMahieu',
            items: [new ListItem({ value: 'I think you get the point' })]
          }),
          new ListItem({ value: 'DJ LeMahieu' }),
          new ListItem({ value: 'DJ LeMahieu' })
        ]
      })
    ]
  }),
  new ListItem({ value: 'DJ LeMahieu' }),
  new ListItem({ value: 'DJ LeMahieu' }),
  new ListItem({
    value: 'DJ LeMahieu',
    items: [
      new ListItem({ value: 'DJ LeMahieu' })
    ]
  }),
  new ListItem({ value: 'DJ LeMahieu' })
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
      <ai-list [model]="model" title="Nested list items"></ai-list>
    `,
    props: {
      model: nestedListModel
    },
  }));
