import {
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { RadioChange } from 'carbon-components-angular';
import { isObservable, Observable, of } from 'rxjs';
import { RadioOption } from './radio-setting.class';
import { SettingChanges } from './setting.class';

@Component({
	selector: 'sc-radio-setting',
	template: `
		<ibm-radio-group>
			<ibm-radio
				*ngFor="let option of options"
				[checked]="option.value === active"
				[value]="option.value"
				(change)="onChange($event)">
				{{getContent(option) | async}}
			</ibm-radio>
		</ibm-radio-group>
	`
})
export class RadioSettingComponent {
	@Input() options: RadioOption[];

	@Input() active: any;

	@Output() activeChange = new EventEmitter<SettingChanges>();

	getContent(option: RadioOption): Observable<string> {
		if (isObservable(option.content)) {
			return option.content;
		}
		return of(option.content);
	}

	onChange(event: RadioChange) {
		this.activeChange.emit({ active: event.value });
	}
}
