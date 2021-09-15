import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IconService } from 'carbon-components-angular';
import { AIListComponent } from '../list/ai-list.component';
import { ArrowRight16, Subtract16 } from '@carbon/icons';
import { AIListBuilderItem, AIListBuilderModel } from './list-builder-model.class';

@Component({
  selector: 'ai-list-builder',
  template: `
    <div class="iot--list-builder__container">
      <div class="iot--list-builder__all">
        <ai-list
          #list
          [items]="model.items"
          [selectionType]="addingMethod === 'multi-select' ? 'multi' : undefined"
        >
        </ai-list>
      </div>
      <div class="iot--list-builder__selected">
        <ai-list
          #addedItemsList
          [items]="model.addedItems"
          [itemsDraggable]="addingMethod === 'multi-select' ? 'multi' : undefined"
          [allowDropOutsideParents]="false"
        >
        </ai-list>
      </div>
    </div>

    <ng-template #addButton let-addItem="addItem">
      <button ibmButton="ghost" size="sm" [iconOnly]="true" (click)="addItem()">
        <svg class="bx--btn__icon" ibmIcon="arrow--right" size="16"></svg>
      </button>
    </ng-template>

    <ng-template #removeButton let-removeItem="removeItem">
      <button ibmButton="ghost" size="sm" [iconOnly]="true" (click)="removeItem()">
        <svg class="bx--btn__icon" ibmIcon="subtract" size="16"></svg>
      </button>
    </ng-template>
  `,
})
export class AIListBuilderComponent implements AfterViewInit, OnInit {
  @Input() model: AIListBuilderModel;

  /**
   * Additional list item props to pass into the 'All items' list.
   * TODO: Link docs for list item interface.
   */
  @Input() listProps: any = {};
  /**
   * Additional list item props to pass into the 'Added items' list.
   * TODO: Link docs for list item interface.
   */
  @Input() addedItemsListProps: any = {};

  /**
   * Determines the procedure for adding items.
   */
  @Input() addingMethod: 'multi-select' | 'row-actions' = 'row-actions';

  @ViewChild('addButton') @Input() addButton: TemplateRef<any>;
  @ViewChild('removeButton') @Input() removeButton: TemplateRef<any>;

  @ViewChild('list') listComponent: AIListComponent;
  @ViewChild('addedItemsList') addedItemsListComponent: AIListComponent;

  constructor(protected iconService: IconService) {}

  ngOnInit() {
    this.iconService.register(Subtract16);
    this.iconService.register(ArrowRight16);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      Object.assign(this.listComponent, this.listComponent, this.listProps);
      Object.assign(
        this.addedItemsListComponent,
        this.addedItemsListComponent,
        this.addedItemsListProps
      );
    });

    this.setItemRowActions(
      this.model.items,
      this.addingMethod !== 'multi-select' ? this.addButton : undefined,
      this.removeButton
    );
  }

  protected setItemRowActions(
    items: AIListBuilderItem[],
    rowActions?: TemplateRef<any>,
    addedItemRowActions?: TemplateRef<any>
  ) {
    items.forEach((item) => {
      if (item.hasChildren()) {
        this.setItemRowActions(item.items, rowActions, addedItemRowActions);
      }

      if (item.rowActions === undefined) {
        item.rowActions = rowActions;
      }

      if (item.addedItemRowActions === undefined) {
        item.addedItemRowActions = addedItemRowActions;
      }
    });
  }
}
