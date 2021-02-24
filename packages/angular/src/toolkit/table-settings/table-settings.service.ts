import { ComponentRef, Injectable } from "@angular/core";
import { ModalService } from "carbon-components-angular";
import { Observable, Subject } from "rxjs";
import { TableSettingsModalComponent } from "./table-settings-modal.component";

@Injectable()
export class TableSettingsService {
	public readonly onClose: Observable<any>;

	protected closeSubject = new Subject();

	protected modalRef: ComponentRef<TableSettingsModalComponent>;

	constructor(protected modalService: ModalService) {
		this.onClose = this.closeSubject.asObservable();
	}

	openSettings(settingsModel) {
		if (this.modalRef) { return; }

		this.modalRef = this.modalService.create({
			component: TableSettingsModalComponent,
			inputs: {
				model: settingsModel
			}
		});

		this.modalRef.instance.close.subscribe(() => {
			this.closeSubject.next();
		});
	}

	closeSettings() {
		if (!this.modalRef) { return; }

		this.modalRef.instance.closeModal();
		this.modalRef = null;
	}
}
