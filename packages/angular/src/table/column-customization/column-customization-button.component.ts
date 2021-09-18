import { Component, Input } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { AITableModel } from '../table-model.class';
import { AIColumnCustomizationModal } from './column-customization-modal.component';

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
export class AIColumnCustomizationButton {
  @Input() model: AITableModel = new AITableModel();
  @Input() listProps: any = {
    title: 'Available columns',
  };
  @Input() addedItemsListProps: any = {
    title: 'Selected columns',
  };
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
      component: AIColumnCustomizationModal,
      inputs: {
        model: this.model,
        listProps: this.listProps,
        addedItemsListProps: this.addedItemsListProps,
      },
    });
  }
}
