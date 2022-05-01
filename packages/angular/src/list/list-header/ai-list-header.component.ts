import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'ai-list-header',
  template: `
    <div class="iot--list-header-container">
      <div class="iot--list-header">
        <div class="iot--list-header--title">
          {{ title }}
        </div>
        <div *ngIf="buttons" class="iot--list-header--btn-container">
          <ng-container [ngTemplateOutlet]="buttons" [ngTemplateOutletContext]="buttonsContext">
          </ng-container>
        </div>
      </div>
      <div *ngIf="hasSearch" class="iot--list-header--search">
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
export class AIListHeaderComponent {
  /**
   * Title to be displayed on the list header.
   */
  @Input() title: string;

  /**
   * Indicates whether a search bar should be rendered in the list header.
   */
  @Input() hasSearch = false;

  @Input() buttons: TemplateRef<any>;
  @Input() buttonsContext: any;

  /**
   * If a `hasSearch` is true, this is emitted when search value is changed.
   */
  @Output() onSearch = new EventEmitter<any>();
}
