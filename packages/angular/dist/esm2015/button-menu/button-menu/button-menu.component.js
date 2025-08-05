/**
 *
 * @ai-apps/angular v2.155.1 | button-menu.component.js
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


import { Component, ElementRef, EventEmitter, HostListener, Input, Output, } from '@angular/core';
import { DocumentService } from 'carbon-components-angular';
export class ButtonMenuComponent {
    constructor(elementRef, documentService) {
        this.elementRef = elementRef;
        this.documentService = documentService;
        this.label = '';
        this.open = false;
        this.openIcon = 'chevron--down';
        this.closeIcon = 'chevron--up';
        this.iconOnly = false;
        this.split = false;
        this.alignMenu = 'left';
        this.placeMenu = 'bottom';
        this.openChange = new EventEmitter();
        this.primaryClick = new EventEmitter();
        this.position = {
            top: 0,
            left: 0,
        };
    }
    ngAfterViewInit() {
        const { nativeElement } = this.elementRef;
        const menuElement = nativeElement.querySelector('.bx--context-menu, .bx--menu');
        const dimensions = nativeElement.getBoundingClientRect();
        const menuDimensions = menuElement.getBoundingClientRect();
        // default placement (align left, place bottom)
        let left = dimensions.left;
        let top = dimensions.top + dimensions.height;
        if (this.alignMenu === 'right') {
            left = dimensions.right - menuDimensions.width;
        }
        if (this.placeMenu === 'top') {
            top = dimensions.top - menuDimensions.height;
        }
        this.position = { top, left };
        this.documentService.handleClick((event) => {
            const { nativeElement } = this.elementRef;
            if (this.open && !nativeElement.contains(event.target)) {
                this.toggleMenu();
            }
        });
    }
    toggleMenu() {
        this.open = !this.open;
        this.openChange.emit(this.open);
    }
    handleKeys(event) {
        if (event.key === 'Escape' && this.open) {
            this.toggleMenu();
            const element = this.elementRef.nativeElement;
            let button = element.querySelector('.iot--menu-button__primary');
            if (this.split || this.iconOnly) {
                button = element.querySelector('.iot--menu-button__secondary');
            }
            button.focus();
        }
    }
}
ButtonMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-button-menu',
                template: `
    <div
      [ngClass]="{
        'iot--menu-button--open': open
      }"
      class="iot--menu-button"
    >
      <ng-container *ngIf="!split && !iconOnly">
        <button
          ibmButton="primary"
          class="iot--menu-button__primary iot--menu-button__trigger"
          (click)="toggleMenu()"
        >
          {{ label }}
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
        </button>
      </ng-container>
      <ng-container *ngIf="split && !iconOnly">
        <button
          *ngIf="!iconOnly"
          ibmButton="primary"
          class="iot--menu-button__primary"
          (click)="primaryClick.emit($event)"
        >
          {{ label }}
        </button>
        <button
          ibmButton="primary"
          [iconOnly]="true"
          [hasAssistiveText]="iconOnly && !!label"
          class="iot--menu-button__secondary iot--menu-button__trigger"
          (click)="toggleMenu()"
        >
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
        </button>
      </ng-container>
      <ng-container *ngIf="iconOnly && !split">
        <button
          ibmButton="ghost"
          [iconOnly]="true"
          [hasAssistiveText]="iconOnly && !!label"
          class="iot--menu-button__secondary"
          (click)="toggleMenu()"
        >
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
          <span *ngIf="label" class="bx--assistive-text">{{ label }}</span>
        </button>
      </ng-container>
      <ibm-context-menu [open]="open" [position]="position">
        <ng-content></ng-content>
      </ibm-context-menu>
    </div>
  `,
                styles: [`
      :host {
        display: inline-block;
      }

      .iot--menu-button {
        display: inline-block;
      }

      .bx--btn__icon {
        pointer-events: none;
      }
    `]
            },] }
];
ButtonMenuComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: DocumentService }
];
ButtonMenuComponent.propDecorators = {
    label: [{ type: Input }],
    open: [{ type: Input }],
    openIcon: [{ type: Input }],
    closeIcon: [{ type: Input }],
    iconOnly: [{ type: Input }],
    split: [{ type: Input }],
    alignMenu: [{ type: Input }],
    placeMenu: [{ type: Input }],
    openChange: [{ type: Output }],
    primaryClick: [{ type: Output }],
    handleKeys: [{ type: HostListener, args: ['keyup', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2J1dHRvbi1tZW51L2J1dHRvbi1tZW51LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBNEU1RCxNQUFNLE9BQU8sbUJBQW1CO0lBaUI5QixZQUFzQixVQUFzQixFQUFZLGVBQWdDO1FBQWxFLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBWSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFoQi9FLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsYUFBUSxHQUFHLGVBQWUsQ0FBQztRQUMzQixjQUFTLEdBQUcsYUFBYSxDQUFDO1FBQzFCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsVUFBSyxHQUFHLEtBQUssQ0FBQztRQUNkLGNBQVMsR0FBcUIsTUFBTSxDQUFDO1FBQ3JDLGNBQVMsR0FBcUIsUUFBUSxDQUFDO1FBQ3RDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBQ3pDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUVqRCxhQUFRLEdBQUc7WUFDaEIsR0FBRyxFQUFFLENBQUM7WUFDTixJQUFJLEVBQUUsQ0FBQztTQUNSLENBQUM7SUFFeUYsQ0FBQztJQUU1RixlQUFlO1FBQ2IsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFtQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzFFLE1BQU0sV0FBVyxHQUFnQixhQUFhLENBQUMsYUFBYSxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDN0YsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDekQsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDM0QsK0NBQStDO1FBQy9DLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBRTdDLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxPQUFPLEVBQUU7WUFDOUIsSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQztTQUNoRDtRQUVELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLEVBQUU7WUFDNUIsR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztTQUM5QztRQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFOUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN6QyxNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQW1DLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDMUUsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBcUIsQ0FBQyxFQUFFO2dCQUNyRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDbkI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFHRCxVQUFVLENBQUMsS0FBb0I7UUFDN0IsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQTRCLENBQUM7WUFDN0QsSUFBSSxNQUFNLEdBQWdCLE9BQU8sQ0FBQyxhQUFhLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUM5RSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDL0IsTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsQ0FBQzthQUNoRTtZQUNELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7OztZQXhJRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdURUO3lCQUVDOzs7Ozs7Ozs7Ozs7S0FZQzthQUVKOzs7WUFqRkMsVUFBVTtZQU1ILGVBQWU7OztvQkE2RXJCLEtBQUs7bUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSztvQkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxNQUFNOzJCQUNOLE1BQU07eUJBeUNOLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvY3VtZW50U2VydmljZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhaS1idXR0b24tbWVudScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAnaW90LS1tZW51LWJ1dHRvbi0tb3Blbic6IG9wZW5cbiAgICAgIH1cIlxuICAgICAgY2xhc3M9XCJpb3QtLW1lbnUtYnV0dG9uXCJcbiAgICA+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIXNwbGl0ICYmICFpY29uT25seVwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgaWJtQnV0dG9uPVwicHJpbWFyeVwiXG4gICAgICAgICAgY2xhc3M9XCJpb3QtLW1lbnUtYnV0dG9uX19wcmltYXJ5IGlvdC0tbWVudS1idXR0b25fX3RyaWdnZXJcIlxuICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVNZW51KClcIlxuICAgICAgICA+XG4gICAgICAgICAge3sgbGFiZWwgfX1cbiAgICAgICAgICA8c3ZnICpuZ0lmPVwiIW9wZW5cIiBjbGFzcz1cImJ4LS1idG5fX2ljb25cIiBbaWJtSWNvbl09XCJvcGVuSWNvblwiIHNpemU9XCIxNlwiPjwvc3ZnPlxuICAgICAgICAgIDxzdmcgKm5nSWY9XCJvcGVuXCIgY2xhc3M9XCJieC0tYnRuX19pY29uXCIgW2libUljb25dPVwiY2xvc2VJY29uXCIgc2l6ZT1cIjE2XCI+PC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwic3BsaXQgJiYgIWljb25Pbmx5XCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICAqbmdJZj1cIiFpY29uT25seVwiXG4gICAgICAgICAgaWJtQnV0dG9uPVwicHJpbWFyeVwiXG4gICAgICAgICAgY2xhc3M9XCJpb3QtLW1lbnUtYnV0dG9uX19wcmltYXJ5XCJcbiAgICAgICAgICAoY2xpY2spPVwicHJpbWFyeUNsaWNrLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgID5cbiAgICAgICAgICB7eyBsYWJlbCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGlibUJ1dHRvbj1cInByaW1hcnlcIlxuICAgICAgICAgIFtpY29uT25seV09XCJ0cnVlXCJcbiAgICAgICAgICBbaGFzQXNzaXN0aXZlVGV4dF09XCJpY29uT25seSAmJiAhIWxhYmVsXCJcbiAgICAgICAgICBjbGFzcz1cImlvdC0tbWVudS1idXR0b25fX3NlY29uZGFyeSBpb3QtLW1lbnUtYnV0dG9uX190cmlnZ2VyXCJcbiAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlTWVudSgpXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzdmcgKm5nSWY9XCIhb3BlblwiIGNsYXNzPVwiYngtLWJ0bl9faWNvblwiIFtpYm1JY29uXT1cIm9wZW5JY29uXCIgc2l6ZT1cIjE2XCI+PC9zdmc+XG4gICAgICAgICAgPHN2ZyAqbmdJZj1cIm9wZW5cIiBjbGFzcz1cImJ4LS1idG5fX2ljb25cIiBbaWJtSWNvbl09XCJjbG9zZUljb25cIiBzaXplPVwiMTZcIj48L3N2Zz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpY29uT25seSAmJiAhc3BsaXRcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGlibUJ1dHRvbj1cImdob3N0XCJcbiAgICAgICAgICBbaWNvbk9ubHldPVwidHJ1ZVwiXG4gICAgICAgICAgW2hhc0Fzc2lzdGl2ZVRleHRdPVwiaWNvbk9ubHkgJiYgISFsYWJlbFwiXG4gICAgICAgICAgY2xhc3M9XCJpb3QtLW1lbnUtYnV0dG9uX19zZWNvbmRhcnlcIlxuICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVNZW51KClcIlxuICAgICAgICA+XG4gICAgICAgICAgPHN2ZyAqbmdJZj1cIiFvcGVuXCIgY2xhc3M9XCJieC0tYnRuX19pY29uXCIgW2libUljb25dPVwib3Blbkljb25cIiBzaXplPVwiMTZcIj48L3N2Zz5cbiAgICAgICAgICA8c3ZnICpuZ0lmPVwib3BlblwiIGNsYXNzPVwiYngtLWJ0bl9faWNvblwiIFtpYm1JY29uXT1cImNsb3NlSWNvblwiIHNpemU9XCIxNlwiPjwvc3ZnPlxuICAgICAgICAgIDxzcGFuICpuZ0lmPVwibGFiZWxcIiBjbGFzcz1cImJ4LS1hc3Npc3RpdmUtdGV4dFwiPnt7IGxhYmVsIH19PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPGlibS1jb250ZXh0LW1lbnUgW29wZW5dPVwib3BlblwiIFtwb3NpdGlvbl09XCJwb3NpdGlvblwiPlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L2libS1jb250ZXh0LW1lbnU+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgfVxuXG4gICAgICAuaW90LS1tZW51LWJ1dHRvbiB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIH1cblxuICAgICAgLmJ4LS1idG5fX2ljb24ge1xuICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgIH1cbiAgICBgLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25NZW51Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIGxhYmVsID0gJyc7XG4gIEBJbnB1dCgpIG9wZW4gPSBmYWxzZTtcbiAgQElucHV0KCkgb3Blbkljb24gPSAnY2hldnJvbi0tZG93bic7XG4gIEBJbnB1dCgpIGNsb3NlSWNvbiA9ICdjaGV2cm9uLS11cCc7XG4gIEBJbnB1dCgpIGljb25Pbmx5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNwbGl0ID0gZmFsc2U7XG4gIEBJbnB1dCgpIGFsaWduTWVudTogJ2xlZnQnIHwgJ3JpZ2h0JyA9ICdsZWZ0JztcbiAgQElucHV0KCkgcGxhY2VNZW51OiAndG9wJyB8ICdib3R0b20nID0gJ2JvdHRvbSc7XG4gIEBPdXRwdXQoKSBvcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBAT3V0cHV0KCkgcHJpbWFyeUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xuXG4gIHB1YmxpYyBwb3NpdGlvbiA9IHtcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIGRvY3VtZW50U2VydmljZTogRG9jdW1lbnRTZXJ2aWNlKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBjb25zdCB7IG5hdGl2ZUVsZW1lbnQgfTogeyBuYXRpdmVFbGVtZW50OiBIVE1MRWxlbWVudCB9ID0gdGhpcy5lbGVtZW50UmVmO1xuICAgIGNvbnN0IG1lbnVFbGVtZW50OiBIVE1MRWxlbWVudCA9IG5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ4LS1jb250ZXh0LW1lbnUsIC5ieC0tbWVudScpO1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBuYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IG1lbnVEaW1lbnNpb25zID0gbWVudUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgLy8gZGVmYXVsdCBwbGFjZW1lbnQgKGFsaWduIGxlZnQsIHBsYWNlIGJvdHRvbSlcbiAgICBsZXQgbGVmdCA9IGRpbWVuc2lvbnMubGVmdDtcbiAgICBsZXQgdG9wID0gZGltZW5zaW9ucy50b3AgKyBkaW1lbnNpb25zLmhlaWdodDtcblxuICAgIGlmICh0aGlzLmFsaWduTWVudSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgbGVmdCA9IGRpbWVuc2lvbnMucmlnaHQgLSBtZW51RGltZW5zaW9ucy53aWR0aDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wbGFjZU1lbnUgPT09ICd0b3AnKSB7XG4gICAgICB0b3AgPSBkaW1lbnNpb25zLnRvcCAtIG1lbnVEaW1lbnNpb25zLmhlaWdodDtcbiAgICB9XG5cbiAgICB0aGlzLnBvc2l0aW9uID0geyB0b3AsIGxlZnQgfTtcblxuICAgIHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmhhbmRsZUNsaWNrKChldmVudCkgPT4ge1xuICAgICAgY29uc3QgeyBuYXRpdmVFbGVtZW50IH06IHsgbmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQgfSA9IHRoaXMuZWxlbWVudFJlZjtcbiAgICAgIGlmICh0aGlzLm9wZW4gJiYgIW5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZU1lbnUoKSB7XG4gICAgdGhpcy5vcGVuID0gIXRoaXMub3BlbjtcbiAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdCh0aGlzLm9wZW4pO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5dXAnLCBbJyRldmVudCddKVxuICBoYW5kbGVLZXlzKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScgJiYgdGhpcy5vcGVuKSB7XG4gICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGxldCBidXR0b246IEhUTUxFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaW90LS1tZW51LWJ1dHRvbl9fcHJpbWFyeScpO1xuICAgICAgaWYgKHRoaXMuc3BsaXQgfHwgdGhpcy5pY29uT25seSkge1xuICAgICAgICBidXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pb3QtLW1lbnUtYnV0dG9uX19zZWNvbmRhcnknKTtcbiAgICAgIH1cbiAgICAgIGJ1dHRvbi5mb2N1cygpO1xuICAgIH1cbiAgfVxufVxuIl19