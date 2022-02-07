import { Component } from '@angular/core';

@Component({
  selector: 'ai-empty-state-secondary-action',
  template: `
    <div class="iot--empty-state--link">
      <ng-content></ng-content>
    </div>
  `,
})
export class EmptyStateSecondaryActionComponent {}
