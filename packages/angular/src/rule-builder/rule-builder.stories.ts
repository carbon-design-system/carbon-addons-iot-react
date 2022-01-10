import { storiesOf, moduleMetadata } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';

import { RuleBuilderModule } from './rule-builder.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'carbon-components-angular';

storiesOf('Components/Rule builder', module)
  .addDecorator(
    moduleMetadata({
      imports: [RuleBuilderModule, ContextMenuModule, CommonModule, FormsModule, DatePickerModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <ng-template #valueTemplate let-rule>
        <ibm-date-picker theme="light" [(ngModel)]="rule.value"></ibm-date-picker>
      </ng-template>

      <div style="background: white; width: 100%; height: 100%; position: absolute; top: 0; left: 0; padding: 44px">
        <ai-rule-builder
        [tree]="tree"
        [columns]="[
          {
            content: 'Column 1',
            id: 'column-1',
            operands: [
              { content: 'Equals', id: 'eq', selected: false },
              { content: 'Before', id: 'bf', selected: false },
              { content: 'After', id: 'af', selected: false },
            ],
            valueTemplate: valueTemplate
          },
          {content: 'Column 2', id: 'column-2'},
          {content: 'Column 3', id: 'column-3'}
        ]">
        </ai-rule-builder>
        {{ tree | json }}
      </div>
    `,
    props: {
      tree: object('tree', {
        groupLogic: 'any',
        rules: [
          { operand: 'eq', id: '1' },
          { operand: 'eq', id: '2' },
          {
            groupLogic: 'any',
            rules: [
              { operand: 'eq', id: '3' },
              { operand: 'eq', id: '4' },
            ],
          },
        ],
      }),
    },
  }));
