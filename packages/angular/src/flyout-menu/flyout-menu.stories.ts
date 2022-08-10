import { moduleMetadata } from '@storybook/angular';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  PlaceholderModule,
} from 'carbon-components-angular';

import { FlyoutMenuModule } from './flyout-menu.module';

export default {
  title: 'Components/Filter menu',

  decorators: [
    moduleMetadata({
      imports: [ButtonModule, DialogModule, PlaceholderModule, FlyoutMenuModule, IconModule],
    })
  ],
  argTypes: {
    flip: {
      control: 'boolean',
      defaultValue: false
    },
    placement: {
      control: {
        type: 'select',
        options: ['bottom', 'top', 'left', 'right']
      },
      name: 'Placement',
      defaultValue: 'bottom'
    },
    isOpen: {
      control: 'boolean',
      defaultValue: false
    },
    handleOpenChange: {
      action: 'handleOpenChange',
      table: {
        disable: true
      }
    },
    clearFilterClicked: {
      action: 'clearFilterClicked',
      table: {
        disable: true
      }
    }
  }
};

export const basic = (args) => ({
  template: `
      <div style="position: absolute; left: 50%; top: 50%;">
        <ai-flyout-menu (isOpenChange)="handleOpenChange($event)" [isOpen]="isOpen" [flip]="flip" [placement]="placement">
          <div class="title">
            Filter
            <a ibmLink (click)="clearFilterClicked($event)" class="clear-flyout" href="#">Clear</a>
          </div>
          Columns
          <ai-flyout-menu-footer>
            <button ibmButton="secondary">Cancel</button>
            <button ibmButton>Apply</button>
          </ai-flyout-menu-footer>
        </ai-flyout-menu>
      </div>
      <ibm-placeholder></ibm-placeholder>
    `,
  props: args,
  name: 'Basic'
});
