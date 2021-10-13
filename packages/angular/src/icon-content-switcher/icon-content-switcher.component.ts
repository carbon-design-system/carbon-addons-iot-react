import { Component, ContentChildren, QueryList } from '@angular/core';
import { ContentSwitcher } from 'carbon-components-angular';
import { IconContentSwitcherOption } from '.';

/**
 * [See demo](../../?path=/story/components-icon-content-switcher--basic)
 *
 * ```html
 * <ai-icon-content-switcher (selected)="selected($event)">
 *		<button aiIconContentOption>First section</button>
 *		<button aiIconContentOption>Second section</button>
 *		<button aiIconContentOption>Third section</button>
 *	</ai-icon-content-switcher>
 *	```
 *
 * <example-url>../../iframe.html?id=components-icon-content-switcher--basic</example-url>
 */
@Component({
  selector: 'ai-content-switcher',
  template: `
    <div
      [attr.aria-label]="ariaLabel"
      class="bx--content-switcher iot--content-switcher--icon"
      [class.bx--content-switcher--light]="theme === 'light'"
      role="tablist"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class IconContentSwitcher extends ContentSwitcher {
  @ContentChildren(IconContentSwitcherOption) options: QueryList<IconContentSwitcherOption>;
}
