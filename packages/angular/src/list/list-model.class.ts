import { ListItem } from './list-item.class';

export class ListModel {
    set items(items: ListItem[]) {
        this._items = this.updateNestingLevels(items);
        console.log(this._items);
    }

    get items() {
        return this._items;
    }

    protected _items: ListItem[] = [];

    updateNestingLevels(items: ListItem[], depth = 0) {
        return items.map((item: ListItem) => ({
            ...item,
            nestingLevel: depth,
            items: item.items && item.items.length ? this.updateNestingLevels(item.items, depth + 1) : []
        }));
    }
}
