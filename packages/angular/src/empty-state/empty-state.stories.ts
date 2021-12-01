import { storiesOf, moduleMetadata } from '@storybook/angular';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';

import { EmptyStateModule } from './empty-state.module';
import { Component } from '@angular/core';
import { ButtonModule, IconModule, IconService, LinkModule } from 'carbon-components-angular';
import Bee32 from '@carbon/icons/lib/bee/32';

@Component({
  selector: 'app-demo-icons',
  template: '',
})
class AppDemoIcons {
  constructor(protected iconService: IconService) {
    iconService.registerAll([Bee32]);
  }
}

storiesOf('Components/EmptyState', module)
  .addDecorator(
    moduleMetadata({
      declarations: [AppDemoIcons],
      imports: [ButtonModule, EmptyStateModule, IconModule, LinkModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Default', () => ({
    template: `
      <ai-empty-state [icon]="icon">
        <h3 aiEmptyStateTitle>{{ title }}</h3>
        <p aiEmptyStateBody>{{ body }}</p>
        <ai-empty-state-action>
          <button ibmButton (click)="actionOnClick()">Action</button>
        </ai-empty-state-action>
      </ai-empty-state>
		`,
    props: {
      icon: select(
        'icon',
        ['error', 'error404', 'not-authorized', 'no-results', 'success', 'default', 'no-icon'],
        'default'
      ),
      title: text('title', 'You don’t have any [variable] yet'),
      body: text(
        'body',
        'Optional extra sentence or sentences to describe the resource and how to create it or the action a first-time user needs to take.'
      ),
      actionOnClick: () => {
        console.log('Action button clicked');
      },
    },
  }))
  .add('With actions and context', () => ({
    template: `
      <ai-empty-state [icon]="icon">
        <h3 aiEmptyStateTitle>{{ title }}</h3>
        <p aiEmptyStateBody>{{ body }}</p>
        <ai-empty-state-action>
          <button ibmButton (click)="actionOnClick()">Action</button>
        </ai-empty-state-action>
        <ai-empty-state-secondary-action>
          <a ibmLink (click)="secondaryActionClick()">Secondary action</a>
        </ai-empty-state-secondary-action>
      </ai-empty-state>
		`,
    props: {
      icon: select(
        'icon',
        ['error', 'error404', 'not-authorized', 'no-results', 'success', 'default', 'no-icon'],
        'default'
      ),
      title: text('title', 'You don’t have any [variable] yet'),
      body: text(
        'body',
        'Optional extra sentence or sentences to describe the resource and how to create it or the action a first-time user needs to take.'
      ),
      actionOnClick: () => {
        console.log('Action button clicked');
      },
      secondaryActionClick: () => {
        console.log('Secondary action clicked');
      },
    },
  }))
  .add('With custom icon', () => ({
    template: `
      <ng-template #icon>
        <svg ibmIcon="bee" size="32"></svg>
      </ng-template>
      <ai-empty-state [icon]="icon">
        <h3 aiEmptyStateTitle>{{ title }}</h3>
        <p aiEmptyStateBody>{{ body }}</p>
      </ai-empty-state>
      <app-demo-icons></app-demo-icons>
		`,
    props: {
      title: text('title', 'Empty state with custom icon'),
      body: text('body', 'Custom icons can be used in addition to the preconfigured options.'),
    },
  }));
