import { Directive, HostBinding, OnInit, Optional } from "@angular/core";
import { OverflowMenu } from "carbon-components-angular";

/**
 * Directive to apply toolbar specific styles and behavior.
 *
 * May be applied to a button, or other simple element:
 * ```
 * <button aiCardToolbarAction>
 *   <svg ibmIcon="calendar" size="16"></svg>
 * </button>
 * ```
 *
 * It will also apply the correct styles to an `ibm-overflow-menu`. For example:
 * ```
 * <ibm-overflow-menu aiCardToolbarAction>
 *   <ibm-overflow-menu-option>First option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Second option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Third option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Fourth option</ibm-overflow-menu-option>
 * </ibm-overflow-menu>
 * ```
 *
 * For the overflow-menu it will override the `flip`, `offset`, and `triggerClass` to toolbar specific values.
 */
@Directive({
  selector: '[aiCardToolbarAction]'
})
export class CardToolbarActionDirective implements OnInit {
  @HostBinding("class") classList = "iot--card--toolbar-action iot--card--toolbar-svg-wrapper bx--btn--icon-only bx--btn bx--btn--ghost"

  /**
   *
   * @param overflowMenuRef optional ref to the OverflowMenu instance this directive may be attached to
   */
  constructor(@Optional() protected overflowMenuRef: OverflowMenu) {}

  ngOnInit() {
    if (this.overflowMenuRef) {
      this.overflowMenuRef.triggerClass = "iot--card--toolbar-action iot--card--toolbar-svg-wrapper bx--btn--icon-only bx--btn bx--btn--ghost";
      this.overflowMenuRef.flip = true;
      this.overflowMenuRef.offset = { x: 4, y: 0 };
      this.classList = "";
    }
  }
}
