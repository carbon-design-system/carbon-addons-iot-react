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
      <ai-tab key="one" [controller]="controller">
        Tab Content 1
      </ai-tab>
      <ai-tab key="two" [controller]="controller">
        Tab Content 2
      </ai-tab>
      <ai-tab key="three" [controller]="controller">
        Tab Content 3
      </ai-tab>

      <ibm-tab-header-group [contentAfter]="controls">
        <ibm-tab-header [paneReference]="content1">One</ibm-tab-header>
        <ibm-tab-header [paneReference]="content2">Two</ibm-tab-header>
        <ibm-tab-header [paneReference]="content3">Three</ibm-tab-header>
      </ibm-tab-header-group>
      <ng-template #controls>
        <button aiTabAction>
          <svg class="bx--btn__icon" ibmIcon="add" size="16"></svg>
        </button>
        <ai-tab-dropdown [controller]="controller"></ai-tab-dropdown>
      </ng-template>
      <ibm-tab #content1>
        Tab Content 1
      </ibm-tab>
      <ibm-tab #content2>
        Tab Content 2
      </ibm-tab>
      <ibm-tab #content3>
        Tab Content 3
      </ibm-tab>
    `,
    props: {
      controller: new TabController([
        {
          key: 'one',
          title: 'One'
        },
        {
          key: 'two',
          title: 'Second tab'
        },
        {
          key: 'three',
          title: 'Three'
        }
      ]),
      addTab: function () {
        this.controller.addTab({
          key: Math.random(),
          title: 'Another tab'
        });
      }
    }
  }));
