/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-target.directive.d.ts
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
export declare class AIListTargetDirective {
    targetPosition: 'nested' | 'above' | 'below';
    targetSize: number;
    dropping: EventEmitter<any>;
    dragOver: EventEmitter<any>;
    dragLeave: EventEmitter<any>;
    dragEnter: EventEmitter<any>;
    isActive: boolean;
    get isNested(): boolean;
    get isAbove(): boolean;
    get isBelow(): boolean;
    get isNestedOver(): boolean;
    get isAboveOver(): boolean;
    get isBelowOver(): boolean;
    get height(): string;
    handleDragEnter(event: DragEvent): void;
    dragover(event: DragEvent): void;
    handleDrop(event: DragEvent): void;
    handleLeave(event: DragEvent): void;
}
