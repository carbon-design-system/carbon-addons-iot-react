import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';

import { RuleBuilderModule } from './rule-builder.module';

storiesOf('Components/Rule builder', module)
  .addDecorator(
    moduleMetadata({
      imports: [RuleBuilderModule, ContextMenuModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <div style="background: white; width: 100%; height: 100%; position: absolute; top: 0; left: 0; padding: 44px">
        <ai-rule-builder
        [tree]="{
          groupLogic: 'any',
          rules: [
            {operand: 'eq', id: '1'},
            {operand: 'eq', id: '2'},
            {
              groupLogic: 'any',
              rules: [
                {operand: 'eq', id: '3'},
                {operand: 'eq', id: '4'},
              ]
            }
          ]}"
        [columns]="[
          {content: 'Column 1', id: 'column-1'},
          {content: 'Column 2', id: 'column-2'},
          {content: 'Column 3', id: 'column-3'}
        ]">
        </ai-rule-builder>
      </div>
    `,
  }));
