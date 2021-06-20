import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionType } from '../ai-list-model.class';

@Component({
  selector: 'ai-list-item-wrapper',
  template: `
    <div class='iot--list-item-parent'>
      <div
        *ngIf="draggable"
        class="iot--list-item-editable--drag-container"
        role="listitem"
        [draggable]="true"
        (dragstart)="dragStart.emit()"
        (dragend)="dragEnd.emit()"
        (dragover)="onDragOver($event)">
        <div class="iot--list-item-editable--drop-targets" *ngIf="isDragging">
          <div
            aiListTarget
            targetPosition='nested'
            (dropping)="itemDropped.emit('nested')"
            [targetSize]="100"
          >
          </div>
          <div aiListTarget targetPosition='above' (dropping)="itemDropped.emit('above')"></div>
          <div aiListTarget targetPosition='below' (dropping)="itemDropped.emit('below')"></div>
        </div>
        <ng-container [ngTemplateOutlet]="listItem"></ng-container>
      </div>
    </div>

    <ng-container *ngIf="!draggable" [ngTemplateOutlet]="listItem">
    </ng-container>

    <ng-template #listItem>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class AIListItemWrapperComponent {
  /**
   * Indicates whether or not the item can be dragged into a different position.
   */
  @Input() draggable = false;

  @Input() isDragging = false;

  /**
   * Indicates whether or not the list item can be selected.
   */
  @Input() isSelectable = false;

  @Input() selectionType: SelectionType;

  @Output() dragStart = new EventEmitter<any>();

  @Output() dragEnd = new EventEmitter<any>();

  @Output() itemDropped = new EventEmitter<any>();

  onDragOver(ev: any) {
    ev.preventDefault();
  }
}
