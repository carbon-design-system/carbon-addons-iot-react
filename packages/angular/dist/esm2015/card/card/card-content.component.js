/**
 *
 * @ai-apps/angular v2.155.1 | card-content.component.js
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


import { Component, ElementRef, HostBinding, Input, TemplateRef, } from '@angular/core';
import { CardService } from './card.service';
export class CardContentComponent {
    constructor(cardService, elementRef) {
        this.cardService = cardService;
        this.elementRef = elementRef;
        this.contentClass = true;
        this.expandedClass = false;
        this.isEmpty = false;
    }
    ngOnInit() {
        this.cardService.onExpand((value) => {
            this.expandedClass = value;
        });
    }
    ngAfterViewInit() {
        const hostElement = this.elementRef.nativeElement;
        hostElement.style.setProperty('--card-content-height', this.cardService.getContentHeight());
    }
    isTemplate(value) {
        return value instanceof TemplateRef;
    }
}
CardContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-content',
                template: `
    <ng-content></ng-content>
    <div *ngIf="isEmpty" class="iot--card--empty-message-wrapper">
      <ng-container *ngIf="!isTemplate(emptyText)">{{ emptyText }}</ng-container>
      <ng-template *ngIf="isTemplate(emptyText)" [ngTemplateOutlet]="emptyText"></ng-template>
    </div>
  `
            },] }
];
CardContentComponent.ctorParameters = () => [
    { type: CardService },
    { type: ElementRef }
];
CardContentComponent.propDecorators = {
    contentClass: [{ type: HostBinding, args: ['class.iot--card--content',] }],
    expandedClass: [{ type: HostBinding, args: ['class.iot--card--content--expanded',] }],
    emptyText: [{ type: Input }],
    isEmpty: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1jb250ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jYXJkL2NhcmQtY29udGVudC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFFTCxXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBWTdDLE1BQU0sT0FBTyxvQkFBb0I7SUFTL0IsWUFBc0IsV0FBd0IsRUFBWSxVQUFzQjtRQUExRCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFZLGVBQVUsR0FBVixVQUFVLENBQVk7UUFSdkMsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDVixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUtoRSxZQUFPLEdBQUcsS0FBSyxDQUFDO0lBRTBELENBQUM7SUFFcEYsUUFBUTtRQUNOLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZUFBZTtRQUNiLE1BQU0sV0FBVyxHQUFnQixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUMvRCxXQUFXLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRU0sVUFBVSxDQUFDLEtBQUs7UUFDckIsT0FBTyxLQUFLLFlBQVksV0FBVyxDQUFDO0lBQ3RDLENBQUM7OztZQWxDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsUUFBUSxFQUFFOzs7Ozs7R0FNVDthQUNGOzs7WUFYUSxXQUFXO1lBTmxCLFVBQVU7OzsyQkFtQlQsV0FBVyxTQUFDLDBCQUEwQjs0QkFDdEMsV0FBVyxTQUFDLG9DQUFvQzt3QkFJaEQsS0FBSztzQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uSW5pdCxcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FyZFNlcnZpY2UgfSBmcm9tICcuL2NhcmQuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWNhcmQtY29udGVudCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDxkaXYgKm5nSWY9XCJpc0VtcHR5XCIgY2xhc3M9XCJpb3QtLWNhcmQtLWVtcHR5LW1lc3NhZ2Utd3JhcHBlclwiPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFpc1RlbXBsYXRlKGVtcHR5VGV4dClcIj57eyBlbXB0eVRleHQgfX08L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cImlzVGVtcGxhdGUoZW1wdHlUZXh0KVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImVtcHR5VGV4dFwiPjwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENhcmRDb250ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWNhcmQtLWNvbnRlbnQnKSBjb250ZW50Q2xhc3MgPSB0cnVlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tY2FyZC0tY29udGVudC0tZXhwYW5kZWQnKSBleHBhbmRlZENsYXNzID0gZmFsc2U7XG4gIC8qKlxuICAgKiBleHBlY3RzIHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT5cbiAgICovXG4gIEBJbnB1dCgpIGVtcHR5VGV4dDogYW55O1xuICBASW5wdXQoKSBpc0VtcHR5ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNhcmRTZXJ2aWNlOiBDYXJkU2VydmljZSwgcHJvdGVjdGVkIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jYXJkU2VydmljZS5vbkV4cGFuZCgodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuZXhwYW5kZWRDbGFzcyA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IGhvc3RFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGhvc3RFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWNhcmQtY29udGVudC1oZWlnaHQnLCB0aGlzLmNhcmRTZXJ2aWNlLmdldENvbnRlbnRIZWlnaHQoKSk7XG4gIH1cblxuICBwdWJsaWMgaXNUZW1wbGF0ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmO1xuICB9XG59XG4iXX0=