import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CheckboxModule, DialogModule } from "carbon-components-angular";
import { DraggableModule } from "../draggable/index";
import { SortableListItemComponent } from "./sortable-list-item.component";
import { SortableListComponent } from "./sortable-list.component";

@NgModule({
	declarations: [
		SortableListComponent,
		SortableListItemComponent
	],
	imports: [
		CommonModule,
		CheckboxModule,
		DialogModule,
		DraggableModule
	],
	exports: [
		SortableListComponent,
		SortableListItemComponent
	]
})
export class SortableListModule {}
