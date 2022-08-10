import { moduleMetadata } from '@storybook/angular';
import { SortableListModule } from './sortable-list.module';

export default {
  title: 'Sterling Toolkit/Sortable list',

  decorators: [
    moduleMetadata({
      imports: [SortableListModule],
    })
  ]
};

const basicTpl = (args) => ({
  template: `
    <div style="height: 40px">
        <!-- just to pad out the demo a bit -->
    </div>
    <sc-sortable-list [items]="items"></sc-sortable-list>
  `,
  props: args
});
export const basic = basicTpl.bind({});
basic.args = {
  items: [
    {
      content: Promise.resolve('Item one'),
      selected: false,
    },
    {
      content: Promise.resolve('Item two'),
      selected: false,
    },
    {
      content: Promise.resolve('Item three'),
      selected: false,
    },
    {
      content: Promise.resolve('Item four'),
      selected: false,
    },
  ]
};
