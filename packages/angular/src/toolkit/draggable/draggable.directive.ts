import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[scDraggable], [aiDraggable]',
})
export class DraggableDirective {
  @Input() dragImage: Element;

  @Input() imageOffset = { x: 0, y: 0 };

  @Output() start = new EventEmitter();

  @Output() end = new EventEmitter();

  @HostBinding('attr.draggable') draggable = true;

  @HostListener('dragstart', ['$event'])
  handleDragStart(event: DragEvent) {
    // 20 is half the element height
    // 4 is half of a mini-unit, which centers the drag on the handle
    event.dataTransfer.setDragImage(this.dragImage, this.imageOffset.x, this.imageOffset.y);
    event.dataTransfer.effectAllowed = 'move';
    this.start.emit();
  }

  @HostListener('dragend')
  handleEnd() {
    this.end.emit();
  }
}
