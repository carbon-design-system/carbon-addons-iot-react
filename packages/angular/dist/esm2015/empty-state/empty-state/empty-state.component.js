/**
 *
 * @ai-apps/angular v2.155.1 | empty-state.component.js
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


import { Component, Input, TemplateRef } from '@angular/core';
export class EmptyStateComponent {
    isTemplate(value) {
        return value instanceof TemplateRef;
    }
}
EmptyStateComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-empty-state',
                template: `
    <div class="iot--empty-state">
      <div class="iot--empty-state--content">
        <ng-container *ngIf="icon !== 'no-icon'">
          <ng-container *ngIf="isTemplate(icon)" [ngTemplateOutlet]="$any(icon)"></ng-container>
          <ng-container *ngIf="!isTemplate(icon)" [ngSwitch]="icon">
            <empty-state-no-results-icon
              *ngSwitchCase="'no-results'"
              iconClass="iot--empty-state--icon"
            >
            </empty-state-no-results-icon>
            <empty-state-404-icon *ngSwitchCase="'error404'" iconClass="iot--empty-state--icon">
            </empty-state-404-icon>
            <empty-state-not-authorized-icon
              *ngSwitchCase="'not-authorized'"
              iconClass="iot--empty-state--icon"
            >
            </empty-state-not-authorized-icon>
            <empty-state-success-icon *ngSwitchCase="'success'" iconClass="iot--empty-state--icon">
            </empty-state-success-icon>
            <empty-state-error-icon *ngSwitchCase="'error'" iconClass="iot--empty-state--icon">
            </empty-state-error-icon>
            <empty-state-default-icon *ngSwitchDefault iconClass="iot--empty-state--icon">
            </empty-state-default-icon>
          </ng-container>
        </ng-container>
        <ng-content select="[aiEmptyStateTitle]"></ng-content>
        <ng-content select="[aiEmptyStateBody]"></ng-content>
        <ng-content select="ai-empty-state-action"></ng-content>
        <ng-content select="ai-empty-state-secondary-action"></ng-content>
      </div>
    </div>
  `
            },] }
];
EmptyStateComponent.propDecorators = {
    icon: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHktc3RhdGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VtcHR5LXN0YXRlL2VtcHR5LXN0YXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFzQzlELE1BQU0sT0FBTyxtQkFBbUI7SUFXdkIsVUFBVSxDQUFDLEtBQVU7UUFDMUIsT0FBTyxLQUFLLFlBQVksV0FBVyxDQUFDO0lBQ3RDLENBQUM7OztZQWpERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdDVDthQUNGOzs7bUJBRUUsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWVtcHR5LXN0YXRlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaW90LS1lbXB0eS1zdGF0ZVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImlvdC0tZW1wdHktc3RhdGUtLWNvbnRlbnRcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImljb24gIT09ICduby1pY29uJ1wiPlxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1RlbXBsYXRlKGljb24pXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiJGFueShpY29uKVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhaXNUZW1wbGF0ZShpY29uKVwiIFtuZ1N3aXRjaF09XCJpY29uXCI+XG4gICAgICAgICAgICA8ZW1wdHktc3RhdGUtbm8tcmVzdWx0cy1pY29uXG4gICAgICAgICAgICAgICpuZ1N3aXRjaENhc2U9XCInbm8tcmVzdWx0cydcIlxuICAgICAgICAgICAgICBpY29uQ2xhc3M9XCJpb3QtLWVtcHR5LXN0YXRlLS1pY29uXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvZW1wdHktc3RhdGUtbm8tcmVzdWx0cy1pY29uPlxuICAgICAgICAgICAgPGVtcHR5LXN0YXRlLTQwNC1pY29uICpuZ1N3aXRjaENhc2U9XCInZXJyb3I0MDQnXCIgaWNvbkNsYXNzPVwiaW90LS1lbXB0eS1zdGF0ZS0taWNvblwiPlxuICAgICAgICAgICAgPC9lbXB0eS1zdGF0ZS00MDQtaWNvbj5cbiAgICAgICAgICAgIDxlbXB0eS1zdGF0ZS1ub3QtYXV0aG9yaXplZC1pY29uXG4gICAgICAgICAgICAgICpuZ1N3aXRjaENhc2U9XCInbm90LWF1dGhvcml6ZWQnXCJcbiAgICAgICAgICAgICAgaWNvbkNsYXNzPVwiaW90LS1lbXB0eS1zdGF0ZS0taWNvblwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8L2VtcHR5LXN0YXRlLW5vdC1hdXRob3JpemVkLWljb24+XG4gICAgICAgICAgICA8ZW1wdHktc3RhdGUtc3VjY2Vzcy1pY29uICpuZ1N3aXRjaENhc2U9XCInc3VjY2VzcydcIiBpY29uQ2xhc3M9XCJpb3QtLWVtcHR5LXN0YXRlLS1pY29uXCI+XG4gICAgICAgICAgICA8L2VtcHR5LXN0YXRlLXN1Y2Nlc3MtaWNvbj5cbiAgICAgICAgICAgIDxlbXB0eS1zdGF0ZS1lcnJvci1pY29uICpuZ1N3aXRjaENhc2U9XCInZXJyb3InXCIgaWNvbkNsYXNzPVwiaW90LS1lbXB0eS1zdGF0ZS0taWNvblwiPlxuICAgICAgICAgICAgPC9lbXB0eS1zdGF0ZS1lcnJvci1pY29uPlxuICAgICAgICAgICAgPGVtcHR5LXN0YXRlLWRlZmF1bHQtaWNvbiAqbmdTd2l0Y2hEZWZhdWx0IGljb25DbGFzcz1cImlvdC0tZW1wdHktc3RhdGUtLWljb25cIj5cbiAgICAgICAgICAgIDwvZW1wdHktc3RhdGUtZGVmYXVsdC1pY29uPlxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2FpRW1wdHlTdGF0ZVRpdGxlXVwiPjwvbmctY29udGVudD5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2FpRW1wdHlTdGF0ZUJvZHldXCI+PC9uZy1jb250ZW50PlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJhaS1lbXB0eS1zdGF0ZS1hY3Rpb25cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImFpLWVtcHR5LXN0YXRlLXNlY29uZGFyeS1hY3Rpb25cIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgRW1wdHlTdGF0ZUNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGljb246XG4gICAgfCAnZGVmYXVsdCdcbiAgICB8ICdlcnJvcidcbiAgICB8ICdlcnJvcjQwNCdcbiAgICB8ICdub3QtYXV0aG9yaXplZCdcbiAgICB8ICduby1yZXN1bHRzJ1xuICAgIHwgJ3N1Y2Nlc3MnXG4gICAgfCAnbm8taWNvbidcbiAgICB8IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgcHVibGljIGlzVGVtcGxhdGUodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmO1xuICB9XG59XG4iXX0=