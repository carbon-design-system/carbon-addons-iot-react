import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListItem } from 'carbon-components-angular';
import { SortableListOption } from './sortable-list-model.class';

export type SortableListItem = SortableListOption & ListItem;

export type SortableListItems = SortableListItem[];

/**
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list component
 */
@Component({
	selector: 'sc-sortable-list',
	template: `
		<ol>
			<ng-container *ngFor="let item of items; trackBy: trackByFn">
				<li
					scDropzone
					class="dropzone"
					[ngClass]="{
						active: isActive(item),
						visible: dragging
					}"
					(dropping)="handleDrop()"
					(active)="active(item)"
					(leave)="leave()"
				>
					<div class="line"></div>
				</li>
				<sc-sortable-list-item
					[disabled]="item.disabled"
					(dragStart)="dragStart(item)"
					(dragEnd)="end()"
					(move)="handleMove($event, item)"
				>
					<ng-container *ngIf="!item.template">{{ item?.content | async }}</ng-container>
					<ng-template
						*ngIf="item.template"
						[ngTemplateOutlet]="item.template"
						[ngTemplateOutletContext]="item"
					>
					</ng-template>
				</sc-sortable-list-item>
			</ng-container>
			<li
				scDropzone
				class="dropzone bottom"
				[ngClass]="{
					active: isActive('bottom'),
					visible: dragging
				}"
				(dropping)="handleDrop()"
				(active)="active('bottom')"
				(leave)="leave()"
			>
				<div class="line"></div>
			</li>
		</ol>
	`,
	styleUrls: ['./sortable-list.scss'],
})
export class SortableListComponent {
	@Input() items: SortableListItems;

	@Output() itemsChange = new EventEmitter<SortableListItems>();

	public dragging = null;

	public dragOver = null;

	trackByFn(index: number, item: SortableListItem) {
		return item;
	}

	dragStart(item: SortableListItem) {
		this.dragging = item;
	}

	active(item: SortableListItem | 'bottom') {
		this.dragOver = item;
	}

	leave() {
		this.dragOver = null;
	}

	isActive(item: SortableListItem | 'bottom') {
		return this.dragOver === item;
	}

	end() {
		this.dragOver = null;
		this.dragging = null;
	}

	handleDrop() {
		if (!this.dragging) {
			return;
		}

		this.items = this.insertBefore(this.dragging, this.dragOver);

		this.end();

		this.itemsChange.emit(this.items);
	}

	handleMove(direction: 'up' | 'down', item: SortableListItem) {
		const itemIndex = this.items.indexOf(item);
		if (direction === 'up') {
			if (!this.items[itemIndex - 1]) {
				return;
			}
			this.items = this.insertBefore(item, this.items[itemIndex - 1]);
		} else if (direction === 'down') {
			const baseItem = this.items[itemIndex + 2] ? this.items[itemIndex + 2] : 'bottom';
			this.items = this.insertBefore(item, baseItem);
		}
	}

	protected insertBefore(itemToMove: SortableListItem, baseItem: SortableListItem | 'bottom') {
		const tmpItems = Array.from(this.items);

		const itemToMoveIndex = tmpItems.indexOf(itemToMove);
		tmpItems.splice(itemToMoveIndex, 1);

		if (baseItem === 'bottom') {
			tmpItems.push(itemToMove);
		} else {
			const insertionPointIndex = tmpItems.indexOf(baseItem);
			tmpItems.splice(insertionPointIndex, 0, itemToMove);
		}

		return tmpItems;
	}
}
