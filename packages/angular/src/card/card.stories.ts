import { moduleMetadata, Story } from '@storybook/angular';
import { CardModule } from './card.module';
import { Component, OnInit } from '@angular/core';
import { CardService } from './card.service';
import { DialogModule, IconModule, IconService } from 'carbon-components-angular';
import Popup16 from '@carbon/icons/lib/popup/16';
import Close16 from '@carbon/icons/lib/close/16';

@Component({
  selector: 'app-demo',
  template: `
    <p>These cards share a <code>CardService</code></p>
    <div class="cards">
      <ai-card>
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
        </ai-card-header>
        <ai-card-content> Demo Card content </ai-card-content>
      </ai-card>
      <ai-card>
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
        </ai-card-header>
        <ai-card-content> Demo Card content </ai-card-content>
      </ai-card>
    </div>
  `,
  providers: [CardService],
  styles: [
    `
      .cards {
        display: flex;
      }

      ai-card {
        margin: 10px;
        flex-grow: 1;
      }
    `,
  ],
})
class AppDemo implements OnInit {
  constructor(protected cardService: CardService) {}

  ngOnInit() {
    this.cardService.setCardHeight(800);
  }
}

@Component({
  selector: 'app-demo-icons',
  template: '',
})
class AppDemoIcons {
  constructor(protected iconService: IconService) {
    iconService.registerAll([Popup16, Close16]);
  }
}

export default {
  title: 'Components/Card',

  decorators: [
    moduleMetadata({
      imports: [CardModule, DialogModule, IconModule],
      declarations: [AppDemo, AppDemoIcons],
    })
  ]
};

export const basic = () => ({
  template: `
    <div style="width: 450px">
      <ai-card style="margin-bottom: 50px" [defaultHeight]="200">
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
          <ai-card-toolbar>
            <button aiCardToolbarAction>
              <svg ibmIcon="popup" size="16"></svg>
            </button>
          </ai-card-toolbar>
        </ai-card-header>
        <ai-card-content>
          Card content
        </ai-card-content>
      </ai-card>
      <ai-card [defaultHeight]="400" style="margin-bottom: 50px">
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
          <ai-card-toolbar>
            <ibm-overflow-menu aiCardToolbarAction>
              <ibm-overflow-menu-option>First option</ibm-overflow-menu-option>
              <ibm-overflow-menu-option>Second option</ibm-overflow-menu-option>
              <ibm-overflow-menu-option>Third option</ibm-overflow-menu-option>
              <ibm-overflow-menu-option>Fourth option</ibm-overflow-menu-option>
            </ibm-overflow-menu>
            <button aiCardToolbarAction>
              <svg ibmIcon="popup" size="16"></svg>
            </button>
          </ai-card-toolbar>
        </ai-card-header>
        <ai-card-content>
          Card content
        </ai-card-content>
      </ai-card>
    </div>
    <app-demo></app-demo>
    <app-demo-icons></app-demo-icons>
  `,
  name: 'Basic'
});

export const withALongTitle = () => ({
  template: `
    <div style="width: 450px">
      <ai-card style="margin-bottom: 50px" [defaultHeight]="200">
        <ai-card-header>
          <ai-card-title text="Card Title that should be truncated and presented in a tooltip while the cards also has an external tooltip.">
            <span
              ibmTooltip="This is some tooltip contents"
              trigger="click"
              placement="bottom">
              <div role="button" class="bx--tooltip__trigger">
                <svg ibmIcon="information--filled" size="16"></svg>
              </div>
            </span>
          </ai-card-title>
          <ai-card-toolbar>
            <button aiCardToolbarAction>
              <svg ibmIcon="popup" size="16"></svg>
            </button>
          </ai-card-toolbar>
        </ai-card-header>
        <ai-card-content>
          Card content
        </ai-card-content>
      </ai-card>
    </div>
    <app-demo-icons></app-demo-icons>
  `,
  name: 'With a long title'
});

export const withoutContent = () => ({
  template: `
    <ai-card [defaultHeight]="400">
      <ai-card-header>
        <ai-card-title text="Card Title"></ai-card-title>
        <ai-card-toolbar>
          <button aiCardToolbarAction>
            <svg ibmIcon="popup" size="16"></svg>
          </button>
        </ai-card-toolbar>
      </ai-card-header>
      <ai-card-content isEmpty="true" emptyText="No content available"></ai-card-content>
    </ai-card>
    <app-demo-icons></app-demo-icons>
  `,
  name: 'Without content'
});

export const withDateRangeSelector = () => ({
  template: `
    <div style="width: 450px">
      <ai-card [defaultHeight]="400">
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
          <ai-card-toolbar>
            <ai-card-date-range></ai-card-date-range>
            <button aiCardToolbarAction>
              <svg ibmIcon="popup" size="16"></svg>
            </button>
          </ai-card-toolbar>
        </ai-card-header>
        <ai-card-content>
          Card Content
        </ai-card-content>
      </ai-card>
    </div>
    <app-demo-icons></app-demo-icons>
  `,
  name: 'With date range selector'
});

const canExpand: Story = (args) => ({
  template: `
    <div style="width: 450px">
      <ai-card [defaultHeight]="400" [expanded]="expanded">
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
          <ai-card-toolbar>
            <button aiCardToolbarAction *ngIf="!expanded" (click)="expanded = true">
              <svg ibmIcon="popup" size="16"></svg>
            </button>
            <button aiCardToolbarAction *ngIf="expanded" (click)="expanded = false">
              <svg ibmIcon="close" size="16"></svg>
            </button>
          </ai-card-toolbar>
        </ai-card-header>
        <ai-card-content isEmpty="true" emptyText="No content available"></ai-card-content>
      </ai-card>
    <div style="width: 450px">
    <app-demo-icons></app-demo-icons>
  `,
  argTypes: {
    expanded: {
      control: 'boolean',
    }
  },
  props: args,
  name: 'Can expand'
});

export const expanded = canExpand.bind({});
expanded.args = {
  expanded: false
};
