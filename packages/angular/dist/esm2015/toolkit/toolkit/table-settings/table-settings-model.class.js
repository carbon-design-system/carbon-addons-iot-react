/**
 *
 * @ai-apps/angular v2.155.1 | table-settings-model.class.js
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
import { TableSettingsPane } from './table-settings-pane.class';
// tslint:disable: max-classes-per-file
export class TableSettings {
    constructor(options) {
        this.panes = [];
        if (options.panes) {
            this.panes = options.panes;
        }
        this.content = options.content;
        this.title = options.title;
        this.template = options.template;
    }
    addPane(paneOrOptions) {
        if (paneOrOptions instanceof TableSettingsPane) {
            this.panes.push(paneOrOptions);
        }
        else {
            this.panes.push(new TableSettingsPane(paneOrOptions));
        }
    }
    setPanes(panes) {
        this.panes = panes;
    }
    getPanes() {
        return this.panes;
    }
    getContent() {
        if (isObservable(this.content)) {
            return this.content;
        }
        return of(this.content);
    }
    toJSON() {
        let jsonPanes = [];
        if (this.panes) {
            jsonPanes = this.panes.map((pane) => pane.toJSON());
        }
        const jsonContent = this.content ? this.content.toString() : null;
        const jsonTitle = this.title ? this.title.toString() : null;
        return {
            content: jsonContent,
            title: jsonTitle,
            panes: jsonPanes,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    commit() {
        this.panes.forEach((pane) => pane.commit());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc2V0dGluZ3MtbW9kZWwuY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC90YWJsZS1zZXR0aW5ncy90YWJsZS1zZXR0aW5ncy1tb2RlbC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQTRCLE1BQU0sNkJBQTZCLENBQUM7QUFXMUYsdUNBQXVDO0FBQ3ZDLE1BQU0sT0FBTyxhQUFhO0lBTXhCLFlBQVksT0FBNkI7UUFGL0IsVUFBSyxHQUF3QixFQUFFLENBQUM7UUFHeEMsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztTQUM1QjtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPLENBQUMsYUFBMkQ7UUFDakUsSUFBSSxhQUFhLFlBQVksaUJBQWlCLEVBQUU7WUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztTQUN2RDtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsS0FBMEI7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JCO1FBRUQsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDckQ7UUFDRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDbEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzVELE9BQU87WUFDTCxPQUFPLEVBQUUsV0FBVztZQUNwQixLQUFLLEVBQUUsU0FBUztZQUNoQixLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDO0lBQ0osQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzT2JzZXJ2YWJsZSwgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFRhYmxlU2V0dGluZ3NQYW5lLCBUYWJsZVNldHRpbmdzUGFuZU9wdGlvbnMgfSBmcm9tICcuL3RhYmxlLXNldHRpbmdzLXBhbmUuY2xhc3MnO1xuXG5leHBvcnQgdHlwZSBDb250ZW50ID0gc3RyaW5nIHwgT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXG5leHBvcnQgaW50ZXJmYWNlIFRhYmxlU2V0dGluZ3NPcHRpb25zIHtcbiAgcGFuZXM/OiBUYWJsZVNldHRpbmdzUGFuZVtdO1xuICBjb250ZW50PzogYW55O1xuICB0aXRsZT86IGFueTtcbiAgdGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbWF4LWNsYXNzZXMtcGVyLWZpbGVcbmV4cG9ydCBjbGFzcyBUYWJsZVNldHRpbmdzIHtcbiAgY29udGVudDogYW55O1xuICB0aXRsZTogYW55O1xuICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgcHJvdGVjdGVkIHBhbmVzOiBUYWJsZVNldHRpbmdzUGFuZVtdID0gW107XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogVGFibGVTZXR0aW5nc09wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5wYW5lcykge1xuICAgICAgdGhpcy5wYW5lcyA9IG9wdGlvbnMucGFuZXM7XG4gICAgfVxuICAgIHRoaXMuY29udGVudCA9IG9wdGlvbnMuY29udGVudDtcbiAgICB0aGlzLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcbiAgICB0aGlzLnRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZTtcbiAgfVxuXG4gIGFkZFBhbmUocGFuZU9yT3B0aW9uczogVGFibGVTZXR0aW5nc1BhbmUgfCBUYWJsZVNldHRpbmdzUGFuZU9wdGlvbnMpIHtcbiAgICBpZiAocGFuZU9yT3B0aW9ucyBpbnN0YW5jZW9mIFRhYmxlU2V0dGluZ3NQYW5lKSB7XG4gICAgICB0aGlzLnBhbmVzLnB1c2gocGFuZU9yT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZXMucHVzaChuZXcgVGFibGVTZXR0aW5nc1BhbmUocGFuZU9yT3B0aW9ucykpO1xuICAgIH1cbiAgfVxuXG4gIHNldFBhbmVzKHBhbmVzOiBUYWJsZVNldHRpbmdzUGFuZVtdKSB7XG4gICAgdGhpcy5wYW5lcyA9IHBhbmVzO1xuICB9XG5cbiAgZ2V0UGFuZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZXM7XG4gIH1cblxuICBnZXRDb250ZW50KCkge1xuICAgIGlmIChpc09ic2VydmFibGUodGhpcy5jb250ZW50KSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gb2YodGhpcy5jb250ZW50KTtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICBsZXQganNvblBhbmVzID0gW107XG4gICAgaWYgKHRoaXMucGFuZXMpIHtcbiAgICAgIGpzb25QYW5lcyA9IHRoaXMucGFuZXMubWFwKChwYW5lKSA9PiBwYW5lLnRvSlNPTigpKTtcbiAgICB9XG4gICAgY29uc3QganNvbkNvbnRlbnQgPSB0aGlzLmNvbnRlbnQgPyB0aGlzLmNvbnRlbnQudG9TdHJpbmcoKSA6IG51bGw7XG4gICAgY29uc3QganNvblRpdGxlID0gdGhpcy50aXRsZSA/IHRoaXMudGl0bGUudG9TdHJpbmcoKSA6IG51bGw7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGpzb25Db250ZW50LFxuICAgICAgdGl0bGU6IGpzb25UaXRsZSxcbiAgICAgIHBhbmVzOiBqc29uUGFuZXMsXG4gICAgfTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRvSlNPTigpKTtcbiAgfVxuXG4gIGNvbW1pdCgpIHtcbiAgICB0aGlzLnBhbmVzLmZvckVhY2goKHBhbmUpID0+IHBhbmUuY29tbWl0KCkpO1xuICB9XG59XG4iXX0=