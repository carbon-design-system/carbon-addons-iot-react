import { storiesOf, moduleMetadata } from '@storybook/angular';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import { CardModule } from './card.module';
import { Component, OnInit } from '@angular/core';
import { CardService } from './card.service';
import { DialogModule, IconModule } from 'carbon-components-angular';

@Component({
  selector: 'app-demo',
  template: `
    <p>These cards share a <code>CardService</code></p>
    <div class="cards">
      <ai-card>
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
        </ai-card-header>
        <ai-card-content>
          Demo Card content
        </ai-card-content>
      </ai-card>
      <ai-card>
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
        </ai-card-header>
        <ai-card-content>
          Demo Card content
        </ai-card-content>
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
    `
  ]
})
class AppDemo implements OnInit {
  constructor(protected cardService: CardService) {}

  ngOnInit() {
    this.cardService.setCardHeight(800);
  }
}

storiesOf('Components/Card', module)
  .addDecorator(
    moduleMetadata({
      imports: [CardModule, DialogModule, IconModule],
      declarations: [AppDemo]
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => ({
    template: `
      <div style="width: 450px">
        <ai-card style="margin-bottom: 50px" [defaultHeight]="200">
          <ai-card-header>
            <ai-card-title text="Card Title"></ai-card-title>
            <ai-card-toolbar>
              <button aiCardToolbarAction>
                <svg ibmIcon="calendar" size="16"></svg>
              </button>
            </ai-card-toolbar>
          </ai-card-header>
          <ai-card-content>
            Card content
          </ai-card-content>
        </ai-card>
        <ai-card [defaultHeight]="400" style="margin-bottom:50px">
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
                <svg ibmIcon="calendar" size="16"></svg>
              </button>
            </ai-card-toolbar>
          </ai-card-header>
          <ai-card-content>
            Card content
          </ai-card-content>
        </ai-card>
      </div>
      <app-demo></app-demo>
		`,
    props: {},
  }))
  .add("With a long title", () => ({
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
                <svg ibmIcon="calendar" size="16"></svg>
              </button>
            </ai-card-toolbar>
          </ai-card-header>
          <ai-card-content>
            Card content
          </ai-card-content>
        </ai-card>
      </div>
    `
  }))
  .add("Without content", () => ({
    template: `
      <ai-card [defaultHeight]="400">
        <ai-card-header>
          <ai-card-title text="Card Title"></ai-card-title>
          <ai-card-toolbar>
            <button aiCardToolbarAction>
              <svg ibmIcon="calendar" size="16"></svg>
            </button>
          </ai-card-toolbar>
        </ai-card-header>
        <ai-card-content isEmpty="true" emptyText="No content available"></ai-card-content>
      </ai-card>
    `
  }))
  .add("Expanded", () => ({
    template: `
      <div style="width: 450px">
        <ai-card [defaultHeight]="400" [expanded]="expanded">
          <ai-card-header>
            <ai-card-title text="Card Title"></ai-card-title>
            <ai-card-toolbar>
              <button aiCardToolbarAction>
                <svg ibmIcon="calendar" size="16"></svg>
              </button>
            </ai-card-toolbar>
          </ai-card-header>
          <ai-card-content isEmpty="true" emptyText="No content available"></ai-card-content>
        </ai-card>
      <div style="width: 450px">
    `,
    props: {
      expanded: boolean("Expanded", true)
    }
  }));
