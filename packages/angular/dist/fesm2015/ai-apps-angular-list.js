/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-list.js
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


import { EventEmitter, TemplateRef, Component, Input, Output, Directive, HostBinding, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService, IconModule, CheckboxModule, SearchModule } from 'carbon-components-angular';
import { Bee32, ChevronUp16, Draggable16 } from '@carbon/icons';

class AIListItem {
    constructor(rawData) {
        /**
         * Unique identifier for the list item.
         */
        this.id = `list-item-${AIListItem.listItemCount++}`;
        /**
         * Primary content to be displayed in the list item.
         */
        this.value = '';
        /**
         * Indicates whether or not a list item's displayed value should be bolded.
         */
        this.isCategory = false;
        /**
         * If the list item has child list items, this indicates whether or not it's
         * direct children are displayed.
         */
        this.expanded = false;
        /**
         * Indicates whether or not the list item can be selected.
         */
        this.isSelectable = false;
        /**
         * Indicates whether or not the item is selected.
         */
        this.selected = false;
        this.disabled = false;
        /**
         * Indicates whether or not the list item is in an indeterminate state.
         */
        this.indeterminate = false;
        /**
         * Optional nested items.
         */
        this.items = [];
        this.size = 'md';
        /**
         * Indicates whether or not the item can be dragged into a different position.
         */
        this.isDraggable = false;
        const data = Object.assign(Object.assign({}, (rawData ? rawData : {})), { items: (rawData === null || rawData === void 0 ? void 0 : rawData.items) && rawData.items.length > 0
                ? rawData.items.map((item) => item instanceof AIListItem ? item : new AIListItem(item))
                : [] });
        Object.assign(this, {}, data);
    }
    /**
     * This method returns `true` if `searchString` is a substring of `value`
     * or `secondaryValue` of this list item or any of its children.
     * This method may be overridden to achieve a custom search.
     *
     * For example, if I want `ai-list` to only filter based on secondary
     * values and have case matter, I can create a custom `AIListItem`:
     *
     * class CustomAIListItem extends AIListItem {
     *   constructor(rawData: any) {
     *     super(rawData);
     *   }
     *
     *   includes(searchString: string) {
     *     return this.secondaryValue.includes(searchString) || this.items.some((listItem) => listItem.includes(searchString));
     *   }
     * }
     *
     * Then instead of passing in an array of `AIListItem`s into `ai-list`,
     * you can pass in an array of `CustomAIListItem`s and if you have the
     * search bar turned on, it will filter out items based on your custom
     * `includes` method.
     */
    includes(searchString) {
        return (this.value.toLowerCase().includes(searchString.toLowerCase()) ||
            (this.secondaryValue !== undefined &&
                this.secondaryValue !== null &&
                this.secondaryValue.toLowerCase().includes(searchString.toLowerCase())) ||
            this.items.some((listItem) => listItem.includes(searchString)));
    }
    expand(expanded = true) {
        this.expanded = expanded;
    }
    select(selected = true) {
        this.selected = selected;
    }
    setIndeterminate(indeterminate = true) {
        this.indeterminate = indeterminate;
    }
    disable(disabled = true) {
        this.disabled = disabled;
    }
    addItem(listItem, index = 0) {
        if (index > this.items.length) {
            this.items.splice(this.items.length, 0, listItem);
        }
        else {
            this.items.splice(index, 0, listItem);
        }
    }
    removeItem(index = 0) {
        if (index >= 0 && this.items.length > index) {
            this.items.splice(index, 1);
        }
    }
    hasItem(item) {
        if (item === undefined || item === null) {
            return false;
        }
        return this.id === item.id || this.items.some((listItem) => listItem.hasItem(item));
    }
    hasChildren() {
        return this.items && this.items.length > 0;
    }
    someChildrenSelected() {
        return this.items.some((item) => (item.isSelectable ? item.selected : false));
    }
    allChildrenSelected() {
        return this.items.every((item) => (item.isSelectable ? item.selected : false));
    }
}
/**
 * Variable used for creating unique ids for ListItems.
 */
AIListItem.listItemCount = 0;

var SelectionType;
(function (SelectionType) {
    SelectionType["SINGLE"] = "single";
    SelectionType["MULTI"] = "multi";
})(SelectionType || (SelectionType = {}));
class AIListComponent {
    constructor(iconService) {
        this.iconService = iconService;
        /**
         * Indicates whether a search bar should be rendered in the list header.
         */
        this.hasSearch = false;
        this.isFullHeight = false;
        /**
         * Text that is displayed when list is empty. To change the default
         * icon with the text, this can also be set to a `TemplateRef`.
         *
         * The reason we are using type `any` instead of `string | TemplateRef<any>`,
         * which is the only two types that should be accepted, is because
         * passing `emptyState` into `ngTemplateOutlet` would cause the error:
         * `Type 'string | TemplateRef<any>' is not assignable to type 'TemplateRef<any>'`
         * to come up while building.
         */
        this.emptyState = 'No list items to show';
        /**
         * If a `hasSearch` is true, this is emitted when search value is changed.
         */
        this.onSearch = new EventEmitter();
        this.isDraggingChange = new EventEmitter();
        this.draggedItemChange = new EventEmitter();
        this.searchString = '';
        this._isDragging = false;
        this._draggedItem = null;
    }
    set isDragging(isDragging) {
        let shouldEmit = false;
        if (this._isDragging !== isDragging) {
            shouldEmit = true;
        }
        this._isDragging = isDragging;
        if (shouldEmit) {
            this.isDraggingChange.emit(isDragging);
        }
    }
    get isDragging() {
        return this._isDragging;
    }
    set draggedItem(draggedItem) {
        let shouldEmit = false;
        if (this._draggedItem !== draggedItem) {
            shouldEmit = true;
        }
        this._draggedItem = draggedItem;
        if (shouldEmit) {
            this.draggedItemChange.emit(draggedItem);
        }
    }
    get draggedItem() {
        return this._draggedItem;
    }
    ngOnInit() {
        this.iconService.register(Bee32);
    }
    handleDragStart(item) {
        this.isDragging = true;
        this.draggedItem = item;
    }
    handleDragEnd(dragEvent, item, parent) {
        const dragEffect = dragEvent.dataTransfer.dropEffect;
        // Remove the original item if the dragged item has been successfully moved to a new position.
        if (dragEffect !== 'none') {
            if (parent === null) {
                const droppedItemIndex = this.items.findIndex((listItem) => listItem === item);
                this.items.splice(droppedItemIndex, 1);
            }
            else {
                const droppedItemIndex = parent.items.findIndex((listItem) => listItem === item);
                parent.items.splice(droppedItemIndex, 1);
            }
        }
        this.isDragging = false;
        this.draggedItem = null;
    }
    handleDragOver(dragEvent, receiver) {
        // Only allow dropping if:
        // 1. The dragged item is not being dropped onto one of its' own children.
        // 2. The dragged item is not being dropped onto itself.
        if (this.draggedItem &&
            !this.draggedItem.hasItem(receiver) &&
            (receiver === null || receiver.id !== this.draggedItem.id)) {
            dragEvent.preventDefault();
        }
    }
    handleDrop(receiver, index) {
        // A copy of the dragged item is created so that the original can be removed in `handleDragEnd`.
        const item = new AIListItem(this.draggedItem);
        if (receiver === null) {
            this.items.splice(index, 0, item);
        }
        else {
            receiver.addItem(item, index);
        }
    }
    handleSelect(selectedItem) {
        if (this.selectionType === SelectionType.MULTI) {
            this.updateChildSelectedStates(selectedItem);
            this.updateParentSelectedStates(this.items);
        }
        else {
            this.onSingleSelect(this.items, selectedItem.id);
        }
    }
    handleSearch(searchString) {
        this.searchString = searchString;
        this.onSearch.emit(searchString);
    }
    /**
     * This function returns the adjusted `nestingLevel`s of an AIListItem.
     */
    getAdjustedNestingLevel(items, currentDepth) {
        return items.some((item) => item.hasChildren()) ? currentDepth + 1 : currentDepth;
    }
    isArray(obj) {
        return Array.isArray(obj);
    }
    isTemplate(value) {
        return value instanceof TemplateRef;
    }
    updateChildSelectedStates(selectedItem) {
        if (selectedItem.hasChildren()) {
            selectedItem.items.forEach((item) => {
                if (!item.disabled) {
                    item.select(selectedItem.selected);
                }
                this.updateChildSelectedStates(item);
            });
        }
    }
    updateParentSelectedStates(items) {
        items.forEach((item) => {
            if (item.hasChildren()) {
                this.updateParentSelectedStates(item.items);
            }
            else {
                return;
            }
            if (item.isSelectable && item.allChildrenSelected()) {
                item.select();
                item.setIndeterminate(false);
            }
            else if (item.isSelectable && item.someChildrenSelected()) {
                item.select();
                item.setIndeterminate();
            }
            else {
                if (!item.items.every((listItem) => listItem.disabled)) {
                    item.select(false);
                }
                item.setIndeterminate(false);
            }
        });
    }
    onSingleSelect(items, selectedId) {
        items.forEach((item) => {
            if (item.id !== selectedId) {
                item.select(false);
            }
            if (item.hasChildren()) {
                this.onSingleSelect(item.items, selectedId);
            }
        });
    }
}
AIListComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-list',
                template: `
    <div class="iot--list" [ngClass]="{ 'iot--list__full-height': isFullHeight }">
      <ai-list-header [hasSearch]="hasSearch" [title]="title" (onSearch)="handleSearch($event)">
      </ai-list-header>
      <div
        class="iot--list--content"
        [ngClass]="{ 'iot--list--content__full-height': isFullHeight }"
      >
        <ng-container
          *ngIf="items && items.length > 0"
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: items,
              nestingLevel: 0,
              parentItem: null,
              index: 0
            }
          }"
        >
        </ng-container>
        <div
          *ngIf="!items || items.length < 1"
          class="iot--list--empty-state iot--list--empty-state__full-height"
          (drop)="isDragging ? handleDrop(null, 0) : undefined"
          (dragover)="$event.preventDefault()"
        >
          <ng-container *ngIf="!isTemplate(emptyState)">
            <svg ibmIcon="bee" size="32"></svg>
            <p>{{ emptyState }}</p>
          </ng-container>
          <ng-container *ngIf="isTemplate(emptyState)" [ngTemplateOutlet]="emptyState">
          </ng-container>
        </div>
      </div>
    </div>

    <ng-template #listItemTemplateRef let-data>
      <!-- Render item -->
      <ng-container *ngIf="data.item.id && !isArray(data.item) && data.item.includes(searchString)">
        <ai-list-item-wrapper
          [draggable]="itemsDraggable && data.item.isDraggable"
          [disabled]="data.item.disabled"
          [size]="data.item.size"
          [isDragging]="isDragging"
          (dragStart)="handleDragStart(data.item)"
          (dragEnd)="handleDragEnd($event, data.item, data.parentItem)"
          (droppedAbove)="handleDrop(data.parentItem, data.index)"
          (droppedBelow)="handleDrop(data.parentItem, data.index + 1)"
          (droppedNested)="handleDrop(data.item, 0)"
          (dragOverBelow)="handleDragOver($event, data.parentItem)"
          (dragOverAbove)="handleDragOver($event, data.parentItem)"
          (dragOverNested)="handleDragOver($event, data.item)"
        >
          <ai-list-item
            [item]="data.item"
            [nestingLevel]="data.item.hasChildren() ? data.nestingLevel - 1 : data.nestingLevel"
            (itemSelected)="handleSelect(data.item)"
            [selectionType]="selectionType"
            [draggable]="itemsDraggable"
          >
          </ai-list-item>
        </ai-list-item-wrapper>
      </ng-container>

      <!-- Item has children -->
      <ng-container *ngIf="!isArray(data.item) && data.item.hasChildren() && data.item.expanded">
        <ng-container
          *ngFor="let item of data.item.items; index as i"
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: item,
              nestingLevel: getAdjustedNestingLevel(data.item.items, data.nestingLevel),
              parentItem: data.item,
              index: i
            }
          }"
        ></ng-container>
      </ng-container>

      <!-- Top level item -->
      <ng-container *ngIf="isArray(data.item)">
        <ng-container
          *ngFor="let item of data.item; index as i"
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: item,
              nestingLevel: getAdjustedNestingLevel(data.item, data.nestingLevel),
              parentItem: null,
              index: i
            }
          }"
        >
        </ng-container>
      </ng-container>
    </ng-template>
  `
            },] }
];
AIListComponent.ctorParameters = () => [
    { type: IconService }
];
AIListComponent.propDecorators = {
    items: [{ type: Input }],
    selectionType: [{ type: Input }],
    itemsDraggable: [{ type: Input }],
    isDragging: [{ type: Input }],
    draggedItem: [{ type: Input }],
    hasSearch: [{ type: Input }],
    title: [{ type: Input }],
    isFullHeight: [{ type: Input }],
    emptyState: [{ type: Input }],
    onSearch: [{ type: Output }],
    isDraggingChange: [{ type: Output }],
    draggedItemChange: [{ type: Output }]
};

class AIListHeaderComponent {
    constructor() {
        /**
         * Indicates whether a search bar should be rendered in the list header.
         */
        this.hasSearch = false;
        /**
         * If a `hasSearch` is true, this is emitted when search value is changed.
         */
        this.onSearch = new EventEmitter();
    }
}
AIListHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-list-header',
                template: `
    <div class="iot--list-header-container">
      <div class="iot--list-header">
        <div class="iot--list-header--title">
          {{ title }}
        </div>
      </div>
      <div *ngIf="hasSearch" class="iot--list-header--search">
        <ibm-search
          placeholder="search"
          (valueChange)="onSearch.emit($event)"
          (clear)="onSearch.emit('')"
        >
        </ibm-search>
      </div>
    </div>
  `
            },] }
];
AIListHeaderComponent.propDecorators = {
    title: [{ type: Input }],
    hasSearch: [{ type: Input }],
    onSearch: [{ type: Output }]
};

class AIListItemComponent {
    constructor(iconService) {
        this.iconService = iconService;
        /**
         * Nesting level of the list item. Determines the amount of space the item will be indented
         * when rendered in the list.
         */
        this.nestingLevel = 0;
        /**
         * Indicates whether or not the item can be dragged into a different position.
         */
        this.draggable = false;
        /**
         * Indicates whether or not the list item can be selected.
         */
        this.isSelectable = false;
        /**
         * Emitted if the item has been selected.
         */
        this.itemSelected = new EventEmitter();
    }
    ngOnInit() {
        this.iconService.register(ChevronUp16);
        this.iconService.register(Draggable16);
    }
    handleSelect(select) {
        this.item.select(select);
        this.itemSelected.emit();
    }
}
AIListItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-list-item',
                template: `
    <div
      role="button"
      [attr.tabindex]="
        this.item.isSelectable && !this.item.disabled && !this.item.isDraggable ? 0 : undefined
      "
      class="iot--list-item"
      [ngClass]="{
        'iot--list-item__selectable': item.isSelectable,
        'iot--list-item__selected': item.selected,
        'iot--list-item-editable': item.isDraggable,
        'iot--list-item__large': item.size === 'lg'
      }"
      (click)="selectionType === 'single' ? handleSelect(!item.selected) : null"
      (keyup.Space)="selectionType === 'single' ? handleSelect(!item.selected) : null"
    >
      <div class="iot--list-item-editable--drag-preview">
        {{ item.value }}
      </div>
      <svg
        *ngIf="draggable && item.isDraggable"
        class="iot--list-item--handle"
        [ngClass]="{ 'iot--list-item--handle__disabled': item.disabled }"
        ibmIcon="draggable"
        size="16"
      ></svg>
      <div
        *ngIf="nestingLevel > 0"
        class="iot--list-item--nesting-offset"
        [ngStyle]="{ width: 30 * nestingLevel + 'px' }"
      ></div>
      <div
        *ngIf="item.hasChildren()"
        role="button"
        (click)="!item.disabled ? item.expand(!item.expanded) : undefined"
        (keyup.Space)="!item.disabled ? item.expand(!item.expanded) : undefined"
        [tabindex]="!item.disabled ? 0 : undefined"
        class="iot--list-item--expand-icon"
        [ngClass]="{ 'iot--list-item--expand-icon__disabled': item.disabled }"
      >
        <svg *ngIf="!item.expanded" ibmIcon="chevron--down" size="16"></svg>
        <svg *ngIf="item.expanded" ibmIcon="chevron--up" size="16"></svg>
      </div>
      <div
        class="iot--list-item--content"
        [ngClass]="{
          'iot--list-item--content__selected': item.selected,
          'iot--list-item--content__large': item.size === 'lg'
        }"
      >
        <div
          *ngIf="item.isSelectable && selectionType === 'multi'"
          class="iot--list-item--content--icon iot--list-item--content--icon__left"
        >
          <ibm-checkbox
            (checkedChange)="handleSelect($event)"
            [checked]="item.selected"
            [id]="item.id + '_checkbox'"
            [disabled]="item.disabled"
            [indeterminate]="item.indeterminate"
          >
          </ibm-checkbox>
        </div>
        <div
          class="iot--list-item--content--values"
          [ngClass]="{ 'iot--list-item--content--values__large': item.size === 'lg' }"
        >
          <div
            class="iot--list-item--content--values--main"
            [ngClass]="{ 'iot--list-item--content--values--main__large': item.size === 'lg' }"
          >
            <div
              class="iot--list-item--content--values--value"
              [ngClass]="{
                'iot--list-item--category': item.isCategory,
                'iot--list-item--content--values__disabled': item.disabled,
                'iot--list-item--content--values--value__with-actions': item.rowActions
              }"
            >
              {{ item.value }}
            </div>
            <div
              *ngIf="item.secondaryValue !== undefined"
              class="iot--list-item--content--values--value"
              [ngClass]="{
                'iot--list-item--content--values__disabled': item.disabled,
                'iot--list-item--content--values--value__large': item.size === 'lg'
              }"
            >
              {{ item.secondaryValue }}
            </div>
            <div *ngIf="item.rowActions" class="iot--list-item--content--row-actions">
              <ng-container
                [ngTemplateOutlet]="item.rowActions"
                [ngTemplateOutletContext]="item.rowActionsContext"
              >
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
            },] }
];
AIListItemComponent.ctorParameters = () => [
    { type: IconService }
];
AIListItemComponent.propDecorators = {
    item: [{ type: Input }],
    nestingLevel: [{ type: Input }],
    draggable: [{ type: Input }],
    isSelectable: [{ type: Input }],
    selectionType: [{ type: Input }],
    itemSelected: [{ type: Output }]
};

class AIListTargetDirective {
    constructor() {
        this.targetPosition = 'below';
        this.targetSize = 33;
        this.dropping = new EventEmitter();
        this.dragOver = new EventEmitter();
        this.dragLeave = new EventEmitter();
        this.dragEnter = new EventEmitter();
        this.isActive = false;
    }
    get isNested() {
        return this.targetPosition === 'nested';
    }
    get isAbove() {
        return this.targetPosition === 'above';
    }
    get isBelow() {
        return this.targetPosition === 'below';
    }
    get isNestedOver() {
        return this.targetPosition === 'nested' && this.isActive;
    }
    get isAboveOver() {
        return this.targetPosition === 'above' && this.isActive;
    }
    get isBelowOver() {
        return this.targetPosition === 'below' && this.isActive;
    }
    get height() {
        return `${this.targetSize}%`;
    }
    handleDragEnter(event) {
        this.isActive = true;
        this.dragEnter.emit(event);
    }
    dragover(event) {
        this.dragOver.emit(event);
    }
    handleDrop(event) {
        this.dropping.emit(event);
    }
    handleLeave(event) {
        this.isActive = false;
        this.dragLeave.emit(event);
    }
}
AIListTargetDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiListTarget]',
            },] }
];
AIListTargetDirective.propDecorators = {
    targetPosition: [{ type: Input }],
    targetSize: [{ type: Input }],
    dropping: [{ type: Output }],
    dragOver: [{ type: Output }],
    dragLeave: [{ type: Output }],
    dragEnter: [{ type: Output }],
    isNested: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-nested',] }],
    isAbove: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-above',] }],
    isBelow: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-below',] }],
    isNestedOver: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-nested__over',] }],
    isAboveOver: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-above__over',] }],
    isBelowOver: [{ type: HostBinding, args: ['class.iot--list-item-editable--drop-target-below__over',] }],
    height: [{ type: HostBinding, args: ['style.height',] }],
    handleDragEnter: [{ type: HostListener, args: ['dragenter', ['$event'],] }],
    dragover: [{ type: HostListener, args: ['dragover', ['$event'],] }],
    handleDrop: [{ type: HostListener, args: ['drop', ['$event'],] }],
    handleLeave: [{ type: HostListener, args: ['dragleave', ['event'],] }]
};

class AIListItemWrapperComponent {
    constructor() {
        /**
         * Indicates whether or not the item can be dragged into a different position.
         */
        this.draggable = false;
        this.isDragging = false;
        /**
         * Indicates whether or not the list item can be selected.
         */
        this.isSelectable = false;
        this.size = 'md';
        this.disabled = false;
        this.dragStart = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.dragOverAbove = new EventEmitter();
        this.dragOverBelow = new EventEmitter();
        this.dragOverNested = new EventEmitter();
        this.droppedBelow = new EventEmitter();
        this.droppedAbove = new EventEmitter();
        this.droppedNested = new EventEmitter();
    }
}
AIListItemWrapperComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-list-item-wrapper',
                template: `
    <div data-floating-menu-container="true" class="iot--list-item-parent">
      <div
        *ngIf="draggable && !disabled; else listItem"
        class="iot--list-item-editable--drag-container"
        role="listitem"
        [draggable]="true"
        (dragstart)="dragStart.emit($event)"
        (dragend)="dragEnd.emit($event)"
      >
        <div
          class="iot--list-item-editable--drop-targets"
          [ngClass]="{ 'iot--list-item__large': size === 'lg' }"
          *ngIf="isDragging"
        >
          <div
            aiListTarget
            targetPosition="nested"
            (dropping)="droppedNested.emit($event)"
            (dragOver)="dragOverNested.emit($event)"
            [targetSize]="100"
          ></div>
          <div
            aiListTarget
            targetPosition="above"
            (dropping)="droppedAbove.emit($event)"
            (dragOver)="dragOverAbove.emit($event)"
          ></div>
          <div
            aiListTarget
            targetPosition="below"
            (dropping)="droppedBelow.emit($event)"
            (dragOver)="dragOverBelow.emit($event)"
          ></div>
        </div>
        <ng-container [ngTemplateOutlet]="listItem"></ng-container>
      </div>
    </div>

    <ng-template #listItem>
      <ng-content></ng-content>
    </ng-template>
  `
            },] }
];
AIListItemWrapperComponent.propDecorators = {
    draggable: [{ type: Input }],
    isDragging: [{ type: Input }],
    isSelectable: [{ type: Input }],
    size: [{ type: Input }],
    disabled: [{ type: Input }],
    dragStart: [{ type: Output }],
    dragEnd: [{ type: Output }],
    dragOverAbove: [{ type: Output }],
    dragOverBelow: [{ type: Output }],
    dragOverNested: [{ type: Output }],
    droppedBelow: [{ type: Output }],
    droppedAbove: [{ type: Output }],
    droppedNested: [{ type: Output }]
};

class ListModule {
}
ListModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AIListHeaderComponent,
                    AIListItemComponent,
                    AIListItemWrapperComponent,
                    AIListComponent,
                    AIListTargetDirective,
                ],
                exports: [
                    AIListHeaderComponent,
                    AIListItemComponent,
                    AIListItemWrapperComponent,
                    AIListComponent,
                    AIListTargetDirective,
                ],
                imports: [CommonModule, IconModule, CheckboxModule, SearchModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AIListComponent, AIListHeaderComponent, AIListItem, AIListItemComponent, AIListItemWrapperComponent, AIListTargetDirective, ListModule, SelectionType };
//# sourceMappingURL=ai-apps-angular-list.js.map
