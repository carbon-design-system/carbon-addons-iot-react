import { Component, Input } from '@angular/core';

import { ListModel } from './list-model.class';

@Component({
  selector: 'ai-list',
  template: `
    <div class="iot--list">
      <ai-list-header [title]="title"></ai-list-header>
      <div class="iot--list--content">
        <ng-template
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{ $implicit: model }">
        </ng-template>
      </div>
    </div>

    <ng-template #listItemTemplateRef let-data>
      <ng-container *ngIf="data.value">
        <ai-list-item [value]="data.value" [nestingLevel]="data.nestingLevel"></ai-list-item>
      </ng-container>

      <ng-container *ngIf="data.items && data.items.length">
        <ng-template
          ngFor
          [ngForOf]="data.items"
          [ngForTemplate]="listItemTemplateRef">
        </ng-template>
      </ng-container>
    </ng-template>
  `,
})

export class ListComponent {
  @Input() model: ListModel;
  @Input() title;
}
