/**
 *
 * @ai-apps/angular v2.155.1 | sortable-list-model.class.js
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


// disable max-classes-per-file since these are very small classes
// tslint:disable: max-classes-per-file
import { BehaviorSubject, isObservable, Subscription } from 'rxjs';
import { BaseSetting } from '../table-settings/settings/setting.class';
import { SortableListComponent } from './sortable-list.component';
export class SortableListOption {
    constructor(options) {
        this.contentSubject = new BehaviorSubject(null);
        this.contentSubscription = new Subscription();
        this.setContent(options.content);
        this.template = options.template;
        this.order = options.order;
        this.options = options.options;
        this.disabled = options.disabled;
        this.content = this.contentSubject.asObservable();
    }
    getContent() {
        return this.content;
    }
    setContent(content) {
        if (isObservable(content)) {
            this.contentSubscription.unsubscribe();
            this.contentSubscription = content.subscribe((value) => {
                this.contentSubject.next(value);
            });
        }
        else {
            this.contentSubject.next(content);
        }
    }
    toJSON() {
        const jsonOptions = this.options ? this.options.map((option) => option.toJSON()) : [];
        return {
            content: this.contentSubject.value,
            disabled: this.disabled,
            order: this.order,
            options: jsonOptions,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
export class SortableList extends BaseSetting {
    constructor(options) {
        super(options);
        this.component = SortableListComponent;
        this._outputs = new Map([['itemsChange', this.onChanges.bind(this)]]);
        this._inputs = new Map([['items', this.options]]);
        // this.options must be set before setting the value (if any)
        this.options = options.options;
        this.setContent(options.content);
        this.setTemplate(options.template);
    }
    getInputs() {
        return this._inputs;
    }
    getOutputs() {
        return this._outputs;
    }
    onChanges(value) {
        this.stagedOptions = value;
    }
    commit() {
        this.options = this.stagedOptions;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGUtbGlzdC1tb2RlbC5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L3NvcnRhYmxlLWxpc3Qvc29ydGFibGUtbGlzdC1tb2RlbC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxrRUFBa0U7QUFDbEUsdUNBQXVDO0FBR3ZDLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNuRSxPQUFPLEVBQUUsV0FBVyxFQUFrQixNQUFNLDBDQUEwQyxDQUFDO0FBRXZGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBVWxFLE1BQU0sT0FBTyxrQkFBa0I7SUFTN0IsWUFBWSxPQUEwQjtRQUg1QixtQkFBYyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHakQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwRCxDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQVk7UUFDckIsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3JELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RixPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSztZQUNsQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUM7SUFDSixDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0Y7QUFRRCxNQUFNLE9BQU8sWUFBYSxTQUFRLFdBQVc7SUFXM0MsWUFBWSxPQUE0QjtRQUN0QyxLQUFLLENBQUMsT0FBeUIsQ0FBQyxDQUFDO1FBWDVCLGNBQVMsR0FBRyxxQkFBcUIsQ0FBQztRQU0vQixhQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRSxZQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBSXJELDZEQUE2RDtRQUM3RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUEyQjtRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUNwQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBkaXNhYmxlIG1heC1jbGFzc2VzLXBlci1maWxlIHNpbmNlIHRoZXNlIGFyZSB2ZXJ5IHNtYWxsIGNsYXNzZXNcbi8vIHRzbGludDpkaXNhYmxlOiBtYXgtY2xhc3Nlcy1wZXItZmlsZVxuXG5pbXBvcnQgeyBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBpc09ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQmFzZVNldHRpbmcsIFNldHRpbmdPcHRpb25zIH0gZnJvbSAnLi4vdGFibGUtc2V0dGluZ3Mvc2V0dGluZ3Mvc2V0dGluZy5jbGFzcyc7XG5pbXBvcnQgeyBDb250ZW50IH0gZnJvbSAnLi4vdGFibGUtc2V0dGluZ3MvdGFibGUtc2V0dGluZ3MtbW9kZWwuY2xhc3MnO1xuaW1wb3J0IHsgU29ydGFibGVMaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9zb3J0YWJsZS1saXN0LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdE9wdGlvbk9wdGlvbnMge1xuICBjb250ZW50PzogYW55O1xuICB0ZW1wbGF0ZT86IFRlbXBsYXRlUmVmPGFueT47XG4gIG9yZGVyPzogbnVtYmVyO1xuICBvcHRpb25zPzogU29ydGFibGVMaXN0T3B0aW9uW107XG4gIGRpc2FibGVkPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFNvcnRhYmxlTGlzdE9wdGlvbiB7XG4gIGRpc2FibGVkOiBib29sZWFuO1xuICBvcmRlcjogbnVtYmVyO1xuICBvcHRpb25zOiBTb3J0YWJsZUxpc3RPcHRpb25bXTtcbiAgY29udGVudDogYW55O1xuICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgcHJvdGVjdGVkIGNvbnRlbnRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdChudWxsKTtcbiAgcHJvdGVjdGVkIGNvbnRlbnRTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogTGlzdE9wdGlvbk9wdGlvbnMpIHtcbiAgICB0aGlzLnNldENvbnRlbnQob3B0aW9ucy5jb250ZW50KTtcbiAgICB0aGlzLnRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZTtcbiAgICB0aGlzLm9yZGVyID0gb3B0aW9ucy5vcmRlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zLm9wdGlvbnM7XG4gICAgdGhpcy5kaXNhYmxlZCA9IG9wdGlvbnMuZGlzYWJsZWQ7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50U3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldENvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgfVxuXG4gIHNldENvbnRlbnQoY29udGVudDogYW55KSB7XG4gICAgaWYgKGlzT2JzZXJ2YWJsZShjb250ZW50KSkge1xuICAgICAgdGhpcy5jb250ZW50U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmNvbnRlbnRTdWJzY3JpcHRpb24gPSBjb250ZW50LnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5jb250ZW50U3ViamVjdC5uZXh0KHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRlbnRTdWJqZWN0Lm5leHQoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIGNvbnN0IGpzb25PcHRpb25zID0gdGhpcy5vcHRpb25zID8gdGhpcy5vcHRpb25zLm1hcCgob3B0aW9uKSA9PiBvcHRpb24udG9KU09OKCkpIDogW107XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXMuY29udGVudFN1YmplY3QudmFsdWUsXG4gICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcbiAgICAgIG9yZGVyOiB0aGlzLm9yZGVyLFxuICAgICAgb3B0aW9uczoganNvbk9wdGlvbnMsXG4gICAgfTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRvSlNPTigpKTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvcnRhYmxlTGlzdE9wdGlvbnMgZXh0ZW5kcyBTZXR0aW5nT3B0aW9ucyB7XG4gIGNvbnRlbnQ/OiBhbnk7XG4gIHRlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcbiAgb3B0aW9uczogU29ydGFibGVMaXN0T3B0aW9uW107XG59XG5cbmV4cG9ydCBjbGFzcyBTb3J0YWJsZUxpc3QgZXh0ZW5kcyBCYXNlU2V0dGluZyB7XG4gIHB1YmxpYyBjb21wb25lbnQgPSBTb3J0YWJsZUxpc3RDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIG9wdGlvbnM6IFNvcnRhYmxlTGlzdE9wdGlvbltdO1xuXG4gIHByb3RlY3RlZCBzdGFnZWRPcHRpb25zOiBTb3J0YWJsZUxpc3RPcHRpb25bXTtcblxuICBwcm90ZWN0ZWQgX291dHB1dHMgPSBuZXcgTWFwKFtbJ2l0ZW1zQ2hhbmdlJywgdGhpcy5vbkNoYW5nZXMuYmluZCh0aGlzKV1dKTtcblxuICBwcm90ZWN0ZWQgX2lucHV0cyA9IG5ldyBNYXAoW1snaXRlbXMnLCB0aGlzLm9wdGlvbnNdXSk7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogU29ydGFibGVMaXN0T3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMgYXMgU2V0dGluZ09wdGlvbnMpO1xuICAgIC8vIHRoaXMub3B0aW9ucyBtdXN0IGJlIHNldCBiZWZvcmUgc2V0dGluZyB0aGUgdmFsdWUgKGlmIGFueSlcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zLm9wdGlvbnM7XG4gICAgdGhpcy5zZXRDb250ZW50KG9wdGlvbnMuY29udGVudCk7XG4gICAgdGhpcy5zZXRUZW1wbGF0ZShvcHRpb25zLnRlbXBsYXRlKTtcbiAgfVxuXG4gIGdldElucHV0cygpIHtcbiAgICByZXR1cm4gdGhpcy5faW5wdXRzO1xuICB9XG5cbiAgZ2V0T3V0cHV0cygpIHtcbiAgICByZXR1cm4gdGhpcy5fb3V0cHV0cztcbiAgfVxuXG4gIG9uQ2hhbmdlcyh2YWx1ZTogU29ydGFibGVMaXN0T3B0aW9uW10pIHtcbiAgICB0aGlzLnN0YWdlZE9wdGlvbnMgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbW1pdCgpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLnN0YWdlZE9wdGlvbnM7XG4gIH1cbn1cbiJdfQ==