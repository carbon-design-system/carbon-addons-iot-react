/**
 *
 * @ai-apps/angular v2.155.1 | tab-header.component.d.ts
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


import { AfterViewInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentService } from 'carbon-components-angular';
import { TabHeader as IBMTabHeader } from 'carbon-components-angular/tabs';
import { Tab, TabAction } from './tab.interface';
export declare class TabHeader extends IBMTabHeader implements OnChanges, AfterViewInit {
    protected elementRef: ElementRef;
    protected documentService: DocumentService;
    tab: Tab;
    actions: TabAction[];
    tabAction: any;
    tabActions: any;
    menuOpen: boolean;
    menuPosition: {
        top: number;
        left: number;
    };
    constructor(elementRef: ElementRef, documentService: DocumentService);
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    onActionClick(action: TabAction): void;
    onTabMenuClick(event: MouseEvent): void;
}
