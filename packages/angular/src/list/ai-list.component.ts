import { Component, Input } from '@angular/core';

import { AIListModel, SelectionType } from './ai-list-model.class';

@Component({
  selector: 'ai-list',
  template: `
    <div class="iot--list">
      <div class="iot--list--content">
        <ng-template
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{ $implicit: model }"
        >
        </ng-template>
      </div>
    </div>
    <ng-template #listItemTemplateRef let-item let-index="index">
      <ng-container *ngIf="item.value">
        <ai-list-item
          [value]="item.value"
          [nestingLevel]="item.nestingLevel"
          [hasChildren]="model.hasChildren(item)"
          [isSelectable]="item.isSelectable"
          [selectionType]="selectionType"
          [expanded]="model.isItemExpanded(item.id)"
          [selected]="model.isItemSelected(item.id)"
          [indeterminate]="model.isItemIndeterminate(item.id)"
          (expansionClick)="model.handleExpansion(item.id)"
          (itemSelected)="model.handleSelect(item.id, !model.isItemSelected(item.id), selectionType)"
        >
        </ai-list-item>
      </ng-container>
      <ng-container *ngIf="model.hasChildren(item) && model.isItemExpanded(item.id)">
        <ng-template ngFor [ngForOf]="item.items" [ngForTemplate]="listItemTemplateRef">
        </ng-template>
      </ng-container>
    </ng-template>
  `,
})

export class AIListComponent {
  @Input() model: AIListModel;

  @Input() selectionType: SelectionType;
}
