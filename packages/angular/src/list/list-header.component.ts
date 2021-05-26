import { Component, Input } from '@angular/core';

@Component({
  selector: 'ai-list-header',
  template: `
    <div class="iot--list-header-container">
      <div class="iot--list-header">
        <div class="iot--list-header--title">
          {{ title }}
        </div>
      </div>
    </div>
  `,
})

export class ListHeaderComponent {
  @Input() title;
}
