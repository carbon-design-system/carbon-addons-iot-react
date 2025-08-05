/**
 *
 * @ai-apps/angular v2.155.1 | tab.component.js
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


import { Component, Input } from '@angular/core';
import { Tab } from 'carbon-components-angular';
import { TabController } from './tab-controller.class';
export class TabComponent extends Tab {
    ngOnInit() {
        // use a subscription to set this.active since that affects a number of other
        // tab internals
        this.selectionSubscription = this.controller.selection.subscribe((key) => {
            this.active = key === this.key;
        });
    }
    ngOnDestroy() {
        this.selectionSubscription.unsubscribe();
    }
}
TabComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-tab',
                template: `
    <div
      [attr.tabindex]="tabIndex"
      role="tabpanel"
      *ngIf="shouldRender()"
      class="bx--tab-content"
      [ngStyle]="{
        display: active ? null : 'none'
      }"
      [attr.aria-labelledby]="id + '-header'"
      aria-live="polite"
    >
      <ng-content></ng-content>
    </div>
  `
            },] }
];
TabComponent.propDecorators = {
    key: [{ type: Input }],
    controller: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90YWJzL3RhYi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVoRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFvQnZELE1BQU0sT0FBTyxZQUFhLFNBQVEsR0FBRztJQU1uQyxRQUFRO1FBQ04sNkVBQTZFO1FBQzdFLGdCQUFnQjtRQUNoQixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDdkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNDLENBQUM7OztZQWxDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7R0FjVDthQUNGOzs7a0JBRUUsS0FBSzt5QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRhYiB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBUYWJDb250cm9sbGVyIH0gZnJvbSAnLi90YWItY29udHJvbGxlci5jbGFzcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLXRhYicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgW2F0dHIudGFiaW5kZXhdPVwidGFiSW5kZXhcIlxuICAgICAgcm9sZT1cInRhYnBhbmVsXCJcbiAgICAgICpuZ0lmPVwic2hvdWxkUmVuZGVyKClcIlxuICAgICAgY2xhc3M9XCJieC0tdGFiLWNvbnRlbnRcIlxuICAgICAgW25nU3R5bGVdPVwie1xuICAgICAgICBkaXNwbGF5OiBhY3RpdmUgPyBudWxsIDogJ25vbmUnXG4gICAgICB9XCJcbiAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJpZCArICctaGVhZGVyJ1wiXG4gICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgID5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgVGFiQ29tcG9uZW50IGV4dGVuZHMgVGFiIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBrZXk6IHN0cmluZztcbiAgQElucHV0KCkgY29udHJvbGxlcjogVGFiQ29udHJvbGxlcjtcblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gdXNlIGEgc3Vic2NyaXB0aW9uIHRvIHNldCB0aGlzLmFjdGl2ZSBzaW5jZSB0aGF0IGFmZmVjdHMgYSBudW1iZXIgb2Ygb3RoZXJcbiAgICAvLyB0YWIgaW50ZXJuYWxzXG4gICAgdGhpcy5zZWxlY3Rpb25TdWJzY3JpcHRpb24gPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnN1YnNjcmliZSgoa2V5KSA9PiB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IGtleSA9PT0gdGhpcy5rZXk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnNlbGVjdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=