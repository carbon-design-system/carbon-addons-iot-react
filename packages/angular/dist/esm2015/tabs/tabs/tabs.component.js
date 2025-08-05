/**
 *
 * @ai-apps/angular v2.155.1 | tabs.component.js
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


import { Component, ElementRef, Input, TemplateRef } from '@angular/core';
import { TabController } from './tab-controller.class';
export class TabsComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        /**
         * Template to bind to header titles (optional).
         * Tab item is passed in as context.
         *
         * For example:
         *
         * controller = new TabController([
         *  {
         *    title: 'One',
         *    icon: 'edit'
         *  }
         * ]);
         *
         * // Tab items are passed in as context in the form "{tab: tab}" so the let-<your_var_name>="tab" is necessary
         * <ng-template #titleTpl let-tab="tab">
         *  <svg *ngIf="tab.icon" [ibmIcon]="tab.icon" size="16"></svg>
         *  {{ tab.title }}
         * </ng-template>
         *
         * <ai-tabs [controller]="controller" [titleTpl]="titleTpl"></ai-tabs>
         */
        this.titleTpl = null;
    }
    onSelected(key) {
        this.controller.selectTab(key);
    }
    getMaxWidth() {
        const actions = this.elementRef.nativeElement.querySelector('ai-tab-actions');
        if (!actions) {
            return null;
        }
        return `calc(100% - ${getComputedStyle(actions).width})`;
    }
}
TabsComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-tabs',
                template: `
    <ibm-tab-header-group
      [ngStyle]="{
        'max-width': getMaxWidth()
      }"
    >
      <ai-tab-header
        *ngFor="let tab of controller.getTabs()"
        [active]="(controller.selection | async) === tab.key"
        [tab]="tab"
        [actions]="tab.actions"
        (selected)="onSelected(tab.key)"
      >
        <div class="iot--tab__title-container">
          <span *ngIf="!titleTpl">{{ tab.title }}</span>
          <ng-container
            *ngIf="titleTpl"
            [ngTemplateOutlet]="titleTpl"
            [ngTemplateOutletContext]="{ tab: tab }"
          >
          </ng-container>
        </div>
      </ai-tab-header>
    </ibm-tab-header-group>
    <ng-content select="ai-tab-actions"></ng-content>
  `,
                styles: [`
      :host {
        display: flex;
      }
    `]
            },] }
];
TabsComponent.ctorParameters = () => [
    { type: ElementRef }
];
TabsComponent.propDecorators = {
    controller: [{ type: Input }],
    titleTpl: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdGFicy90YWJzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQXNDdkQsTUFBTSxPQUFPLGFBQWE7SUF5QnhCLFlBQXNCLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUF2QjVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQW9CRztRQUNNLGFBQVEsR0FBcUIsSUFBSSxDQUFDO0lBRUksQ0FBQztJQUVoRCxVQUFVLENBQUMsR0FBRztRQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLGVBQWUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7SUFDM0QsQ0FBQzs7O1lBekVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUJUO3lCQUVDOzs7O0tBSUM7YUFFSjs7O1lBdENtQixVQUFVOzs7eUJBd0MzQixLQUFLO3VCQXNCTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRhYkNvbnRyb2xsZXIgfSBmcm9tICcuL3RhYi1jb250cm9sbGVyLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktdGFicycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGlibS10YWItaGVhZGVyLWdyb3VwXG4gICAgICBbbmdTdHlsZV09XCJ7XG4gICAgICAgICdtYXgtd2lkdGgnOiBnZXRNYXhXaWR0aCgpXG4gICAgICB9XCJcbiAgICA+XG4gICAgICA8YWktdGFiLWhlYWRlclxuICAgICAgICAqbmdGb3I9XCJsZXQgdGFiIG9mIGNvbnRyb2xsZXIuZ2V0VGFicygpXCJcbiAgICAgICAgW2FjdGl2ZV09XCIoY29udHJvbGxlci5zZWxlY3Rpb24gfCBhc3luYykgPT09IHRhYi5rZXlcIlxuICAgICAgICBbdGFiXT1cInRhYlwiXG4gICAgICAgIFthY3Rpb25zXT1cInRhYi5hY3Rpb25zXCJcbiAgICAgICAgKHNlbGVjdGVkKT1cIm9uU2VsZWN0ZWQodGFiLmtleSlcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW90LS10YWJfX3RpdGxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxzcGFuICpuZ0lmPVwiIXRpdGxlVHBsXCI+e3sgdGFiLnRpdGxlIH19PC9zcGFuPlxuICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICpuZ0lmPVwidGl0bGVUcGxcIlxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGl0bGVUcGxcIlxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgdGFiOiB0YWIgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvYWktdGFiLWhlYWRlcj5cbiAgICA8L2libS10YWItaGVhZGVyLWdyb3VwPlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImFpLXRhYi1hY3Rpb25zXCI+PC9uZy1jb250ZW50PlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgVGFic0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGNvbnRyb2xsZXI6IFRhYkNvbnRyb2xsZXI7XG4gIC8qKlxuICAgKiBUZW1wbGF0ZSB0byBiaW5kIHRvIGhlYWRlciB0aXRsZXMgKG9wdGlvbmFsKS5cbiAgICogVGFiIGl0ZW0gaXMgcGFzc2VkIGluIGFzIGNvbnRleHQuXG4gICAqXG4gICAqIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBjb250cm9sbGVyID0gbmV3IFRhYkNvbnRyb2xsZXIoW1xuICAgKiAge1xuICAgKiAgICB0aXRsZTogJ09uZScsXG4gICAqICAgIGljb246ICdlZGl0J1xuICAgKiAgfVxuICAgKiBdKTtcbiAgICpcbiAgICogLy8gVGFiIGl0ZW1zIGFyZSBwYXNzZWQgaW4gYXMgY29udGV4dCBpbiB0aGUgZm9ybSBcInt0YWI6IHRhYn1cIiBzbyB0aGUgbGV0LTx5b3VyX3Zhcl9uYW1lPj1cInRhYlwiIGlzIG5lY2Vzc2FyeVxuICAgKiA8bmctdGVtcGxhdGUgI3RpdGxlVHBsIGxldC10YWI9XCJ0YWJcIj5cbiAgICogIDxzdmcgKm5nSWY9XCJ0YWIuaWNvblwiIFtpYm1JY29uXT1cInRhYi5pY29uXCIgc2l6ZT1cIjE2XCI+PC9zdmc+XG4gICAqICB7eyB0YWIudGl0bGUgfX1cbiAgICogPC9uZy10ZW1wbGF0ZT5cbiAgICpcbiAgICogPGFpLXRhYnMgW2NvbnRyb2xsZXJdPVwiY29udHJvbGxlclwiIFt0aXRsZVRwbF09XCJ0aXRsZVRwbFwiPjwvYWktdGFicz5cbiAgICovXG4gIEBJbnB1dCgpIHRpdGxlVHBsOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cblxuICBvblNlbGVjdGVkKGtleSkge1xuICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3RUYWIoa2V5KTtcbiAgfVxuXG4gIGdldE1heFdpZHRoKCkge1xuICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhaS10YWItYWN0aW9ucycpO1xuICAgIGlmICghYWN0aW9ucykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBgY2FsYygxMDAlIC0gJHtnZXRDb21wdXRlZFN0eWxlKGFjdGlvbnMpLndpZHRofSlgO1xuICB9XG59XG4iXX0=