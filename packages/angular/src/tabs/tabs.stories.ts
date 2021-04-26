import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { TabsModule } from './tabs.module';
import { TabController } from './tab-controller.class';
import { ButtonModule, DropdownModule, IconModule, TabsModule as CTabsModule } from 'carbon-components-angular';

storiesOf('Components/Tabs', module)
  .addDecorator(
    moduleMetadata({
      imports: [TabsModule, CTabsModule, IconModule, ButtonModule, DropdownModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <ai-tabs [controller]="controller">
        <ai-tab-actions>
          <button aiTabAction (click)="addTab()">
            <svg class="bx--btn__icon" ibmIcon="add" size="16"></svg>
          </button>
          <ai-tab-dropdown [controller]="controller"></ai-tab-dropdown>
        </ai-tab-actions>
      </ai-tabs>
      <ai-tab
        *ngFor="let tab of controller.tabList | async"
        [key]="tab.key"
        [controller]="controller">
        {{tab.demoContent}}
      </ai-tab>
    `,
    props: {
      controller: new TabController([
        {
          key: 'one',
          title: 'One',
          demoContent: 'Tab content 1'
        },
        {
          key: 'two',
          title: 'Second tab',
          demoContent: 'Tab content 2'
        },
        {
          key: 'three',
          title: 'Three',
          demoContent: 'Tab content 3'
        }
      ]),
      addTab: function () {
        this.controller.addTab({
          key: Math.random(),
          title: 'Another tab',
          demoContent: 'Another tab content'
        });
      }
    }
  }));
