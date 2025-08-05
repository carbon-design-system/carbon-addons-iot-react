/**
 *
 * @ai-apps/angular v2.155.1 | table-settings-modal.component.js
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


import { Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { BaseModal } from 'carbon-components-angular';
import { Subject } from 'rxjs';
import { SortableListComponent } from '../sortable-list/index';
import { TableSettings } from './table-settings-model.class';
export class TableSettingsModalComponent extends BaseModal {
    constructor(model, modelChange) {
        super();
        this.model = model;
        this.modelChange = modelChange;
        this.listComponent = SortableListComponent;
        this.settingsModelChange = new EventEmitter();
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
TableSettingsModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-table-settings-modal, ai-table-settings-modal',
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
          [ngTemplateOutletContext]="model"
        >
        </ng-template>
        <ibm-tabs>
          <ibm-tab *ngFor="let pane of model.getPanes()" [heading]="pane.title">
            <p>{{ pane.getContent() | async }}</p>
            <div *ngFor="let setting of pane.getSettings()">
              <p>{{ setting.getContent() | async }}</p>
              <ng-template
                [ngTemplateOutlet]="setting.getTemplate()"
                [ngTemplateOutletContext]="setting"
              ></ng-template>
              <ng-container
                *scComponentOutlet="
                  setting.component;
                  inputs: setting.getInputs();
                  outputs: setting.getOutputs()
                "
              >
              </ng-container>
            </div>
          </ibm-tab>
        </ibm-tabs>
      </div>
      <ibm-modal-footer>
        <button ibmButton="secondary" (click)="cancel()">Cancel</button>
        <button ibmButton="primary" (click)="acceptChanges()">Okay</button>
      </ibm-modal-footer>
    </ibm-modal>
  `,
                styles: [".content{overflow-y:visible;padding-right:1rem}"]
            },] }
];
TableSettingsModalComponent.ctorParameters = () => [
    { type: TableSettings, decorators: [{ type: Optional }, { type: Inject, args: ['model',] }] },
    { type: Subject, decorators: [{ type: Optional }, { type: Inject, args: ['modelChange',] }] }
];
TableSettingsModalComponent.propDecorators = {
    settingsModel: [{ type: Input }],
    settingsModelChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc2V0dGluZ3MtbW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Rvb2xraXQvdGFibGUtc2V0dGluZ3MvdGFibGUtc2V0dGluZ3MtbW9kYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQVUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUE4QzdELE1BQU0sT0FBTywyQkFBNEIsU0FBUSxTQUFTO0lBT3hELFlBQ3NDLEtBQW9CLEVBQ1gsV0FBbUM7UUFFaEYsS0FBSyxFQUFFLENBQUM7UUFINEIsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUNYLGdCQUFXLEdBQVgsV0FBVyxDQUF3QjtRQVJsRixrQkFBYSxHQUFHLHFCQUFxQixDQUFDO1FBSTVCLHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUFpQixDQUFDO0lBT2xFLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7OztZQTNFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtEQUFrRDtnQkFDNUQsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q1Q7O2FBRUY7OztZQTdDUSxhQUFhLHVCQXNEakIsUUFBUSxZQUFJLE1BQU0sU0FBQyxPQUFPO1lBeER0QixPQUFPLHVCQXlEWCxRQUFRLFlBQUksTUFBTSxTQUFDLGFBQWE7Ozs0QkFObEMsS0FBSztrQ0FFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3B0aW9uYWwsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzZU1vZGFsIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBTb3J0YWJsZUxpc3RDb21wb25lbnQgfSBmcm9tICcuLi9zb3J0YWJsZS1saXN0L2luZGV4JztcbmltcG9ydCB7IFRhYmxlU2V0dGluZ3MgfSBmcm9tICcuL3RhYmxlLXNldHRpbmdzLW1vZGVsLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2MtdGFibGUtc2V0dGluZ3MtbW9kYWwsIGFpLXRhYmxlLXNldHRpbmdzLW1vZGFsJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8aWJtLW1vZGFsIChvdmVybGF5U2VsZWN0ZWQpPVwiY2xvc2VNb2RhbCgpXCIgW2hhc1Njcm9sbGluZ0NvbnRlbnRdPVwiZmFsc2VcIiBbb3Blbl09XCJvcGVuXCI+XG4gICAgICA8aWJtLW1vZGFsLWhlYWRlciAoY2xvc2VTZWxlY3QpPVwiY2xvc2VNb2RhbCgpXCI+XG4gICAgICAgIDxwIGNsYXNzPVwiYngtLW1vZGFsLWhlYWRlcl9faGVhZGluZyBieC0tdHlwZS1iZXRhXCI+e3sgbW9kZWwudGl0bGUgfX08L3A+XG4gICAgICA8L2libS1tb2RhbC1oZWFkZXI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYngtLW1vZGFsLWNvbnRlbnQgY29udGVudFwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIW1vZGVsLnRlbXBsYXRlXCI+e3sgbW9kZWwuZ2V0Q29udGVudCgpIHwgYXN5bmMgfX08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgKm5nSWY9XCJtb2RlbC50ZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibW9kZWwudGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJtb2RlbFwiXG4gICAgICAgID5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPGlibS10YWJzPlxuICAgICAgICAgIDxpYm0tdGFiICpuZ0Zvcj1cImxldCBwYW5lIG9mIG1vZGVsLmdldFBhbmVzKClcIiBbaGVhZGluZ109XCJwYW5lLnRpdGxlXCI+XG4gICAgICAgICAgICA8cD57eyBwYW5lLmdldENvbnRlbnQoKSB8IGFzeW5jIH19PC9wPlxuICAgICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgc2V0dGluZyBvZiBwYW5lLmdldFNldHRpbmdzKClcIj5cbiAgICAgICAgICAgICAgPHA+e3sgc2V0dGluZy5nZXRDb250ZW50KCkgfCBhc3luYyB9fTwvcD5cbiAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwic2V0dGluZy5nZXRUZW1wbGF0ZSgpXCJcbiAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwic2V0dGluZ1wiXG4gICAgICAgICAgICAgID48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAgICAgKnNjQ29tcG9uZW50T3V0bGV0PVwiXG4gICAgICAgICAgICAgICAgICBzZXR0aW5nLmNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgIGlucHV0czogc2V0dGluZy5nZXRJbnB1dHMoKTtcbiAgICAgICAgICAgICAgICAgIG91dHB1dHM6IHNldHRpbmcuZ2V0T3V0cHV0cygpXG4gICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvaWJtLXRhYj5cbiAgICAgICAgPC9pYm0tdGFicz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGlibS1tb2RhbC1mb290ZXI+XG4gICAgICAgIDxidXR0b24gaWJtQnV0dG9uPVwic2Vjb25kYXJ5XCIgKGNsaWNrKT1cImNhbmNlbCgpXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWJtQnV0dG9uPVwicHJpbWFyeVwiIChjbGljayk9XCJhY2NlcHRDaGFuZ2VzKClcIj5Pa2F5PC9idXR0b24+XG4gICAgICA8L2libS1tb2RhbC1mb290ZXI+XG4gICAgPC9pYm0tbW9kYWw+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL3RhYmxlLXNldHRpbmdzLW1vZGFsLnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgVGFibGVTZXR0aW5nc01vZGFsQ29tcG9uZW50IGV4dGVuZHMgQmFzZU1vZGFsIGltcGxlbWVudHMgT25Jbml0IHtcbiAgbGlzdENvbXBvbmVudCA9IFNvcnRhYmxlTGlzdENvbXBvbmVudDtcblxuICBASW5wdXQoKSBzZXR0aW5nc01vZGVsOiBUYWJsZVNldHRpbmdzO1xuXG4gIEBPdXRwdXQoKSBzZXR0aW5nc01vZGVsQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxUYWJsZVNldHRpbmdzPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoJ21vZGVsJykgcHVibGljIG1vZGVsOiBUYWJsZVNldHRpbmdzLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoJ21vZGVsQ2hhbmdlJykgcHJvdGVjdGVkIG1vZGVsQ2hhbmdlOiBTdWJqZWN0PFRhYmxlU2V0dGluZ3M+XG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5nc01vZGVsKSB7XG4gICAgICB0aGlzLm1vZGVsID0gdGhpcy5zZXR0aW5nc01vZGVsO1xuICAgIH1cbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLmNsb3NlTW9kYWwoKTtcbiAgfVxuXG4gIGFjY2VwdENoYW5nZXMoKSB7XG4gICAgdGhpcy5tb2RlbC5jb21taXQoKTtcbiAgICB0aGlzLnNldHRpbmdzTW9kZWxDaGFuZ2UuZW1pdCh0aGlzLm1vZGVsKTtcbiAgICBpZiAodGhpcy5tb2RlbENoYW5nZSkge1xuICAgICAgdGhpcy5tb2RlbENoYW5nZS5uZXh0KHRoaXMubW9kZWwpO1xuICAgIH1cbiAgICB0aGlzLmNsb3NlTW9kYWwoKTtcbiAgfVxufVxuIl19