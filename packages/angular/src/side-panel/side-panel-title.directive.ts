import { Directive, HostBinding } from '@angular/core';

/**
 * selector: `aiSidePanelTitle`
 */
@Directive({
  selector: '[aiSidePanelTitle]',
  exportAs: 'aiSidePanelTitle',
})
export class SidePanelTitleDirective {
  @HostBinding('class.iot--side-panel-title') titleClass = true;
}
