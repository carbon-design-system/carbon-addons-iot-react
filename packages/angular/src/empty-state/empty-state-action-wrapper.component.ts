import { Component } from '@angular/core';

@Component({
  selector: 'ai-empty-state-action',
  template: `
    <div class="iot--empty-state--action">
      <ng-content></ng-content>
    </div>
  `,
})
export class EmptyStateActionComponent {}
