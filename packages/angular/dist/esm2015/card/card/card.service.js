/**
 *
 * @ai-apps/angular v2.155.1 | card.service.js
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


import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
/**
 * Service for data and config shared between card components
 */
export class CardService {
    constructor() {
        /**
         * Overall height of the card
         */
        this.height = null;
        this.headerHeight = 48;
        this.expandedSubject = new BehaviorSubject(false);
        this.subscriptions = new Subscription();
    }
    /**
     * Set the overall height of the card in pixels
     *
     * @param height height specified in pixels
     */
    setCardHeight(height) {
        this.height = height;
    }
    /**
     * Get the overall height of the card as a formatted string
     *
     * @returns the height as a string ex. `'200px'`
     */
    getCardHeight() {
        if (!this.height) {
            return '';
        }
        return `${this.height}px`;
    }
    /**
     * Get the height of just the content area as a formatted string
     *
     * @returns the height as a string ex. `'200px'`
     */
    getContentHeight() {
        if (!this.height) {
            return '';
        }
        return `${this.height - this.headerHeight}px`;
    }
    setExpanded(isExpanded) {
        this.expandedSubject.next(isExpanded);
    }
    getExpanded() {
        return this.expandedSubject.value;
    }
    onExpand(listener) {
        const subscription = this.expandedSubject.subscribe(listener);
        this.subscriptions.add(subscription);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
CardService.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NhcmQvY2FyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFckQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sV0FBVztJQUR4QjtRQUVFOztXQUVHO1FBQ0ssV0FBTSxHQUFXLElBQUksQ0FBQztRQUV0QixpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQUVsQixvQkFBZSxHQUFHLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTdDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQW1EN0MsQ0FBQztJQWpEQzs7OztPQUlHO0lBQ0gsYUFBYSxDQUFDLE1BQWM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhO1FBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDO0lBQ2hELENBQUM7SUFFRCxXQUFXLENBQUMsVUFBbUI7UUFDN0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxRQUFRLENBQUMsUUFBdUM7UUFDOUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ25DLENBQUM7OztZQTdERixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIGRhdGEgYW5kIGNvbmZpZyBzaGFyZWQgYmV0d2VlbiBjYXJkIGNvbXBvbmVudHNcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENhcmRTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIE92ZXJhbGwgaGVpZ2h0IG9mIHRoZSBjYXJkXG4gICAqL1xuICBwcml2YXRlIGhlaWdodDogbnVtYmVyID0gbnVsbDtcblxuICBwcml2YXRlIGhlYWRlckhlaWdodCA9IDQ4O1xuXG4gIHByaXZhdGUgZXhwYW5kZWRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG92ZXJhbGwgaGVpZ2h0IG9mIHRoZSBjYXJkIGluIHBpeGVsc1xuICAgKlxuICAgKiBAcGFyYW0gaGVpZ2h0IGhlaWdodCBzcGVjaWZpZWQgaW4gcGl4ZWxzXG4gICAqL1xuICBzZXRDYXJkSGVpZ2h0KGhlaWdodDogbnVtYmVyKSB7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBvdmVyYWxsIGhlaWdodCBvZiB0aGUgY2FyZCBhcyBhIGZvcm1hdHRlZCBzdHJpbmdcbiAgICpcbiAgICogQHJldHVybnMgdGhlIGhlaWdodCBhcyBhIHN0cmluZyBleC4gYCcyMDBweCdgXG4gICAqL1xuICBnZXRDYXJkSGVpZ2h0KCkge1xuICAgIGlmICghdGhpcy5oZWlnaHQpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIGAke3RoaXMuaGVpZ2h0fXB4YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGhlaWdodCBvZiBqdXN0IHRoZSBjb250ZW50IGFyZWEgYXMgYSBmb3JtYXR0ZWQgc3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBoZWlnaHQgYXMgYSBzdHJpbmcgZXguIGAnMjAwcHgnYFxuICAgKi9cbiAgZ2V0Q29udGVudEhlaWdodCgpIHtcbiAgICBpZiAoIXRoaXMuaGVpZ2h0KSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBgJHt0aGlzLmhlaWdodCAtIHRoaXMuaGVhZGVySGVpZ2h0fXB4YDtcbiAgfVxuXG4gIHNldEV4cGFuZGVkKGlzRXhwYW5kZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmV4cGFuZGVkU3ViamVjdC5uZXh0KGlzRXhwYW5kZWQpO1xuICB9XG5cbiAgZ2V0RXhwYW5kZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kZWRTdWJqZWN0LnZhbHVlO1xuICB9XG5cbiAgb25FeHBhbmQobGlzdGVuZXI6IChpc0V4cGFuZGVkOiBib29sZWFuKSA9PiB2b2lkKSB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy5leHBhbmRlZFN1YmplY3Quc3Vic2NyaWJlKGxpc3RlbmVyKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHN1YnNjcmlwdGlvbik7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19