import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
  ViewContainerRef,
  HostBinding,
  Output,
  EventEmitter,
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
  /**
   * Emit the open/close state of the menu
   */
  @Output() flyoutStateChange = new EventEmitter;
  @HostBinding('class.iot--flyout-menu') menuClass = true;
  /**
   * bx--tooltip__trigger is inherited from TooltipDirective and it enables focus indication
   */
  @HostBinding('class.bx--tooltip__trigger') className = false;
  /**
   * Override tabindex to make it not tabbable
   */
  @HostBinding('tabindex') tabIndex = -1;
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
    this.isOpenChange.subscribe( isOpen => {
      this.flyoutStateChange.emit(isOpen);
    })
  }

  updateConfig() {
    this.dialogConfig.content = this.aiFlyoutMenu;
    this.dialogConfig.flip = this.flip;
    this.dialogConfig.offset = this.offset;
    this.dialogConfig.wrapperClass = this.wrapperClass;
    this.dialogConfig.placement = this.placement;
  }
}
