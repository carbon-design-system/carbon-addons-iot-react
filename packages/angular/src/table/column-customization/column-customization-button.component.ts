import { SelectionType } from '@ai-apps/angular/list';
import { Component, Input, TemplateRef } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { AITableModel } from '../table-model.class';
import { ColumnCustomizationModal } from './column-customization-modal.component';

@Component({
  selector: 'ai-column-customization-button',
  template: `
    <button
      [iconOnly]="iconOnly"
      [ibmButton]="ibmButton"
      [assistiveTextPlacement]="assistiveTextPlacement"
      [assistiveTextAlignment]="assistiveTextAlignment"
      [hasAssistiveText]="!!assistiveText"
      (click)="openModal()"
    >
      <ng-content></ng-content>
      <span *ngIf="assistiveText" class="bx--assistive-text">
        {{ assistiveText }}
      </span>
    </button>
  `,
})
export class ColumnCustomizationButton {
  @Input() model: AITableModel = new AITableModel();
  @Input() usedModel: AITableModel = new AITableModel();
  // List builder props
  @Input() addingMethod = 'multi-select';
  // Unselected list props
  @Input() unselectedListTitle = 'Available items';
  @Input() unselectedListItemsDraggable = false;
  @Input() unselectedListSelectionType = SelectionType.MULTI;
  @Input() unselectedListHeaderButtons: TemplateRef<any>;
  @Input() unselectedListHeaderButtonsContext: any;
  @Input() unselectedListAllowDropOutsideParents = false;
  // Selected list props
  @Input() selectedListTitle = 'Selected items';
  @Input() selectedListItemsDraggable = true;
  @Input() selectedListSelectionType: SelectionType;
  @Input() selectedListHeaderButtons: TemplateRef<any>;
  @Input() selectedListHeaderButtonsContext: any;
  @Input() selectedListAllowDropOutsideParents = false;
  @Input() iconOnly = true;
  @Input() ibmButton:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'ghost'
    | 'danger'
    | 'danger--primary' = 'ghost';
  @Input() assistiveText: string;
  @Input() assistiveTextPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() assistiveTextAlignment: 'center' | 'start' | 'end' = 'center';

  constructor(protected modalService: ModalService) {}

  openModal() {
    this.modalService.create({
      component: ColumnCustomizationModal,
      inputs: {
        model: this.model,
        usedModel: this.usedModel,
        addingMethod: this.addingMethod,
        unselectedListTitle: this.unselectedListTitle,
        unselectedListItemsDraggable: this.unselectedListItemsDraggable,
        unselectedListSelectionType: this.unselectedListSelectionType,
        unselectedListHeaderButtons: this.unselectedListHeaderButtons,
        unselectedListHeaderButtonsContext: this.unselectedListHeaderButtonsContext,
        unselectedListAllowDropOutsideParents: this.unselectedListAllowDropOutsideParents,
        selectedListTitle: this.selectedListTitle,
        selectedListItemsDraggable: this.selectedListItemsDraggable,
        selectedListSelectionType: this.selectedListSelectionType,
        selectedListHeaderButtons: this.selectedListHeaderButtons,
        selectedListHeaderButtonsContext: this.selectedListHeaderButtonsContext,
        selectedListAllowDropOutsideParents: this.selectedListAllowDropOutsideParents,
      },
    });
  }
}
