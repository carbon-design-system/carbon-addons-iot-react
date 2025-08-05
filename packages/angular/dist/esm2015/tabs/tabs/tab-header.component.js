/**
 *
 * @ai-apps/angular v2.155.1 | tab-header.component.js
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


import { Component, ElementRef, Input, } from '@angular/core';
import { DocumentService } from 'carbon-components-angular';
import { TabHeader as IBMTabHeader } from 'carbon-components-angular/tabs';
export class TabHeader extends IBMTabHeader {
    constructor(elementRef, documentService) {
        super();
        this.elementRef = elementRef;
        this.documentService = documentService;
        this.actions = [];
        this.tabAction = null;
        this.tabActions = null;
        this.menuOpen = false;
        this.menuPosition = {
            top: 0,
            left: 0,
        };
    }
    ngOnChanges(changes) {
        var _a;
        const actions = (_a = changes.actions) === null || _a === void 0 ? void 0 : _a.currentValue;
        if (actions) {
            if (actions.length === 1) {
                this.tabAction = Object.assign({}, {
                    title: '',
                    icon: 'close',
                    onClick: () => { },
                }, actions[0]);
            }
            else if (actions.length > 1) {
                this.tabActions = actions.map((action) => Object.assign({}, {
                    title: '',
                    icon: '',
                    onClick: () => { },
                }, action));
            }
        }
    }
    ngAfterViewInit() {
        this.documentService.handleClick((event) => {
            const { nativeElement } = this.elementRef;
            if (this.menuOpen && !nativeElement.contains(event.target)) {
                this.menuOpen = false;
            }
        });
    }
    onActionClick(action) {
        action.onClick(this.tab);
        this.menuOpen = false;
    }
    onTabMenuClick(event) {
        const target = event.target;
        const button = target.closest('button');
        const buttonRect = button.getBoundingClientRect();
        const menuRect = button.parentElement
            .querySelector('.bx--context-menu')
            .getBoundingClientRect();
        this.menuOpen = !this.menuOpen;
        this.menuPosition = {
            top: buttonRect.top + buttonRect.height,
            left: buttonRect.right - menuRect.width,
        };
    }
}
TabHeader.decorators = [
    { type: Component, args: [{
                selector: 'ai-tab-header',
                template: `
    <li
      [ngClass]="{
        'bx--tabs__nav-item--selected bx--tabs--scrollable__nav-item--selected': active,
        'bx--tabs__nav-item--disabled bx--tabs--scrollable__nav-item--disabled': disabled
      }"
      class="bx--tabs--scrollable__nav-item"
      role="presentation"
      (click)="selectTab()"
    >
      <div
        class="bx--tabs--scrollable__nav-link"
        #tabItem
        [attr.aria-selected]="active"
        draggable="false"
        [title]="title"
        [attr.tabindex]="active ? 0 : -1"
        role="tab"
      >
        <div class="ai--tabs--header_content">
          <ng-content></ng-content>
        </div>
        <ng-container *ngIf="tabAction">
          <button
            ibmButton="ghost"
            class="ai--tabs--header_action"
            [title]="tabAction.title"
            (click)="onActionClick(tabAction)"
          >
            <svg [ibmIcon]="tabAction.icon" size="16"></svg>
          </button>
        </ng-container>
        <ng-container *ngIf="tabActions">
          <button
            ibmButton="ghost"
            class="ai--tabs--header_action"
            (click)="onTabMenuClick($event)"
          >
            <svg ibmIcon="overflow-menu--vertical" size="16"></svg>
          </button>
          <ibm-context-menu [open]="menuOpen" [position]="menuPosition">
            <ibm-context-menu-item
              *ngFor="let action of tabActions"
              [label]="action.title"
              [icon]="action.icon"
              (click)="onActionClick(action)"
              (keydown.enter)="onActionClick(action)"
              (keydown.space)="onActionClick(action)"
            >
            </ibm-context-menu-item>
          </ibm-context-menu>
        </ng-container>
      </div>
    </li>
  `,
                providers: [
                    {
                        provide: IBMTabHeader,
                        useExisting: TabHeader,
                    },
                ],
                styles: [`
      .bx--tabs--scrollable__nav-link {
        display: flex;
        align-items: end;
      }

      ::ng-deep .bx--tabs--scrollable .bx--tabs--scrollable__nav-link {
        padding: 0;
      }

      .ai--tabs--header_content {
        width: 100%;
        padding: 0.75rem 1rem 0.5rem;
      }

      .ai--tabs--header_action {
        padding: 0;
        min-height: 0;
        height: 1.5rem;
        width: 1.5rem;
        align-content: center;
        justify-content: center;
        margin-bottom: 0.3rem;
        margin-right: 0.5rem;
      }
    `]
            },] }
];
TabHeader.ctorParameters = () => [
    { type: ElementRef },
    { type: DocumentService }
];
TabHeader.propDecorators = {
    tab: [{ type: Input }],
    actions: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdGFicy90YWItaGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEdBR04sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTVELE9BQU8sRUFBRSxTQUFTLElBQUksWUFBWSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUErRjNFLE1BQU0sT0FBTyxTQUFVLFNBQVEsWUFBWTtJQVl6QyxZQUFzQixVQUFzQixFQUFZLGVBQWdDO1FBQ3RGLEtBQUssRUFBRSxDQUFDO1FBRFksZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFZLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQVYvRSxZQUFPLEdBQWdCLEVBQUUsQ0FBQztRQUVuQyxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixpQkFBWSxHQUFHO1lBQ2IsR0FBRyxFQUFFLENBQUM7WUFDTixJQUFJLEVBQUUsQ0FBQztTQUNSLENBQUM7SUFJRixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCOztRQUNoQyxNQUFNLE9BQU8sU0FBRyxPQUFPLENBQUMsT0FBTywwQ0FBRSxZQUFZLENBQUM7UUFDOUMsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQzVCLEVBQUUsRUFDRjtvQkFDRSxLQUFLLEVBQUUsRUFBRTtvQkFDVCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztpQkFDbEIsRUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQ1gsQ0FBQzthQUNIO2lCQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQ1gsRUFBRSxFQUNGO29CQUNFLEtBQUssRUFBRSxFQUFFO29CQUNULElBQUksRUFBRSxFQUFFO29CQUNSLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO2lCQUNsQixFQUNELE1BQU0sQ0FDUCxDQUNGLENBQUM7YUFDSDtTQUNGO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3pDLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBbUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUMxRSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFxQixDQUFDLEVBQUU7Z0JBQ3pFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsYUFBYSxDQUFDLE1BQWlCO1FBQzdCLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBaUI7UUFDOUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQXFCLENBQUM7UUFDM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsYUFBYTthQUNsQyxhQUFhLENBQUMsbUJBQW1CLENBQUM7YUFDbEMscUJBQXFCLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHO1lBQ2xCLEdBQUcsRUFBRSxVQUFVLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxNQUFNO1lBQ3ZDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLO1NBQ3hDLENBQUM7SUFDSixDQUFDOzs7WUFuS0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNEVDtnQkE2QkQsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxZQUFZO3dCQUNyQixXQUFXLEVBQUUsU0FBUztxQkFDdkI7aUJBQ0Y7eUJBaENDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBeUJDO2FBUUo7OztZQXJHQyxVQUFVO1lBS0gsZUFBZTs7O2tCQWtHckIsS0FBSztzQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvY3VtZW50U2VydmljZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG5pbXBvcnQgeyBUYWJIZWFkZXIgYXMgSUJNVGFiSGVhZGVyIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhci90YWJzJztcbmltcG9ydCB7IFRhYiwgVGFiQWN0aW9uIH0gZnJvbSAnLi90YWIuaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktdGFiLWhlYWRlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGxpXG4gICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICdieC0tdGFic19fbmF2LWl0ZW0tLXNlbGVjdGVkIGJ4LS10YWJzLS1zY3JvbGxhYmxlX19uYXYtaXRlbS0tc2VsZWN0ZWQnOiBhY3RpdmUsXG4gICAgICAgICdieC0tdGFic19fbmF2LWl0ZW0tLWRpc2FibGVkIGJ4LS10YWJzLS1zY3JvbGxhYmxlX19uYXYtaXRlbS0tZGlzYWJsZWQnOiBkaXNhYmxlZFxuICAgICAgfVwiXG4gICAgICBjbGFzcz1cImJ4LS10YWJzLS1zY3JvbGxhYmxlX19uYXYtaXRlbVwiXG4gICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgIChjbGljayk9XCJzZWxlY3RUYWIoKVwiXG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImJ4LS10YWJzLS1zY3JvbGxhYmxlX19uYXYtbGlua1wiXG4gICAgICAgICN0YWJJdGVtXG4gICAgICAgIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiYWN0aXZlXCJcbiAgICAgICAgZHJhZ2dhYmxlPVwiZmFsc2VcIlxuICAgICAgICBbdGl0bGVdPVwidGl0bGVcIlxuICAgICAgICBbYXR0ci50YWJpbmRleF09XCJhY3RpdmUgPyAwIDogLTFcIlxuICAgICAgICByb2xlPVwidGFiXCJcbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFpLS10YWJzLS1oZWFkZXJfY29udGVudFwiPlxuICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0YWJBY3Rpb25cIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBpYm1CdXR0b249XCJnaG9zdFwiXG4gICAgICAgICAgICBjbGFzcz1cImFpLS10YWJzLS1oZWFkZXJfYWN0aW9uXCJcbiAgICAgICAgICAgIFt0aXRsZV09XCJ0YWJBY3Rpb24udGl0bGVcIlxuICAgICAgICAgICAgKGNsaWNrKT1cIm9uQWN0aW9uQ2xpY2sodGFiQWN0aW9uKVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHN2ZyBbaWJtSWNvbl09XCJ0YWJBY3Rpb24uaWNvblwiIHNpemU9XCIxNlwiPjwvc3ZnPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInRhYkFjdGlvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBpYm1CdXR0b249XCJnaG9zdFwiXG4gICAgICAgICAgICBjbGFzcz1cImFpLS10YWJzLS1oZWFkZXJfYWN0aW9uXCJcbiAgICAgICAgICAgIChjbGljayk9XCJvblRhYk1lbnVDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3ZnIGlibUljb249XCJvdmVyZmxvdy1tZW51LS12ZXJ0aWNhbFwiIHNpemU9XCIxNlwiPjwvc3ZnPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxpYm0tY29udGV4dC1tZW51IFtvcGVuXT1cIm1lbnVPcGVuXCIgW3Bvc2l0aW9uXT1cIm1lbnVQb3NpdGlvblwiPlxuICAgICAgICAgICAgPGlibS1jb250ZXh0LW1lbnUtaXRlbVxuICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgYWN0aW9uIG9mIHRhYkFjdGlvbnNcIlxuICAgICAgICAgICAgICBbbGFiZWxdPVwiYWN0aW9uLnRpdGxlXCJcbiAgICAgICAgICAgICAgW2ljb25dPVwiYWN0aW9uLmljb25cIlxuICAgICAgICAgICAgICAoY2xpY2spPVwib25BY3Rpb25DbGljayhhY3Rpb24pXCJcbiAgICAgICAgICAgICAgKGtleWRvd24uZW50ZXIpPVwib25BY3Rpb25DbGljayhhY3Rpb24pXCJcbiAgICAgICAgICAgICAgKGtleWRvd24uc3BhY2UpPVwib25BY3Rpb25DbGljayhhY3Rpb24pXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvaWJtLWNvbnRleHQtbWVudS1pdGVtPlxuICAgICAgICAgIDwvaWJtLWNvbnRleHQtbWVudT5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8L2Rpdj5cbiAgICA8L2xpPlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICAuYngtLXRhYnMtLXNjcm9sbGFibGVfX25hdi1saW5rIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGVuZDtcbiAgICAgIH1cblxuICAgICAgOjpuZy1kZWVwIC5ieC0tdGFicy0tc2Nyb2xsYWJsZSAuYngtLXRhYnMtLXNjcm9sbGFibGVfX25hdi1saW5rIHtcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgIH1cblxuICAgICAgLmFpLS10YWJzLS1oZWFkZXJfY29udGVudCB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nOiAwLjc1cmVtIDFyZW0gMC41cmVtO1xuICAgICAgfVxuXG4gICAgICAuYWktLXRhYnMtLWhlYWRlcl9hY3Rpb24ge1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBoZWlnaHQ6IDEuNXJlbTtcbiAgICAgICAgd2lkdGg6IDEuNXJlbTtcbiAgICAgICAgYWxpZ24tY29udGVudDogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMC4zcmVtO1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDAuNXJlbTtcbiAgICAgIH1cbiAgICBgLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBJQk1UYWJIZWFkZXIsXG4gICAgICB1c2VFeGlzdGluZzogVGFiSGVhZGVyLFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIFRhYkhlYWRlciBleHRlbmRzIElCTVRhYkhlYWRlciBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIHRhYjogVGFiO1xuICBASW5wdXQoKSBhY3Rpb25zOiBUYWJBY3Rpb25bXSA9IFtdO1xuXG4gIHRhYkFjdGlvbiA9IG51bGw7XG4gIHRhYkFjdGlvbnMgPSBudWxsO1xuICBtZW51T3BlbiA9IGZhbHNlO1xuICBtZW51UG9zaXRpb24gPSB7XG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCBkb2N1bWVudFNlcnZpY2U6IERvY3VtZW50U2VydmljZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGNoYW5nZXMuYWN0aW9ucz8uY3VycmVudFZhbHVlO1xuICAgIGlmIChhY3Rpb25zKSB7XG4gICAgICBpZiAoYWN0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy50YWJBY3Rpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICAgIGljb246ICdjbG9zZScsXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjdGlvbnNbMF1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoYWN0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRoaXMudGFiQWN0aW9ucyA9IGFjdGlvbnMubWFwKChhY3Rpb24pID0+XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICAgIGljb246ICcnLFxuICAgICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhY3Rpb25cbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmhhbmRsZUNsaWNrKChldmVudCkgPT4ge1xuICAgICAgY29uc3QgeyBuYXRpdmVFbGVtZW50IH06IHsgbmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQgfSA9IHRoaXMuZWxlbWVudFJlZjtcbiAgICAgIGlmICh0aGlzLm1lbnVPcGVuICYmICFuYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgdGhpcy5tZW51T3BlbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25BY3Rpb25DbGljayhhY3Rpb246IFRhYkFjdGlvbikge1xuICAgIGFjdGlvbi5vbkNsaWNrKHRoaXMudGFiKTtcbiAgICB0aGlzLm1lbnVPcGVuID0gZmFsc2U7XG4gIH1cblxuICBvblRhYk1lbnVDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBidXR0b24gPSB0YXJnZXQuY2xvc2VzdCgnYnV0dG9uJyk7XG4gICAgY29uc3QgYnV0dG9uUmVjdCA9IGJ1dHRvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBtZW51UmVjdCA9IGJ1dHRvbi5wYXJlbnRFbGVtZW50XG4gICAgICAucXVlcnlTZWxlY3RvcignLmJ4LS1jb250ZXh0LW1lbnUnKVxuICAgICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMubWVudU9wZW4gPSAhdGhpcy5tZW51T3BlbjtcbiAgICB0aGlzLm1lbnVQb3NpdGlvbiA9IHtcbiAgICAgIHRvcDogYnV0dG9uUmVjdC50b3AgKyBidXR0b25SZWN0LmhlaWdodCxcbiAgICAgIGxlZnQ6IGJ1dHRvblJlY3QucmlnaHQgLSBtZW51UmVjdC53aWR0aCxcbiAgICB9O1xuICB9XG59XG4iXX0=