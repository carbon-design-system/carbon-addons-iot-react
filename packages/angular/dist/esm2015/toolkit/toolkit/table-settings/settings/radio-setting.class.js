/**
 *
 * @ai-apps/angular v2.155.1 | radio-setting.class.js
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


import { RadioSettingComponent } from './radio-setting.component';
import { BaseSetting } from './setting.class';
export class RadioSetting extends BaseSetting {
    constructor(options) {
        super(options);
        this.component = RadioSettingComponent;
        this.options = options.options;
        this.active = options.active;
        this._inputs.set('options', options.options);
        this._inputs.set('active', options.active);
        this._outputs.set('activeChange', this.onChanges.bind(this));
    }
    toJSON() {
        let jsonOptions = null;
        if (this.options) {
            jsonOptions = this.options.map((option) => option.toJSON ? option.toJSON() : JSON.parse(JSON.stringify(option)));
        }
        return {
            content: this.content.value,
            options: jsonOptions,
            active: this.active,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tc2V0dGluZy5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L3RhYmxlLXNldHRpbmdzL3NldHRpbmdzL3JhZGlvLXNldHRpbmcuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLFdBQVcsRUFBaUMsTUFBTSxpQkFBaUIsQ0FBQztBQVc3RSxNQUFNLE9BQU8sWUFBYSxTQUFRLFdBQVc7SUFPM0MsWUFBWSxPQUE0QjtRQUN0QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFQVixjQUFTLEdBQUcscUJBQXFCLENBQUM7UUFRdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3JFLENBQUM7U0FDSDtRQUNELE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQzNCLE9BQU8sRUFBRSxXQUFXO1lBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNwQixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmFkaW9TZXR0aW5nQ29tcG9uZW50IH0gZnJvbSAnLi9yYWRpby1zZXR0aW5nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBCYXNlU2V0dGluZywgU2V0dGluZ09wdGlvbiwgU2V0dGluZ09wdGlvbnMgfSBmcm9tICcuL3NldHRpbmcuY2xhc3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJhZGlvT3B0aW9uIGV4dGVuZHMgU2V0dGluZ09wdGlvbiB7XG4gIHZhbHVlOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmFkaW9TZXR0aW5nT3B0aW9ucyBleHRlbmRzIFNldHRpbmdPcHRpb25zIHtcbiAgb3B0aW9uczogUmFkaW9PcHRpb25bXTtcbiAgYWN0aXZlOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBSYWRpb1NldHRpbmcgZXh0ZW5kcyBCYXNlU2V0dGluZyB7XG4gIHB1YmxpYyBjb21wb25lbnQgPSBSYWRpb1NldHRpbmdDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIG9wdGlvbnM6IFJhZGlvT3B0aW9uW107XG5cbiAgcHJvdGVjdGVkIGFjdGl2ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFJhZGlvU2V0dGluZ09wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zLm9wdGlvbnM7XG4gICAgdGhpcy5hY3RpdmUgPSBvcHRpb25zLmFjdGl2ZTtcbiAgICB0aGlzLl9pbnB1dHMuc2V0KCdvcHRpb25zJywgb3B0aW9ucy5vcHRpb25zKTtcbiAgICB0aGlzLl9pbnB1dHMuc2V0KCdhY3RpdmUnLCBvcHRpb25zLmFjdGl2ZSk7XG4gICAgdGhpcy5fb3V0cHV0cy5zZXQoJ2FjdGl2ZUNoYW5nZScsIHRoaXMub25DaGFuZ2VzLmJpbmQodGhpcykpO1xuICB9XG5cbiAgdG9KU09OKCk6IG9iamVjdCB7XG4gICAgbGV0IGpzb25PcHRpb25zID0gbnVsbDtcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICBqc29uT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5tYXAoKG9wdGlvbikgPT5cbiAgICAgICAgb3B0aW9uLnRvSlNPTiA/IG9wdGlvbi50b0pTT04oKSA6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3B0aW9uKSlcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiB0aGlzLmNvbnRlbnQudmFsdWUsXG4gICAgICBvcHRpb25zOiBqc29uT3B0aW9ucyxcbiAgICAgIGFjdGl2ZTogdGhpcy5hY3RpdmUsXG4gICAgfTtcbiAgfVxufVxuIl19