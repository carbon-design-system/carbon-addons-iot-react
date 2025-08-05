/**
 *
 * @ai-apps/angular v2.155.1 | component-setting.class.js
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


import { BaseSetting } from './setting.class';
export class ComponentSetting extends BaseSetting {
    constructor(options) {
        super(options);
        this.component = options.component;
        if (options.inputs) {
            this._inputs = new Map(Object.entries(options.inputs));
        }
        if (options.outputs) {
            this._outputs = new Map(Object.entries(options.outputs));
        }
    }
    getInputs() {
        return this._inputs;
    }
    getOutputs() {
        return this._outputs;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LXNldHRpbmcuY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC90YWJsZS1zZXR0aW5ncy9zZXR0aW5ncy9jb21wb25lbnQtc2V0dGluZy5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFnQjlDLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxXQUFXO0lBRS9DLFlBQVksT0FBZ0M7UUFDMUMsS0FBSyxDQUFDLE9BQWMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNuQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUMxRDtJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxVQUFVO1FBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VTZXR0aW5nIH0gZnJvbSAnLi9zZXR0aW5nLmNsYXNzJztcblxuZXhwb3J0IGludGVyZmFjZSBJbnB1dE1hcCB7XG4gIFtpbnB1dE5hbWU6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPdXRwdXRNYXAge1xuICBbb3V0cHV0TmFtZTogc3RyaW5nXTogKGV2ZW50OiBhbnkpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50U2V0dGluZ09wdGlvbnMge1xuICBjb21wb25lbnQ6IGFueTtcbiAgaW5wdXRzPzogSW5wdXRNYXA7XG4gIG91dHB1dHM/OiBPdXRwdXRNYXA7XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRTZXR0aW5nIGV4dGVuZHMgQmFzZVNldHRpbmcge1xuICBwdWJsaWMgY29tcG9uZW50OiBhbnk7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IENvbXBvbmVudFNldHRpbmdPcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyBhcyBhbnkpO1xuICAgIHRoaXMuY29tcG9uZW50ID0gb3B0aW9ucy5jb21wb25lbnQ7XG4gICAgaWYgKG9wdGlvbnMuaW5wdXRzKSB7XG4gICAgICB0aGlzLl9pbnB1dHMgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKG9wdGlvbnMuaW5wdXRzKSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMub3V0cHV0cykge1xuICAgICAgdGhpcy5fb3V0cHV0cyA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMob3B0aW9ucy5vdXRwdXRzKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0SW5wdXRzKCkge1xuICAgIHJldHVybiB0aGlzLl9pbnB1dHM7XG4gIH1cblxuICBnZXRPdXRwdXRzKCkge1xuICAgIHJldHVybiB0aGlzLl9vdXRwdXRzO1xuICB9XG59XG4iXX0=