import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Optional,
	Output
} from "@angular/core";
import { BaseModal } from "carbon-components-angular";
import { Subject } from "rxjs";
import { SortableListComponent } from "../sortable-list/index";
import { TableSettings } from "./table-settings-model.class";

@Component({
	selector: "sc-table-settings-modal",
	template: `
		<ibm-modal (overlaySelected)="closeModal()" [hasScrollingContent]="false" [open]="open">
			<ibm-modal-header (closeSelect)="closeModal()">
      			<p class="bx--modal-header__heading bx--type-beta">{{ model.title }}</p>
			</ibm-modal-header>
			<div class="bx--modal-content content">
				<ng-container *ngIf="!model.template">{{ model.getContent() | async }}</ng-container>
				<ng-template
					*ngIf="model.template"
					[ngTemplateOutlet]="model.template"
					[ngTemplateOutletContext]="model">
				</ng-template>
				<ibm-tabs>
					<ibm-tab
						*ngFor="let pane of model.getPanes()"
						[heading]="pane.title">
						<p>{{ pane.getContent() | async }}</p>
						<div *ngFor="let setting of pane.getSettings()">
							<p>{{ setting.getContent() | async }}</p>
							<ng-template [ngTemplateOutlet]="setting.getTemplate()" [ngTemplateOutletContext]="setting"></ng-template>
							<ng-container
								*scComponentOutlet="setting.component; inputs: setting.getInputs(); outputs: setting.getOutputs()">
							</ng-container>
						</div>
					</ibm-tab>
				</ibm-tabs>
			</div>
			<ibm-modal-footer>
				<button ibmButton="secondary" (click)="cancel()">
					Cancel
				</button>
				<button ibmButton="primary" (click)="acceptChanges()">
					Okay
				</button>
			</ibm-modal-footer>
		</ibm-modal>
	`,
	styleUrls: [ "./table-settings-modal.scss" ]
})
export class TableSettingsModalComponent extends BaseModal implements OnInit {
	listComponent = SortableListComponent;

	@Input() settingsModel: TableSettings;

	@Output() settingsModelChange = new EventEmitter<TableSettings>();

	constructor(
		@Optional() @Inject("model") public model: TableSettings,
		@Optional() @Inject("modelChange") protected modelChange: Subject<TableSettings>
	) {
		super();
	}

	ngOnInit() {
		if (this.settingsModel) {
			this.model = this.settingsModel;
		}
	}

	cancel() {
		this.closeModal();
	}

	acceptChanges() {
		this.model.commit();
		this.settingsModelChange.emit(this.model);
		if (this.modelChange) {
			this.modelChange.next(this.model);
		}
		this.closeModal();
	}
}
