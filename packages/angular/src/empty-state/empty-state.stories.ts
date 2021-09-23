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
      <ai-empty-state
        [icon]="icon"
        [title]="title"
        [body]="body"
        [action]="action">
      </ai-empty-state>

      <ng-template #action>
        <button ibmButton (click)="actionOnClick()">Action</button>
      </ng-template>
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
      <ai-empty-state
        [icon]="icon"
        [title]="title"
        [body]="body"
        [action]="action"
        [actionContext]="actionContext"
        [secondaryAction]="secondaryAction"
        [secondaryActionContext]="secondaryActionContext">
      </ai-empty-state>

      <ng-template #action let-data="data">
        <button ibmButton (click)="data.action()">Action</button>
      </ng-template>

      <ng-template #secondaryAction let-data="data">
        <a ibmLink (click)="data.action()">Secondary action</a>
      </ng-template>
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
      actionContext: {
        data: {
          action: () => {
            console.log('Action button clicked');
          },
        },
      },
      secondaryActionContext: {
        data: {
          action: () => {
            console.log('Secondary action link clicked');
          },
        },
      },
    },
  }))
  .add('With custom icon', () => ({
    template: `
      <ng-template #icon>
        <svg ibmIcon="bee" size="32"></svg>
      </ng-template>
      <ai-empty-state [icon]="icon" [title]="title" [body]="body"></ai-empty-state>
      <app-demo-icons></app-demo-icons>
		`,
    props: {
      title: text('title', 'Empty state with custom icon'),
      body: text('body', 'Custom icons can be used in addition to the preconfigured options.'),
    },
  }));
