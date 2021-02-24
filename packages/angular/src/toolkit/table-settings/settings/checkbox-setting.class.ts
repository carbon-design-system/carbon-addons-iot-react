import { CheckboxSettingComponent } from "./checkbox-setting.component";
import { BaseSetting, SettingOption, SettingOptions } from "./setting.class";

export interface CheckboxOption extends SettingOption {
	checked: boolean;
}

export interface CheckboxSettingOptions extends SettingOptions {
	options: CheckboxOption[];
}

export class CheckboxSetting extends BaseSetting {
	public component = CheckboxSettingComponent;

	protected options: CheckboxOption[];

	constructor(options?: CheckboxSettingOptions) {
		super(options);
		this.options = options.options;
		this._inputs.set("options", options.options);
		this._outputs.set("optionsChange", this.onChanges.bind(this));
	}
}
