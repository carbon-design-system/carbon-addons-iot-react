import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ai-list-header',
  template: `
    <div class="iot--list-header-container">
      <div class="iot--list-header">
        <div class="iot--list-header--title">
          {{ title }}
        </div>
      </div>
      <div *ngIf="search" class="iot--list-header--search">
        <ibm-search
          placeholder="search"
          (valueChange)="onSearch.emit($event)"
          (clear)="onSearch.emit('')"
        >
        </ibm-search>
      </div>
    </div>
  `,
})
export class ListHeaderComponent {
  @Input() title: string;
  @Input() search: boolean;

  @Output() onSearch = new EventEmitter<any>();
}
