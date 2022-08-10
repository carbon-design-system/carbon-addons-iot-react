import { moduleMetadata } from '@storybook/angular';
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

const defaultArgTypes = {
  click: {
    action: 'click',
    table: {
      disable: true
    }
  },
  icon: {
    control: {
      type: 'select',
      options: ['error', 'error404', 'not-authorized', 'no-results', 'success', 'default', 'no-icon']
    },
    defaultValue: 'default'
  },
  title: {
    control: 'text',
    defaultValue: 'No data to display'
  },
  body: {
    control: 'text',
    defaultValue: 'Optional extra sentence or sentences to describe the resource and how to create it or the action a first-time user needs to take.'
  }
};

export default {
  title: 'Components/EmptyState',

  decorators: [
    moduleMetadata({
      declarations: [AppDemoIcons],
      imports: [ButtonModule, EmptyStateModule, IconModule, LinkModule],
    })
  ]
};

const defaultTpl = (args) => ({
  template: `
    <ai-empty-state [icon]="icon">
      <h3 aiEmptyStateTitle>{{ title }}</h3>
      <p aiEmptyStateBody>{{ body }}</p>
      <ai-empty-state-action>
        <button ibmButton (click)="click('Primary action button clicked')">Action</button>
      </ai-empty-state-action>
    </ai-empty-state>
  `,
  props: args,
  name: 'Default'
});

export const defaultStory = defaultTpl.bind({});
defaultStory.argTypes = defaultArgTypes;

const withActionsAndContextTpl = (args) => ({
  template: `
    <ai-empty-state [icon]="icon">
      <h3 aiEmptyStateTitle>{{ title }}</h3>
      <p aiEmptyStateBody>{{ body }}</p>
      <ai-empty-state-action>
        <button ibmButton (click)="click('Primary action clicked')">Action</button>
      </ai-empty-state-action>
      <ai-empty-state-secondary-action>
        <a ibmLink (click)="click('Secondary action clicked')">Secondary action</a>
      </ai-empty-state-secondary-action>
    </ai-empty-state>
  `,
  props: args,
  name: 'With actions and context'
});

export const withActionsAndContext = withActionsAndContextTpl.bind({});
withActionsAndContext.argTypes = defaultArgTypes;

const withCustomIconTpl = (args) => ({
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
  props: args,
  name: 'With custom icon'
});

export const withCustomIcon = withCustomIconTpl.bind({});
withCustomIcon.argTypes = {
  title: {
    control: 'text',
    defaultValue: 'No data to display'
  },
  body: {
    control: 'text',
    defaultValue: 'Optional extra sentence or sentences to describe the resource and how to create it or the action a first-time user needs to take.'
  },
  click: {
    action: 'click',
    table: {
      disable: true
    }
  }
};
