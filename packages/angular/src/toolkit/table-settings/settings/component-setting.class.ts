import { BaseSetting } from "./setting.class";

export interface InputMap {
	[inputName: string]: any;
}

export interface OutputMap {
	[outputName: string]: (event: any) => void;
}

export interface ComponentSettingOptions {
	component: any;
	inputs?: InputMap;
	outputs?: OutputMap;
}

export class ComponentSetting extends BaseSetting {
	public component: any;
	constructor(options: ComponentSettingOptions) {
		super(options as any);
		this.component = options.component;
		if (options.inputs) {
			this._inputs = new Map(Object.entries(options.inputs));
		}

		if (options.outputs) {
			this._outputs = new Map(Object.entries(options.outputs));
		}
	}

	getInputs() {
		return this._inputs;
	}

	getOutputs() {
		return this._outputs;
	}
}
