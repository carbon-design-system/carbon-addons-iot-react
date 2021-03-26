import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';

import { ListItem } from 'carbon-components-angular';
import { SortableListModule } from './sortable-list.module';

storiesOf('Sterling Toolkit/Sortable list', module)
  .addDecorator(
    moduleMetadata({
      imports: [SortableListModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
		<div style="height: 40px">
			<!-- just to pad out the demo a bit -->
		</div>
		<sc-sortable-list [items]="items"></sc-sortable-list>
	`,
    props: {
      items: [
        {
          content: 'Item one',
          selected: false,
        },
        {
          content: 'Item two',
          selected: false,
        },
        {
          content: 'Item three',
          selected: false,
        },
        {
          content: 'Item four',
          selected: false,
        },
      ] as ListItem[],
    },
  }));
