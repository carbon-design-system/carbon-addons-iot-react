import { isObservable, of } from 'rxjs';
import { BaseSetting } from './settings/index';
import { Content } from './table-settings-model.class';

export interface TableSettingsPaneOptions {
  settings?: BaseSetting[];
  content?: any;
  title: any;
}

export class TableSettingsPane {
  content?: any;
  title: any;
  protected settings: BaseSetting[] = [];

  constructor(options: TableSettingsPaneOptions) {
    if (options.settings) {
      this.settings = options.settings;
    }
    this.content = options.content;
    this.title = options.title;
  }

  addSetting(setting: BaseSetting) {
    this.settings.push(setting);
  }

  setSettings(settings: BaseSetting[]) {
    this.settings = settings;
  }

  getSettings() {
    return this.settings;
  }

  getContent() {
    if (isObservable(this.content)) {
      return this.content;
    }

    return of(this.content);
  }

  toJSON() {
    let jsonSettings = [];
    if (this.settings) {
      jsonSettings = this.settings.map((setting) => setting.toJSON());
    }
    const jsonContent = this.content ? this.content.toString() : null;
    return {
      settings: jsonSettings,
      content: jsonContent,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  commit() {
    this.settings.forEach((setting) => setting.commit());
  }
}
