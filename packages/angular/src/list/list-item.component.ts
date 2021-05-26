import { Component, Input } from '@angular/core';

@Component({
  selector: 'ai-list-item',
  template: `
    <div>
      <div class="iot--list-item">
        <div
          *ngIf="nestingLevel"
          class="iot--list-item--nesting-offset"
          [ngStyle]="{'width': 30*nestingLevel + 'px'}">
        </div>
        <div class="iot--list-item--content">
          <div class="iot--list-item--content--values">
            <div class="iot--list-item--content--values--main">
              <div class="iot--list-item--content--values--value">
                {{ value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})

export class ListItemComponent {
  @Input() value;
  @Input() secondaryValue;
  @Input() nestingLevel = 0;
}
