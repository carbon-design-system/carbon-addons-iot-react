import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TableHeaderItem, TableItem } from 'carbon-components-angular';

import { AITableModel } from './table-model.class';
import { AITableModule } from './table.module';

const simpleModel = new AITableModel();

simpleModel.setHeader([
  [
    new TableHeaderItem({
      data: 'Name',
      rowSpan: 2,
    }),
    new TableHeaderItem({ data: 'hwer', colSpan: 2, sortable: false }),
  ],
  [new TableHeaderItem({ data: 'hwer1' }), new TableHeaderItem({ data: 'hwer2' })],
]);

simpleModel.setData([
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

const complexModel = new AITableModel();

complexModel.setHeader([
  [
    new TableHeaderItem({ data: 'h1', colSpan: 4 }),
    new TableHeaderItem({ data: 'h2', rowSpan: 4 }),
    new TableHeaderItem({ data: 'h3', colSpan: 2, rowSpan: 2 }),
    new TableHeaderItem({ data: 'h4', colSpan: 2 }),
  ],
  [
    new TableHeaderItem({ data: 'h11' }),
    new TableHeaderItem({ data: 'h12', rowSpan: 2, colSpan: 2 }),
    new TableHeaderItem({ data: 'h13', rowSpan: 3 }),
    new TableHeaderItem({ data: 'h41', rowSpan: 3 }),
    new TableHeaderItem({ data: 'h42' }),
  ],
  [
    new TableHeaderItem({ data: 'h111' }),
    new TableHeaderItem({ data: 'h31', colSpan: 2 }),
    new TableHeaderItem({ data: 'h421' }),
  ],
  [
    new TableHeaderItem({ data: 'h1111' }),
    new TableHeaderItem({ data: 'h121' }),
    new TableHeaderItem({ data: 'h122' }),
    new TableHeaderItem({ data: 'h311' }),
    new TableHeaderItem({ data: 'h312' }),
    new TableHeaderItem({ data: 'h422' }),
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

storiesOf('Components/Table', module)
  .addDecorator(
    moduleMetadata({
      imports: [AITableModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => {
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
      props: {
        model: simpleModel,
        size: select('size', { Small: 'sm', Short: 'sh', Normal: 'md', Large: 'lg' }, 'md'),
        showSelectionColumn: boolean('showSelectionColumn', true),
        striped: boolean('striped', true),
        isDataGrid: boolean('Data grid keyboard interactions', true),
        skeleton: boolean('Skeleton mode', false),
        rowClick: action('row clicked'),
        customSort: (index: number) => {
          if (simpleModel.getClosestHeader(index).sorted) {
            // if already sorted flip sorting direction
            simpleModel.getClosestHeader(index).ascending = simpleModel.getClosestHeader(
              index
            ).descending;
          }
          simpleModel.sort(index);
        },
      },
    };
  })
  .add('Complex multiheader table with move columns', () => {
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
      props: {
        model: complexModel,
        size: select('size', { Small: 'sm', Short: 'sh', Normal: 'md', Large: 'lg' }, 'md'),
        showSelectionColumn: boolean('showSelectionColumn', false),
        striped: boolean('striped', true),
        isDataGrid: boolean('Data grid keyboard interactions', false),
        skeleton: boolean('Skeleton mode', false),
        rowClick: action('row clicked'),
        indexFrom: null,
        indexTo: null,
        moveRandomColumns: function() {
          this.indexFrom = Math.floor(Math.random() * (complexModel['header'][0].length));
          this.indexTo = Math.floor(Math.random() * (complexModel['header'][0].length));
          this.model.moveColumn(this.indexFrom, this.indexTo, 0);
        },
      },
    };
  });
