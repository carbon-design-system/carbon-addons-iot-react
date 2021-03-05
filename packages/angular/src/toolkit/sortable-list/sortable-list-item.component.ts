import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output
} from "@angular/core";
/**
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list-item component
 */
@Component({
	selector: "sc-sortable-list-item",
	template: `
		<div
			class="drag-marker"
			[ngClass]="{
				active: dragActive
			}">
		</div>
		<div class="wrapper" [ngClass]="{ disabled: disabled }">
			<div
				class="handle"
				scDraggable
				[dragImage]="elementRef.nativeElement"
				[imageOffset]="{x: 4, y: 20}"
				(start)="!disabled ? dragStart.emit() : null"
				(end)="!disabled ? dragEnd.emit() : null">
				<svg
					xmlns="http://www.w3.org/2000/svg" focusable="false"
					preserveAspectRatio="xMidYMid meet" aria-hidden="true"
					width="16" height="16" viewBox="0 0 32 32">
					<path d="M10 6H14V10H10zM18 6H22V10H18zM10 14H14V18H10zM18 14H22V18H18zM10 22H14V26H10zM18 22H22V26H18z"></path>
				</svg>
			</div>
			<div class="content">
				<ibm-checkbox [checked]="checked" [disabled]="disabled">
					<ng-content></ng-content>
				</ibm-checkbox>
				<ibm-overflow-menu [flip]="true">
					<ibm-overflow-menu-option (selected)="move.emit('up')" [disabled]="disabled">Move up</ibm-overflow-menu-option>
					<ibm-overflow-menu-option (selected)="move.emit('down')" [disabled]="disabled">Move down</ibm-overflow-menu-option>
				</ibm-overflow-menu>
			</div>
		</div>
	`,
	styleUrls: ["./sortable-list-item.scss"]
})
export class SortableListItemComponent {
	@Input() checked = true;

	@Input() disabled = false;

	@Input() dragActive = false;

	@Output() dragStart = new EventEmitter();

	@Output() dragEnd = new EventEmitter();

	@Output() move = new EventEmitter<"up"|"down">();

	constructor(public elementRef: ElementRef) {}
}
