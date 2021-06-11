import { Component, Input } from '@angular/core';

import { ListModel } from './list-model.class';

@Component({
  selector: 'ai-list',
  template: `
    <div class="iot--list">
      <ai-list-header
        [title]="title"
        [search]="true"
        (onSearch)="onSearch($event)">
      </ai-list-header>
      <div class="iot--list--content">
        <ng-template
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{ $implicit: model }">
        </ng-template>
      </div>
    </div>

    <ng-template #listItemTemplateRef let-data let-index="index">
      <ng-container *ngIf="data.value">
        <ai-list-item
          [listItem]="data"
          [isSelectable]="isSelectable"
          (checkedChange)="onSelect($event)"
          (expansionClick)="onExpand($event)">
        </ai-list-item>
      </ng-container>

      <ng-container *ngIf="data.items && data.items.length && data.expanded">
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
  @Input() title: string;
  @Input() isSelectable: boolean;
  @Input() search: boolean;

  onExpand(id: string) {
    this.model.expandListItem(id);
  }

  onSelect({ id, checked }) {
    this.model.selectListItem(id, checked);
  }

  onSearch(searchString: string) {
    this.model.search(searchString);
  }
}
