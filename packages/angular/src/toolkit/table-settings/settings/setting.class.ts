import { TemplateRef } from '@angular/core';
import { BehaviorSubject, isObservable, Subscription } from 'rxjs';
import { Content } from '../table-settings-model.class';

export interface SettingOption {
	content?: Content;
	template?: TemplateRef<any>;
	toJSON?(): any;
}

export interface SettingOptions {
	content?: Content;
	template?: TemplateRef<any>;
	options: SettingOption[];
}

export interface SettingChanges {
	[property: string]: any;
}

export class BaseSetting {
	public readonly component: any;

	protected options: SettingOption[];
	protected staged = {};
	protected content = new BehaviorSubject(null);
	protected contentObservable = this.content.asObservable();
	protected contentSubscription = new Subscription();
	protected template?: TemplateRef<any>;

	protected _inputs = new Map();
	protected _outputs = new Map();

	constructor(options?: SettingOptions) {
		this.setContent(options.content);
		this.setTemplate(options.template);
		this.options = options.options;
	}

	getContent() {
		return this.contentObservable;
	}

	setContent(content: Content) {
		if (isObservable(content)) {
			this.contentSubscription.unsubscribe();
			this.contentSubscription = content.subscribe((value) => {
				this.content.next(value);
			});
		} else {
			this.content.next(content);
		}
	}

	getTemplate() {
		return this.template;
	}

	setTemplate(template: TemplateRef<any>) {
		this.template = template;
	}

	/**
	 * gets a map of input names to values
	 *
	 * By default returns a map of 'options' to `this.options`
	 */
	getInputs() {
		return this._inputs;
	}

	getOutputs() {
		return this._outputs;
	}

	toJSON(): object {
		let jsonOptions = null;
		if (this.options) {
			jsonOptions = this.options.map((option) => option.toJSON ? option.toJSON() : JSON.parse(JSON.stringify(option)));
		}
		return {
			content: this.content.value,
			options: jsonOptions
		};
	}

	toString(): string {
		return JSON.stringify(this.toJSON());
	}

	onChanges(changes: SettingChanges) {
		for (const [key, value] of Object.entries(changes)) {
			this.staged[key] = value;
		}
	}

	commit() {
		for (const [key, value] of Object.entries(this.staged)) {
			this[key] = value;
		}
	}
}
