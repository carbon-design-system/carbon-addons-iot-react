import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TableHeaderItem, TableItem } from 'carbon-components-angular';
import { Action } from 'rxjs/internal/scheduler/Action';

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

storiesOf('Sterling Toolkit/Sterling table', module)
  .addDecorator(
    moduleMetadata({
      imports: [SCTableModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => {
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
      props: {
        model: simpleModel,
        size: select('size', { Small: 'sm', Short: 'sh', Normal: 'md', Large: 'lg' }, 'md'),
        showSelectionColumn: boolean('showSelectionColumn', true),
        striped: boolean('striped', true),
        isDataGrid: boolean('Data grid keyboard interactions', true),
        skeleton: boolean('Skeleton mode', false),
        rowClick: action('row clicked'),
        customSort: (index: number) => {
          if (simpleModel.getHeader(index).sorted) {
            // if already sorted flip sorting direction
            simpleModel.getHeader(index).ascending = simpleModel.getHeader(index).descending;
          }
          simpleModel.sort(index);
        },
      },
    };
  });
