import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';

@NgModule({
	declarations: [DraggableDirective, DroppableDirective],
	imports: [CommonModule],
	exports: [DraggableDirective, DroppableDirective],
})
export class DraggableModule {}
