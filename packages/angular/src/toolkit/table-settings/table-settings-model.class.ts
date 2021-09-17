import { TemplateRef } from '@angular/core';
import { isObservable, Observable, of } from 'rxjs';
import { TableSettingsPane, TableSettingsPaneOptions } from './table-settings-pane.class';

export type Content = string | Observable<string>;

export interface TableSettingsOptions {
  panes?: TableSettingsPane[];
  content?: any;
  title?: any;
  template?: TemplateRef<any>;
}

// tslint:disable: max-classes-per-file
export class TableSettings {
  content: any;
  title: any;
  template: TemplateRef<any>;
  protected panes: TableSettingsPane[] = [];

  constructor(options: TableSettingsOptions) {
    if (options.panes) {
      this.panes = options.panes;
    }
    this.content = options.content;
    this.title = options.title;
    this.template = options.template;
  }

  addPane(paneOrOptions: TableSettingsPane | TableSettingsPaneOptions) {
    if (paneOrOptions instanceof TableSettingsPane) {
      this.panes.push(paneOrOptions);
    } else {
      this.panes.push(new TableSettingsPane(paneOrOptions));
    }
  }

  setPanes(panes: TableSettingsPane[]) {
    this.panes = panes;
  }

  getPanes() {
    return this.panes;
  }

  getContent() {
    if (isObservable(this.content)) {
      return this.content;
    }

    return of(this.content);
  }

  toJSON() {
    let jsonPanes = [];
    if (this.panes) {
      jsonPanes = this.panes.map((pane) => pane.toJSON());
    }
    const jsonContent = this.content ? this.content.toString() : null;
    const jsonTitle = this.title ? this.title.toString() : null;
    return {
      content: jsonContent,
      title: jsonTitle,
      panes: jsonPanes,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  commit() {
    this.panes.forEach((pane) => pane.commit());
  }
}
