/**
 *
 * @ai-apps/angular v2.155.1 | card-content.component.d.ts
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


import { AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { CardService } from './card.service';
export declare class CardContentComponent implements OnInit, AfterViewInit {
    protected cardService: CardService;
    protected elementRef: ElementRef;
    contentClass: boolean;
    expandedClass: boolean;
    /**
     * expects string | TemplateRef<any>
     */
    emptyText: any;
    isEmpty: boolean;
    constructor(cardService: CardService, elementRef: ElementRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    isTemplate(value: any): boolean;
}
