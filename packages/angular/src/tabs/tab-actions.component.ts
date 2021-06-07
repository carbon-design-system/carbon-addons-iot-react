import { Component } from '@angular/core';

@Component({
  selector: 'ai-tab-actions',
  template: ` <ng-content></ng-content> `,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
})
export class TabActionsComponent {}
