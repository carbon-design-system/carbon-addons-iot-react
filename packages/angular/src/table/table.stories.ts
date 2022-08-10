import { moduleMetadata } from '@storybook/angular';
import { ButtonModule, TableItem } from 'carbon-components-angular';
import { AITableHeaderItem, AITableModel } from './table-model.class';
import { AITableModule } from './table.module';
import { EmptyStateModule } from '../empty-state-index';

const simpleModel = new AITableModel();
const simpleMultiHeaderModel = new AITableModel();
const complexModel = new AITableModel();
const emptyDataModel = new AITableModel();

simpleModel.setHeader([
  [
    new AITableHeaderItem({ data: 'hwer1', alignment: 'center' }),
    new AITableHeaderItem({ data: 'hwer2', alignment: 'center' }),
    new AITableHeaderItem({ data: 'hwer3', alignment: 'center' }),
    new AITableHeaderItem({ data: 'hwer4', alignment: 'center' }),
  ],
]);

simpleModel.setData([
  [
    new TableItem({ data: 'Name 1' }),
    new TableItem({ data: 'qwer' }),
    new TableItem({ data: 'qwer1' }),
    new TableItem({ data: 'qwer2' }),
  ],
  [
    new TableItem({ data: 'Name 3' }),
    new TableItem({ data: 'zwer' }),
    new TableItem({ data: 'qwer' }),
    new TableItem({ data: 'qwer2' }),
  ],
  [
    new TableItem({ data: 'Name 2' }),
    new TableItem({ data: 'swer' }),
    new TableItem({ data: 'swer1' }),
    new TableItem({ data: 'qwer2' }),
  ],
  [
    new TableItem({ data: 'Name 4' }),
    new TableItem({ data: 'twer' }),
    new TableItem({ data: 'twer1' }),
    new TableItem({ data: 'qwer2' }),
  ],
]);

simpleMultiHeaderModel.setHeader([
  [
    new AITableHeaderItem({
      data: 'Name',
      rowSpan: 2,
    }),
    new AITableHeaderItem({ data: 'hwer', colSpan: 2, sortable: false }),
  ],
  [new AITableHeaderItem({ data: 'hwer1' }), new AITableHeaderItem({ data: 'hwer2' })],
]);

simpleMultiHeaderModel.setData([
  [
    new TableItem({ data: 'Name 1' }),
    new TableItem({ data: 'qwer' }),
    new TableItem({ data: 'qwer1' }),
  ],
  [new TableItem({ data: 'Name 3' }), new TableItem({ data: 'zwer', colSpan: 2 })],
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
]);

complexModel.setHeader([
  [
    new AITableHeaderItem({ data: 'h1', colSpan: 4 }),
    new AITableHeaderItem({ data: 'h2', rowSpan: 4 }),
    new AITableHeaderItem({ data: 'h3', colSpan: 2, rowSpan: 2 }),
    new AITableHeaderItem({ data: 'h4', colSpan: 2 }),
  ],
  [
    new AITableHeaderItem({ data: 'h11' }),
    new AITableHeaderItem({ data: 'h12', rowSpan: 2, colSpan: 2 }),
    new AITableHeaderItem({ data: 'h13', rowSpan: 3 }),
    new AITableHeaderItem({ data: 'h41', rowSpan: 3 }),
    new AITableHeaderItem({ data: 'h42' }),
  ],
  [
    new AITableHeaderItem({ data: 'h111' }),
    new AITableHeaderItem({ data: 'h31', colSpan: 2 }),
    new AITableHeaderItem({ data: 'h421' }),
  ],
  [
    new AITableHeaderItem({ data: 'h1111' }),
    new AITableHeaderItem({ data: 'h121' }),
    new AITableHeaderItem({ data: 'h122' }),
    new AITableHeaderItem({ data: 'h311' }),
    new AITableHeaderItem({ data: 'h312' }),
    new AITableHeaderItem({ data: 'h422' }),
  ],
]);

complexModel.setData([
  [
    new TableItem({ data: 'd1111' }),
    new TableItem({ data: 'd121' }),
    new TableItem({ data: 'd122' }),
    new TableItem({ data: 'd13' }),
    new TableItem({ data: 'd2' }),
    new TableItem({ data: 'd311' }),
    new TableItem({ data: 'd312' }),
    new TableItem({ data: 'd41' }),
    new TableItem({ data: 'd422' }),
  ],
  [
    new TableItem({ data: 'd1111' }),
    new TableItem({ data: 'd121' }),
    new TableItem({ data: 'd122' }),
    new TableItem({ data: 'd13' }),
    new TableItem({ data: 'd2' }),
    new TableItem({ data: 'd311' }),
    new TableItem({ data: 'd312' }),
    new TableItem({ data: 'd41' }),
    new TableItem({ data: 'd422' }),
  ],
]);

emptyDataModel.setHeader([
  [
    new AITableHeaderItem({
      data: 'Name',
    }),
    new AITableHeaderItem({
      data: 'Name 2',
    }),
    new AITableHeaderItem({
      data: 'Name 3',
    }),
    new AITableHeaderItem({
      data: 'Name 4',
    }),
  ],
]);

const defaultArgTypes = {
  size: {
    control: {
      type: 'select',
      options: { Small: 'sm', Short: 'sh', Normal: 'md', Large: 'lg' }
    },
    defaultValue: 'md'
  },
  showSelectionColumn: { control: 'boolean', defaultValue: true },
  striped: { control: 'boolean', defaultValue: true },
  isDataGrid: { control: 'boolean', defaultValue: true },
  skeleton: { control: 'boolean', defaultValue: false },
  rowClick: {
    action: 'click',
    table: {
      disable: true
    }
  },
  model: {
    table: {
      disable: true
    }
  },
  customSort: {
    action: 'click',
    table: {
      disable: true
    }
  }
};

export default {
  title: 'Components/Table',

  decorators: [
    moduleMetadata({
      imports: [AITableModule, ButtonModule, EmptyStateModule],
    })
  ],
};

const basicTpl = (args) => {
  return {
    template: `
      <ai-table
        [model]="model"
        [size]="size"
        [showSelectionColumn]="showSelectionColumn"
        [striped]="striped"
        [skeleton]="skeleton"
        [isDataGrid]="isDataGrid"
        (sort)="customSort($event)"
        (rowClick)="rowClick($event)">
      </ai-table>
    `,
    props: args
  };
};

export const basic = basicTpl.bind({});
basic.argTypes = defaultArgTypes;
basic.args = {
  model: simpleModel,
  customSort: (index: number) => {
    if (simpleMultiHeaderModel.getClosestHeader(index).sorted) {
      // if already sorted flip sorting direction
      simpleMultiHeaderModel.getClosestHeader(index).ascending =
        simpleMultiHeaderModel.getClosestHeader(index).descending;
    }
    simpleMultiHeaderModel.sort(index);
  }
};

const basicMultiheaderTpl = (args) => {
  return {
    template: `
      <ai-table
          [model]="model"
          [size]="size"
          [showSelectionColumn]="showSelectionColumn"
          [striped]="striped"
          [skeleton]="skeleton"
          [isDataGrid]="isDataGrid"
          (sort)="customSort($event)"
          (rowClick)="rowClick($event)">
      </ai-table>
    `,
    props: args,
    name: 'Basic multiheader'
  };
};
export const basicMultiheader = basicMultiheaderTpl.bind({});
basicMultiheader.argTypes = defaultArgTypes;
basicMultiheader.args = {
  model: simpleMultiHeaderModel,
  customSort: (index: number) => {
    if (simpleMultiHeaderModel.getClosestHeader(index).sorted) {
      // if already sorted flip sorting direction
      simpleMultiHeaderModel.getClosestHeader(index).ascending =
        simpleMultiHeaderModel.getClosestHeader(index).descending;
    }
    simpleMultiHeaderModel.sort(index);
  }
};

const emptyTpl = (args) => {
  return {
    template: `
      <div class="iot--table-container bx--data-table-container">
        <div class="addons-iot-table-container">
          <div class="bx--data-table-content">
            <ai-table
              [showSelectionColumn]="false"
              [model]="model">
              <ai-empty-state [icon]="icon">
                <h3 aiEmptyStateTitle>{{ title }}</h3>
                <p aiEmptyStateBody>{{ body }}</p>
                <ai-empty-state-action>
                  <button ibmButton (click)="actionOnClick($event)">Create some data</button>
                </ai-empty-state-action>
              </ai-empty-state>
            </ai-table>
          </div>
        </div>
      </div>
    `,
    props: args
  };
};
export const empty = emptyTpl.bind({});
empty.argTypes = {
  icon: {
    control: {
      type: 'select',
      options: ['error', 'error404', 'not-authorized', 'no-results', 'success', 'default', 'no-icon'],
    },
    defaultValue: 'default'
  },
  title: {
    control: 'text',
    defaultValue: 'No data to display'
  },
  body: {
    control: 'text',
    defaultValue: 'Optional extra sentence or sentences'
  },
  actionOnClick: {
    action: 'click',
    table: {
      disable: true
    }
  },
  model: {
    table: {
      disable: true
    }
  }
};
empty.args = {
  model: emptyDataModel
};

const complexMultiheaderTableWithMoveColumnsTpl = (args) => {
  return {
    template: `
      <button (click)="moveRandomColumns()">Move random columns</button>
      <p>Moving header index {{indexFrom}} to index {{indexTo}}</p>
      <ai-table
        [model]="model"
        [size]="size"
        [showSelectionColumn]="showSelectionColumn"
        [striped]="striped"
        [skeleton]="skeleton"
        [isDataGrid]="isDataGrid"
        (rowClick)="rowClick($event)">
      </ai-table>
    `,
    props: args,
    name: 'Complex multiheader table with move columns'
  };
};
export const complexMultiheaderTableWithMoveColumns = complexMultiheaderTableWithMoveColumnsTpl.bind({});
complexMultiheaderTableWithMoveColumns.argTypes = {
  ...defaultArgTypes,
  indexFrom: {
    table: {
      disable: true
    }
  },
  indexTo: {
    table: {
      disable: true
    }
  },
  moveRandomColumns: {
    action: 'click',
    table: {
      disable: true
    }
  }
};
complexMultiheaderTableWithMoveColumns.args = {
  model: complexModel,
  indexFrom: null,
  indexTo: null,
  moveRandomColumns: function () {
    this.indexFrom = Math.floor(Math.random() * complexModel['header'][0].length);
    this.indexTo = Math.floor(Math.random() * complexModel['header'][0].length);
    this.model.moveColumn(this.indexFrom, this.indexTo, 0);
  }
};
