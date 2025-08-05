/**
 *
 * @ai-apps/angular v2.155.1 | table-settings-pane.class.js
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


import { isObservable, of } from 'rxjs';
export class TableSettingsPane {
    constructor(options) {
        this.settings = [];
        if (options.settings) {
            this.settings = options.settings;
        }
        this.content = options.content;
        this.title = options.title;
    }
    addSetting(setting) {
        this.settings.push(setting);
    }
    setSettings(settings) {
        this.settings = settings;
    }
    getSettings() {
        return this.settings;
    }
    getContent() {
        if (isObservable(this.content)) {
            return this.content;
        }
        return of(this.content);
    }
    toJSON() {
        let jsonSettings = [];
        if (this.settings) {
            jsonSettings = this.settings.map((setting) => setting.toJSON());
        }
        const jsonContent = this.content ? this.content.toString() : null;
        return {
            settings: jsonSettings,
            content: jsonContent,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    commit() {
        this.settings.forEach((setting) => setting.commit());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc2V0dGluZ3MtcGFuZS5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L3RhYmxlLXNldHRpbmdzL3RhYmxlLXNldHRpbmdzLXBhbmUuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFVeEMsTUFBTSxPQUFPLGlCQUFpQjtJQUs1QixZQUFZLE9BQWlDO1FBRm5DLGFBQVEsR0FBa0IsRUFBRSxDQUFDO1FBR3JDLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7U0FDbEM7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBb0I7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUF1QjtRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRUQsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7UUFFRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDakU7UUFDRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDbEUsT0FBTztZQUNMLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUM7SUFDSixDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBCYXNlU2V0dGluZyB9IGZyb20gJy4vc2V0dGluZ3MvaW5kZXgnO1xuaW1wb3J0IHsgQ29udGVudCB9IGZyb20gJy4vdGFibGUtc2V0dGluZ3MtbW9kZWwuY2xhc3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRhYmxlU2V0dGluZ3NQYW5lT3B0aW9ucyB7XG4gIHNldHRpbmdzPzogQmFzZVNldHRpbmdbXTtcbiAgY29udGVudD86IGFueTtcbiAgdGl0bGU6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFRhYmxlU2V0dGluZ3NQYW5lIHtcbiAgY29udGVudD86IGFueTtcbiAgdGl0bGU6IGFueTtcbiAgcHJvdGVjdGVkIHNldHRpbmdzOiBCYXNlU2V0dGluZ1tdID0gW107XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogVGFibGVTZXR0aW5nc1BhbmVPcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuc2V0dGluZ3MpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MgPSBvcHRpb25zLnNldHRpbmdzO1xuICAgIH1cbiAgICB0aGlzLmNvbnRlbnQgPSBvcHRpb25zLmNvbnRlbnQ7XG4gICAgdGhpcy50aXRsZSA9IG9wdGlvbnMudGl0bGU7XG4gIH1cblxuICBhZGRTZXR0aW5nKHNldHRpbmc6IEJhc2VTZXR0aW5nKSB7XG4gICAgdGhpcy5zZXR0aW5ncy5wdXNoKHNldHRpbmcpO1xuICB9XG5cbiAgc2V0U2V0dGluZ3Moc2V0dGluZ3M6IEJhc2VTZXR0aW5nW10pIHtcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gIH1cblxuICBnZXRTZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncztcbiAgfVxuXG4gIGdldENvbnRlbnQoKSB7XG4gICAgaWYgKGlzT2JzZXJ2YWJsZSh0aGlzLmNvbnRlbnQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50O1xuICAgIH1cblxuICAgIHJldHVybiBvZih0aGlzLmNvbnRlbnQpO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIGxldCBqc29uU2V0dGluZ3MgPSBbXTtcbiAgICBpZiAodGhpcy5zZXR0aW5ncykge1xuICAgICAganNvblNldHRpbmdzID0gdGhpcy5zZXR0aW5ncy5tYXAoKHNldHRpbmcpID0+IHNldHRpbmcudG9KU09OKCkpO1xuICAgIH1cbiAgICBjb25zdCBqc29uQ29udGVudCA9IHRoaXMuY29udGVudCA/IHRoaXMuY29udGVudC50b1N0cmluZygpIDogbnVsbDtcbiAgICByZXR1cm4ge1xuICAgICAgc2V0dGluZ3M6IGpzb25TZXR0aW5ncyxcbiAgICAgIGNvbnRlbnQ6IGpzb25Db250ZW50LFxuICAgIH07XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy50b0pTT04oKSk7XG4gIH1cblxuICBjb21taXQoKSB7XG4gICAgdGhpcy5zZXR0aW5ncy5mb3JFYWNoKChzZXR0aW5nKSA9PiBzZXR0aW5nLmNvbW1pdCgpKTtcbiAgfVxufVxuIl19