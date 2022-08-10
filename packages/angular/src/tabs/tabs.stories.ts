import { moduleMetadata } from '@storybook/angular';
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
import { Bee16, Edit16, Settings16 } from '@carbon/icons';

@NgModule({
  imports: [IconModule],
})
class StoryIconModule {
  constructor(protected iconService: IconService) {
    iconService.register(Edit16);
    iconService.register(Bee16);
    iconService.register(Settings16);
  }
}

export default {
  title: 'Components/Tabs',

  decorators: [
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
  ],
  argTypes: {
    controller: {
      table: {
        disable: true
      }
    },
    addTab: {
      action: 'click',
      table: {
        disable: true
      }
    }
  }
};

const basicTpl = (args) => ({
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
  props: args,
  name: 'Basic'
});
export const basic = basicTpl.bind({});
basic.args = {
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
    }
  ]),
  addTab() {
    this.controller.addTab({
      key: Math.random(),
      title: 'Another tab',
      demoContent: 'Another tab content',
    });
  }
};

const withActionsTpl = (args) => ({
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
  props: args,
  name: 'With actions'
});
export const withActions = withActionsTpl.bind({});
withActions.args = {
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
  }
};

const withCloseableTabsTpl = (args) => ({
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
  props: args,
  name: 'With closeable tabs'
});
export const withCloseableTabs = withCloseableTabsTpl.bind({});
withCloseableTabs.argTypes = {
  getController: {
    action: 'click',
    table: {
      disable: true
    }
  },
  removeTab: {
    action: 'click',
    table: {
      disable: true
    }
  }
};
withCloseableTabs.args = {
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
  }
};

const withTabManagementTpl = (args) => ({
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
  props: args,
  name: 'With tab management'
});
export const withTabManagement = withTabManagementTpl.bind({});
withTabManagement.argTypes = {
  getController: {
    action: 'click',
    table: {
      disable: true
    }
  },
  removeTab: {
    action: 'click',
    table: {
      disable: true
    }
  },
  open: {
    table: {
      disable: true
    }
  },
  tabToEdit: {
    table: {
      disable: true
    }
  },
  newTitle: {
    table: {
      disable: true
    }
  },
  editTab: {
    action: 'click',
    table: {
      disable: true
    }
  },
  finishEditing: {
    action: 'click',
    table: {
      disable: true
    }
  }
};
withTabManagement.args = {
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
};

const withCustomTemplatesTpl = (args) => ({
  template: `
      <ai-tabs [controller]="controller" [titleTpl]="titleTpl">
        <ai-tab-actions>
          <button aiTabAction (click)="addTab()">
            <svg class="bx--btn__icon" ibmIcon="add" size="16"></svg>
          </button>
          <ai-tab-dropdown [controller]="controller" [listTpl]="listTpl"></ai-tab-dropdown>
        </ai-tab-actions>
      </ai-tabs>
      <ai-tab
        *ngFor="let tab of controller.tabList | async"
        [key]="tab.key"
        [controller]="controller">
        {{tab.demoContent}}
      </ai-tab>

      <ng-template #titleTpl let-tab="tab">
        <svg *ngIf="tab.icon" [ibmIcon]="tab.icon" size="16"></svg>
        {{ tab.title }}
      </ng-template>

      <ng-template #listTpl let-item="item">
        {{ item.content }}
        <svg *ngIf="item.icon" [ibmIcon]="item.icon" size="16"></svg>
      </ng-template>
    `,
  props: args,
  name: 'With custom templates'
});
export const withCustomTemplates = withCustomTemplatesTpl.bind({});
withCustomTemplates.args = {
  controller: new TabController([
    {
      key: 'one',
      title: 'One',
      icon: 'edit',
      dropdownListProps: { icon: 'edit' },
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
      icon: 'bee',
      dropdownListProps: { icon: 'bee' },
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
      icon: 'settings',
      dropdownListProps: { icon: 'settings' },
      actions: [
        {
          title: 'Close',
          icon: 'close',
          onClick: () => {
            console.log('tab one close action clicked!');
          },
        },
      ],
      demoContent: 'Tab content 3',
    },
  ]),
  removeTab(tab) {
    const key = this.controller.removeTab(tab.key);
    this.controller.selectTab(key);
  },
  addTab() {
    this.controller.addTab({
      key: Math.random(),
      title: 'Another tab',
      demoContent: 'Another tab content',
    });
  }
};
