import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { ListModule } from './list.module';
import { simpleListItems } from './sample-data';
import { DialogModule, IconModule, PlaceholderModule } from 'carbon-components-angular';
import { AppHierarchyList } from './stories/app-hierarchy-list.component';

storiesOf('Components/List', module)
  .addDecorator(
    moduleMetadata({
      imports: [ListModule, DialogModule, IconModule, PlaceholderModule],
      declarations: [AppHierarchyList],
    })
  )
  .addDecorator(withKnobs)
  .add('Simple list', () => ({
    template: `
      <ai-list [items]="items" title="Simple list"></ai-list>
    `,
    props: {
      items: simpleListItems,
    },
  }))
  .add('Hierarchy list draggable items', () => ({
    template: `
      <app-hierarchy-list></app-hierarchy-list>
    `,
  }));
