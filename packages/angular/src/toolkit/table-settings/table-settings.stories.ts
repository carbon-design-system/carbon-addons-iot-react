import { Component, Input } from '@angular/core';
import { moduleMetadata } from '@storybook/angular';
import { SortableList, SortableListOption } from '../sortable-list';
import { CheckboxSetting, ComponentSetting, RadioSetting } from './settings';
import { TableSettings } from './table-settings-model.class';
import { TableSettingsPane } from './table-settings-pane.class';
import { TableSettingsModule } from './table-settings.module';

@Component({
  selector: 'sc-story-custom-component',
  template: `
    <p>This is a custom component</p>
    <p>
      It can have any content within it, and additional data can be passed via inputs, like such:
      {{ hello }}
    </p>
  `,
})
class StoryCustomComponent {
  @Input() hello;
}

export default {
  title: 'Sterling Toolkit/Table settings modal',

  decorators: [
    moduleMetadata({
      declarations: [StoryCustomComponent],
      imports: [TableSettingsModule],
      entryComponents: [StoryCustomComponent],
    })
  ]
};

const basicTpl = (args) => ({
  template: `
    <p>hello world</p>
    <sc-table-settings-modal
        [settingsModel]="model()"
        (settingsModelChange)="onChange($event)"
        [open]="true">
    </sc-table-settings-modal>
  `,
  props: args,
  name: 'Basic'
});
export const basic = basicTpl.bind({});
basic.argTypes = {
  _model: {
    table: {
      disable: true
    }
  },
  model: {
    action: 'function',
    table: {
      disable: true
    }
  },
  onChange: {
    action: 'click',
    table: {
      disable: true
    }
  },
  onCancel: {
    action: 'click',
    table: {
      disable: true
    }
  },
  initModel: {
    action: 'click',
    table: {
      disable: true
    }
  }
};
basic.args = {
  _model: null,
  model() {
    if (!this._model) {
      this._model = this.initModel();
    }
    return this._model;
  },
  onChange(model: TableSettings) {
    console.log(model.toJSON());
  },
  onCancel() {
    console.log(this.model.toJSON());
  },
  initModel() {
    const tableSettingsModel = new TableSettings({
      content: 'hello world',
      title: 'Table settings',
    });

    const sortableListPane = new TableSettingsPane({
      title: 'Setting pane title',
      content: 'Pane content',
      settings: [
        new SortableList({
          content: 'Setting content',
          options: [
            new SortableListOption({
              content: 'option 1',
              order: 0,
              disabled: true,
            }),
            new SortableListOption({
              content: 'option 2',
              order: 1,
            }),
            new SortableListOption({
              content: 'option 3',
              order: 2,
            }),
            new SortableListOption({
              content: 'option 4',
              order: 3,
            }),
            new SortableListOption({
              content: 'option 5',
              order: 4,
            }),
            new SortableListOption({
              content: 'option 6',
              order: 5,
            }),
          ],
        }),
      ],
    });

    tableSettingsModel.addPane(sortableListPane);

    tableSettingsModel.addPane({
      title: 'Custom component',
      settings: [
        new ComponentSetting({
          component: StoryCustomComponent,
          inputs: {
            hello: 'Hello, world!',
          },
        }),
      ],
    });

    const checkboxSetting = new CheckboxSetting({
      content: 'This is one checkbox group',
      options: [
        {
          content: 'hi',
          checked: false,
        },
        {
          content: 'Another option',
          checked: false,
        },
      ],
    });

    tableSettingsModel.addPane({
      title: 'Checkbox',
      settings: [checkboxSetting],
    });

    const radioPane = new TableSettingsPane({
      title: 'Radio',
    });

    radioPane.addSetting(
      new RadioSetting({
        content: 'This is a radio setting',
        active: 'one',
        options: [
          {
            content: 'Option one',
            value: 'one',
          },
          {
            content: 'Option two',
            value: 'two',
          },
        ],
      })
    );

    tableSettingsModel.addPane(radioPane);

    return tableSettingsModel;
  }
};
