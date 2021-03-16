import { RadioSettingComponent } from './radio-setting.component';
import { BaseSetting, SettingOption, SettingOptions } from './setting.class';

export interface RadioOption extends SettingOption {
  value: any;
}

export interface RadioSettingOptions extends SettingOptions {
  options: RadioOption[];
  active: any;
}

export class RadioSetting extends BaseSetting {
  public component = RadioSettingComponent;

  protected options: RadioOption[];

  protected active: any;

  constructor(options: RadioSettingOptions) {
    super(options);
    this.options = options.options;
    this.active = options.active;
    this._inputs.set('options', options.options);
    this._inputs.set('active', options.active);
    this._outputs.set('activeChange', this.onChanges.bind(this));
  }

  toJSON(): object {
    let jsonOptions = null;
    if (this.options) {
      jsonOptions = this.options.map((option) =>
        option.toJSON ? option.toJSON() : JSON.parse(JSON.stringify(option))
      );
    }
    return {
      content: this.content.value,
      options: jsonOptions,
      active: this.active,
    };
  }
}
