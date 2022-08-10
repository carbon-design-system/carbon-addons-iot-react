import { moduleMetadata } from '@storybook/angular';
import { TableHeaderItem, TableItem } from 'carbon-components-angular';
import { SCTableModel } from './sterling-table-model.class';
import { SCTableModule } from './sterling-table.module';

const simpleModel = new SCTableModel();

simpleModel.header = [
  [
    new TableHeaderItem({
      data: 'Name Name Name Name Name Name Name Name Name Name \
    Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name \
    Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name \
    Name Name Name Name Name Name Name Name Name Name \
    Name',
      rowSpan: 2,
    }),
    new TableHeaderItem({ data: 'hwer', colSpan: 2, sortable: false }),
    null,
  ],
  [null, new TableHeaderItem({ data: 'hwer1' }), new TableHeaderItem({ data: 'hwer2' })],
];

simpleModel.data = [
  [
    new TableItem({ data: 'Name 1' }),
    new TableItem({ data: 'qwer' }),
    new TableItem({ data: 'qwer1' }),
  ],
  [new TableItem({ data: 'Name 3' }), new TableItem({ data: 'zwer', colSpan: 2 }), null],
  [
    new TableItem({ data: 'Name 2' }),
    new TableItem({ data: 'swer' }),
    new TableItem({ data: 'swer1' }),
  ],
  [
    new TableItem({ data: 'Name 4' }),
    new TableItem({ data: 'twer' }),
    new TableItem({ data: 'twer1' }),
  ],
];

export default {
  title: 'Sterling Toolkit/Sterling table',

  decorators: [
    moduleMetadata({
      imports: [SCTableModule],
    })
  ],
};

const basicTpl = (args) => {
  return {
    template: `
      <sc-table
          [model]="model"
          [size]="size"
          [showSelectionColumn]="showSelectionColumn"
          [striped]="striped"
          [skeleton]="skeleton"
          [isDataGrid]="isDataGrid"
          (sort)="customSort($event)"
          (rowClick)="rowClick($event)">
      </sc-table>
    `,
    props: args,
    name: 'Basic'
  };
};
export const basic = basicTpl.bind({});
basic.argTypes = {
  model: {
    table: {
      disable: true
    }
  },
  size: {
    control: {
      type: 'select',
      options: { Small: 'sm', Short: 'sh', Normal: 'md', Large: 'lg' }
    },
    defaultValue: 'md'
  },
  showSelectionColumn: {
    control: 'boolean',
    defaultValue: true
  },
  striped: {
    control: 'boolean',
    defaultValue: true
  },
  isDataGrid: {
    control: 'boolean',
    name: 'Data grid keyboard interactions',
    defaultValue: true
  },
  skeleton: {
    control: 'boolean',
    name: 'Skeleton mode',
    defaultValue: false
  },
  rowClick: {
    action: 'click',
    table: {
      disable: true
    }
  },
  customSort: {
    action: 'function',
    table: {
      disable: true
    }
  }
};
basic.args = {
  model: simpleModel,
  customSort: (index: number) => {
    if (simpleModel.getHeader(index).sorted) {
      // if already sorted flip sorting direction
      simpleModel.getHeader(index).ascending = simpleModel.getHeader(index).descending;
    }
    simpleModel.sort(index);
  }
};
