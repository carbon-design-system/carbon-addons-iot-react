import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxChange } from 'carbon-components-angular/checkbox/checkbox.component';
import { isObservable, Observable, of } from 'rxjs';
import { CheckboxOption } from './checkbox-setting.class';
import { SettingChanges } from './setting.class';

@Component({
	selector: 'sc-checkbox-setting, ai-checkbox-setting',
	template: `
		<ibm-checkbox
			*ngFor="let option of options"
			[checked]="option.checked"
			(change)="onChange($event, option)"
		>
			{{ getContent(option) | async }}
		</ibm-checkbox>
	`,
})
export class CheckboxSettingComponent {
	@Input() options: CheckboxOption[];

	@Output() optionsChange = new EventEmitter<SettingChanges>();

	getContent(option: CheckboxOption): Observable<string> {
		if (isObservable(option.content)) {
			return option.content;
		}
		return of(option.content);
	}

	onChange(event: CheckboxChange, eventOption: CheckboxOption) {
		const changes = {
			options: this.options.map((option) => {
				if (option === eventOption) {
					return Object.assign({}, option, { checked: event.checked });
				}
				return option;
			}),
		};
		this.optionsChange.emit(changes);
	}
}
