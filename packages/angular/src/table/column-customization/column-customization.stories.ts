import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TableHeaderItem } from 'carbon-components-angular';

import { AITableModel } from '../table-model.class';
import { AITableModule } from '../table.module';

const simpleModel = new AITableModel();

simpleModel.setHeader([
  [
    new TableHeaderItem({
      data: 'yo',
    }),
    new TableHeaderItem({ data: 'hwer', colSpan: 2, sortable: false }),
    null,
    new TableHeaderItem({
      data: 'Name',
      rowSpan: 2,
    }),
  ],
  [
    new TableHeaderItem({ data: 'yo1' }),
    null,
    new TableHeaderItem({ data: 'hwer1' }),
    new TableHeaderItem({ data: 'hwer2' }),
  ],
  [
    new TableHeaderItem({ data: 'yo11' }),
    new TableHeaderItem({ data: 'test' }),
    new TableHeaderItem({ data: 'hwer11' }),
    new TableHeaderItem({ data: 'hwer22' }),
  ],
]);

const complexModel = new AITableModel();

complexModel.setHeader([
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
    null,
  ],
  [
    new TableHeaderItem({ data: 'h12', rowSpan: 2 }),
    new TableHeaderItem({ data: 'h222' }),
    new TableHeaderItem({ data: 'h331' }),
    null,
    null,
    null,
    null,
  ],
  [
    new TableHeaderItem({ data: 'h223' }),
    new TableHeaderItem({ data: 'h312' }),
    new TableHeaderItem({ data: 'h332' }),
    null,
    null,
    null,
    null,
  ],
]);

storiesOf('Components/Table/Column customization', module)
  .addDecorator(
    moduleMetadata({
      imports: [AITableModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Simple multi header', () => {
    return {
      template: `
			<ai-column-customization-modal [model]="model"></ai-column-customization-modal>
		`,
      props: {
        model: simpleModel,
      },
    };
  })
  .add('Complex multi header', () => {
    return {
      template: `
			<ai-column-customization-modal [model]="model"></ai-column-customization-modal>
		`,
      props: {
        model: complexModel,
      },
    };
  });
