/**
 *
 * @ai-apps/angular v2.155.1 | card.service.d.ts
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


import { OnDestroy } from '@angular/core';
/**
 * Service for data and config shared between card components
 */
export declare class CardService implements OnDestroy {
    /**
     * Overall height of the card
     */
    private height;
    private headerHeight;
    private expandedSubject;
    private subscriptions;
    /**
     * Set the overall height of the card in pixels
     *
     * @param height height specified in pixels
     */
    setCardHeight(height: number): void;
    /**
     * Get the overall height of the card as a formatted string
     *
     * @returns the height as a string ex. `'200px'`
     */
    getCardHeight(): string;
    /**
     * Get the height of just the content area as a formatted string
     *
     * @returns the height as a string ex. `'200px'`
     */
    getContentHeight(): string;
    setExpanded(isExpanded: boolean): void;
    getExpanded(): boolean;
    onExpand(listener: (isExpanded: boolean) => void): void;
    ngOnDestroy(): void;
}
