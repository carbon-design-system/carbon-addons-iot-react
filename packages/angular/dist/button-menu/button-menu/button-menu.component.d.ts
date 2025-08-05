/**
 *
 * @ai-apps/angular v2.155.1 | button-menu.component.d.ts
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


import { AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { DocumentService } from 'carbon-components-angular';
export declare class ButtonMenuComponent implements AfterViewInit {
    protected elementRef: ElementRef;
    protected documentService: DocumentService;
    label: string;
    open: boolean;
    openIcon: string;
    closeIcon: string;
    iconOnly: boolean;
    split: boolean;
    alignMenu: 'left' | 'right';
    placeMenu: 'top' | 'bottom';
    openChange: EventEmitter<boolean>;
    primaryClick: EventEmitter<MouseEvent>;
    position: {
        top: number;
        left: number;
    };
    constructor(elementRef: ElementRef, documentService: DocumentService);
    ngAfterViewInit(): void;
    toggleMenu(): void;
    handleKeys(event: KeyboardEvent): void;
}
