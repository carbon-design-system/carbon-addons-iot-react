import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ai-card-toolbar',
  template: ` <ng-content></ng-content> `,
})
export class CardToolbarComponent {
  @HostBinding('class.iot--card--toolbar') toolbarClass = true;
}
