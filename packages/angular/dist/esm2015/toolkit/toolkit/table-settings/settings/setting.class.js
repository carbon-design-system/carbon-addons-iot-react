/**
 *
 * @ai-apps/angular v2.155.1 | setting.class.js
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


import { BehaviorSubject, isObservable, Subscription } from 'rxjs';
export class BaseSetting {
    constructor(options) {
        this.staged = {};
        this.content = new BehaviorSubject(null);
        this.contentObservable = this.content.asObservable();
        this.contentSubscription = new Subscription();
        this._inputs = new Map();
        this._outputs = new Map();
        this.setContent(options.content);
        this.setTemplate(options.template);
        this.options = options.options;
    }
    getContent() {
        return this.contentObservable;
    }
    setContent(content) {
        if (isObservable(content)) {
            this.contentSubscription.unsubscribe();
            this.contentSubscription = content.subscribe((value) => {
                this.content.next(value);
            });
        }
        else {
            this.content.next(content);
        }
    }
    getTemplate() {
        return this.template;
    }
    setTemplate(template) {
        this.template = template;
    }
    /**
     * gets a map of input names to values
     *
     * By default returns a map of 'options' to `this.options`
     */
    getInputs() {
        return this._inputs;
    }
    getOutputs() {
        return this._outputs;
    }
    toJSON() {
        let jsonOptions = null;
        if (this.options) {
            jsonOptions = this.options.map((option) => option.toJSON ? option.toJSON() : JSON.parse(JSON.stringify(option)));
        }
        return {
            content: this.content.value,
            options: jsonOptions,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    onChanges(changes) {
        for (const [key, value] of Object.entries(changes)) {
            this.staged[key] = value;
        }
    }
    commit() {
        for (const [key, value] of Object.entries(this.staged)) {
            this[key] = value;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZy5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L3RhYmxlLXNldHRpbmdzL3NldHRpbmdzL3NldHRpbmcuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBbUJuRSxNQUFNLE9BQU8sV0FBVztJQWF0QixZQUFZLE9BQXdCO1FBVDFCLFdBQU0sR0FBRyxFQUFFLENBQUM7UUFDWixZQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsc0JBQWlCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNoRCx3QkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3pDLFlBQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRzdCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNqQyxDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBZ0I7UUFDekIsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUEwQjtRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3JFLENBQUM7U0FDSDtRQUNELE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQzNCLE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUM7SUFDSixDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsU0FBUyxDQUFDLE9BQXVCO1FBQy9CLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUNuQjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGlzT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDb250ZW50IH0gZnJvbSAnLi4vdGFibGUtc2V0dGluZ3MtbW9kZWwuY2xhc3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdPcHRpb24ge1xuICBjb250ZW50PzogQ29udGVudDtcbiAgdGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuICB0b0pTT04/KCk6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5nT3B0aW9ucyB7XG4gIGNvbnRlbnQ/OiBDb250ZW50O1xuICB0ZW1wbGF0ZT86IFRlbXBsYXRlUmVmPGFueT47XG4gIG9wdGlvbnM6IFNldHRpbmdPcHRpb25bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5nQ2hhbmdlcyB7XG4gIFtwcm9wZXJ0eTogc3RyaW5nXTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgQmFzZVNldHRpbmcge1xuICBwdWJsaWMgcmVhZG9ubHkgY29tcG9uZW50OiBhbnk7XG5cbiAgcHJvdGVjdGVkIG9wdGlvbnM6IFNldHRpbmdPcHRpb25bXTtcbiAgcHJvdGVjdGVkIHN0YWdlZCA9IHt9O1xuICBwcm90ZWN0ZWQgY29udGVudCA9IG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCk7XG4gIHByb3RlY3RlZCBjb250ZW50T2JzZXJ2YWJsZSA9IHRoaXMuY29udGVudC5hc09ic2VydmFibGUoKTtcbiAgcHJvdGVjdGVkIGNvbnRlbnRTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gIHByb3RlY3RlZCB0ZW1wbGF0ZT86IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgcHJvdGVjdGVkIF9pbnB1dHMgPSBuZXcgTWFwKCk7XG4gIHByb3RlY3RlZCBfb3V0cHV0cyA9IG5ldyBNYXAoKTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zPzogU2V0dGluZ09wdGlvbnMpIHtcbiAgICB0aGlzLnNldENvbnRlbnQob3B0aW9ucy5jb250ZW50KTtcbiAgICB0aGlzLnNldFRlbXBsYXRlKG9wdGlvbnMudGVtcGxhdGUpO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMub3B0aW9ucztcbiAgfVxuXG4gIGdldENvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudE9ic2VydmFibGU7XG4gIH1cblxuICBzZXRDb250ZW50KGNvbnRlbnQ6IENvbnRlbnQpIHtcbiAgICBpZiAoaXNPYnNlcnZhYmxlKGNvbnRlbnQpKSB7XG4gICAgICB0aGlzLmNvbnRlbnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuY29udGVudFN1YnNjcmlwdGlvbiA9IGNvbnRlbnQuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmNvbnRlbnQubmV4dCh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250ZW50Lm5leHQoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGU7XG4gIH1cblxuICBzZXRUZW1wbGF0ZSh0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pikge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXRzIGEgbWFwIG9mIGlucHV0IG5hbWVzIHRvIHZhbHVlc1xuICAgKlxuICAgKiBCeSBkZWZhdWx0IHJldHVybnMgYSBtYXAgb2YgJ29wdGlvbnMnIHRvIGB0aGlzLm9wdGlvbnNgXG4gICAqL1xuICBnZXRJbnB1dHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lucHV0cztcbiAgfVxuXG4gIGdldE91dHB1dHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX291dHB1dHM7XG4gIH1cblxuICB0b0pTT04oKTogb2JqZWN0IHtcbiAgICBsZXQganNvbk9wdGlvbnMgPSBudWxsO1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIGpzb25PcHRpb25zID0gdGhpcy5vcHRpb25zLm1hcCgob3B0aW9uKSA9PlxuICAgICAgICBvcHRpb24udG9KU09OID8gb3B0aW9uLnRvSlNPTigpIDogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcHRpb24pKVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXMuY29udGVudC52YWx1ZSxcbiAgICAgIG9wdGlvbnM6IGpzb25PcHRpb25zLFxuICAgIH07XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRvSlNPTigpKTtcbiAgfVxuXG4gIG9uQ2hhbmdlcyhjaGFuZ2VzOiBTZXR0aW5nQ2hhbmdlcykge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpKSB7XG4gICAgICB0aGlzLnN0YWdlZFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgY29tbWl0KCkge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuc3RhZ2VkKSkge1xuICAgICAgdGhpc1trZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG59XG4iXX0=