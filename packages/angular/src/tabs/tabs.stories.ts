import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

import { TabsModule } from './tabs.module';
import { TabController } from './tab-controller.class';
import {
  ButtonModule,
  DropdownModule,
  IconModule,
  IconService,
  InputModule,
  ModalModule,
  TabsModule as CTabsModule,
} from 'carbon-components-angular';
import { NgModule } from '@angular/core';
import Edit16 from '@carbon/icons/es/edit/16';

@NgModule({
  imports: [IconModule],
})
class StoryIconModule {
  constructor(protected iconService: IconService) {
    iconService.register(Edit16);
  }
}

storiesOf('Components/Tabs', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        TabsModule,
        CTabsModule,
        IconModule,
        ButtonModule,
        DropdownModule,
        ModalModule,
        InputModule,
        StoryIconModule,
      ],
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
          demoContent: 'Tab content 1',
        },
        {
          key: 'two',
          title: 'Second tab',
          demoContent: 'Tab content 2',
        },
        {
          key: 'three',
          title: 'Three',
          demoContent: 'Tab content 3',
        },
      ]),
      addTab() {
        this.controller.addTab({
          key: Math.random(),
          title: 'Another tab',
          demoContent: 'Another tab content',
        });
      },
    },
  }))
  .add('With actions', () => ({
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
          demoContent: 'Tab content 1',
          actions: [
            {
              title: 'Close',
              icon: 'close',
              onClick: () => {
                console.log('tab one close action clicked!');
              },
            },
          ],
        },
        {
          key: 'two',
          title: 'Second tab',
          demoContent: 'Tab content 2',
          actions: [
            {
              title: 'Close',
              icon: 'close',
              onClick: () => {
                console.log('tab two close action clicked!');
              },
            },
            {
              title: 'Edit',
              onClick: () => {
                console.log('tab two edit action clicked!');
              },
            },
          ],
        },
        {
          key: 'three',
          title: 'Three',
          demoContent: 'Tab content 3',
        },
      ]),
      addTab() {
        this.controller.addTab({
          key: Math.random(),
          title: 'Another tab',
          demoContent: 'Another tab content',
        });
      },
    },
  }))
  .add('With closeable tabs', () => ({
    template: `
      <ai-tabs [controller]="getController()">
        <ai-tab-actions>
          <button aiTabAction (click)="addTab()">
            <svg class="bx--btn__icon" ibmIcon="add" size="16"></svg>
          </button>
          <ai-tab-dropdown [controller]="getController()"></ai-tab-dropdown>
        </ai-tab-actions>
      </ai-tabs>
      <ai-tab
        *ngFor="let tab of controller.tabList | async"
        [key]="tab.key"
        [controller]="getController()">
        {{tab.demoContent}}
      </ai-tab>
    `,
    props: {
      getController() {
        if (this.controller) {
          return this.controller;
        }
        this.controller = new TabController([
          {
            key: 'one',
            title: 'One',
            demoContent: 'Tab content 1',
            actions: [
              {
                title: 'Close',
                icon: 'close',
                onClick: this.removeTab.bind(this),
              },
            ],
          },
          {
            key: 'two',
            title: 'Second tab',
            demoContent: 'Tab content 2',
            actions: [
              {
                title: 'Close',
                icon: 'close',
                onClick: this.removeTab.bind(this),
              },
            ],
          },
          {
            key: 'three',
            title: 'Three',
            demoContent: 'Tab content 3',
            actions: [
              {
                title: 'Close',
                icon: 'close',
                onClick: this.removeTab.bind(this),
              },
            ],
          },
        ]);
        return this.controller;
      },
      controller: null,
      removeTab(tab) {
        const key = this.controller.removeTab(tab.key);
        this.controller.selectTab(key);
      },
      addTab() {
        this.controller.addTab({
          key: Math.random(),
          title: 'Another tab',
          demoContent: 'Another tab content',
          actions: [
            {
              title: 'Close',
              icon: 'close',
              onClick: this.removeTab.bind(this),
            },
          ],
        });
      },
    },
  }))
  .add('With tab management', () => ({
    template: `
      <ai-tabs [controller]="getController()">
        <ai-tab-actions>
          <button aiTabAction (click)="addTab()">
            <svg class="bx--btn__icon" ibmIcon="add" size="16"></svg>
          </button>
          <ai-tab-dropdown [controller]="getController()"></ai-tab-dropdown>
        </ai-tab-actions>
      </ai-tabs>
      <ai-tab
        *ngFor="let tab of controller.tabList | async"
        [key]="tab.key"
        [controller]="getController()">
        {{tab.demoContent}}
      </ai-tab>
      <ibm-modal [open]="open" (overlaySelected)="open = false">
				<ibm-modal-header (closeSelect)="open = false">
					<p class="bx--modal-header__heading bx--type-beta">Edit tab</p>
				</ibm-modal-header>
				<div class="bx--modal-content">
          <ibm-label [invalid]="newTitle.length === 0" invalidText="Title must have content">
            Title
            <input
              ibmText
              [value]="tabToEdit?.title"
              [invalid]="newTitle.length === 0"
              (keyup)="newTitle = $event.target.value"
              (keydown.enter)="finishEditing()">
          </ibm-label>
				</div>
				<ibm-modal-footer>
					<ng-container>
            <button ibmButton="secondary" (click)="open = false">Cancel</button>
						<button
							ibmButton="primary"
							(click)="finishEditing()"
							[attr.modal-primary-focus]="true">
							Apply
						</button>
					</ng-container>
				</ibm-modal-footer>
			</ibm-modal>
    `,
    props: {
      getController() {
        if (this.controller) {
          return this.controller;
        }
        this.controller = new TabController([
          {
            key: 'one',
            title: 'One',
            demoContent: 'Tab content 1',
            actions: [
              {
                title: 'Close',
                icon: 'close',
                onClick: this.removeTab.bind(this),
              },
              {
                title: 'Edit',
                icon: 'edit',
                onClick: this.editTab.bind(this),
              },
            ],
          },
          {
            key: 'two',
            title: 'Second tab',
            demoContent: 'Tab content 2',
            actions: [
              {
                title: 'Close',
                icon: 'close',
                onClick: this.removeTab.bind(this),
              },
              {
                title: 'Edit',
                icon: 'edit',
                onClick: this.editTab.bind(this),
              },
            ],
          },
          {
            key: 'three',
            title: 'Three',
            demoContent: 'Tab content 3',
            actions: [
              {
                title: 'Close',
                icon: 'close',
                onClick: this.removeTab.bind(this),
              },
              {
                title: 'Edit',
                icon: 'edit',
                onClick: this.editTab.bind(this),
              },
            ],
          },
        ]);
        return this.controller;
      },
      controller: null,
      removeTab(tab) {
        const key = this.controller.removeTab(tab.key);
        this.controller.selectTab(key);
      },
      open: false,
      tabToEdit: null,
      newTitle: '',
      editTab(tab) {
        this.tabToEdit = tab;
        this.open = true;
        this.newTitle = tab.title;
      },
      finishEditing() {
        const tab = {
          ...this.tabToEdit,
          title: this.newTitle,
        };
        this.controller.updateTab(tab);
        this.open = false;
        this.tabToEdit = null;
        this.newTitle = '';
      },
      addTab() {
        this.controller.addTab({
          key: Math.random(),
          title: 'Another tab',
          demoContent: 'Another tab content',
          actions: [
            {
              title: 'Close',
              icon: 'close',
              onClick: this.removeTab.bind(this),
            },
            {
              title: 'Edit',
              icon: 'edit',
              onClick: this.editTab.bind(this),
            },
          ],
        });
      },
    },
  }));
