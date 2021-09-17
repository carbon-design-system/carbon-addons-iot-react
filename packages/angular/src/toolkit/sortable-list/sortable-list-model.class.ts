// disable max-classes-per-file since these are very small classes
// tslint:disable: max-classes-per-file

import { TemplateRef } from '@angular/core';
import { BehaviorSubject, isObservable, Subscription } from 'rxjs';
import { BaseSetting, SettingOptions } from '../table-settings/settings/setting.class';
import { Content } from '../table-settings/table-settings-model.class';
import { SortableListComponent } from './sortable-list.component';

export interface ListOptionOptions {
  content?: any;
  template?: TemplateRef<any>;
  order?: number;
  options?: SortableListOption[];
  disabled?: boolean;
}

export class SortableListOption {
  disabled: boolean;
  order: number;
  options: SortableListOption[];
  content: any;
  template: TemplateRef<any>;
  protected contentSubject = new BehaviorSubject(null);
  protected contentSubscription = new Subscription();

  constructor(options: ListOptionOptions) {
    this.setContent(options.content);
    this.template = options.template;
    this.order = options.order;
    this.options = options.options;
    this.disabled = options.disabled;
    this.content = this.contentSubject.asObservable();
  }

  getContent() {
    return this.content;
  }

  setContent(content: any) {
    if (isObservable(content)) {
      this.contentSubscription.unsubscribe();
      this.contentSubscription = content.subscribe((value) => {
        this.contentSubject.next(value);
      });
    } else {
      this.contentSubject.next(content);
    }
  }

  toJSON() {
    const jsonOptions = this.options ? this.options.map((option) => option.toJSON()) : [];
    return {
      content: this.contentSubject.value,
      disabled: this.disabled,
      order: this.order,
      options: jsonOptions,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

export interface SortableListOptions extends SettingOptions {
  content?: any;
  template?: TemplateRef<any>;
  options: SortableListOption[];
}

export class SortableList extends BaseSetting {
  public component = SortableListComponent;

  protected options: SortableListOption[];

  protected stagedOptions: SortableListOption[];

  protected _outputs = new Map([['itemsChange', this.onChanges.bind(this)]]);

  protected _inputs = new Map([['items', this.options]]);

  constructor(options: SortableListOptions) {
    super(options as SettingOptions);
    // this.options must be set before setting the value (if any)
    this.options = options.options;
    this.setContent(options.content);
    this.setTemplate(options.template);
  }

  getInputs() {
    return this._inputs;
  }

  getOutputs() {
    return this._outputs;
  }

  onChanges(value: SortableListOption[]) {
    this.stagedOptions = value;
  }

  commit() {
    this.options = this.stagedOptions;
  }
}
