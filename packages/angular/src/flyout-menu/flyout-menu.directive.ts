import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
  ViewContainerRef,
  HostBinding,
} from '@angular/core';
import { EventService } from 'carbon-components-angular/utils';
import { TooltipDirective, DialogService } from 'carbon-components-angular';
import { FlyoutMenuPane } from './flyout-menu-pane.component';

/**
 * selector: `aiFlyoutMenu`
 */
@Directive({
  selector: '[aiFlyoutMenu]',
  exportAs: 'aiFlyoutMenu',
  providers: [DialogService],
})
export class FlyoutMenuDirective extends TooltipDirective {
  /**
   * The string or template content to be exposed by the tooltip.
   */
  @Input() aiFlyoutMenu: string | TemplateRef<any>;
  /**
   * Controls wether the overflow menu is flipped
   */
  @Input() flip = false;
  @HostBinding('class.iot--flyout-menu') menuClass = true;
  @HostBinding('class.iot--flyout-menu__open') get openClass() {
    return this.isOpen;
  }
  @HostBinding('class.iot--flyout-menu__bottom') get menuBottomClass() {
    return this.placement === 'bottom';
  }
  @HostBinding('class.iot--flyout-menu__top') get menuTopClass() {
    return this.placement === 'top';
  }

  /**
   * Creates an instance of `TooltipDirective`.
   */
  constructor(
    protected elementRef: ElementRef,
    protected viewContainerRef: ViewContainerRef,
    protected dialogService: DialogService,
    protected eventService: EventService
  ) {
    super(elementRef, viewContainerRef, dialogService, eventService);
    dialogService.setContext({ component: FlyoutMenuPane });
  }

  updateConfig() {
    this.dialogConfig.content = this.aiFlyoutMenu;
    this.dialogConfig.flip = this.flip;
    this.dialogConfig.offset = this.offset;
    this.dialogConfig.wrapperClass = this.wrapperClass;
    this.dialogConfig.placement = this.placement;
  }
}
