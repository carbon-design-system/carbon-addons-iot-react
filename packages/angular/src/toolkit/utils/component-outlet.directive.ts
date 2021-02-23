import { NgComponentOutlet } from '@angular/common';
import { Directive, Input, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[scComponentOutlet]'
})
export class ComponentOutletDirective extends NgComponentOutlet implements OnChanges {
	@Input() set scComponentOutlet(value) {
		this.ngComponentOutlet = value;
	}

	get scComponentOutlet() {
		return this.ngComponentOutlet;
	}

	@Input() scComponentOutletInputs = new Map<string, any>();

	@Input() scComponentOutletOutputs = new Map<string, any>();

	constructor(protected viewContainerRef: ViewContainerRef) {
		super(viewContainerRef);
	}

	ngOnChanges(changes: SimpleChanges) {
		super.ngOnChanges(changes);

		if (changes.scComponentOutletInputs) {
			const inputs: Array<[string, any]> = Array.from(changes.scComponentOutletInputs.currentValue);
			for (const [key, value] of inputs) {
				this['_componentRef']['instance'][key] = value;
			}
		}

		if (changes.scComponentOutletOutputs) {
			const outputs: Array<[string, any]> = Array.from(changes.scComponentOutletOutputs.currentValue);
			for (const [key, value] of outputs) {
				this['_componentRef']['instance'][key].subscribe((event) => {
					value(event);
				});
			}
		}
	}
}
