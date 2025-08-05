/**
 *
 * @ai-apps/angular v2.155.1 | page-header.component.d.ts
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
import { BreadcrumbItem } from 'carbon-components-angular/breadcrumb';
/**
 * Adds an item to the end of a `BreadcrumbItem` list to serve as a title for the page header component
 *
 * @param items a list of `BreadcumbItem`s _without_ an item to serve as a title
 * @param title the title to add to the list of items
 */
export declare const itemsWithTitle: (items: BreadcrumbItem[], title: string) => BreadcrumbItem[];
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
export declare class PageHeaderComponent {
    /**
     * Items to display in the header. The last item is used as the title
     */
    items: BreadcrumbItem[];
    /**
     * Accessible label for the underlying `<nav></nav>` element that the breadcrumb
     * items reside in
     */
    ariaLabel: string;
    /**
     * Emits the navigation status promise when the link is activated
     *
     * (event forwarded from the underlying `ibm-breadcrumb`)
     */
    navigation: EventEmitter<Promise<boolean>>;
    /**
     * The page header sits on the grid by default.
     * Set to `false` if you need to manually position the page header using the default padding values
     */
    onGrid: boolean;
    get title(): string;
    get breadcrumbItems(): BreadcrumbItem[];
    get hasBreadcrumbs(): boolean;
}
