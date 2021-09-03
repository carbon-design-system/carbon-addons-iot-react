import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TableHeaderItem, TableItem } from 'carbon-components-angular';

import { AITableModel } from './table-model.class';
import { AITableModule } from './table.module';

const simpleModel = new AITableModel();

simpleModel.setData([
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
]);

simpleModel.setHeader([
  [
    new TableHeaderItem({ data: 'h1' }),
    new TableHeaderItem({ data: 'h2', colSpan: 2 }),
    new TableHeaderItem({ data: 'h3', colSpan: 3 }),
    new TableHeaderItem({ data: 'h4', rowSpan: 4 }),
  ],
  [
    new TableHeaderItem({ data: 'h11' }),
    new TableHeaderItem({ data: 'h21', rowSpan: 3 }),
    new TableHeaderItem({ data: 'h22' }),
    new TableHeaderItem({ data: 'h31', rowSpan: 2 }),
    new TableHeaderItem({ data: 'h32', rowSpan: 3 }),
    new TableHeaderItem({ data: 'h33' }),
  ],
  [
    new TableHeaderItem({ data: 'h12', rowSpan: 2 }),
    new TableHeaderItem({ data: 'h222' }),
    new TableHeaderItem({ data: 'h331' }),
  ],
  [
    new TableHeaderItem({ data: 'h223' }),
    new TableHeaderItem({ data: 'h312' }),
    new TableHeaderItem({ data: 'h332' }),
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
      <button (click)="onClick()">Click</button>
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
        onClick: function () {
          this.model.moveColumn(1, 2, 0);
        },
      },
    };
  });
