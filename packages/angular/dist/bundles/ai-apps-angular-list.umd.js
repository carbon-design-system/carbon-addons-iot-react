/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-list.umd.js
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


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('carbon-components-angular'), require('@carbon/icons')) :
    typeof define === 'function' && define.amd ? define('@ai-apps/angular/list', ['exports', '@angular/core', '@angular/common', 'carbon-components-angular', '@carbon/icons'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular.list = {}), global.ng.core, global.ng.common, global.carbonComponentsAngular, global.icons));
})(this, (function (exports, core, common, carbonComponentsAngular, icons) { 'use strict';

    var AIListItem = /** @class */ (function () {
        function AIListItem(rawData) {
            /**
             * Unique identifier for the list item.
             */
            this.id = "list-item-" + AIListItem.listItemCount++;
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
            var data = Object.assign(Object.assign({}, (rawData ? rawData : {})), { items: (rawData === null || rawData === void 0 ? void 0 : rawData.items) && rawData.items.length > 0
                    ? rawData.items.map(function (item) { return item instanceof AIListItem ? item : new AIListItem(item); })
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
        AIListItem.prototype.includes = function (searchString) {
            return (this.value.toLowerCase().includes(searchString.toLowerCase()) ||
                (this.secondaryValue !== undefined &&
                    this.secondaryValue !== null &&
                    this.secondaryValue.toLowerCase().includes(searchString.toLowerCase())) ||
                this.items.some(function (listItem) { return listItem.includes(searchString); }));
        };
        AIListItem.prototype.expand = function (expanded) {
            if (expanded === void 0) { expanded = true; }
            this.expanded = expanded;
        };
        AIListItem.prototype.select = function (selected) {
            if (selected === void 0) { selected = true; }
            this.selected = selected;
        };
        AIListItem.prototype.setIndeterminate = function (indeterminate) {
            if (indeterminate === void 0) { indeterminate = true; }
            this.indeterminate = indeterminate;
        };
        AIListItem.prototype.disable = function (disabled) {
            if (disabled === void 0) { disabled = true; }
            this.disabled = disabled;
        };
        AIListItem.prototype.addItem = function (listItem, index) {
            if (index === void 0) { index = 0; }
            if (index > this.items.length) {
                this.items.splice(this.items.length, 0, listItem);
            }
            else {
                this.items.splice(index, 0, listItem);
            }
        };
        AIListItem.prototype.removeItem = function (index) {
            if (index === void 0) { index = 0; }
            if (index >= 0 && this.items.length > index) {
                this.items.splice(index, 1);
            }
        };
        AIListItem.prototype.hasItem = function (item) {
            if (item === undefined || item === null) {
                return false;
            }
            return this.id === item.id || this.items.some(function (listItem) { return listItem.hasItem(item); });
        };
        AIListItem.prototype.hasChildren = function () {
            return this.items && this.items.length > 0;
        };
        AIListItem.prototype.someChildrenSelected = function () {
            return this.items.some(function (item) { return (item.isSelectable ? item.selected : false); });
        };
        AIListItem.prototype.allChildrenSelected = function () {
            return this.items.every(function (item) { return (item.isSelectable ? item.selected : false); });
        };
        return AIListItem;
    }());
    /**
     * Variable used for creating unique ids for ListItems.
     */
    AIListItem.listItemCount = 0;

    exports.SelectionType = void 0;
    (function (SelectionType) {
        SelectionType["SINGLE"] = "single";
        SelectionType["MULTI"] = "multi";
    })(exports.SelectionType || (exports.SelectionType = {}));
    var AIListComponent = /** @class */ (function () {
        function AIListComponent(iconService) {
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
            this.onSearch = new core.EventEmitter();
            this.isDraggingChange = new core.EventEmitter();
            this.draggedItemChange = new core.EventEmitter();
            this.searchString = '';
            this._isDragging = false;
            this._draggedItem = null;
        }
        Object.defineProperty(AIListComponent.prototype, "isDragging", {
            get: function () {
                return this._isDragging;
            },
            set: function (isDragging) {
                var shouldEmit = false;
                if (this._isDragging !== isDragging) {
                    shouldEmit = true;
                }
                this._isDragging = isDragging;
                if (shouldEmit) {
                    this.isDraggingChange.emit(isDragging);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AIListComponent.prototype, "draggedItem", {
            get: function () {
                return this._draggedItem;
            },
            set: function (draggedItem) {
                var shouldEmit = false;
                if (this._draggedItem !== draggedItem) {
                    shouldEmit = true;
                }
                this._draggedItem = draggedItem;
                if (shouldEmit) {
                    this.draggedItemChange.emit(draggedItem);
                }
            },
            enumerable: false,
            configurable: true
        });
        AIListComponent.prototype.ngOnInit = function () {
            this.iconService.register(icons.Bee32);
        };
        AIListComponent.prototype.handleDragStart = function (item) {
            this.isDragging = true;
            this.draggedItem = item;
        };
        AIListComponent.prototype.handleDragEnd = function (dragEvent, item, parent) {
            var dragEffect = dragEvent.dataTransfer.dropEffect;
            // Remove the original item if the dragged item has been successfully moved to a new position.
            if (dragEffect !== 'none') {
                if (parent === null) {
                    var droppedItemIndex = this.items.findIndex(function (listItem) { return listItem === item; });
                    this.items.splice(droppedItemIndex, 1);
                }
                else {
                    var droppedItemIndex = parent.items.findIndex(function (listItem) { return listItem === item; });
                    parent.items.splice(droppedItemIndex, 1);
                }
            }
            this.isDragging = false;
            this.draggedItem = null;
        };
        AIListComponent.prototype.handleDragOver = function (dragEvent, receiver) {
            // Only allow dropping if:
            // 1. The dragged item is not being dropped onto one of its' own children.
            // 2. The dragged item is not being dropped onto itself.
            if (this.draggedItem &&
                !this.draggedItem.hasItem(receiver) &&
                (receiver === null || receiver.id !== this.draggedItem.id)) {
                dragEvent.preventDefault();
            }
        };
        AIListComponent.prototype.handleDrop = function (receiver, index) {
            // A copy of the dragged item is created so that the original can be removed in `handleDragEnd`.
            var item = new AIListItem(this.draggedItem);
            if (receiver === null) {
                this.items.splice(index, 0, item);
            }
            else {
                receiver.addItem(item, index);
            }
        };
        AIListComponent.prototype.handleSelect = function (selectedItem) {
            if (this.selectionType === exports.SelectionType.MULTI) {
                this.updateChildSelectedStates(selectedItem);
                this.updateParentSelectedStates(this.items);
            }
            else {
                this.onSingleSelect(this.items, selectedItem.id);
            }
        };
        AIListComponent.prototype.handleSearch = function (searchString) {
            this.searchString = searchString;
            this.onSearch.emit(searchString);
        };
        /**
         * This function returns the adjusted `nestingLevel`s of an AIListItem.
         */
        AIListComponent.prototype.getAdjustedNestingLevel = function (items, currentDepth) {
            return items.some(function (item) { return item.hasChildren(); }) ? currentDepth + 1 : currentDepth;
        };
        AIListComponent.prototype.isArray = function (obj) {
            return Array.isArray(obj);
        };
        AIListComponent.prototype.isTemplate = function (value) {
            return value instanceof core.TemplateRef;
        };
        AIListComponent.prototype.updateChildSelectedStates = function (selectedItem) {
            var _this = this;
            if (selectedItem.hasChildren()) {
                selectedItem.items.forEach(function (item) {
                    if (!item.disabled) {
                        item.select(selectedItem.selected);
                    }
                    _this.updateChildSelectedStates(item);
                });
            }
        };
        AIListComponent.prototype.updateParentSelectedStates = function (items) {
            var _this = this;
            items.forEach(function (item) {
                if (item.hasChildren()) {
                    _this.updateParentSelectedStates(item.items);
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
                    if (!item.items.every(function (listItem) { return listItem.disabled; })) {
                        item.select(false);
                    }
                    item.setIndeterminate(false);
                }
            });
        };
        AIListComponent.prototype.onSingleSelect = function (items, selectedId) {
            var _this = this;
            items.forEach(function (item) {
                if (item.id !== selectedId) {
                    item.select(false);
                }
                if (item.hasChildren()) {
                    _this.onSingleSelect(item.items, selectedId);
                }
            });
        };
        return AIListComponent;
    }());
    AIListComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-list',
                    template: "\n    <div class=\"iot--list\" [ngClass]=\"{ 'iot--list__full-height': isFullHeight }\">\n      <ai-list-header [hasSearch]=\"hasSearch\" [title]=\"title\" (onSearch)=\"handleSearch($event)\">\n      </ai-list-header>\n      <div\n        class=\"iot--list--content\"\n        [ngClass]=\"{ 'iot--list--content__full-height': isFullHeight }\"\n      >\n        <ng-container\n          *ngIf=\"items && items.length > 0\"\n          [ngTemplateOutlet]=\"listItemTemplateRef\"\n          [ngTemplateOutletContext]=\"{\n            $implicit: {\n              item: items,\n              nestingLevel: 0,\n              parentItem: null,\n              index: 0\n            }\n          }\"\n        >\n        </ng-container>\n        <div\n          *ngIf=\"!items || items.length < 1\"\n          class=\"iot--list--empty-state iot--list--empty-state__full-height\"\n          (drop)=\"isDragging ? handleDrop(null, 0) : undefined\"\n          (dragover)=\"$event.preventDefault()\"\n        >\n          <ng-container *ngIf=\"!isTemplate(emptyState)\">\n            <svg ibmIcon=\"bee\" size=\"32\"></svg>\n            <p>{{ emptyState }}</p>\n          </ng-container>\n          <ng-container *ngIf=\"isTemplate(emptyState)\" [ngTemplateOutlet]=\"emptyState\">\n          </ng-container>\n        </div>\n      </div>\n    </div>\n\n    <ng-template #listItemTemplateRef let-data>\n      <!-- Render item -->\n      <ng-container *ngIf=\"data.item.id && !isArray(data.item) && data.item.includes(searchString)\">\n        <ai-list-item-wrapper\n          [draggable]=\"itemsDraggable && data.item.isDraggable\"\n          [disabled]=\"data.item.disabled\"\n          [size]=\"data.item.size\"\n          [isDragging]=\"isDragging\"\n          (dragStart)=\"handleDragStart(data.item)\"\n          (dragEnd)=\"handleDragEnd($event, data.item, data.parentItem)\"\n          (droppedAbove)=\"handleDrop(data.parentItem, data.index)\"\n          (droppedBelow)=\"handleDrop(data.parentItem, data.index + 1)\"\n          (droppedNested)=\"handleDrop(data.item, 0)\"\n          (dragOverBelow)=\"handleDragOver($event, data.parentItem)\"\n          (dragOverAbove)=\"handleDragOver($event, data.parentItem)\"\n          (dragOverNested)=\"handleDragOver($event, data.item)\"\n        >\n          <ai-list-item\n            [item]=\"data.item\"\n            [nestingLevel]=\"data.item.hasChildren() ? data.nestingLevel - 1 : data.nestingLevel\"\n            (itemSelected)=\"handleSelect(data.item)\"\n            [selectionType]=\"selectionType\"\n            [draggable]=\"itemsDraggable\"\n          >\n          </ai-list-item>\n        </ai-list-item-wrapper>\n      </ng-container>\n\n      <!-- Item has children -->\n      <ng-container *ngIf=\"!isArray(data.item) && data.item.hasChildren() && data.item.expanded\">\n        <ng-container\n          *ngFor=\"let item of data.item.items; index as i\"\n          [ngTemplateOutlet]=\"listItemTemplateRef\"\n          [ngTemplateOutletContext]=\"{\n            $implicit: {\n              item: item,\n              nestingLevel: getAdjustedNestingLevel(data.item.items, data.nestingLevel),\n              parentItem: data.item,\n              index: i\n            }\n          }\"\n        ></ng-container>\n      </ng-container>\n\n      <!-- Top level item -->\n      <ng-container *ngIf=\"isArray(data.item)\">\n        <ng-container\n          *ngFor=\"let item of data.item; index as i\"\n          [ngTemplateOutlet]=\"listItemTemplateRef\"\n          [ngTemplateOutletContext]=\"{\n            $implicit: {\n              item: item,\n              nestingLevel: getAdjustedNestingLevel(data.item, data.nestingLevel),\n              parentItem: null,\n              index: i\n            }\n          }\"\n        >\n        </ng-container>\n      </ng-container>\n    </ng-template>\n  "
                },] }
    ];
    AIListComponent.ctorParameters = function () { return [
        { type: carbonComponentsAngular.IconService }
    ]; };
    AIListComponent.propDecorators = {
        items: [{ type: core.Input }],
        selectionType: [{ type: core.Input }],
        itemsDraggable: [{ type: core.Input }],
        isDragging: [{ type: core.Input }],
        draggedItem: [{ type: core.Input }],
        hasSearch: [{ type: core.Input }],
        title: [{ type: core.Input }],
        isFullHeight: [{ type: core.Input }],
        emptyState: [{ type: core.Input }],
        onSearch: [{ type: core.Output }],
        isDraggingChange: [{ type: core.Output }],
        draggedItemChange: [{ type: core.Output }]
    };

    var AIListHeaderComponent = /** @class */ (function () {
        function AIListHeaderComponent() {
            /**
             * Indicates whether a search bar should be rendered in the list header.
             */
            this.hasSearch = false;
            /**
             * If a `hasSearch` is true, this is emitted when search value is changed.
             */
            this.onSearch = new core.EventEmitter();
        }
        return AIListHeaderComponent;
    }());
    AIListHeaderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-list-header',
                    template: "\n    <div class=\"iot--list-header-container\">\n      <div class=\"iot--list-header\">\n        <div class=\"iot--list-header--title\">\n          {{ title }}\n        </div>\n      </div>\n      <div *ngIf=\"hasSearch\" class=\"iot--list-header--search\">\n        <ibm-search\n          placeholder=\"search\"\n          (valueChange)=\"onSearch.emit($event)\"\n          (clear)=\"onSearch.emit('')\"\n        >\n        </ibm-search>\n      </div>\n    </div>\n  "
                },] }
    ];
    AIListHeaderComponent.propDecorators = {
        title: [{ type: core.Input }],
        hasSearch: [{ type: core.Input }],
        onSearch: [{ type: core.Output }]
    };

    var AIListItemComponent = /** @class */ (function () {
        function AIListItemComponent(iconService) {
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
            this.itemSelected = new core.EventEmitter();
        }
        AIListItemComponent.prototype.ngOnInit = function () {
            this.iconService.register(icons.ChevronUp16);
            this.iconService.register(icons.Draggable16);
        };
        AIListItemComponent.prototype.handleSelect = function (select) {
            this.item.select(select);
            this.itemSelected.emit();
        };
        return AIListItemComponent;
    }());
    AIListItemComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-list-item',
                    template: "\n    <div\n      role=\"button\"\n      [attr.tabindex]=\"\n        this.item.isSelectable && !this.item.disabled && !this.item.isDraggable ? 0 : undefined\n      \"\n      class=\"iot--list-item\"\n      [ngClass]=\"{\n        'iot--list-item__selectable': item.isSelectable,\n        'iot--list-item__selected': item.selected,\n        'iot--list-item-editable': item.isDraggable,\n        'iot--list-item__large': item.size === 'lg'\n      }\"\n      (click)=\"selectionType === 'single' ? handleSelect(!item.selected) : null\"\n      (keyup.Space)=\"selectionType === 'single' ? handleSelect(!item.selected) : null\"\n    >\n      <div class=\"iot--list-item-editable--drag-preview\">\n        {{ item.value }}\n      </div>\n      <svg\n        *ngIf=\"draggable && item.isDraggable\"\n        class=\"iot--list-item--handle\"\n        [ngClass]=\"{ 'iot--list-item--handle__disabled': item.disabled }\"\n        ibmIcon=\"draggable\"\n        size=\"16\"\n      ></svg>\n      <div\n        *ngIf=\"nestingLevel > 0\"\n        class=\"iot--list-item--nesting-offset\"\n        [ngStyle]=\"{ width: 30 * nestingLevel + 'px' }\"\n      ></div>\n      <div\n        *ngIf=\"item.hasChildren()\"\n        role=\"button\"\n        (click)=\"!item.disabled ? item.expand(!item.expanded) : undefined\"\n        (keyup.Space)=\"!item.disabled ? item.expand(!item.expanded) : undefined\"\n        [tabindex]=\"!item.disabled ? 0 : undefined\"\n        class=\"iot--list-item--expand-icon\"\n        [ngClass]=\"{ 'iot--list-item--expand-icon__disabled': item.disabled }\"\n      >\n        <svg *ngIf=\"!item.expanded\" ibmIcon=\"chevron--down\" size=\"16\"></svg>\n        <svg *ngIf=\"item.expanded\" ibmIcon=\"chevron--up\" size=\"16\"></svg>\n      </div>\n      <div\n        class=\"iot--list-item--content\"\n        [ngClass]=\"{\n          'iot--list-item--content__selected': item.selected,\n          'iot--list-item--content__large': item.size === 'lg'\n        }\"\n      >\n        <div\n          *ngIf=\"item.isSelectable && selectionType === 'multi'\"\n          class=\"iot--list-item--content--icon iot--list-item--content--icon__left\"\n        >\n          <ibm-checkbox\n            (checkedChange)=\"handleSelect($event)\"\n            [checked]=\"item.selected\"\n            [id]=\"item.id + '_checkbox'\"\n            [disabled]=\"item.disabled\"\n            [indeterminate]=\"item.indeterminate\"\n          >\n          </ibm-checkbox>\n        </div>\n        <div\n          class=\"iot--list-item--content--values\"\n          [ngClass]=\"{ 'iot--list-item--content--values__large': item.size === 'lg' }\"\n        >\n          <div\n            class=\"iot--list-item--content--values--main\"\n            [ngClass]=\"{ 'iot--list-item--content--values--main__large': item.size === 'lg' }\"\n          >\n            <div\n              class=\"iot--list-item--content--values--value\"\n              [ngClass]=\"{\n                'iot--list-item--category': item.isCategory,\n                'iot--list-item--content--values__disabled': item.disabled,\n                'iot--list-item--content--values--value__with-actions': item.rowActions\n              }\"\n            >\n              {{ item.value }}\n            </div>\n            <div\n              *ngIf=\"item.secondaryValue !== undefined\"\n              class=\"iot--list-item--content--values--value\"\n              [ngClass]=\"{\n                'iot--list-item--content--values__disabled': item.disabled,\n                'iot--list-item--content--values--value__large': item.size === 'lg'\n              }\"\n            >\n              {{ item.secondaryValue }}\n            </div>\n            <div *ngIf=\"item.rowActions\" class=\"iot--list-item--content--row-actions\">\n              <ng-container\n                [ngTemplateOutlet]=\"item.rowActions\"\n                [ngTemplateOutletContext]=\"item.rowActionsContext\"\n              >\n              </ng-container>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  "
                },] }
    ];
    AIListItemComponent.ctorParameters = function () { return [
        { type: carbonComponentsAngular.IconService }
    ]; };
    AIListItemComponent.propDecorators = {
        item: [{ type: core.Input }],
        nestingLevel: [{ type: core.Input }],
        draggable: [{ type: core.Input }],
        isSelectable: [{ type: core.Input }],
        selectionType: [{ type: core.Input }],
        itemSelected: [{ type: core.Output }]
    };

    var AIListTargetDirective = /** @class */ (function () {
        function AIListTargetDirective() {
            this.targetPosition = 'below';
            this.targetSize = 33;
            this.dropping = new core.EventEmitter();
            this.dragOver = new core.EventEmitter();
            this.dragLeave = new core.EventEmitter();
            this.dragEnter = new core.EventEmitter();
            this.isActive = false;
        }
        Object.defineProperty(AIListTargetDirective.prototype, "isNested", {
            get: function () {
                return this.targetPosition === 'nested';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AIListTargetDirective.prototype, "isAbove", {
            get: function () {
                return this.targetPosition === 'above';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AIListTargetDirective.prototype, "isBelow", {
            get: function () {
                return this.targetPosition === 'below';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AIListTargetDirective.prototype, "isNestedOver", {
            get: function () {
                return this.targetPosition === 'nested' && this.isActive;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AIListTargetDirective.prototype, "isAboveOver", {
            get: function () {
                return this.targetPosition === 'above' && this.isActive;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AIListTargetDirective.prototype, "isBelowOver", {
            get: function () {
                return this.targetPosition === 'below' && this.isActive;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AIListTargetDirective.prototype, "height", {
            get: function () {
                return this.targetSize + "%";
            },
            enumerable: false,
            configurable: true
        });
        AIListTargetDirective.prototype.handleDragEnter = function (event) {
            this.isActive = true;
            this.dragEnter.emit(event);
        };
        AIListTargetDirective.prototype.dragover = function (event) {
            this.dragOver.emit(event);
        };
        AIListTargetDirective.prototype.handleDrop = function (event) {
            this.dropping.emit(event);
        };
        AIListTargetDirective.prototype.handleLeave = function (event) {
            this.isActive = false;
            this.dragLeave.emit(event);
        };
        return AIListTargetDirective;
    }());
    AIListTargetDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[aiListTarget]',
                },] }
    ];
    AIListTargetDirective.propDecorators = {
        targetPosition: [{ type: core.Input }],
        targetSize: [{ type: core.Input }],
        dropping: [{ type: core.Output }],
        dragOver: [{ type: core.Output }],
        dragLeave: [{ type: core.Output }],
        dragEnter: [{ type: core.Output }],
        isNested: [{ type: core.HostBinding, args: ['class.iot--list-item-editable--drop-target-nested',] }],
        isAbove: [{ type: core.HostBinding, args: ['class.iot--list-item-editable--drop-target-above',] }],
        isBelow: [{ type: core.HostBinding, args: ['class.iot--list-item-editable--drop-target-below',] }],
        isNestedOver: [{ type: core.HostBinding, args: ['class.iot--list-item-editable--drop-target-nested__over',] }],
        isAboveOver: [{ type: core.HostBinding, args: ['class.iot--list-item-editable--drop-target-above__over',] }],
        isBelowOver: [{ type: core.HostBinding, args: ['class.iot--list-item-editable--drop-target-below__over',] }],
        height: [{ type: core.HostBinding, args: ['style.height',] }],
        handleDragEnter: [{ type: core.HostListener, args: ['dragenter', ['$event'],] }],
        dragover: [{ type: core.HostListener, args: ['dragover', ['$event'],] }],
        handleDrop: [{ type: core.HostListener, args: ['drop', ['$event'],] }],
        handleLeave: [{ type: core.HostListener, args: ['dragleave', ['event'],] }]
    };

    var AIListItemWrapperComponent = /** @class */ (function () {
        function AIListItemWrapperComponent() {
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
            this.dragStart = new core.EventEmitter();
            this.dragEnd = new core.EventEmitter();
            this.dragOverAbove = new core.EventEmitter();
            this.dragOverBelow = new core.EventEmitter();
            this.dragOverNested = new core.EventEmitter();
            this.droppedBelow = new core.EventEmitter();
            this.droppedAbove = new core.EventEmitter();
            this.droppedNested = new core.EventEmitter();
        }
        return AIListItemWrapperComponent;
    }());
    AIListItemWrapperComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-list-item-wrapper',
                    template: "\n    <div data-floating-menu-container=\"true\" class=\"iot--list-item-parent\">\n      <div\n        *ngIf=\"draggable && !disabled; else listItem\"\n        class=\"iot--list-item-editable--drag-container\"\n        role=\"listitem\"\n        [draggable]=\"true\"\n        (dragstart)=\"dragStart.emit($event)\"\n        (dragend)=\"dragEnd.emit($event)\"\n      >\n        <div\n          class=\"iot--list-item-editable--drop-targets\"\n          [ngClass]=\"{ 'iot--list-item__large': size === 'lg' }\"\n          *ngIf=\"isDragging\"\n        >\n          <div\n            aiListTarget\n            targetPosition=\"nested\"\n            (dropping)=\"droppedNested.emit($event)\"\n            (dragOver)=\"dragOverNested.emit($event)\"\n            [targetSize]=\"100\"\n          ></div>\n          <div\n            aiListTarget\n            targetPosition=\"above\"\n            (dropping)=\"droppedAbove.emit($event)\"\n            (dragOver)=\"dragOverAbove.emit($event)\"\n          ></div>\n          <div\n            aiListTarget\n            targetPosition=\"below\"\n            (dropping)=\"droppedBelow.emit($event)\"\n            (dragOver)=\"dragOverBelow.emit($event)\"\n          ></div>\n        </div>\n        <ng-container [ngTemplateOutlet]=\"listItem\"></ng-container>\n      </div>\n    </div>\n\n    <ng-template #listItem>\n      <ng-content></ng-content>\n    </ng-template>\n  "
                },] }
    ];
    AIListItemWrapperComponent.propDecorators = {
        draggable: [{ type: core.Input }],
        isDragging: [{ type: core.Input }],
        isSelectable: [{ type: core.Input }],
        size: [{ type: core.Input }],
        disabled: [{ type: core.Input }],
        dragStart: [{ type: core.Output }],
        dragEnd: [{ type: core.Output }],
        dragOverAbove: [{ type: core.Output }],
        dragOverBelow: [{ type: core.Output }],
        dragOverNested: [{ type: core.Output }],
        droppedBelow: [{ type: core.Output }],
        droppedAbove: [{ type: core.Output }],
        droppedNested: [{ type: core.Output }]
    };

    var ListModule = /** @class */ (function () {
        function ListModule() {
        }
        return ListModule;
    }());
    ListModule.decorators = [
        { type: core.NgModule, args: [{
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
                    imports: [common.CommonModule, carbonComponentsAngular.IconModule, carbonComponentsAngular.CheckboxModule, carbonComponentsAngular.SearchModule],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AIListComponent = AIListComponent;
    exports.AIListHeaderComponent = AIListHeaderComponent;
    exports.AIListItem = AIListItem;
    exports.AIListItemComponent = AIListItemComponent;
    exports.AIListItemWrapperComponent = AIListItemWrapperComponent;
    exports.AIListTargetDirective = AIListTargetDirective;
    exports.ListModule = ListModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-list.umd.js.map
