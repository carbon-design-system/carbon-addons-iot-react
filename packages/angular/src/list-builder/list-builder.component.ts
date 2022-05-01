import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ArrowRight16, Subtract16 } from '@carbon/icons';
import { AIListItem, SelectionType } from '@ai-apps/angular/list';
import { IconService } from 'carbon-components-angular';
import { ListBuilderItem } from './list-builder-item.class';
import { Subscription } from 'rxjs';

const getAddedItems = (items: ListBuilderItem[]) => {
  return items.reduce(
    (displayedItems: ListBuilderItem[], item: ListBuilderItem) =>
      item.added
        ? [
            ...displayedItems,
            {
              ...item,
              children: item.items && item.items.length > 0 ? getAddedItems(item.items) : [],
            },
          ]
        : displayedItems,
    []
  );
};

@Component({
  selector: 'ai-list-builder',
  template: `
    <div class="iot--list-builder__container">
      <div class="iot--list-builder__all">
        <ai-list
          [items]="unselectedListItems"
          [title]="unselectedListTitle"
          [itemsDraggable]="unselectedListItemsDraggable"
          [allowDropOutsideParents]="unselectedListAllowDropOutsideParents"
          [selectionType]="unselectedListSelectionType"
          [headerButtons]="unselectedListHeaderButtons"
          [headerButtonsContext]="unselectedListHeaderButtonsContext"
        >
        </ai-list>
      </div>
      <div class="iot--list-builder__selected">
        <ai-list
          [items]="selectedListItems"
          [title]="selectedListTitle"
          [itemsDraggable]="selectedListItemsDraggable"
          [allowDropOutsideParents]="selectedListAllowDropOutsideParents"
          [allowDropOutsideParents]="false"
          [selectionType]="selectedListSelectionType"
          [headerButtons]="selectedListHeaderButtons"
          [headerButtonsContext]="selectedListHeaderButtonsContext"
        >
        </ai-list>
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
export class ListBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() set items(items: ListBuilderItem[]) {
    this.unselectedListItems = [];
    this.selectedListItems = [];
    this._items = items;
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.createListItems(this._items, this.unselectedListItems, this.selectedListItems);
    this.unselectedListItemsChange.emit(this.unselectedListItems);
    this.selectedListItemsChange.emit(this.selectedListItems);
  }

  @Input() unselectedListTitle = '';
  @Input() unselectedListItemsDraggable = false;
  @Input() unselectedListSelectionType: SelectionType;
  @Input() unselectedListHeaderButtons: TemplateRef<any>;
  @Input() unselectedListHeaderButtonsContext: any;
  @Input() unselectedListAllowDropOutsideParents = false;

  @Input() selectedListTitle = '';
  @Input() selectedListItemsDraggable = false;
  @Input() selectedListSelectionType: SelectionType;
  @Input() selectedListHeaderButtons: TemplateRef<any>;
  @Input() selectedListHeaderButtonsContext: any;
  @Input() selectedListAllowDropOutsideParents = false;

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

  @Output() addedItemsChange = new EventEmitter<ListBuilderItem[]>();
  @Output() unselectedListItemsChange = new EventEmitter<AIListItem[]>();
  @Output() selectedListItemsChange = new EventEmitter<AIListItem[]>();

  protected _items: ListBuilderItem[] = [];
  private subscriptions = new Subscription();

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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
      const unselectedItem = new AIListItem(item.unselectedItemState);
      const selectedItem = new AIListItem(item.selectedItemState);

      switch (item.addingMethod) {
        case 'select':
          item.added = unselectedItem.selected;
          selectedItem.hidden = !item.added;
          // This will be called everytime the select method is called on the list item.
          this.subscriptions.add(
            unselectedItem.onSelectedChange.subscribe((selected: boolean) => {
              item.added = selected;
              selectedItem.hidden = !item.added;
              this.addedItemsChange.emit(getAddedItems(this._items));
            })
          );
          break;

        case 'row-action':
        default:
          unselectedItem.rowActions = this.addButton;
          unselectedItem.rowActionsContext = {
            addItem: () => {
              item.added = true;
              unselectedItem.hidden = item.hideUnselectedItemOnSelect;
              selectedItem.hidden = false;
              this.addedItemsChange.emit(getAddedItems(this._items));
            },
          };
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
          this.addedItemsChange.emit(getAddedItems(this._items));
          selectedItem.hidden = true;
        },
      };

      unselectedItems.push(unselectedItem);
      selectedItems.push(selectedItem);

      if (item.hasChildren()) {
        this.createListItems(item.items, unselectedItem.items, selectedItem.items);
      }
    });
  }
}
