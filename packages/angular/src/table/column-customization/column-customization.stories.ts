import { Component } from '@angular/core';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import {
  IconModule,
  IconService,
  PlaceholderModule,
  TableHeaderItem,
  TableItem,
} from 'carbon-components-angular';
import Column16 from '@carbon/icons/lib/column/16';

import { AITableModel } from '../table-model.class';
import { AITableModule } from '../table.module';

@Component({
  selector: 'app-demo-icons',
  template: '',
})
class AppDemoIcons {
  constructor(protected iconService: IconService) {
    iconService.registerAll([Column16]);
  }
}

const simpleModel = new AITableModel();

simpleModel.setHeader([
  [
    new TableHeaderItem({
      data: 'Name',
      rowSpan: 2,
    }),
    new TableHeaderItem({ data: 'hwer', colSpan: 2, sortable: false }),
    null,
  ],
  [null, new TableHeaderItem({ data: 'hwer1' }), new TableHeaderItem({ data: 'hwer2' })],
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

complexModel.setData([
  [
    new TableItem({ data: 'h1_data' }),
    new TableItem({ data: 'h2_data' }),
    new TableItem({ data: 'h2_data' }),
    new TableItem({ data: 'h3_data' }),
    new TableItem({ data: 'h3_data' }),
    new TableItem({ data: 'h3_data' }),
    new TableItem({ data: 'h4_data' }),
  ],
]);

storiesOf('Components/Table/Column customization', module)
  .addDecorator(
    moduleMetadata({
      imports: [AITableModule, IconModule, PlaceholderModule],
      declarations: [AppDemoIcons],
    })
  )
  .addDecorator(withKnobs)
  .add('Simple multi header', () => {
    return {
      template: `
      <ai-table [model]="model"></ai-table>
      <ai-column-customization-button
        [model]="model"
        ibmButton="primary"
        assistiveText="Customize columns">
        <svg class="bx--btn__icon" ibmIcon="column" size="16"></svg>
      </ai-column-customization-button>
      <ibm-placeholder></ibm-placeholder>
      <app-demo-icons></app-demo-icons>
		`,
      props: {
        model: simpleModel,
      },
    };
  })
  .add('Complex multi header', () => {
    return {
      template: `
      <ai-table [model]="model"></ai-table>
      <ai-column-customization-button
        [model]="model"
        ibmButton="primary"
        assistiveText="Customize columns">
        <svg class="bx--btn__icon" ibmIcon="column" size="16"></svg>
      </ai-column-customization-button>
      <ibm-placeholder></ibm-placeholder>
      <app-demo-icons></app-demo-icons>
		`,
      props: {
        model: complexModel,
      },
    };
  });
