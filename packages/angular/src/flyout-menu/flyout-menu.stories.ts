import { Component, Input, OnInit } from '@angular/core';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  IconService,
  PlaceholderModule,
} from 'carbon-components-angular';
import { Filter16 } from '@carbon/icons';

import { FlyoutMenuModule } from './flyout-menu.module';

@Component({
  selector: 'ai-flyout-menu-component',
  template: `
    <div style="position: absolute; left: 50%; top: 50%;">
      <ai-flyout-menu [flip]="flip" [placement]="placement">
        <div class="title">
          Filter
          <a ibmLink (click)="clearFilterClicked($event)" class="clear-flyout" href="#">Clear</a>
        </div>
        Columns
        <button ibmButton="secondary" cancelButton>Cancel</button>
        <button ibmButton applyButton>Apply</button>
      </ai-flyout-menu>
    </div>
  `,
})
class StoryCustomComponent implements OnInit {
  @Input() flip = false;
  @Input() placement: 'bottom' | 'top' | 'left' | 'right' = 'bottom';

  constructor(protected iconService: IconService) {}

  ngOnInit() {
    this.iconService.register(Filter16);
  }
}

storiesOf('Components/Filter menu', module)
  .addDecorator(
    moduleMetadata({
      declarations: [StoryCustomComponent],
      imports: [ButtonModule, DialogModule, PlaceholderModule, FlyoutMenuModule, IconModule],
      entryComponents: [StoryCustomComponent],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <ai-flyout-menu-component [flip]="flip" [placement]="placement"></ai-flyout-menu-component>
      <ibm-placeholder></ibm-placeholder>
    `,
    props: {
      flip: boolean('flip', false),
      placement: select('Placement', ['bottom', 'top', 'left', 'right'], 'bottom'),
    },
  }));
