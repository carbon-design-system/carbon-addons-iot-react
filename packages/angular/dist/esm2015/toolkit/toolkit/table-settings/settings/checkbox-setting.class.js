/**
 *
 * @ai-apps/angular v2.155.1 | checkbox-setting.class.js
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


import { CheckboxSettingComponent } from './checkbox-setting.component';
import { BaseSetting } from './setting.class';
export class CheckboxSetting extends BaseSetting {
    constructor(options) {
        super(options);
        this.component = CheckboxSettingComponent;
        this.options = options.options;
        this._inputs.set('options', options.options);
        this._outputs.set('optionsChange', this.onChanges.bind(this));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtc2V0dGluZy5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L3RhYmxlLXNldHRpbmdzL3NldHRpbmdzL2NoZWNrYm94LXNldHRpbmcuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDeEUsT0FBTyxFQUFFLFdBQVcsRUFBaUMsTUFBTSxpQkFBaUIsQ0FBQztBQVU3RSxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxXQUFXO0lBSzlDLFlBQVksT0FBZ0M7UUFDMUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBTFYsY0FBUyxHQUFHLHdCQUF3QixDQUFDO1FBTTFDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoZWNrYm94U2V0dGluZ0NvbXBvbmVudCB9IGZyb20gJy4vY2hlY2tib3gtc2V0dGluZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQmFzZVNldHRpbmcsIFNldHRpbmdPcHRpb24sIFNldHRpbmdPcHRpb25zIH0gZnJvbSAnLi9zZXR0aW5nLmNsYXNzJztcblxuZXhwb3J0IGludGVyZmFjZSBDaGVja2JveE9wdGlvbiBleHRlbmRzIFNldHRpbmdPcHRpb24ge1xuICBjaGVja2VkOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoZWNrYm94U2V0dGluZ09wdGlvbnMgZXh0ZW5kcyBTZXR0aW5nT3B0aW9ucyB7XG4gIG9wdGlvbnM6IENoZWNrYm94T3B0aW9uW107XG59XG5cbmV4cG9ydCBjbGFzcyBDaGVja2JveFNldHRpbmcgZXh0ZW5kcyBCYXNlU2V0dGluZyB7XG4gIHB1YmxpYyBjb21wb25lbnQgPSBDaGVja2JveFNldHRpbmdDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIG9wdGlvbnM6IENoZWNrYm94T3B0aW9uW107XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IENoZWNrYm94U2V0dGluZ09wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zLm9wdGlvbnM7XG4gICAgdGhpcy5faW5wdXRzLnNldCgnb3B0aW9ucycsIG9wdGlvbnMub3B0aW9ucyk7XG4gICAgdGhpcy5fb3V0cHV0cy5zZXQoJ29wdGlvbnNDaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlcy5iaW5kKHRoaXMpKTtcbiAgfVxufVxuIl19