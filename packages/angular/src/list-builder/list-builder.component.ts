import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ArrowRight16, Subtract16 } from '@carbon/icons';
import { AIListItem } from '@ai-apps/angular/list';
import { IconService } from 'carbon-components-angular';
import { ListBuilderItem } from './list-builder-item.class';

@Component({
  selector: 'ai-list-builder',
  template: `
    <div class="iot--list-builder__container">
      <div class="iot--list-builder__all">
        <ai-list-builder-list [listProps]="unselectedListProps" [items]="unselectedListItems">
        </ai-list-builder-list>
      </div>
      <div class="iot--list-builder__selected">
        <ai-list-builder-list [listProps]="selectedListProps" [items]="selectedListItems">
        </ai-list-builder-list>
      </div>
    </div>

    <ng-template #addButton let-addItem="addItem">
      <button ibmButton="ghost" size="sm" [iconOnly]="true" (click)="addItem()">
        <svg
          *ngIf="!addItemButtonIcon"
          class="bx--btn__icon"
          ibmIcon="arrow--right"
          size="16"
        ></svg>
        <ng-container
          *ngIf="addItemButtonIcon"
          [ngTemplateOutlet]="addItemButtonIcon"
        ></ng-container>
      </button>
    </ng-template>

    <ng-template #removeButton let-removeItem="removeItem">
      <button ibmButton="ghost" size="sm" [iconOnly]="true" (click)="removeItem()">
        <svg *ngIf="!removeItemButtonIcon" class="bx--btn__icon" ibmIcon="subtract" size="16"></svg>
        <ng-container
          *ngIf="removeItemButtonIcon"
          [ngTemplateOutlet]="removeItemButtonIcon"
        ></ng-container>
      </button>
    </ng-template>
  `,
})
export class ListBuilderComponent implements OnInit, AfterViewInit {
  @Input() set items(items: ListBuilderItem[]) {
    this.unselectedListItems = [];
    this.selectedListItems = [];
    this._items = items;
    this.createListItems(this._items, this.unselectedListItems, this.selectedListItems);
  }
  /**
   * Props for the unselected list component
   */
  @Input() unselectedListProps: any = {};
  /**
   * Props for the selected list component
   */
  @Input() selectedListProps: any = {};

  /**
   * Icon which is displayed as a row action on the unselected list items.
   */
  @Input() addItemButtonIcon: TemplateRef<any>;
  /**
   * Icon which is displayed as a row action on the selected list items.
   */
  @Input() removeItemButtonIcon: TemplateRef<any>;

  @ViewChild('addButton') addButton: TemplateRef<any>;
  @ViewChild('removeButton') removeButton: TemplateRef<any>;

  /**
   * Items passed into the unselected list. These items should be tied to an item in `selectedListItems`.
   */
  unselectedListItems = [];
  /**
   * Items passed into the selected list. These items should be tied to an item in `unselectedListItems`.
   */
  selectedListItems = [];

  protected _items: ListBuilderItem[] = [];

  constructor(protected iconService: IconService) {}

  ngOnInit() {
    this.iconService.register(Subtract16);
    this.iconService.register(ArrowRight16);
  }

  ngAfterViewInit() {
    // In case items were set before the view was initialized.
    // If an item contains row actions, it needs to wait until the view in initialized
    // before it can reference it.
    this.items = this._items;
  }

  /**
   * Creates unselected and selected list items from `ListBuilderItem`s. The unselected and selected list
   * items are created in a way where they are tied to each other. For example, selecting an unselected
   * list item will cause its associated selected list item to be displayed.
   *
   * The unselected and selected list items are stored in the `unselectedItems` and `selectedItems` parameters.
   */
  protected createListItems(items: ListBuilderItem[], unselectedItems = [], selectedItems = []) {
    items.forEach((item: any) => {
      const unselectedItem = new AIListItem(item.unselectedItemProps);
      const selectedItem = new AIListItem(item.selectedItemProps);

      // Deal with unselected items.
      if (item.addingMethod === 'row-action') {
        unselectedItem.rowActions = this.addButton;
        unselectedItem.rowActionsContext = {
          addItem: () => {
            item.added = true;
            if (item.hideUnselectedItemOnSelect) {
              unselectedItem.hidden = true;
            }
            selectedItem.hidden = false;
          },
        };
      }

      if (item.addingMethod === 'select') {
        // This will be called everytime the select method is called on the list item.
        unselectedItem.onSelectedChange.subscribe((selected: boolean) => {
          item.added = selected;
          selectedItem.hidden = !item.added;
        });
      }

      // Deal with selected items.
      // NOTE: we may need to add another flag to make the remove button optional on the selected items.
      // NOTE: that would only be viable if `hideUnselectedItemOnSelect` is set to `false`.
      selectedItem.rowActions = this.removeButton;
      selectedItem.rowActionsContext = {
        removeItem: () => {
          item.added = false;
          if (item.addingMethod === 'row-action') {
            unselectedItem.hidden = false;
          }

          if (item.addingMethod === 'select') {
            unselectedItem.select(false, true);
          }
          selectedItem.hidden = true;
        },
      };

      unselectedItems.push(unselectedItem);
      selectedItems.push(selectedItem);

      if (item.children && item.children.length > 0) {
        this.createListItems(item.children, unselectedItem.items, selectedItem.items);
      }
    });
  }
}
