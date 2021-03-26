import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { BreadcrumbItem } from 'carbon-components-angular/breadcrumb';

/**
 * Adds an item to the end of a `BreadcrumbItem` list to serve as a title for the page header component
 *
 * @param items a list of `BreadcumbItem`s _without_ an item to serve as a title
 * @param title the title to add to the list of items
 */
export const itemsWithTitle = (items: BreadcrumbItem[], title: string): BreadcrumbItem[] => {
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
@Component({
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
  styleUrls: ['./page-header.scss'],
})
export class PageHeaderComponent {
  /**
   * Items to display in the header. The last item is used as the title
   */
  @Input() items: BreadcrumbItem[] = [];

  /**
   * Accessible label for the underlying `<nav></nav>` element that the breadcrumb
   * items reside in
   */
  @Input() ariaLabel: string;

  /**
   * Emits the navigation status promise when the link is activated
   *
   * (event forwarded from the underlying `ibm-breadcrumb`)
   */
  @Output() navigation = new EventEmitter<Promise<boolean>>();

  /**
   * The page header sits on the grid by default.
   * Set to `false` if you need to manually position the page header using the default padding values
   */
  @HostBinding('class.bx--row') @Input() onGrid = true;

  get title() {
    return this.items[this.items.length - 1].content;
  }

  get breadcrumbItems() {
    return this.items.slice(0, this.items.length - 1);
  }

  @HostBinding('class.has-breadcrumbs') get hasBreadcrumbs() {
    return this.items.length > 1;
  }
}
