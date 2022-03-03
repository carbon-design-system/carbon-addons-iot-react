import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  PlaceholderModule,
} from 'carbon-components-angular';

import { FlyoutMenuModule } from './flyout-menu.module';

storiesOf('Components/Filter menu', module)
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule, DialogModule, PlaceholderModule, FlyoutMenuModule, IconModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <div style="position: absolute; left: 50%; top: 50%;">
        <ai-flyout-menu (isOpenChange)="handleOpenChange($event)" [flip]="flip" [placement]="placement">
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
    props: {
      flip: boolean('flip', false),
      placement: select('Placement', ['bottom', 'top', 'left', 'right'], 'bottom'),
      handleOpenChange: (isOpen) => {
        console.log(`Flyout has been ${isOpen ? 'opened' : 'closed'}`);
      },
    },
  }));
