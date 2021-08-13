import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[aiListTarget]',
})
export class AIListTargetDirective {
  @Input() targetPosition: 'nested' | 'above' | 'below' = 'below';

  @Input() targetSize = 33;

  @Output() dropping = new EventEmitter();

  @Output() dragOver = new EventEmitter();

  @Output() dragLeave = new EventEmitter();

  @Output() dragEnter = new EventEmitter();

  isActive = false;

  @HostBinding('class.iot--list-item-editable--drop-target-nested') get isNested() {
    return this.targetPosition === 'nested';
  }

  @HostBinding('class.iot--list-item-editable--drop-target-above') get isAbove() {
    return this.targetPosition === 'above';
  }

  @HostBinding('class.iot--list-item-editable--drop-target-below') get isBelow() {
    return this.targetPosition === 'below';
  }

  @HostBinding('class.iot--list-item-editable--drop-target-nested__over') get isNestedOver() {
    return this.targetPosition === 'nested' && this.isActive;
  }

  @HostBinding('class.iot--list-item-editable--drop-target-above__over') get isAboveOver() {
    return this.targetPosition === 'above' && this.isActive;
  }

  @HostBinding('class.iot--list-item-editable--drop-target-below__over') get isBelowOver() {
    return this.targetPosition === 'below' && this.isActive;
  }

  @HostBinding('style.height') get height() {
    return `${this.targetSize}%`;
  }

  @HostListener('dragenter', ['$event'])
  handleDragEnter(event: DragEvent) {
    this.isActive = true;
    this.dragEnter.emit(event);
  }

  @HostListener('dragover', ['$event'])
  dragover(event: DragEvent) {
    this.dragOver.emit(event);
  }

  @HostListener('drop', ['$event'])
  handleDrop(event: DragEvent) {
    this.dropping.emit(event);
  }

  @HostListener('dragleave', ['event'])
  handleLeave(event: DragEvent) {
    this.isActive = false;
    this.dragLeave.emit(event);
  }
}
