import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'ai-card-title',
  template: `
    <div class="iot--card--title--text" [attr.title]="text">
      {{ text }}
    </div>
    <ng-content></ng-content>
  `,
})
export class CardTitleComponent {
  @Input() text = '';
  @HostBinding('class.iot--card--title') hostClass = true;
}
