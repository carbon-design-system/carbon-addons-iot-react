import { Directive, HostBinding, Input } from '@angular/core';
import { ContentSwitcherOption } from 'carbon-components-angular';

/**
 * selector: `aiIconContentOption`
 */
@Directive({
  selector: '[aiIconContentOption]',
  exportAs: 'aiIconContentOption',
})
export class IconContentSwitcherOption extends ContentSwitcherOption {
  @HostBinding('class') mainClass = `iot--icon-switch
    bx--btn
    bx--btn--secondary
    bx--tooltip--hidden
    bx--btn--icon-only
    bx--tooltip__trigger
    bx--tooltip--a11y
    bx--btn--icon-only--top
    bx--tooltip--align-center`;
  @HostBinding('class.iot--icon-switch--selected')
  @HostBinding('class.bx--content-switcher--selected')
  selectedClass = false;
  @HostBinding('class.iot--icon-switch--unselected') get unselectedClass() {
    return !this.selectedClass;
  }

  @HostBinding('class.iot--icon-switch--default') get isDefaultSize() {
    return this.size === 'md';
  }

  @HostBinding('class.iot--icon-switch--small') get isSmallSize() {
    return this.size === 'sm';
  }

  @HostBinding('class.iot--icon-switch--large') get isLargeSize() {
    return this.size === 'lg';
  }

  @HostBinding('class.iot--icon-switch--light') get isLight() {
    return this.theme === 'light';
  }

  @HostBinding('class.iot--icon-switch--unselected--light') get isUnselectedLight() {
    return this.isLight && !this.selectedClass;
  }

  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() theme: 'light' | 'dark' = 'dark';
}
