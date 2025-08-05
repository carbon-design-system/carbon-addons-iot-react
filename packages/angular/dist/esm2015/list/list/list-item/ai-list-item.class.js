/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-item.class.js
 *
 * Copyright 2014, 2025 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


export class AIListItem {
    constructor(rawData) {
        /**
         * Unique identifier for the list item.
         */
        this.id = `list-item-${AIListItem.listItemCount++}`;
        /**
         * Primary content to be displayed in the list item.
         */
        this.value = '';
        /**
         * Indicates whether or not a list item's displayed value should be bolded.
         */
        this.isCategory = false;
        /**
         * If the list item has child list items, this indicates whether or not it's
         * direct children are displayed.
         */
        this.expanded = false;
        /**
         * Indicates whether or not the list item can be selected.
         */
        this.isSelectable = false;
        /**
         * Indicates whether or not the item is selected.
         */
        this.selected = false;
        this.disabled = false;
        /**
         * Indicates whether or not the list item is in an indeterminate state.
         */
        this.indeterminate = false;
        /**
         * Optional nested items.
         */
        this.items = [];
        this.size = 'md';
        /**
         * Indicates whether or not the item can be dragged into a different position.
         */
        this.isDraggable = false;
        const data = Object.assign(Object.assign({}, (rawData ? rawData : {})), { items: (rawData === null || rawData === void 0 ? void 0 : rawData.items) && rawData.items.length > 0
                ? rawData.items.map((item) => item instanceof AIListItem ? item : new AIListItem(item))
                : [] });
        Object.assign(this, {}, data);
    }
    /**
     * This method returns `true` if `searchString` is a substring of `value`
     * or `secondaryValue` of this list item or any of its children.
     * This method may be overridden to achieve a custom search.
     *
     * For example, if I want `ai-list` to only filter based on secondary
     * values and have case matter, I can create a custom `AIListItem`:
     *
     * class CustomAIListItem extends AIListItem {
     *   constructor(rawData: any) {
     *     super(rawData);
     *   }
     *
     *   includes(searchString: string) {
     *     return this.secondaryValue.includes(searchString) || this.items.some((listItem) => listItem.includes(searchString));
     *   }
     * }
     *
     * Then instead of passing in an array of `AIListItem`s into `ai-list`,
     * you can pass in an array of `CustomAIListItem`s and if you have the
     * search bar turned on, it will filter out items based on your custom
     * `includes` method.
     */
    includes(searchString) {
        return (this.value.toLowerCase().includes(searchString.toLowerCase()) ||
            (this.secondaryValue !== undefined &&
                this.secondaryValue !== null &&
                this.secondaryValue.toLowerCase().includes(searchString.toLowerCase())) ||
            this.items.some((listItem) => listItem.includes(searchString)));
    }
    expand(expanded = true) {
        this.expanded = expanded;
    }
    select(selected = true) {
        this.selected = selected;
    }
    setIndeterminate(indeterminate = true) {
        this.indeterminate = indeterminate;
    }
    disable(disabled = true) {
        this.disabled = disabled;
    }
    addItem(listItem, index = 0) {
        if (index > this.items.length) {
            this.items.splice(this.items.length, 0, listItem);
        }
        else {
            this.items.splice(index, 0, listItem);
        }
    }
    removeItem(index = 0) {
        if (index >= 0 && this.items.length > index) {
            this.items.splice(index, 1);
        }
    }
    hasItem(item) {
        if (item === undefined || item === null) {
            return false;
        }
        return this.id === item.id || this.items.some((listItem) => listItem.hasItem(item));
    }
    hasChildren() {
        return this.items && this.items.length > 0;
    }
    someChildrenSelected() {
        return this.items.some((item) => (item.isSelectable ? item.selected : false));
    }
    allChildrenSelected() {
        return this.items.every((item) => (item.isSelectable ? item.selected : false));
    }
}
/**
 * Variable used for creating unique ids for ListItems.
 */
AIListItem.listItemCount = 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWktbGlzdC1pdGVtLmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpc3QvbGlzdC1pdGVtL2FpLWxpc3QtaXRlbS5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sVUFBVTtJQW9FckIsWUFBWSxPQUFhO1FBOUR6Qjs7V0FFRztRQUNILE9BQUUsR0FBRyxhQUFhLFVBQVUsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO1FBRS9DOztXQUVHO1FBQ0gsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUVYOztXQUVHO1FBQ0gsZUFBVSxHQUFHLEtBQUssQ0FBQztRQWNuQjs7O1dBR0c7UUFDSCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRWpCOztXQUVHO1FBQ0gsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFFckI7O1dBRUc7UUFDSCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRWpCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFFakI7O1dBRUc7UUFDSCxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUV0Qjs7V0FFRztRQUNILFVBQUssR0FBaUIsRUFBRSxDQUFDO1FBRXpCLFNBQUksR0FBZ0IsSUFBSSxDQUFDO1FBRXpCOztXQUVHO1FBQ0gsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFHbEIsTUFBTSxJQUFJLG1DQUNMLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUMzQixLQUFLLEVBQ0gsQ0FBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsS0FBSyxLQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3hDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQzlCLElBQUksWUFBWSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENB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QUFLLENBQUMsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFRCxtQkFBbUI7UUFDakIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDOztBQWpLRDs7R0FFRztBQUNJLHdCQUFhLEdBQUcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIEFJTGlzdEl0ZW0ge1xuICAvKipcbiAgICogVmFyaWFibGUgdXNlZCBmb3IgY3JlYXRpbmcgdW5pcXVlIGlkcyBmb3IgTGlzdEl0ZW1zLlxuICAgKi9cbiAgc3RhdGljIGxpc3RJdGVtQ291bnQgPSAwO1xuXG4gIC8qKlxuICAgKiBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGxpc3QgaXRlbS5cbiAgICovXG4gIGlkID0gYGxpc3QtaXRlbS0ke0FJTGlzdEl0ZW0ubGlzdEl0ZW1Db3VudCsrfWA7XG5cbiAgLyoqXG4gICAqIFByaW1hcnkgY29udGVudCB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIGxpc3QgaXRlbS5cbiAgICovXG4gIHZhbHVlID0gJyc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhIGxpc3QgaXRlbSdzIGRpc3BsYXllZCB2YWx1ZSBzaG91bGQgYmUgYm9sZGVkLlxuICAgKi9cbiAgaXNDYXRlZ29yeSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTZWNvbmRhcnkgdmFsdWUgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBsaXN0IGl0ZW0uXG4gICAqL1xuICBzZWNvbmRhcnlWYWx1ZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhpcyBjb250YWlucyBhbiBvcHRpb25hbCByb3cgYWN0aW9uIHRoYXQgY2FuIGJlIHJlbmRlcmVkIGluIHRoZSBsaXN0IGl0ZW0uXG4gICAqL1xuICByb3dBY3Rpb25zPzogVGVtcGxhdGVSZWY8YW55PjtcblxuICByb3dBY3Rpb25zQ29udGV4dD86IGFueTtcblxuICAvKipcbiAgICogSWYgdGhlIGxpc3QgaXRlbSBoYXMgY2hpbGQgbGlzdCBpdGVtcywgdGhpcyBpbmRpY2F0ZXMgd2hldGhlciBvciBub3QgaXQnc1xuICAgKiBkaXJlY3QgY2hpbGRyZW4gYXJlIGRpc3BsYXllZC5cbiAgICovXG4gIGV4cGFuZGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgbGlzdCBpdGVtIGNhbiBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGlzU2VsZWN0YWJsZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhlIGl0ZW0gaXMgc2VsZWN0ZWQuXG4gICAqL1xuICBzZWxlY3RlZCA9IGZhbHNlO1xuXG4gIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgbGlzdCBpdGVtIGlzIGluIGFuIGluZGV0ZXJtaW5hdGUgc3RhdGUuXG4gICAqL1xuICBpbmRldGVybWluYXRlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIG5lc3RlZCBpdGVtcy5cbiAgICovXG4gIGl0ZW1zOiBBSUxpc3RJdGVtW10gPSBbXTtcblxuICBzaXplOiAnbWQnIHwgJ2xnJyA9ICdtZCc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgaXRlbSBjYW4gYmUgZHJhZ2dlZCBpbnRvIGEgZGlmZmVyZW50IHBvc2l0aW9uLlxuICAgKi9cbiAgaXNEcmFnZ2FibGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihyYXdEYXRhPzogYW55KSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIC4uLihyYXdEYXRhID8gcmF3RGF0YSA6IHt9KSxcbiAgICAgIGl0ZW1zOlxuICAgICAgICByYXdEYXRhPy5pdGVtcyAmJiByYXdEYXRhLml0ZW1zLmxlbmd0aCA+IDBcbiAgICAgICAgICA/IHJhd0RhdGEuaXRlbXMubWFwKChpdGVtOiBhbnkpID0+XG4gICAgICAgICAgICAgIGl0ZW0gaW5zdGFuY2VvZiBBSUxpc3RJdGVtID8gaXRlbSA6IG5ldyBBSUxpc3RJdGVtKGl0ZW0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBbXSxcbiAgICB9O1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywge30sIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJldHVybnMgYHRydWVgIGlmIGBzZWFyY2hTdHJpbmdgIGlzIGEgc3Vic3RyaW5nIG9mIGB2YWx1ZWBcbiAgICogb3IgYHNlY29uZGFyeVZhbHVlYCBvZiB0aGlzIGxpc3QgaXRlbSBvciBhbnkgb2YgaXRzIGNoaWxkcmVuLlxuICAgKiBUaGlzIG1ldGhvZCBtYXkgYmUgb3ZlcnJpZGRlbiB0byBhY2hpZXZlIGEgY3VzdG9tIHNlYXJjaC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGlmIEkgd2FudCBgYWktbGlzdGAgdG8gb25seSBmaWx0ZXIgYmFzZWQgb24gc2Vjb25kYXJ5XG4gICAqIHZhbHVlcyBhbmQgaGF2ZSBjYXNlIG1hdHRlciwgSSBjYW4gY3JlYXRlIGEgY3VzdG9tIGBBSUxpc3RJdGVtYDpcbiAgICpcbiAgICogY2xhc3MgQ3VzdG9tQUlMaXN0SXRlbSBleHRlbmRzIEFJTGlzdEl0ZW0ge1xuICAgKiAgIGNvbnN0cnVjdG9yKHJhd0RhdGE6IGFueSkge1xuICAgKiAgICAgc3VwZXIocmF3RGF0YSk7XG4gICAqICAgfVxuICAgKlxuICAgKiAgIGluY2x1ZGVzKHNlYXJjaFN0cmluZzogc3RyaW5nKSB7XG4gICAqICAgICByZXR1cm4gdGhpcy5zZWNvbmRhcnlWYWx1ZS5pbmNsdWRlcyhzZWFyY2hTdHJpbmcpIHx8IHRoaXMuaXRlbXMuc29tZSgobGlzdEl0ZW0pID0+IGxpc3RJdGVtLmluY2x1ZGVzKHNlYXJjaFN0cmluZykpO1xuICAgKiAgIH1cbiAgICogfVxuICAgKlxuICAgKiBUaGVuIGluc3RlYWQgb2YgcGFzc2luZyBpbiBhbiBhcnJheSBvZiBgQUlMaXN0SXRlbWBzIGludG8gYGFpLWxpc3RgLFxuICAgKiB5b3UgY2FuIHBhc3MgaW4gYW4gYXJyYXkgb2YgYEN1c3RvbUFJTGlzdEl0ZW1gcyBhbmQgaWYgeW91IGhhdmUgdGhlXG4gICAqIHNlYXJjaCBiYXIgdHVybmVkIG9uLCBpdCB3aWxsIGZpbHRlciBvdXQgaXRlbXMgYmFzZWQgb24geW91ciBjdXN0b21cbiAgICogYGluY2x1ZGVzYCBtZXRob2QuXG4gICAqL1xuICBpbmNsdWRlcyhzZWFyY2hTdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnZhbHVlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoU3RyaW5nLnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgICAodGhpcy5zZWNvbmRhcnlWYWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5VmFsdWUgIT09IG51bGwgJiZcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlWYWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFN0cmluZy50b0xvd2VyQ2FzZSgpKSkgfHxcbiAgICAgIHRoaXMuaXRlbXMuc29tZSgobGlzdEl0ZW0pID0+IGxpc3RJdGVtLmluY2x1ZGVzKHNlYXJjaFN0cmluZykpXG4gICAgKTtcbiAgfVxuXG4gIGV4cGFuZChleHBhbmRlZCA9IHRydWUpIHtcbiAgICB0aGlzLmV4cGFuZGVkID0gZXhwYW5kZWQ7XG4gIH1cblxuICBzZWxlY3Qoc2VsZWN0ZWQgPSB0cnVlKSB7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICB9XG5cbiAgc2V0SW5kZXRlcm1pbmF0ZShpbmRldGVybWluYXRlID0gdHJ1ZSkge1xuICAgIHRoaXMuaW5kZXRlcm1pbmF0ZSA9IGluZGV0ZXJtaW5hdGU7XG4gIH1cblxuICBkaXNhYmxlKGRpc2FibGVkID0gdHJ1ZSkge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgfVxuXG4gIGFkZEl0ZW0obGlzdEl0ZW06IEFJTGlzdEl0ZW0sIGluZGV4ID0gMCkge1xuICAgIGlmIChpbmRleCA+IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLml0ZW1zLnNwbGljZSh0aGlzLml0ZW1zLmxlbmd0aCwgMCwgbGlzdEl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMCwgbGlzdEl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUl0ZW0oaW5kZXggPSAwKSB7XG4gICAgaWYgKGluZGV4ID49IDAgJiYgdGhpcy5pdGVtcy5sZW5ndGggPiBpbmRleCkge1xuICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIGhhc0l0ZW0oaXRlbTogQUlMaXN0SXRlbSkge1xuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQgfHwgaXRlbSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmlkID09PSBpdGVtLmlkIHx8IHRoaXMuaXRlbXMuc29tZSgobGlzdEl0ZW0pID0+IGxpc3RJdGVtLmhhc0l0ZW0oaXRlbSkpO1xuICB9XG5cbiAgaGFzQ2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5sZW5ndGggPiAwO1xuICB9XG5cbiAgc29tZUNoaWxkcmVuU2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuc29tZSgoaXRlbTogQUlMaXN0SXRlbSkgPT4gKGl0ZW0uaXNTZWxlY3RhYmxlID8gaXRlbS5zZWxlY3RlZCA6IGZhbHNlKSk7XG4gIH1cblxuICBhbGxDaGlsZHJlblNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmV2ZXJ5KChpdGVtOiBBSUxpc3RJdGVtKSA9PiAoaXRlbS5pc1NlbGVjdGFibGUgPyBpdGVtLnNlbGVjdGVkIDogZmFsc2UpKTtcbiAgfVxufVxuIl19