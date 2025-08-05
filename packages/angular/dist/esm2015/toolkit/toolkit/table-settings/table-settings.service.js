/**
 *
 * @ai-apps/angular v2.155.1 | table-settings.service.js
 *
 * Copyright 2014, 2025 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Injectable } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { Subject } from 'rxjs';
import { TableSettingsModalComponent } from './table-settings-modal.component';
export class TableSettingsService {
    constructor(modalService) {
        this.modalService = modalService;
        this.closeSubject = new Subject();
        this.onClose = this.closeSubject.asObservable();
    }
    openSettings(settingsModel) {
        if (this.modalRef) {
            return;
        }
        this.modalRef = this.modalService.create({
            component: TableSettingsModalComponent,
            inputs: {
                model: settingsModel,
            },
        });
        this.modalRef.instance.close.subscribe(() => {
            this.closeSubject.next();
        });
    }
    closeSettings() {
        if (!this.modalRef) {
            return;
        }
        this.modalRef.instance.closeModal();
        this.modalRef = null;
    }
}
TableSettingsService.decorators = [
    { type: Injectable }
];
TableSettingsService.ctorParameters = () => [
    { type: ModalService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc2V0dGluZ3Muc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L3RhYmxlLXNldHRpbmdzL3RhYmxlLXNldHRpbmdzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFnQixVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFHL0UsTUFBTSxPQUFPLG9CQUFvQjtJQU8vQixZQUFzQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUp0QyxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFLckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFFRCxZQUFZLENBQUMsYUFBYTtRQUN4QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUN2QyxTQUFTLEVBQUUsMkJBQTJCO1lBQ3RDLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsYUFBYTthQUNyQjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7OztZQXBDRixVQUFVOzs7WUFKRixZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50UmVmLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNb2RhbFNlcnZpY2UgfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFRhYmxlU2V0dGluZ3NNb2RhbENvbXBvbmVudCB9IGZyb20gJy4vdGFibGUtc2V0dGluZ3MtbW9kYWwuY29tcG9uZW50JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRhYmxlU2V0dGluZ3NTZXJ2aWNlIHtcbiAgcHVibGljIHJlYWRvbmx5IG9uQ2xvc2U6IE9ic2VydmFibGU8YW55PjtcblxuICBwcm90ZWN0ZWQgY2xvc2VTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcblxuICBwcm90ZWN0ZWQgbW9kYWxSZWY6IENvbXBvbmVudFJlZjxUYWJsZVNldHRpbmdzTW9kYWxDb21wb25lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBtb2RhbFNlcnZpY2U6IE1vZGFsU2VydmljZSkge1xuICAgIHRoaXMub25DbG9zZSA9IHRoaXMuY2xvc2VTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgb3BlblNldHRpbmdzKHNldHRpbmdzTW9kZWwpIHtcbiAgICBpZiAodGhpcy5tb2RhbFJlZikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubW9kYWxSZWYgPSB0aGlzLm1vZGFsU2VydmljZS5jcmVhdGUoe1xuICAgICAgY29tcG9uZW50OiBUYWJsZVNldHRpbmdzTW9kYWxDb21wb25lbnQsXG4gICAgICBpbnB1dHM6IHtcbiAgICAgICAgbW9kZWw6IHNldHRpbmdzTW9kZWwsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5tb2RhbFJlZi5pbnN0YW5jZS5jbG9zZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZVN1YmplY3QubmV4dCgpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xvc2VTZXR0aW5ncygpIHtcbiAgICBpZiAoIXRoaXMubW9kYWxSZWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1vZGFsUmVmLmluc3RhbmNlLmNsb3NlTW9kYWwoKTtcbiAgICB0aGlzLm1vZGFsUmVmID0gbnVsbDtcbiAgfVxufVxuIl19