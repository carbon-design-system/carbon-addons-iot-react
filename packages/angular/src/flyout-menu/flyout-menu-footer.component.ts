import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

/**
 * html:
 * ```
 * <ai-flyout-menu-footer>
 *	<button ibmButton="secondary">Cancel</button>
 *	<button ibmButton>Apply</button>
 * </ai-flyout-menu-footer>
 * ```
 */
@Component({
  selector: 'ai-flyout-menu-footer',
  template: ` <ng-content></ng-content> `,
  encapsulation: ViewEncapsulation.None,
})
export class FlyoutMenuFooter {
  @HostBinding('class.iot--flyout-menu__bottom-container') className = true;
}
