/**
 *
 * @ai-apps/angular v2.155.1 | card.component.js
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


import { Component, ElementRef, HostBinding, Input, Optional, SkipSelf, } from '@angular/core';
import { CardService } from './card.service';
const ɵ0 = (parentCardService) => {
    return parentCardService || new CardService();
};
/**
 * Provider for `CardService` that lets us either use a service provided to us
 * by the parent injector, or fall back to a new instance for this component tree.
 */
const CARD_SERVICE_PROVIDER = {
    provide: CardService,
    deps: [[new Optional(), new SkipSelf(), CardService]],
    useFactory: ɵ0,
};
export class CardComponent {
    constructor(cardService, elementRef) {
        this.cardService = cardService;
        this.elementRef = elementRef;
        this.defaultHeight = null;
        this.expanded = false;
        this.cardClass = true;
        this.wrapperClass = true;
        this.selected = false;
        this.role = 'presentation';
    }
    ngOnChanges(changes) {
        if (changes.expanded) {
            this.cardService.setExpanded(changes.expanded.currentValue);
        }
    }
    ngOnInit() {
        if (this.defaultHeight) {
            this.cardService.setCardHeight(this.defaultHeight);
        }
    }
    ngAfterViewInit() {
        const hostElement = this.elementRef.nativeElement;
        hostElement.style.setProperty('--card-default-height', this.cardService.getCardHeight());
    }
}
CardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card',
                template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    <ng-container *ngIf="!expanded" [ngTemplateOutlet]="content"></ng-container>
    <div *ngIf="expanded" class="bx--modal is-visible">
      <div class="iot--card iot--card--wrapper expanded">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </div>
    </div>
  `,
                providers: [CARD_SERVICE_PROVIDER],
                styles: [`
      .expanded {
        height: calc(100% - 50px);
        width: calc(100% - 50px);
      }
    `]
            },] }
];
CardComponent.ctorParameters = () => [
    { type: CardService },
    { type: ElementRef }
];
CardComponent.propDecorators = {
    defaultHeight: [{ type: Input }],
    expanded: [{ type: Input }],
    cardClass: [{ type: HostBinding, args: ['class.iot--card',] }],
    wrapperClass: [{ type: HostBinding, args: ['class.iot--card--wrapper',] }],
    selected: [{ type: HostBinding, args: ['class.iot--card--wrapper__selected',] }, { type: Input }],
    role: [{ type: HostBinding, args: ['attr.role',] }]
};
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2FyZC9jYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixXQUFXLEVBQ1gsS0FBSyxFQUdMLFFBQVEsRUFFUixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO1dBUy9CLENBQUMsaUJBQThCLEVBQUUsRUFBRTtJQUM3QyxPQUFPLGlCQUFpQixJQUFJLElBQUksV0FBVyxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQVRIOzs7R0FHRztBQUNILE1BQU0scUJBQXFCLEdBQUc7SUFDNUIsT0FBTyxFQUFFLFdBQVc7SUFDcEIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDckQsVUFBVSxJQUVUO0NBQ0YsQ0FBQztBQXlCRixNQUFNLE9BQU8sYUFBYTtJQVF4QixZQUFzQixXQUF3QixFQUFZLFVBQXNCO1FBQTFELGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQVksZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQVB2RSxrQkFBYSxHQUFXLElBQUksQ0FBQztRQUM3QixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ00sY0FBUyxHQUFHLElBQUksQ0FBQztRQUNSLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ0QsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNuRCxTQUFJLEdBQUcsY0FBYyxDQUFDO0lBRW1DLENBQUM7SUFFcEYsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzdEO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixNQUFNLFdBQVcsR0FBZ0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDL0QsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQzNGLENBQUM7OztZQWhERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFFBQVEsRUFBRTs7Ozs7Ozs7OztHQVVUO2dCQUNELFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO3lCQUVoQzs7Ozs7S0FLQzthQUVKOzs7WUFwQ1EsV0FBVztZQVRsQixVQUFVOzs7NEJBK0NULEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxXQUFXLFNBQUMsaUJBQWlCOzJCQUM3QixXQUFXLFNBQUMsMEJBQTBCO3VCQUN0QyxXQUFXLFNBQUMsb0NBQW9DLGNBQUcsS0FBSzttQkFDeEQsV0FBVyxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBTa2lwU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYXJkU2VydmljZSB9IGZyb20gJy4vY2FyZC5zZXJ2aWNlJztcblxuLyoqXG4gKiBQcm92aWRlciBmb3IgYENhcmRTZXJ2aWNlYCB0aGF0IGxldHMgdXMgZWl0aGVyIHVzZSBhIHNlcnZpY2UgcHJvdmlkZWQgdG8gdXNcbiAqIGJ5IHRoZSBwYXJlbnQgaW5qZWN0b3IsIG9yIGZhbGwgYmFjayB0byBhIG5ldyBpbnN0YW5jZSBmb3IgdGhpcyBjb21wb25lbnQgdHJlZS5cbiAqL1xuY29uc3QgQ0FSRF9TRVJWSUNFX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBDYXJkU2VydmljZSxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIENhcmRTZXJ2aWNlXV0sXG4gIHVzZUZhY3Rvcnk6IChwYXJlbnRDYXJkU2VydmljZTogQ2FyZFNlcnZpY2UpID0+IHtcbiAgICByZXR1cm4gcGFyZW50Q2FyZFNlcnZpY2UgfHwgbmV3IENhcmRTZXJ2aWNlKCk7XG4gIH0sXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhaS1jYXJkJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI2NvbnRlbnQ+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWV4cGFuZGVkXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGVudFwiPjwvbmctY29udGFpbmVyPlxuICAgIDxkaXYgKm5nSWY9XCJleHBhbmRlZFwiIGNsYXNzPVwiYngtLW1vZGFsIGlzLXZpc2libGVcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpb3QtLWNhcmQgaW90LS1jYXJkLS13cmFwcGVyIGV4cGFuZGVkXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGVudFwiPjwvbmctY29udGFpbmVyPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHByb3ZpZGVyczogW0NBUkRfU0VSVklDRV9QUk9WSURFUl0sXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIC5leHBhbmRlZCB7XG4gICAgICAgIGhlaWdodDogY2FsYygxMDAlIC0gNTBweCk7XG4gICAgICAgIHdpZHRoOiBjYWxjKDEwMCUgLSA1MHB4KTtcbiAgICAgIH1cbiAgICBgLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBDYXJkQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBkZWZhdWx0SGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuICBASW5wdXQoKSBleHBhbmRlZCA9IGZhbHNlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tY2FyZCcpIGNhcmRDbGFzcyA9IHRydWU7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1jYXJkLS13cmFwcGVyJykgd3JhcHBlckNsYXNzID0gdHJ1ZTtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWNhcmQtLXdyYXBwZXJfX3NlbGVjdGVkJykgQElucHV0KCkgc2VsZWN0ZWQgPSBmYWxzZTtcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKSByb2xlID0gJ3ByZXNlbnRhdGlvbic7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNhcmRTZXJ2aWNlOiBDYXJkU2VydmljZSwgcHJvdGVjdGVkIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmV4cGFuZGVkKSB7XG4gICAgICB0aGlzLmNhcmRTZXJ2aWNlLnNldEV4cGFuZGVkKGNoYW5nZXMuZXhwYW5kZWQuY3VycmVudFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5kZWZhdWx0SGVpZ2h0KSB7XG4gICAgICB0aGlzLmNhcmRTZXJ2aWNlLnNldENhcmRIZWlnaHQodGhpcy5kZWZhdWx0SGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgY29uc3QgaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaG9zdEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tY2FyZC1kZWZhdWx0LWhlaWdodCcsIHRoaXMuY2FyZFNlcnZpY2UuZ2V0Q2FyZEhlaWdodCgpKTtcbiAgfVxufVxuIl19