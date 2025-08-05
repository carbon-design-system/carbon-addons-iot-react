/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-item-wrapper.component.d.ts
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


import { EventEmitter } from '@angular/core';
export declare class AIListItemWrapperComponent {
    /**
     * Indicates whether or not the item can be dragged into a different position.
     */
    draggable: boolean;
    isDragging: boolean;
    /**
     * Indicates whether or not the list item can be selected.
     */
    isSelectable: boolean;
    size: 'md' | 'lg';
    disabled: boolean;
    dragStart: EventEmitter<any>;
    dragEnd: EventEmitter<any>;
    dragOverAbove: EventEmitter<any>;
    dragOverBelow: EventEmitter<any>;
    dragOverNested: EventEmitter<any>;
    droppedBelow: EventEmitter<any>;
    droppedAbove: EventEmitter<any>;
    droppedNested: EventEmitter<any>;
}
