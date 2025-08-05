/**
 *
 * @ai-apps/angular v2.155.1 | page-header.component.js
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


import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
/**
 * Adds an item to the end of a `BreadcrumbItem` list to serve as a title for the page header component
 *
 * @param items a list of `BreadcumbItem`s _without_ an item to serve as a title
 * @param title the title to add to the list of items
 */
export const itemsWithTitle = (items, title) => {
    return [
        ...items,
        {
            content: title,
            href: '',
        },
    ];
};
/**
 * Page header
 *
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-page-header component
 *
 * The page header component uses the _last_ item in the `items` array as the title.
 *
 * For conveninence we provide a `itemsWithTitle` function that will take an existing
 * set of breadcrumb items and add one to the end to act as a title.
 *
 * Example:
 *
 * component.ts
 * ```typescript
 * items = itemsWithTitle([
 * 	{
 * 		content: "one",
 * 		href: "first link"
 * 	},
 * 	{
 * 		content: "two",
 * 		href: "second link"
 * 	}
 * ], "Hello World");
 * ```
 *
 * component.html
 * ```html
 * <sc-page-header [items]="currentPath"></sc-page-header>
 * ```
 */
export class PageHeaderComponent {
    constructor() {
        /**
         * Items to display in the header. The last item is used as the title
         */
        this.items = [];
        /**
         * Emits the navigation status promise when the link is activated
         *
         * (event forwarded from the underlying `ibm-breadcrumb`)
         */
        this.navigation = new EventEmitter();
        /**
         * The page header sits on the grid by default.
         * Set to `false` if you need to manually position the page header using the default padding values
         */
        this.onGrid = true;
    }
    get title() {
        return this.items[this.items.length - 1].content;
    }
    get breadcrumbItems() {
        return this.items.slice(0, this.items.length - 1);
    }
    get hasBreadcrumbs() {
        return this.items.length > 1;
    }
}
PageHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-page-header',
                template: `
    <div [ngClass]="{ 'bx--col': onGrid }">
      <ibm-breadcrumb
        class="breadcrumbs"
        [ariaLabel]="ariaLabel"
        [items]="breadcrumbItems"
        (navigation)="navigation.emit($event)"
      >
      </ibm-breadcrumb>
      <h2>{{ title }}</h2>
    </div>
  `,
                styles: [":host{background:#f4f4f4;display:block;max-height:6.25rem;padding:2rem}:host.has-breadcrumbs{padding-top:1rem}h2{font-size:1.75rem;line-height:2.25rem}:host.bx--row{padding-left:0;padding-right:0}:host{max-height:unset}"]
            },] }
];
PageHeaderComponent.propDecorators = {
    items: [{ type: Input }],
    ariaLabel: [{ type: Input }],
    navigation: [{ type: Output }],
    onGrid: [{ type: HostBinding, args: ['class.bx--row',] }, { type: Input }],
    hasBreadcrumbs: [{ type: HostBinding, args: ['class.has-breadcrumbs',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Rvb2xraXQvcGFnZS1oZWFkZXIvcGFnZS1oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3BGOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLENBQUMsS0FBdUIsRUFBRSxLQUFhLEVBQW9CLEVBQUU7SUFDekYsT0FBTztRQUNMLEdBQUcsS0FBSztRQUNSO1lBQ0UsT0FBTyxFQUFFLEtBQUs7WUFDZCxJQUFJLEVBQUUsRUFBRTtTQUNUO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Qkc7QUFpQkgsTUFBTSxPQUFPLG1CQUFtQjtJQWhCaEM7UUFpQkU7O1dBRUc7UUFDTSxVQUFLLEdBQXFCLEVBQUUsQ0FBQztRQVF0Qzs7OztXQUlHO1FBQ08sZUFBVSxHQUFHLElBQUksWUFBWSxFQUFvQixDQUFDO1FBRTVEOzs7V0FHRztRQUNvQyxXQUFNLEdBQUcsSUFBSSxDQUFDO0lBYXZELENBQUM7SUFYQyxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFJLGVBQWU7UUFDakIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELElBQTBDLGNBQWM7UUFDdEQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7O1lBbkRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0dBV1Q7O2FBRUY7OztvQkFLRSxLQUFLO3dCQU1MLEtBQUs7eUJBT0wsTUFBTTtxQkFNTixXQUFXLFNBQUMsZUFBZSxjQUFHLEtBQUs7NkJBVW5DLFdBQVcsU0FBQyx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyZWFkY3J1bWJJdGVtIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhci9icmVhZGNydW1iJztcblxuLyoqXG4gKiBBZGRzIGFuIGl0ZW0gdG8gdGhlIGVuZCBvZiBhIGBCcmVhZGNydW1iSXRlbWAgbGlzdCB0byBzZXJ2ZSBhcyBhIHRpdGxlIGZvciB0aGUgcGFnZSBoZWFkZXIgY29tcG9uZW50XG4gKlxuICogQHBhcmFtIGl0ZW1zIGEgbGlzdCBvZiBgQnJlYWRjdW1iSXRlbWBzIF93aXRob3V0XyBhbiBpdGVtIHRvIHNlcnZlIGFzIGEgdGl0bGVcbiAqIEBwYXJhbSB0aXRsZSB0aGUgdGl0bGUgdG8gYWRkIHRvIHRoZSBsaXN0IG9mIGl0ZW1zXG4gKi9cbmV4cG9ydCBjb25zdCBpdGVtc1dpdGhUaXRsZSA9IChpdGVtczogQnJlYWRjcnVtYkl0ZW1bXSwgdGl0bGU6IHN0cmluZyk6IEJyZWFkY3J1bWJJdGVtW10gPT4ge1xuICByZXR1cm4gW1xuICAgIC4uLml0ZW1zLFxuICAgIHtcbiAgICAgIGNvbnRlbnQ6IHRpdGxlLFxuICAgICAgaHJlZjogJycsXG4gICAgfSxcbiAgXTtcbn07XG5cbi8qKlxuICogUGFnZSBoZWFkZXJcbiAqXG4gKiAqKldhcm5pbmc6KiogVGhpcyBjb21wb25lbnQgd2lsbCBiZSBkZXByZWNhdGVkIGluIHRoZSBmdXR1cmUgaW4gZmF2b3VyIG9mIGEgc3BlYyBjb21wbGlhbnQgYWktcGFnZS1oZWFkZXIgY29tcG9uZW50XG4gKlxuICogVGhlIHBhZ2UgaGVhZGVyIGNvbXBvbmVudCB1c2VzIHRoZSBfbGFzdF8gaXRlbSBpbiB0aGUgYGl0ZW1zYCBhcnJheSBhcyB0aGUgdGl0bGUuXG4gKlxuICogRm9yIGNvbnZlbmluZW5jZSB3ZSBwcm92aWRlIGEgYGl0ZW1zV2l0aFRpdGxlYCBmdW5jdGlvbiB0aGF0IHdpbGwgdGFrZSBhbiBleGlzdGluZ1xuICogc2V0IG9mIGJyZWFkY3J1bWIgaXRlbXMgYW5kIGFkZCBvbmUgdG8gdGhlIGVuZCB0byBhY3QgYXMgYSB0aXRsZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGNvbXBvbmVudC50c1xuICogYGBgdHlwZXNjcmlwdFxuICogaXRlbXMgPSBpdGVtc1dpdGhUaXRsZShbXG4gKiBcdHtcbiAqIFx0XHRjb250ZW50OiBcIm9uZVwiLFxuICogXHRcdGhyZWY6IFwiZmlyc3QgbGlua1wiXG4gKiBcdH0sXG4gKiBcdHtcbiAqIFx0XHRjb250ZW50OiBcInR3b1wiLFxuICogXHRcdGhyZWY6IFwic2Vjb25kIGxpbmtcIlxuICogXHR9XG4gKiBdLCBcIkhlbGxvIFdvcmxkXCIpO1xuICogYGBgXG4gKlxuICogY29tcG9uZW50Lmh0bWxcbiAqIGBgYGh0bWxcbiAqIDxzYy1wYWdlLWhlYWRlciBbaXRlbXNdPVwiY3VycmVudFBhdGhcIj48L3NjLXBhZ2UtaGVhZGVyPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NjLXBhZ2UtaGVhZGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IFtuZ0NsYXNzXT1cInsgJ2J4LS1jb2wnOiBvbkdyaWQgfVwiPlxuICAgICAgPGlibS1icmVhZGNydW1iXG4gICAgICAgIGNsYXNzPVwiYnJlYWRjcnVtYnNcIlxuICAgICAgICBbYXJpYUxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgIFtpdGVtc109XCJicmVhZGNydW1iSXRlbXNcIlxuICAgICAgICAobmF2aWdhdGlvbik9XCJuYXZpZ2F0aW9uLmVtaXQoJGV2ZW50KVwiXG4gICAgICA+XG4gICAgICA8L2libS1icmVhZGNydW1iPlxuICAgICAgPGgyPnt7IHRpdGxlIH19PC9oMj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vcGFnZS1oZWFkZXIuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBQYWdlSGVhZGVyQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIEl0ZW1zIHRvIGRpc3BsYXkgaW4gdGhlIGhlYWRlci4gVGhlIGxhc3QgaXRlbSBpcyB1c2VkIGFzIHRoZSB0aXRsZVxuICAgKi9cbiAgQElucHV0KCkgaXRlbXM6IEJyZWFkY3J1bWJJdGVtW10gPSBbXTtcblxuICAvKipcbiAgICogQWNjZXNzaWJsZSBsYWJlbCBmb3IgdGhlIHVuZGVybHlpbmcgYDxuYXY+PC9uYXY+YCBlbGVtZW50IHRoYXQgdGhlIGJyZWFkY3J1bWJcbiAgICogaXRlbXMgcmVzaWRlIGluXG4gICAqL1xuICBASW5wdXQoKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKipcbiAgICogRW1pdHMgdGhlIG5hdmlnYXRpb24gc3RhdHVzIHByb21pc2Ugd2hlbiB0aGUgbGluayBpcyBhY3RpdmF0ZWRcbiAgICpcbiAgICogKGV2ZW50IGZvcndhcmRlZCBmcm9tIHRoZSB1bmRlcmx5aW5nIGBpYm0tYnJlYWRjcnVtYmApXG4gICAqL1xuICBAT3V0cHV0KCkgbmF2aWdhdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8UHJvbWlzZTxib29sZWFuPj4oKTtcblxuICAvKipcbiAgICogVGhlIHBhZ2UgaGVhZGVyIHNpdHMgb24gdGhlIGdyaWQgYnkgZGVmYXVsdC5cbiAgICogU2V0IHRvIGBmYWxzZWAgaWYgeW91IG5lZWQgdG8gbWFudWFsbHkgcG9zaXRpb24gdGhlIHBhZ2UgaGVhZGVyIHVzaW5nIHRoZSBkZWZhdWx0IHBhZGRpbmcgdmFsdWVzXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmJ4LS1yb3cnKSBASW5wdXQoKSBvbkdyaWQgPSB0cnVlO1xuXG4gIGdldCB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtc1t0aGlzLml0ZW1zLmxlbmd0aCAtIDFdLmNvbnRlbnQ7XG4gIH1cblxuICBnZXQgYnJlYWRjcnVtYkl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLnNsaWNlKDAsIHRoaXMuaXRlbXMubGVuZ3RoIC0gMSk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmhhcy1icmVhZGNydW1icycpIGdldCBoYXNCcmVhZGNydW1icygpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPiAxO1xuICB9XG59XG4iXX0=