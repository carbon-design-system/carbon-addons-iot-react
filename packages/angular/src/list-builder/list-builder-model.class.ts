import { EventEmitter, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AIListItem } from '../list';

export class AIListBuilderItem extends AIListItem {
  items: AIListBuilderItem[] = [];

  /**
   * Checks whether the item should be included in the added items list.
   */
  added = false;

  addedChange = new EventEmitter<boolean>();

  /**
   * State of the item in the add items list when added is true.
   */
  addedState: 'disabled' | 'hide' | null = 'hide';

  addOnSelect = false;

  /**
   * Any additional props to pass into the generated added items.
   * You can use any `AIListItem` properties.
   */
  addedItemProps: any = {};

  addedItemRowActions: TemplateRef<any>;

  addedItemRowActionsContext: any = {
    removeItem: () => this.removeItem(),
  };

  rowActionsContext: any = {
    addItem: () => this.addItem(),
  };

  constructor(rawData?: any) {
    super();
    Object.assign(this, {}, rawData);
  }

  addItem() {
    this.added = true;

    this.addedChange.emit(true);

    if (this.addedState === 'disabled') {
      this.disabled = true;
    }

    if (this.addOnSelect) {
      this.select(true, true);
    }
  }

  removeItem() {
    this.added = false;

    this.addedChange.emit(false);

    if (this.addedState === 'disabled') {
      this.disabled = false;
    }

    if (this.addOnSelect) {
      this.select(false, true);
    }
  }

  select(selected = true, shouldEmit = false) {
    this.selected = selected;

    if (shouldEmit) {
      this.onSelect.emit(this.selected);
    }

    if (this.addedState === 'disabled') {
      this.disabled = this.selected;
    }

    if (this.addOnSelect) {
      this.added = selected;
      this.addedChange.emit(selected);
    }
  }

  /**
   * Original includes function with the extra condition of hiding the item if it
   * is added and `addedState` is `hide`.
   */
  includes(searchString: string) {
    return (
      (this.addedState !== 'hide' || !this.added) &&
      (this.value.toLowerCase().includes(searchString.toLowerCase()) ||
        (this.secondaryValue !== undefined &&
          this.secondaryValue !== null &&
          this.secondaryValue.toLowerCase().includes(searchString.toLowerCase())) ||
        this.items.some((listItem) => listItem.includes(searchString)))
    );
  }
}

export class AIListBuilderModel {
  get items(): AIListBuilderItem[] {
    return this._items;
  }

  get addedItems(): AIListItem[] {
    return this._addedItems;
  }

  /**
   * Sets items of the list builder.
   *
   */
  set items(items: AIListBuilderItem[]) {
    if (!items || (Array.isArray(items) && items.length === 0)) {
      items = [];
    }

    this._items = items;
    this._addedItems = this.createAddedItems(items);

    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.initializeSubscriptions(this.items);
  }

  protected _items: AIListBuilderItem[] = [];

  /**
   * Items in the added items list.
   */
  protected _addedItems: AIListItem[] = [];

  private subscriptions = new Subscription();

  protected createAddedItems(items: AIListBuilderItem[]) {
    return items.reduce((addedItems: AIListItem[], item) => {
      if (item.hasChildren()) {
        const addedChildren = this.createAddedItems(item.items);

        if (addedChildren.length > 0) {
          if (item.added) {
            return [
              ...addedItems,
              new AIListItem({
                value: item.value,
                expanded: true,
                items: addedChildren,
                rowActions: item.addedItemRowActions,
                rowActionsContext: item.addedItemRowActionsContext,
                ...item.addedItemProps,
              }),
            ];
          } else {
            return [...addedItems, ...addedChildren];
          }
        }
      }

      if (item.added) {
        return [
          ...addedItems,
          new AIListItem({
            value: item.value,
            expanded: true,
            rowActions: item.addedItemRowActions,
            rowActionsContext: item.addedItemRowActionsContext,
            ...item.addedItemProps,
          }),
        ];
      }

      return addedItems;
    }, []);
  }

  protected initializeSubscriptions(items: AIListBuilderItem[]) {
    items.forEach((item) => {
      if (item.hasChildren()) {
        this.initializeSubscriptions(item.items);
      }

      const subscription = item.addedChange.subscribe(() => {
        this._addedItems = this.createAddedItems(this._items);
      });

      this.subscriptions.add(subscription);
    });
  }
}
